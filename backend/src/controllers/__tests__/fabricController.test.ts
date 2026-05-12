import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  listFabrics,
  getFabricById,
  createFabric,
  updateFabric,
  deleteFabric,
  getFabricUsage,
  checkQuiltAvailability,
  commitQuiltFabric,
} from '../fabricController';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
  Prisma: {
    JsonNull: {},
  },
}));

const createMockResponse = (): { response: Partial<Response>; json: jest.Mock; status: jest.Mock } => {
  const json = jest.fn().mockReturnThis();
  const status = jest.fn().mockReturnThis();
  return {
    response: { json, status },
    json,
    status,
  };
};

const createMockRequest = (body: any = {}, params: any = {}, user: any = {}): Partial<Request> => ({
  body,
  params,
  user: { userId: 'test-user-123', ...user },
  query: {},
});

// Mock Prisma instance
let mockPrisma: any;

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma = {
    fabric: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    blockDesign: {
      findMany: jest.fn(),
    },
    pattern: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  // Mock PrismaClient constructor
  (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(
    () => mockPrisma as any
  );
});

describe('FabricController', () => {
  describe('listFabrics', () => {
    it('should return fabrics for authenticated user', async () => {
      const mockFabrics = [
        { id: 'fabric-1', name: 'Red Cotton', color: '#FF0000', userId: 'test-user-123' },
        { id: 'fabric-2', name: 'Blue Wool', color: '#0000FF', userId: 'test-user-123' },
      ];

      mockPrisma.fabric.findMany.mockResolvedValue(mockFabrics);

      const mockReq = createMockRequest();
      const { response, json } = createMockResponse();

      await listFabrics(mockReq as Request, response as Response);

      expect(mockPrisma.fabric.findMany).toHaveBeenCalledWith({
        where: { userId: 'test-user-123', archivedAt: null },
        orderBy: { updatedAt: 'desc' },
      });

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: { fabrics: mockFabrics },
      });
    });

    it('should return 401 if not authenticated', async () => {
      const mockReq = createMockRequest({}, {}, {});
      mockReq.user = undefined;
      const { response, json, status } = createMockResponse();

      await listFabrics(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should return empty array when no fabrics exist', async () => {
      mockPrisma.fabric.findMany.mockResolvedValue([]);

      const mockReq = createMockRequest();
      const { response, json } = createMockResponse();

      await listFabrics(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: { fabrics: [] },
      });
    });
  });

  describe('getFabricById', () => {
    it('should return fabric by ID for authorized user', async () => {
      const mockFabric = { id: 'fabric-1', name: 'Red Cotton', userId: 'test-user-123' };
      mockPrisma.fabric.findFirst.mockResolvedValue(mockFabric);

      const mockReq = createMockRequest({}, { fabricId: 'fabric-1' });
      const { response, json } = createMockResponse();

      await getFabricById(mockReq as Request, response as Response);

      expect(mockPrisma.fabric.findFirst).toHaveBeenCalledWith({
        where: { id: 'fabric-1', userId: 'test-user-123', archivedAt: null },
      });

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: { fabric: mockFabric },
      });
    });

    it('should return 404 if fabric not found', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue(null);

      const mockReq = createMockRequest({}, { fabricId: 'nonexistent' });
      const { response, json, status } = createMockResponse();

      await getFabricById(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        success: false,
        message: 'Fabric not found',
      });
    });

    it('should return 401 if not authenticated', async () => {
      const mockReq = createMockRequest({}, { fabricId: 'fabric-1' });
      mockReq.user = undefined;
      const { response, json, status } = createMockResponse();

      await getFabricById(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(401);
    });
  });

  describe('createFabric', () => {
    it('should create fabric for free tier user (within limit)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        subscriptionTier: 'free',
      });
      mockPrisma.fabric.count.mockResolvedValue(2); // 2 existing, limit is 3
      mockPrisma.fabric.create.mockResolvedValue({
        id: 'new-fabric-1',
        name: 'Red Cotton',
        color: '#FF0000',
        userId: 'test-user-123',
      });

      const mockReq = createMockRequest({
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: 5,
      });
      const { response, json, status } = createMockResponse();

      await createFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Fabric saved',
        })
      );
    });

    it('should reject fabric creation when free tier limit reached', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        subscriptionTier: 'free',
      });
      mockPrisma.fabric.count.mockResolvedValue(3); // Already at limit

      const mockReq = createMockRequest({
        name: 'Red Cotton',
        color: '#FF0000',
      });
      const { response, json, status } = createMockResponse();

      await createFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(403);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Fabric limit reached'),
        })
      );
    });

    it('should allow paid tier user higher limit', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        subscriptionTier: 'paid',
      });
      mockPrisma.fabric.count.mockResolvedValue(8); // 8 existing, limit is 10
      mockPrisma.fabric.create.mockResolvedValue({
        id: 'new-fabric-1',
        name: 'Red Cotton',
        color: '#FF0000',
      });

      const mockReq = createMockRequest({
        name: 'Red Cotton',
        color: '#FF0000',
      });
      const { response, json, status } = createMockResponse();

      await createFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(201);
    });

    it('should reject creation without required fields', async () => {
      const mockReq = createMockRequest({
        color: '#FF0000',
        // missing name
      });
      const { response, json, status } = createMockResponse();

      await createFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        success: false,
        message: 'Fabric name is required',
      });
    });

    it('should reject invalid yardage values', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'free' });
      mockPrisma.fabric.count.mockResolvedValue(0);

      const mockReq = createMockRequest({
        name: 'Red Cotton',
        color: '#FF0000',
        yardageAvailable: -5,
      });
      const { response, json, status } = createMockResponse();

      await createFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        success: false,
        message: 'Yardage must be a non-negative number',
      });
    });

    it('should return 401 if not authenticated', async () => {
      const mockReq = createMockRequest({ name: 'Red Cotton', color: '#FF0000' });
      mockReq.user = undefined;
      const { response, json, status } = createMockResponse();

      await createFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(401);
    });
  });

  describe('updateFabric', () => {
    it('should update fabric properties', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue({
        id: 'fabric-1',
        userId: 'test-user-123',
      });
      mockPrisma.fabric.update.mockResolvedValue({
        id: 'fabric-1',
        name: 'Updated Cotton',
        color: '#FF0000',
        yardageAvailable: 10,
      });

      const mockReq = createMockRequest(
        {
          name: 'Updated Cotton',
          yardageAvailable: 10,
        },
        { fabricId: 'fabric-1' }
      );
      const { response, json } = createMockResponse();

      await updateFabric(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Fabric updated',
        })
      );
    });

    it('should reject update of non-existent fabric', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue(null);

      const mockReq = createMockRequest({ name: 'Updated' }, { fabricId: 'nonexistent' });
      const { response, json, status } = createMockResponse();

      await updateFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(404);
    });

    it('should reject invalid yardage on update', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue({
        id: 'fabric-1',
        userId: 'test-user-123',
      });

      const mockReq = createMockRequest(
        { yardageAvailable: -10 },
        { fabricId: 'fabric-1' }
      );
      const { response, json, status } = createMockResponse();

      await updateFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteFabric', () => {
    it('should soft-delete fabric when not in use', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue({
        id: 'fabric-1',
        name: 'Red Cotton',
        userId: 'test-user-123',
      });
      mockPrisma.blockDesign.findMany.mockResolvedValue([]);
      mockPrisma.pattern.findMany.mockResolvedValue([]);
      mockPrisma.fabric.update.mockResolvedValue({
        id: 'fabric-1',
        archivedAt: new Date(),
      });

      const mockReq = createMockRequest({}, { fabricId: 'fabric-1' });
      const { response, json } = createMockResponse();

      await deleteFabric(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Fabric deleted',
        })
      );
    });

    it('should reject deletion when fabric is in use', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue({
        id: 'fabric-1',
        name: 'Red Cotton',
        userId: 'test-user-123',
      });
      mockPrisma.blockDesign.findMany.mockResolvedValue([
        {
          name: 'My Block',
          fabrics: [{ libraryFabricId: 'fabric-1' }],
        },
      ]);
      mockPrisma.pattern.findMany.mockResolvedValue([]);

      const mockReq = createMockRequest({}, { fabricId: 'fabric-1' });
      const { response, json, status } = createMockResponse();

      await deleteFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Fabric is used in saved blocks or quilts',
        })
      );
    });

    it('should force-delete when force=true', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue({
        id: 'fabric-1',
        name: 'Red Cotton',
        userId: 'test-user-123',
      });
      mockPrisma.blockDesign.findMany.mockResolvedValue([
        {
          name: 'My Block',
          fabrics: [{ libraryFabricId: 'fabric-1' }],
        },
      ]);
      mockPrisma.pattern.findMany.mockResolvedValue([]);
      mockPrisma.fabric.update.mockResolvedValue({
        id: 'fabric-1',
        archivedAt: new Date(),
      });

      const mockReq = createMockRequest({}, { fabricId: 'fabric-1' });
      mockReq.query = { force: 'true' };
      const { response, json } = createMockResponse();

      await deleteFabric(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('checkQuiltAvailability', () => {
    it('should confirm enough fabric is available', async () => {
      mockPrisma.fabric.findMany.mockResolvedValue([
        {
          id: 'fabric-1',
          name: 'Red Cotton',
          yardageAvailable: 10,
          yardageReserved: 2,
        },
      ]);

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
      });
      const { response, json } = createMockResponse();

      await checkQuiltAvailability(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          hasShortage: false,
          statement: 'You have enough fabric to make this quilt.',
        }),
      });
    });

    it('should report shortage when insufficient fabric', async () => {
      mockPrisma.fabric.findMany.mockResolvedValue([
        {
          id: 'fabric-1',
          name: 'Red Cotton',
          yardageAvailable: 3,
          yardageReserved: 1,
        },
      ]);

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
      });
      const { response, json } = createMockResponse();

      await checkQuiltAvailability(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          hasShortage: true,
          statement: "You don't have enough fabric to make this quilt.",
        }),
      });
    });

    it('should account for reserved yardage', async () => {
      mockPrisma.fabric.findMany.mockResolvedValue([
        {
          id: 'fabric-1',
          name: 'Red Cotton',
          yardageAvailable: 10,
          yardageReserved: 8,
        },
      ]);

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 3 }],
      });
      const { response, json } = createMockResponse();

      await checkQuiltAvailability(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          hasShortage: true,
        }),
      });
    });

    it('should reject empty requirements', async () => {
      const mockReq = createMockRequest({
        requirements: [],
      });
      const { response, json, status } = createMockResponse();

      await checkQuiltAvailability(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(400);
    });
  });

  describe('commitQuiltFabric', () => {
    it('should reserve fabric for quilt', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          fabric: {
            findMany: jest.fn().mockResolvedValue([
              {
                id: 'fabric-1',
                name: 'Red Cotton',
                yardageAvailable: 10,
                yardageReserved: 0,
              },
            ]),
            update: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(mockTx);
      });

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        mode: 'reserve',
        quiltName: 'My Quilt',
      });
      const { response, json } = createMockResponse();

      await commitQuiltFabric(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Fabric reserved for quilt',
        })
      );
    });

    it('should consume fabric for quilt', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          fabric: {
            findMany: jest.fn().mockResolvedValue([
              {
                id: 'fabric-1',
                name: 'Red Cotton',
                yardageAvailable: 10,
                yardageReserved: 0,
              },
            ]),
            update: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(mockTx);
      });

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
        mode: 'consume',
      });
      const { response, json } = createMockResponse();

      await commitQuiltFabric(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Fabric consumed for quilt',
        })
      );
    });

    it('should reject commit when insufficient fabric', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          fabric: {
            findMany: jest.fn().mockResolvedValue([
              {
                id: 'fabric-1',
                name: 'Red Cotton',
                yardageAvailable: 3,
                yardageReserved: 0,
              },
            ]),
          },
        };
        return callback(mockTx);
      });

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
      });
      const { response, json, status } = createMockResponse();

      await commitQuiltFabric(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(409);
    });
  });

  describe('getFabricUsage', () => {
    it('should return usage summary for fabric', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue({
        id: 'fabric-1',
        name: 'Red Cotton',
      });
      mockPrisma.blockDesign.findMany.mockResolvedValue([
        { name: 'Block 1', fabrics: [{ libraryFabricId: 'fabric-1' }] },
      ]);
      mockPrisma.pattern.findMany.mockResolvedValue([]);

      const mockReq = createMockRequest({}, { fabricId: 'fabric-1' });
      const { response, json } = createMockResponse();

      await getFabricUsage(mockReq as Request, response as Response);

      expect(json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          fabric: expect.objectContaining({
            id: 'fabric-1',
            name: 'Red Cotton',
          }),
          usage: expect.objectContaining({
            usedInBlockDesigns: 1,
            blockDesignNames: ['Block 1'],
          }),
        }),
      });
    });

    it('should return 404 for non-existent fabric', async () => {
      mockPrisma.fabric.findFirst.mockResolvedValue(null);

      const mockReq = createMockRequest({}, { fabricId: 'nonexistent' });
      const { response, json, status } = createMockResponse();

      await getFabricUsage(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockPrisma.fabric.findMany.mockRejectedValue(new Error('Database error'));

      const mockReq = createMockRequest();
      const { response, json, status } = createMockResponse();

      await listFabrics(mockReq as Request, response as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch fabrics',
      });
    });

    it('should handle concurrent fabric updates in transaction', async () => {
      const transactionCalls: any[] = [];
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        transactionCalls.push(callback);
        const mockTx = {
          fabric: {
            findMany: jest.fn().mockResolvedValue([
              { id: 'fabric-1', yardageAvailable: 10, yardageReserved: 0 },
            ]),
            update: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(mockTx);
      });

      const mockReq = createMockRequest({
        requirements: [{ fabricId: 'fabric-1', requiredYardage: 5 }],
      });
      const { response, json } = createMockResponse();

      await commitQuiltFabric(mockReq as Request, response as Response);

      expect(transactionCalls.length).toBeGreaterThan(0);
    });
  });
});
