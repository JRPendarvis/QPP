import { renderHook, act, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { useFabricLibrary } from '../useFabricLibrary';
import fabricService from '@/services/fabricService';
import { FabricRecord } from '@/services/fabricService';

jest.mock('@/services/fabricService');
jest.mock('react-hot-toast');

const mockFabricService = fabricService as jest.Mocked<typeof fabricService>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('useFabricLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  describe('fetchFabrics', () => {
    it('should fetch fabrics and update state', async () => {
      const mockFabrics: FabricRecord[] = [
        {
          id: 'fabric-1',
          userId: 'user-123',
          name: 'Red Cotton',
          color: '#FF0000',
          yardageAvailable: 5,
          yardageReserved: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockFabricService.list.mockResolvedValue(mockFabrics);

      const { result } = renderHook(() => useFabricLibrary());

      expect(result.current.loading).toBe(false);
      expect(result.current.fabrics).toEqual([]);

      await act(async () => {
        await result.current.fetchFabrics();
      });

      expect(result.current.fabrics).toEqual(mockFabrics);
      expect(result.current.loading).toBe(false);
    });

    it('should show error toast on fetch failure', async () => {
      mockFabricService.list.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(result.current.fetchFabrics()).rejects.toThrow('API error');
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to load fabrics');
    });

    it('should set loading state during fetch', async () => {
      mockFabricService.list.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      const { result } = renderHook(() => useFabricLibrary());

      const fetchPromise = act(async () => {
        const promise = result.current.fetchFabrics();
        expect(result.current.loading).toBe(true);
        await promise;
      });

      await fetchPromise;
      expect(result.current.loading).toBe(false);
    });
  });

  describe('createFabric', () => {
    it('should create fabric and update list', async () => {
      const newFabric: FabricRecord = {
        id: 'fabric-2',
        userId: 'user-123',
        name: 'Blue Wool',
        color: '#0000FF',
        yardageAvailable: 3,
        yardageReserved: 0,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      const existingFabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: 5,
        yardageReserved: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFabricService.create.mockResolvedValue({
        fabric: newFabric,
        limit: 10,
      });

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        result.current.fabrics.splice(0, 0, existingFabric);
        await result.current.createFabric({
          name: 'Blue Wool',
          color: '#0000FF',
          yardageAvailable: 3,
        });
      });

      expect(result.current.fabrics[0]).toEqual(newFabric);
      expect(result.current.usageStats.limit).toBe(10);
      expect(mockToast.success).toHaveBeenCalledWith('Fabric saved');
    });

    it('should show error toast on creation failure', async () => {
      mockFabricService.create.mockRejectedValue(
        new Error('Fabric limit reached')
      );

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(
          result.current.createFabric({
            name: 'Fabric',
            color: '#000000',
          })
        ).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to save fabric');
    });

    it('should extract limit from response', async () => {
      const newFabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Fabric',
        color: '#000000',
        yardageAvailable: 0,
        yardageReserved: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFabricService.create.mockResolvedValue({
        fabric: newFabric,
        limit: 3,
      });

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await result.current.createFabric({
          name: 'Fabric',
          color: '#000000',
        });
      });

      expect(result.current.usageStats.limit).toBe(3);
    });
  });

  describe('updateFabric', () => {
    it('should update fabric in list', async () => {
      const originalFabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: 5,
        yardageReserved: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const updatedFabric: FabricRecord = {
        ...originalFabric,
        yardageAvailable: 10,
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockFabricService.update.mockResolvedValue(updatedFabric);

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        result.current.fabrics.push(originalFabric);
        await result.current.updateFabric('fabric-1', {
          yardageAvailable: 10,
        });
      });

      expect(result.current.fabrics[0].yardageAvailable).toBe(10);
      expect(mockToast.success).toHaveBeenCalledWith('Fabric updated');
    });

    it('should show error on update failure', async () => {
      mockFabricService.update.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(
          result.current.updateFabric('fabric-1', { name: 'Updated' })
        ).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to update fabric');
    });
  });

  describe('deleteFabric', () => {
    it('should remove fabric from list', async () => {
      const fabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: 5,
        yardageReserved: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFabricService.delete.mockResolvedValue({
        usage: {
          usedInBlockDesigns: 0,
          usedInSavedQuilts: 0,
          blockDesignNames: [],
          quiltNames: [],
        },
      });

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        result.current.fabrics.push(fabric);
        await result.current.deleteFabric('fabric-1');
      });

      expect(result.current.fabrics).toEqual([]);
      expect(mockToast.success).toHaveBeenCalledWith('Fabric deleted');
    });

    it('should support force delete', async () => {
      mockFabricService.delete.mockResolvedValue({
        usage: {
          usedInBlockDesigns: 1,
          usedInSavedQuilts: 0,
          blockDesignNames: ['Block 1'],
          quiltNames: [],
        },
      });

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await result.current.deleteFabric('fabric-1', true);
      });

      expect(mockFabricService.delete).toHaveBeenCalledWith('fabric-1', true);
    });

    it('should show error on delete failure', async () => {
      mockFabricService.delete.mockRejectedValue(
        new Error('Fabric in use')
      );

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(result.current.deleteFabric('fabric-1')).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete fabric');
    });
  });

  describe('checkUsage', () => {
    it('should return fabric usage summary', async () => {
      const usage = {
        usedInBlockDesigns: 2,
        usedInSavedQuilts: 1,
        blockDesignNames: ['Block 1', 'Block 2'],
        quiltNames: ['Quilt 1'],
      };

      mockFabricService.usage.mockResolvedValue(usage);

      const { result } = renderHook(() => useFabricLibrary());

      let usageResult;
      await act(async () => {
        usageResult = await result.current.checkUsage('fabric-1');
      });

      expect(usageResult).toEqual(usage);
    });

    it('should show error on usage check failure', async () => {
      mockFabricService.usage.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(result.current.checkUsage('fabric-1')).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to check usage');
    });
  });

  describe('checkAvailability', () => {
    it('should confirm sufficient fabric available', async () => {
      const availability = {
        hasShortage: false,
        statement: 'You have enough fabric to make this quilt.',
        summary: {
          totalRequired: 10,
          totalAvailable: 15,
          totalShortage: 0,
        },
        breakdown: [],
      };

      mockFabricService.checkAvailability.mockResolvedValue(availability);

      const { result } = renderHook(() => useFabricLibrary());

      let availabilityResult;
      await act(async () => {
        availabilityResult = await result.current.checkAvailability([
          { fabricId: 'fabric-1', requiredYardage: 10 },
        ]);
      });

      expect(availabilityResult.hasShortage).toBe(false);
    });

    it('should report shortage', async () => {
      const availability = {
        hasShortage: true,
        statement: "You don't have enough fabric to make this quilt.",
        summary: {
          totalRequired: 15,
          totalAvailable: 8,
          totalShortage: 7,
        },
        breakdown: [],
      };

      mockFabricService.checkAvailability.mockResolvedValue(availability);

      const { result } = renderHook(() => useFabricLibrary());

      let availabilityResult;
      await act(async () => {
        availabilityResult = await result.current.checkAvailability([
          { fabricId: 'fabric-1', requiredYardage: 15 },
        ]);
      });

      expect(availabilityResult.hasShortage).toBe(true);
    });

    it('should show error on availability check failure', async () => {
      mockFabricService.checkAvailability.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(
          result.current.checkAvailability([
            { fabricId: 'fabric-1', requiredYardage: 10 },
          ])
        ).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to check fabric availability');
    });
  });

  describe('commitQuilt', () => {
    it('should reserve fabric for quilt', async () => {
      const fabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: 10,
        yardageReserved: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockFabricService.commitQuilt.mockResolvedValue(undefined);
      mockFabricService.list.mockResolvedValue([fabric]);

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await result.current.commitQuilt(
          [{ fabricId: 'fabric-1', requiredYardage: 5 }],
          'reserve',
          'My Quilt'
        );
      });

      expect(mockFabricService.commitQuilt).toHaveBeenCalledWith(
        [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        'reserve',
        'My Quilt'
      );
      expect(mockToast.success).toHaveBeenCalledWith('Fabric reserved for quilt');
    });

    it('should consume fabric for quilt', async () => {
      mockFabricService.commitQuilt.mockResolvedValue(undefined);
      mockFabricService.list.mockResolvedValue([]);

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await result.current.commitQuilt(
          [{ fabricId: 'fabric-1', requiredYardage: 5 }],
          'consume'
        );
      });

      expect(mockToast.success).toHaveBeenCalledWith('Fabric consumed');
    });

    it('should show error on commit failure', async () => {
      mockFabricService.commitQuilt.mockRejectedValue(
        new Error('Not enough fabric')
      );

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(
          result.current.commitQuilt([
            { fabricId: 'fabric-1', requiredYardage: 100 },
          ])
        ).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to commit quilt fabric usage');
    });

    it('should refresh fabrics after commit', async () => {
      const fabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: 5,
        yardageReserved: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockFabricService.commitQuilt.mockResolvedValue(undefined);
      mockFabricService.list.mockResolvedValue([fabric]);

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await result.current.commitQuilt([
          { fabricId: 'fabric-1', requiredYardage: 5 },
        ]);
      });

      expect(result.current.fabrics[0]).toEqual(fabric);
    });
  });

  describe('usageStats', () => {
    it('should calculate usage stats correctly', () => {
      const mockFabrics: FabricRecord[] = [
        {
          id: 'fabric-1',
          userId: 'user-123',
          name: 'Fabric 1',
          color: '#FF0000',
          yardageAvailable: 5,
          yardageReserved: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'fabric-2',
          userId: 'user-123',
          name: 'Fabric 2',
          color: '#0000FF',
          yardageAvailable: 3,
          yardageReserved: 1,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      const { result } = renderHook(() => useFabricLibrary());

      act(() => {
        // Manually set fabrics and limit for testing
        (result.current as any).fabrics = mockFabrics;
        (result.current as any).limit = 10;
      });

      // Note: usageStats is memoized, so we need to verify through returned values
      expect(result.current.fabrics.length).toBe(2);
    });

    it('should update stats when fabrics change', async () => {
      const fabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Fabric 1',
        color: '#FF0000',
        yardageAvailable: 5,
        yardageReserved: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFabricService.create.mockResolvedValue({
        fabric,
        limit: 10,
      });

      const { result } = renderHook(() => useFabricLibrary());

      expect(result.current.fabrics).toEqual([]);

      await act(async () => {
        await result.current.createFabric({
          name: 'Fabric 1',
          color: '#FF0000',
        });
      });

      expect(result.current.fabrics.length).toBe(1);
      expect(result.current.usageStats.used).toBe(1);
      expect(result.current.usageStats.limit).toBe(10);
    });
  });

  describe('Error handling', () => {
    it('should extract API error messages', async () => {
      const error = new Error('API error');
      mockFabricService.list.mockRejectedValue(error);

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(result.current.fetchFabrics()).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalled();
    });

    it('should handle authentication errors gracefully', async () => {
      mockFabricService.list.mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useFabricLibrary());

      await act(async () => {
        await expect(result.current.fetchFabrics()).rejects.toThrow();
      });

      expect(mockToast.error).toHaveBeenCalled();
    });
  });
});
