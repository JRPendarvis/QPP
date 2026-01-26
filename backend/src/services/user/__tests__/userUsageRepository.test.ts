import { UserUsageRepository } from '../userUsageRepository';

// Mock Prisma Client
const mockFindMany = jest.fn();
const mockUpdate = jest.fn();
const mockCount = jest.fn();
const mockFindFirst = jest.fn();

const mockPrismaClient = {
  user: {
    findMany: mockFindMany,
    update: mockUpdate,
    count: mockCount,
    findFirst: mockFindFirst,
  },
} as any;

describe('UserUsageRepository', () => {
  let repository: UserUsageRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new UserUsageRepository(mockPrismaClient);
  });

  describe('findUsersNeedingReset', () => {
    it('should find users with lastResetDate before cutoff', async () => {
      const cutoffDate = new Date('2025-01-01');
      const mockUsers = [
        { id: '1', email: 'user1@test.com', subscriptionTier: 'free', generationsThisMonth: 3, downloadsThisMonth: 1 },
        { id: '2', email: 'user2@test.com', subscriptionTier: 'basic', generationsThisMonth: 5, downloadsThisMonth: 2 },
      ];
      mockFindMany.mockResolvedValueOnce(mockUsers);

      const result = await repository.findUsersNeedingReset(cutoffDate);

      expect(result).toEqual(mockUsers);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          lastResetDate: {
            lte: cutoffDate,
          },
        },
        select: {
          id: true,
          email: true,
          subscriptionTier: true,
          generationsThisMonth: true,
          downloadsThisMonth: true,
        },
      });
    });

    it('should return empty array when no users need reset', async () => {
      const cutoffDate = new Date('2025-01-15');
      mockFindMany.mockResolvedValueOnce([]);

      const result = await repository.findUsersNeedingReset(cutoffDate);

      expect(result).toEqual([]);
    });

    it('should pass correct query to Prisma', async () => {
      const cutoffDate = new Date('2024-12-01');
      mockFindMany.mockResolvedValueOnce([]);

      await repository.findUsersNeedingReset(cutoffDate);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            lastResetDate: {
              lte: cutoffDate,
            },
          },
        })
      );
    });
  });

  describe('updateUserUsage', () => {
    it('should update user with reset data', async () => {
      const userId = 'user-123';
      const resetData = {
        generationsThisMonth: 0,
        downloadsThisMonth: 0,
        lastResetDate: new Date('2025-01-25'),
      };
      const mockUpdatedUser = { id: userId, ...resetData };
      mockUpdate.mockResolvedValueOnce(mockUpdatedUser);

      const result = await repository.updateUserUsage(userId, resetData);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: resetData,
      });
    });

    it('should handle reset data without downloads', async () => {
      const userId = 'user-456';
      const resetData = {
        generationsThisMonth: 0,
        lastResetDate: new Date(),
      };
      mockUpdate.mockResolvedValueOnce({ id: userId });

      await repository.updateUserUsage(userId, resetData);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: resetData,
      });
    });

    it('should propagate Prisma errors', async () => {
      const userId = 'user-error';
      const resetData = {
        generationsThisMonth: 0,
        lastResetDate: new Date(),
      };
      const error = new Error('Database error');
      mockUpdate.mockRejectedValueOnce(error);

      await expect(
        repository.updateUserUsage(userId, resetData)
      ).rejects.toThrow('Database error');
    });
  });

  describe('countUsersNeedingReset', () => {
    it('should count users needing reset', async () => {
      const cutoffDate = new Date('2025-01-01');
      mockCount.mockResolvedValueOnce(5);

      const result = await repository.countUsersNeedingReset(cutoffDate);

      expect(result).toBe(5);
      expect(mockCount).toHaveBeenCalledWith({
        where: {
          lastResetDate: {
            lte: cutoffDate,
          },
        },
      });
    });

    it('should return zero when no users need reset', async () => {
      const cutoffDate = new Date();
      mockCount.mockResolvedValueOnce(0);

      const result = await repository.countUsersNeedingReset(cutoffDate);

      expect(result).toBe(0);
    });

    it('should use correct cutoff date in query', async () => {
      const cutoffDate = new Date('2024-06-15');
      mockCount.mockResolvedValueOnce(10);

      await repository.countUsersNeedingReset(cutoffDate);

      expect(mockCount).toHaveBeenCalledWith({
        where: {
          lastResetDate: {
            lte: cutoffDate,
          },
        },
      });
    });
  });

  describe('findNextUserToReset', () => {
    it('should find next user to reset after given date', async () => {
      const afterDate = new Date('2025-01-01');
      const mockUser = { lastResetDate: new Date('2025-01-05') };
      mockFindFirst.mockResolvedValueOnce(mockUser);

      const result = await repository.findNextUserToReset(afterDate);

      expect(result).toEqual(mockUser);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          lastResetDate: {
            gt: afterDate,
          },
        },
        orderBy: {
          lastResetDate: 'asc',
        },
        select: {
          lastResetDate: true,
        },
      });
    });

    it('should return null when no future users found', async () => {
      const afterDate = new Date();
      mockFindFirst.mockResolvedValueOnce(null);

      const result = await repository.findNextUserToReset(afterDate);

      expect(result).toBeNull();
    });

    it('should order by lastResetDate ascending', async () => {
      const afterDate = new Date('2025-01-10');
      mockFindFirst.mockResolvedValueOnce(null);

      await repository.findNextUserToReset(afterDate);

      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            lastResetDate: 'asc',
          },
        })
      );
    });

    it('should only select lastResetDate field', async () => {
      const afterDate = new Date();
      mockFindFirst.mockResolvedValueOnce({ lastResetDate: new Date() });

      await repository.findNextUserToReset(afterDate);

      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          select: {
            lastResetDate: true,
          },
        })
      );
    });
  });
});
