import { AxiosError } from 'axios';
import fabricService, { FabricRecord, QuiltAvailability } from '../fabricService';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = require('@/lib/api').default as {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

describe('FabricService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch all fabrics for user', async () => {
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
        {
          id: 'fabric-2',
          userId: 'user-123',
          name: 'Blue Wool',
          color: '#0000FF',
          yardageAvailable: 3,
          yardageReserved: 1,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockApi.get.mockResolvedValue({
        data: { data: { fabrics: mockFabrics } },
      });

      const result = await fabricService.list();

      expect(mockApi.get).toHaveBeenCalledWith('/api/fabrics');
      expect(result).toEqual(mockFabrics);
    });

    it('should return empty array if no fabrics', async () => {
      mockApi.get.mockResolvedValue({
        data: { data: { fabrics: [] } },
      });

      const result = await fabricService.list();

      expect(result).toEqual([]);
    });

    it('should handle missing data structure', async () => {
      mockApi.get.mockResolvedValue({
        data: { data: null },
      });

      const result = await fabricService.list();

      expect(result).toEqual([]);
    });

    it('should throw on network error', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(fabricService.list()).rejects.toThrow('Network error');
    });
  });

  describe('create', () => {
    it('should create fabric with all properties', async () => {
      const newFabric: FabricRecord = {
        id: 'fabric-new',
        userId: 'user-123',
        name: 'Green Flannel',
        color: '#00FF00',
        type: 'flannel',
        notes: 'Soft and cozy',
        yardageAvailable: 2,
        yardageReserved: 0,
        tags: ['winter', 'cozy'],
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };

      mockApi.post.mockResolvedValue({
        data: {
          data: {
            fabric: newFabric,
            limit: 10,
          },
        },
      });

      const result = await fabricService.create({
        name: 'Green Flannel',
        color: '#00FF00',
        type: 'flannel',
        notes: 'Soft and cozy',
        yardageAvailable: 2,
        tags: ['winter', 'cozy'],
      });

      expect(mockApi.post).toHaveBeenCalledWith('/api/fabrics', {
        name: 'Green Flannel',
        color: '#00FF00',
        type: 'flannel',
        notes: 'Soft and cozy',
        yardageAvailable: 2,
        tags: ['winter', 'cozy'],
      });

      expect(result.fabric).toEqual(newFabric);
      expect(result.limit).toBe(10);
    });

    it('should create fabric with minimal properties', async () => {
      const newFabric: FabricRecord = {
        id: 'fabric-new',
        userId: 'user-123',
        name: 'Basic Fabric',
        color: '#000000',
        yardageAvailable: 0,
        yardageReserved: 0,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };

      mockApi.post.mockResolvedValue({
        data: {
          data: {
            fabric: newFabric,
            limit: 3,
          },
        },
      });

      const result = await fabricService.create({
        name: 'Basic Fabric',
        color: '#000000',
      });

      expect(result.fabric.name).toBe('Basic Fabric');
      expect(result.limit).toBe(3);
    });

    it('should throw on limit exceeded', async () => {
      const error = new Error('Fabric limit reached');
      mockApi.post.mockRejectedValue(error);

      await expect(
        fabricService.create({ name: 'Fabric', color: '#000000' })
      ).rejects.toThrow('Fabric limit reached');
    });
  });

  describe('update', () => {
    it('should update fabric properties', async () => {
      const updatedFabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Updated Red Cotton',
        color: '#FF0000',
        yardageAvailable: 10,
        yardageReserved: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };

      mockApi.put.mockResolvedValue({
        data: { data: { fabric: updatedFabric } },
      });

      const result = await fabricService.update('fabric-1', {
        name: 'Updated Red Cotton',
        yardageAvailable: 10,
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/fabrics/fabric-1', {
        name: 'Updated Red Cotton',
        yardageAvailable: 10,
      });

      expect(result).toEqual(updatedFabric);
    });

    it('should allow clearing optional fields', async () => {
      const updatedFabric: FabricRecord = {
        id: 'fabric-1',
        userId: 'user-123',
        name: 'Red Cotton',
        color: '#FF0000',
        type: null,
        notes: null,
        yardageAvailable: 5,
        yardageReserved: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };

      mockApi.put.mockResolvedValue({
        data: { data: { fabric: updatedFabric } },
      });

      const result = await fabricService.update('fabric-1', {
        type: null,
        notes: null,
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/fabrics/fabric-1', {
        type: null,
        notes: null,
      });

      expect(result.type).toBeNull();
      expect(result.notes).toBeNull();
    });

    it('should throw on invalid fabric ID', async () => {
      mockApi.put.mockRejectedValue(new Error('Fabric not found'));

      await expect(
        fabricService.update('invalid-id', { name: 'Updated' })
      ).rejects.toThrow('Fabric not found');
    });
  });

  describe('delete', () => {
    it('should soft delete fabric', async () => {
      const usage = {
        usedInBlockDesigns: 0,
        usedInSavedQuilts: 0,
        blockDesignNames: [],
        quiltNames: [],
      };

      mockApi.delete.mockResolvedValue({
        data: { data: { usage } },
      });

      const result = await fabricService.delete('fabric-1');

      expect(mockApi.delete).toHaveBeenCalledWith('/api/fabrics/fabric-1', {
        params: { force: false },
      });

      expect(result.usage).toEqual(usage);
    });

    it('should force delete if specified', async () => {
      mockApi.delete.mockResolvedValue({
        data: { data: { usage: {} } },
      });

      await fabricService.delete('fabric-1', true);

      expect(mockApi.delete).toHaveBeenCalledWith('/api/fabrics/fabric-1', {
        params: { force: true },
      });
    });

    it('should throw if fabric in use without force', async () => {
      mockApi.delete.mockRejectedValue(
        new Error('Fabric is used in saved blocks or quilts')
      );

      await expect(fabricService.delete('fabric-1')).rejects.toThrow(
        'Fabric is used in saved blocks or quilts'
      );
    });
  });

  describe('usage', () => {
    it('should return fabric usage summary', async () => {
      const usage = {
        usedInBlockDesigns: 2,
        usedInSavedQuilts: 1,
        blockDesignNames: ['Block 1', 'Block 2'],
        quiltNames: ['Quilt 1'],
      };

      mockApi.get.mockResolvedValue({
        data: { data: { usage } },
      });

      const result = await fabricService.usage('fabric-1');

      expect(mockApi.get).toHaveBeenCalledWith('/api/fabrics/fabric-1/usage');
      expect(result).toEqual(usage);
    });

    it('should show zero usage for unused fabric', async () => {
      const usage = {
        usedInBlockDesigns: 0,
        usedInSavedQuilts: 0,
        blockDesignNames: [],
        quiltNames: [],
      };

      mockApi.get.mockResolvedValue({
        data: { data: { usage } },
      });

      const result = await fabricService.usage('fabric-1');

      expect(result.usedInBlockDesigns).toBe(0);
      expect(result.usedInSavedQuilts).toBe(0);
    });
  });

  describe('checkAvailability', () => {
    it('should confirm sufficient fabric available', async () => {
      const availability: QuiltAvailability = {
        hasShortage: false,
        statement: 'You have enough fabric to make this quilt.',
        summary: {
          totalRequired: 10,
          totalAvailable: 15,
          totalShortage: 0,
        },
        breakdown: [
          {
            fabricId: 'fabric-1',
            name: 'Red Cotton',
            requiredYardage: 5,
            availableYardage: 8,
            shortageYardage: 0,
          },
          {
            fabricId: 'fabric-2',
            name: 'Blue Wool',
            requiredYardage: 5,
            availableYardage: 7,
            shortageYardage: 0,
          },
        ],
      };

      mockApi.post.mockResolvedValue({
        data: { data: availability },
      });

      const result = await fabricService.checkAvailability([
        { fabricId: 'fabric-1', requiredYardage: 5 },
        { fabricId: 'fabric-2', requiredYardage: 5 },
      ]);

      expect(mockApi.post).toHaveBeenCalledWith('/api/fabrics/check-availability/quilt', {
        requirements: [
          { fabricId: 'fabric-1', requiredYardage: 5 },
          { fabricId: 'fabric-2', requiredYardage: 5 },
        ],
      });

      expect(result.hasShortage).toBe(false);
      expect(result.statement).toContain('You have enough fabric');
    });

    it('should report shortage', async () => {
      const availability: QuiltAvailability = {
        hasShortage: true,
        statement: "You don't have enough fabric to make this quilt.",
        summary: {
          totalRequired: 15,
          totalAvailable: 8,
          totalShortage: 7,
        },
        breakdown: [
          {
            fabricId: 'fabric-1',
            name: 'Red Cotton',
            requiredYardage: 10,
            availableYardage: 3,
            shortageYardage: 7,
          },
        ],
      };

      mockApi.post.mockResolvedValue({
        data: { data: availability },
      });

      const result = await fabricService.checkAvailability([
        { fabricId: 'fabric-1', requiredYardage: 10 },
      ]);

      expect(result.hasShortage).toBe(true);
      expect(result.summary.totalShortage).toBe(7);
    });
  });

  describe('commitQuilt', () => {
    it('should reserve fabric for quilt', async () => {
      mockApi.post.mockResolvedValue({
        data: {
          data: {
            mode: 'reserve',
            updatedCount: 2,
            quiltName: 'My Quilt',
          },
        },
      });

      await fabricService.commitQuilt(
        [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        'reserve',
        'My Quilt'
      );

      expect(mockApi.post).toHaveBeenCalledWith('/api/fabrics/commit-quilt', {
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        mode: 'reserve',
        quiltName: 'My Quilt',
      });
    });

    it('should consume fabric for quilt', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { mode: 'consume', updatedCount: 1 } },
      });

      await fabricService.commitQuilt(
        [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        'consume'
      );

      expect(mockApi.post).toHaveBeenCalledWith('/api/fabrics/commit-quilt', {
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        mode: 'consume',
        quiltName: undefined,
      });
    });

    it('should throw on insufficient fabric', async () => {
      mockApi.post.mockRejectedValue(
        new Error('Not enough fabric for Red Cotton')
      );

      await expect(
        fabricService.commitQuilt([
          { fabricId: 'fabric-1', requiredYardage: 100 },
        ])
      ).rejects.toThrow('Not enough fabric');
    });
  });

  describe('Error Handling', () => {
    it('should propagate API errors', async () => {
      const error = new AxiosError('Request failed');
      mockApi.get.mockRejectedValue(error);

      await expect(fabricService.list()).rejects.toThrow('Request failed');
    });

    it('should handle malformed responses', async () => {
      mockApi.get.mockResolvedValue({
        data: { data: undefined },
      });

      const result = await fabricService.list();

      expect(result).toEqual([]);
    });
  });
});
