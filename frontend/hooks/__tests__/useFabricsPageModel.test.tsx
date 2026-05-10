import { act, renderHook, waitFor } from '@testing-library/react';
import { useFabricsPageModel } from '../useFabricsPageModel';

const mockPush = jest.fn();
const mockFetchFabrics = jest.fn().mockResolvedValue(undefined);
const mockCreateFabric = jest.fn().mockResolvedValue(undefined);
const mockUpdateFabric = jest.fn().mockResolvedValue(undefined);
const mockCheckUsage = jest.fn().mockResolvedValue({
  usedInBlockDesigns: 0,
  usedInSavedQuilts: 0,
  blockDesignNames: [],
  quiltNames: [],
});
const mockDeleteFabric = jest.fn().mockResolvedValue(undefined);
const mockCheckAvailability = jest.fn().mockResolvedValue({
  hasShortage: false,
  statement: 'You have enough fabric to make this quilt.',
  summary: { totalRequired: 1, totalAvailable: 2, totalShortage: 0 },
  breakdown: [],
});
const mockCommitQuilt = jest.fn().mockResolvedValue(undefined);

const mockUseAuth = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/hooks/useFabricLibrary', () => ({
  useFabricLibrary: () => ({
    fabrics: [{
      id: 'f1',
      userId: 'u1',
      name: 'Ruby',
      color: '#ff0000',
      yardageAvailable: 3,
      yardageReserved: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }],
    loading: false,
    usageStats: { used: 1, limit: 3 },
    fetchFabrics: mockFetchFabrics,
    createFabric: mockCreateFabric,
    updateFabric: mockUpdateFabric,
    checkUsage: mockCheckUsage,
    deleteFabric: mockDeleteFabric,
    checkAvailability: mockCheckAvailability,
    commitQuilt: mockCommitQuilt,
  }),
}));

describe('useFabricsPageModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when unauthenticated', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    renderHook(() => useFabricsPageModel());

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('loads fabrics when authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });

    renderHook(() => useFabricsPageModel());

    await waitFor(() => {
      expect(mockFetchFabrics).toHaveBeenCalled();
    });
  });

  it('uses force delete when usage exists and confirm is accepted', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
    mockCheckUsage.mockResolvedValueOnce({
      usedInBlockDesigns: 1,
      usedInSavedQuilts: 1,
      blockDesignNames: ['B1'],
      quiltNames: ['Q1'],
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const { result } = renderHook(() => useFabricsPageModel());

    await act(async () => {
      await result.current.handleDelete('f1');
    });

    expect(mockDeleteFabric).toHaveBeenCalledWith('f1', true);
    expect(result.current.usageWarning).toContain('This fabric is used in 1 block design(s) and 1 saved quilt(s).');

    confirmSpy.mockRestore();
  });
});
