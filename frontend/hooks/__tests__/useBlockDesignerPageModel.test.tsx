import { act, renderHook, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { useBlockDesignerPageModel } from '../useBlockDesignerPageModel';

const mockPush = jest.fn();
const mockGetSearchParam = jest.fn();
const mockUseAuth = jest.fn();
const mockSaveDesign = jest.fn();
const mockUpdateDesign = jest.fn();
const mockGetById = jest.fn();
const mockFabricList = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGetSearchParam }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/hooks/useBlockDesignLibrary', () => ({
  useBlockDesignLibrary: () => ({
    saveDesign: mockSaveDesign,
    updateDesign: mockUpdateDesign,
  }),
}));

jest.mock('@/services/blockDesignService', () => ({
  __esModule: true,
  default: {
    getById: (...args: unknown[]) => mockGetById(...args),
  },
}));

jest.mock('@/services/fabricService', () => ({
  __esModule: true,
  default: {
    list: (...args: unknown[]) => mockFabricList(...args),
  },
}));

jest.mock('react-hot-toast', () => {
  const toastFn = jest.fn();
  return {
    __esModule: true,
    default: Object.assign(toastFn, {
      success: jest.fn(),
      error: jest.fn(),
    }),
  };
});

const patterns = [
  { id: 'simple-squares', name: 'Simple Squares', minFabrics: 2, maxFabrics: 3 },
  { id: 'rail-fence', name: 'Rail Fence', minFabrics: 3, maxFabrics: 4 },
];

const defaultFabrics = [
  { id: 'fabric-1', name: 'Fabric 1', color: '#111111', previewUrl: 'blob:temp-url' },
  { id: 'fabric-2', name: 'Fabric 2', color: '#222222', previewUrl: 'data:image/png;base64,abc' },
  { id: 'fabric-3', name: 'Fabric 3', color: '#333333' },
];

const getBaseRegions = jest.fn((patternId: string) => [
  {
    id: `region-${patternId}`,
    name: `Region ${patternId}`,
    shape: 'rect' as const,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fabricIndex: 0,
    rotation: 0 as const,
  },
]);

const sanitizeLoadedFabrics = (input: typeof defaultFabrics) => input;

describe('useBlockDesignerPageModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSearchParam.mockReturnValue(null);
    mockUseAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
    mockFabricList.mockResolvedValue([]);
    mockSaveDesign.mockResolvedValue({ id: 'new-design' });
    mockUpdateDesign.mockResolvedValue({ id: 'existing-design' });
    mockGetById.mockResolvedValue({
      id: 'existing-design',
      name: 'Saved Design',
      patternId: 'rail-fence',
      globalRotation: 90,
      fabrics: [{ id: 'fabric-1', name: 'Loaded One', color: '#444444' }],
      regions: [
        {
          id: 'loaded-region',
          name: 'Loaded Region',
          shape: 'rect',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          fabricIndex: 1,
          rotation: 0,
        },
      ],
    });
  });

  it('redirects unauthenticated users when a design query param is present', async () => {
    mockGetSearchParam.mockReturnValue('design-1');
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    renderHook(() =>
      useBlockDesignerPageModel({
        patterns,
        defaultPatternId: 'simple-squares',
        defaultFabrics,
        getBaseRegions,
        sanitizeLoadedFabrics,
      })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    expect((toast as unknown as { error: jest.Mock }).error).toHaveBeenCalledWith('Please log in to edit saved block designs');
  });

  it('loads a saved design when design id exists', async () => {
    mockGetSearchParam.mockReturnValue('design-1');

    const { result } = renderHook(() =>
      useBlockDesignerPageModel({
        patterns,
        defaultPatternId: 'simple-squares',
        defaultFabrics,
        getBaseRegions,
        sanitizeLoadedFabrics,
      })
    );

    await waitFor(() => {
      expect(mockGetById).toHaveBeenCalledWith('design-1');
      expect(result.current.currentDesignId).toBe('existing-design');
    });

    expect(result.current.selectedPatternId).toBe('rail-fence');
    expect(result.current.globalRotation).toBe(90);
    expect(result.current.regions[0]?.id).toBe('loaded-region');
    expect((toast as unknown as { success: jest.Mock }).success).toHaveBeenCalledWith('Loaded "Saved Design"');
  });

  it('saves a new design and removes non-persistable preview urls', async () => {
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('My Block');

    const { result } = renderHook(() =>
      useBlockDesignerPageModel({
        patterns,
        defaultPatternId: 'simple-squares',
        defaultFabrics,
        getBaseRegions,
        sanitizeLoadedFabrics,
      })
    );

    await act(async () => {
      await result.current.handleSaveDesign();
    });

    expect(mockSaveDesign).toHaveBeenCalledTimes(1);
    const payload = mockSaveDesign.mock.calls[0][0] as {
      name: string;
      fabrics: Array<{ previewUrl?: string }>;
    };

    expect(payload.name).toBe('My Block');
    expect(payload.fabrics[0]).not.toHaveProperty('previewUrl');
    expect(payload.fabrics[1]?.previewUrl).toBe('data:image/png;base64,abc');
    expect(result.current.currentDesignId).toBe('new-design');

    promptSpy.mockRestore();
  });
});