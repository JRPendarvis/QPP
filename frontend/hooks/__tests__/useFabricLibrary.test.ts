import { act, renderHook, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { useFabricLibrary } from '../useFabricLibrary';
import type { FabricGateway } from '@/services/fabric/fabricGateway';
import type { FabricRecord } from '@/services/fabricService';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockToast = toast as unknown as { success: jest.Mock; error: jest.Mock };

const baseFabric: FabricRecord = {
  id: 'fabric-1',
  userId: 'user-123',
  name: 'Red Cotton',
  color: '#FF0000',
  yardageAvailable: 5,
  yardageReserved: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

function createGateway(overrides: Partial<FabricGateway> = {}): FabricGateway {
  return {
    list: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ fabric: baseFabric, limit: 10 }),
    update: jest.fn().mockResolvedValue(baseFabric),
    usage: jest.fn().mockResolvedValue({
      usedInBlockDesigns: 0,
      usedInSavedQuilts: 0,
      blockDesignNames: [],
      quiltNames: [],
    }),
    delete: jest.fn().mockResolvedValue({
      usage: {
        usedInBlockDesigns: 0,
        usedInSavedQuilts: 0,
        blockDesignNames: [],
        quiltNames: [],
      },
    }),
    checkAvailability: jest.fn().mockResolvedValue({
      hasShortage: false,
      statement: 'You have enough fabric to make this quilt.',
      summary: { totalRequired: 1, totalAvailable: 2, totalShortage: 0 },
      breakdown: [],
    }),
    commitQuilt: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('useFabricLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches fabrics and updates state', async () => {
    const gateway = createGateway({ list: jest.fn().mockResolvedValue([baseFabric]) });
    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await result.current.fetchFabrics();
    });

    expect(gateway.list).toHaveBeenCalledTimes(1);
    expect(result.current.fabrics).toEqual([baseFabric]);
    expect(result.current.loading).toBe(false);
  });

  it('surfaces API error message on fetch failure', async () => {
    const gateway = createGateway({ list: jest.fn().mockRejectedValue(new Error('API error')) });
    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await expect(result.current.fetchFabrics()).rejects.toThrow('API error');
    });

    expect(mockToast.error).toHaveBeenCalledWith('API error');
  });

  it('creates fabric and updates usage limit', async () => {
    const created = { ...baseFabric, id: 'fabric-2', name: 'Blue Wool' };
    const gateway = createGateway({
      create: jest.fn().mockResolvedValue({ fabric: created, limit: 3 }),
    });
    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await result.current.createFabric({ name: 'Blue Wool', color: '#0000FF' });
    });

    expect(result.current.fabrics[0]).toEqual(created);
    expect(result.current.usageStats.limit).toBe(3);
    expect(mockToast.success).toHaveBeenCalledWith('Fabric saved');
  });

  it('updates and deletes fabric entries', async () => {
    const updated = { ...baseFabric, yardageAvailable: 10 };
    const gateway = createGateway({
      list: jest.fn().mockResolvedValue([baseFabric]),
      update: jest.fn().mockResolvedValue(updated),
    });
    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await result.current.fetchFabrics();
      await result.current.updateFabric(baseFabric.id, { yardageAvailable: 10 });
      await result.current.deleteFabric(baseFabric.id);
    });

    expect(gateway.update).toHaveBeenCalledWith(baseFabric.id, { yardageAvailable: 10 });
    expect(gateway.delete).toHaveBeenCalledWith(baseFabric.id, false);
    expect(result.current.fabrics).toEqual([]);
  });

  it('commits quilt reservation and refreshes fabrics', async () => {
    const refreshed = { ...baseFabric, yardageReserved: 2 };
    const gateway = createGateway({
      list: jest.fn().mockResolvedValue([refreshed]),
    });

    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await result.current.commitQuilt([{ fabricId: baseFabric.id, requiredYardage: 2 }], 'reserve', 'Q1');
    });

    expect(gateway.commitQuilt).toHaveBeenCalledWith([{ fabricId: baseFabric.id, requiredYardage: 2 }], 'reserve', 'Q1');
    expect(gateway.list).toHaveBeenCalledTimes(1);
    expect(result.current.fabrics).toEqual([refreshed]);
    expect(mockToast.success).toHaveBeenCalledWith('Fabric reserved for quilt');
  });

  it('reports commit failure with original message', async () => {
    const gateway = createGateway({
      commitQuilt: jest.fn().mockRejectedValue(new Error('Not enough fabric')),
    });

    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await expect(
        result.current.commitQuilt([{ fabricId: baseFabric.id, requiredYardage: 100 }])
      ).rejects.toThrow('Not enough fabric');
    });

    expect(mockToast.error).toHaveBeenCalledWith('Not enough fabric');
  });

  it('exposes usage stats count from current fabrics', async () => {
    const gateway = createGateway({ list: jest.fn().mockResolvedValue([baseFabric, { ...baseFabric, id: 'fabric-2' }]) });
    const { result } = renderHook(() => useFabricLibrary(gateway));

    await act(async () => {
      await result.current.fetchFabrics();
    });

    await waitFor(() => {
      expect(result.current.usageStats.used).toBe(2);
    });
  });
});
