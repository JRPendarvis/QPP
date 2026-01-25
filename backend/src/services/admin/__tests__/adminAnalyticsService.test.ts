import { AdminAnalyticsService } from '../adminAnalyticsService';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    pattern: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    feedback: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('AdminAnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverviewStats', () => {
    it('should return platform overview statistics', async () => {
      (prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(150) // totalUsers
        .mockResolvedValueOnce(45);  // activeSubscribers
      
      (prisma.pattern.count as jest.Mock).mockResolvedValue(320);
      
      (prisma.user.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { generationsThisMonth: 85 } })
        .mockResolvedValueOnce({ _sum: { downloadsThisMonth: 62 } });
      
      (prisma.feedback.count as jest.Mock).mockResolvedValue(28);

      const result = await AdminAnalyticsService.getOverviewStats();

      expect(result).toEqual({
        totalUsers: 150,
        activeSubscribers: 45,
        totalPatterns: 320,
        totalGenerationsThisMonth: 85,
        totalDownloadsThisMonth: 62,
        totalFeedback: 28,
      });
    });

    it('should handle null aggregation results', async () => {
      (prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(2);
      
      (prisma.pattern.count as jest.Mock).mockResolvedValue(5);
      
      (prisma.user.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { generationsThisMonth: null } })
        .mockResolvedValueOnce({ _sum: { downloadsThisMonth: null } });
      
      (prisma.feedback.count as jest.Mock).mockResolvedValue(0);

      const result = await AdminAnalyticsService.getOverviewStats();

      expect(result.totalGenerationsThisMonth).toBe(0);
      expect(result.totalDownloadsThisMonth).toBe(0);
    });

    it('should call prisma with correct query for active subscribers', async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(0);
      (prisma.pattern.count as jest.Mock).mockResolvedValue(0);
      (prisma.user.aggregate as jest.Mock).mockResolvedValue({ _sum: { generationsThisMonth: 0 } });
      (prisma.feedback.count as jest.Mock).mockResolvedValue(0);

      await AdminAnalyticsService.getOverviewStats();

      expect(prisma.user.count).toHaveBeenCalledWith({
        where: {
          subscriptionStatus: 'active',
          subscriptionTier: { not: 'free' },
        },
      });
    });
  });

  describe('getUserList', () => {
    it('should return user list with subscription details', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          role: 'user',
          skillLevel: 'intermediate',
          subscriptionTier: 'basic',
          subscriptionStatus: 'active',
          currentPeriodEnd: new Date('2025-02-15'),
          generationsThisMonth: 3,
          downloadsThisMonth: 2,
          badge: null,
          createdAt: new Date('2024-01-10'),
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          role: 'user',
          skillLevel: 'beginner',
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          currentPeriodEnd: null,
          generationsThisMonth: 1,
          downloadsThisMonth: 0,
          badge: 'early_adopter',
          createdAt: new Date('2024-01-12'),
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await AdminAnalyticsService.getUserList();

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          skillLevel: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
          generationsThisMonth: true,
          downloadsThisMonth: true,
          badge: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no users exist', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await AdminAnalyticsService.getUserList();

      expect(result).toEqual([]);
    });
  });

  describe('getRecentPatterns', () => {
    it('should return recent patterns with user details', async () => {
      const mockPatterns = [
        {
          id: 'pattern1',
          userId: 'user1',
          patternData: { patternId: 'nine-patch' },
          downloaded: true,
          downloadedAt: new Date('2025-01-20'),
          createdAt: new Date('2025-01-20'),
          user: {
            email: 'user1@example.com',
            name: 'User One',
            subscriptionTier: 'basic',
          },
        },
      ];

      (prisma.pattern.findMany as jest.Mock).mockResolvedValue(mockPatterns);

      const result = await AdminAnalyticsService.getRecentPatterns(25);

      expect(result).toEqual(mockPatterns);
      expect(prisma.pattern.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          userId: true,
          patternData: true,
          downloaded: true,
          downloadedAt: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true,
              subscriptionTier: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
      });
    });

    it('should use default limit of 50 when not specified', async () => {
      (prisma.pattern.findMany as jest.Mock).mockResolvedValue([]);

      await AdminAnalyticsService.getRecentPatterns();

      expect(prisma.pattern.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 })
      );
    });

    it('should handle custom limit values', async () => {
      (prisma.pattern.findMany as jest.Mock).mockResolvedValue([]);

      await AdminAnalyticsService.getRecentPatterns(100);

      expect(prisma.pattern.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 })
      );
    });
  });

  describe('getAllFeedback', () => {
    it('should return feedback with author and votes', async () => {
      const mockFeedback = [
        {
          id: 'feedback1',
          message: 'Great app!',
          createdAt: new Date('2025-01-15'),
          author: {
            email: 'user1@example.com',
            name: 'User One',
          },
          votes: [
            { id: 'vote1', userId: 'user2', feedbackId: 'feedback1' },
          ],
        },
      ];

      (prisma.feedback.findMany as jest.Mock).mockResolvedValue(mockFeedback);

      const result = await AdminAnalyticsService.getAllFeedback();

      expect(result).toEqual(mockFeedback);
      expect(prisma.feedback.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              email: true,
              name: true,
            },
          },
          votes: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no feedback exists', async () => {
      (prisma.feedback.findMany as jest.Mock).mockResolvedValue([]);

      const result = await AdminAnalyticsService.getAllFeedback();

      expect(result).toEqual([]);
    });

    it('should handle feedback with no votes', async () => {
      const mockFeedback = [
        {
          id: 'feedback1',
          message: 'New feature request',
          createdAt: new Date('2025-01-18'),
          author: {
            email: 'user3@example.com',
            name: 'User Three',
          },
          votes: [],
        },
      ];

      (prisma.feedback.findMany as jest.Mock).mockResolvedValue(mockFeedback);

      const result = await AdminAnalyticsService.getAllFeedback();

      expect(result[0].votes).toEqual([]);
    });
  });

  describe('getUsageStatsByTier', () => {
    it('should return usage statistics grouped by subscription tier', async () => {
      const mockStats = [
        {
          subscriptionTier: 'free',
          _count: { id: 80 },
          _sum: {
            generationsThisMonth: 15,
            downloadsThisMonth: 8,
          },
        },
        {
          subscriptionTier: 'basic',
          _count: { id: 40 },
          _sum: {
            generationsThisMonth: 120,
            downloadsThisMonth: 95,
          },
        },
        {
          subscriptionTier: 'intermediate',
          _count: { id: 25 },
          _sum: {
            generationsThisMonth: 280,
            downloadsThisMonth: 210,
          },
        },
      ];

      (prisma.user.groupBy as jest.Mock).mockResolvedValue(mockStats);

      const result = await AdminAnalyticsService.getUsageStatsByTier();

      expect(result).toEqual(mockStats);
      expect(prisma.user.groupBy).toHaveBeenCalledWith({
        by: ['subscriptionTier'],
        _count: { id: true },
        _sum: {
          generationsThisMonth: true,
          downloadsThisMonth: true,
        },
      });
    });

    it('should handle single tier result', async () => {
      const mockStats = [
        {
          subscriptionTier: 'free',
          _count: { id: 10 },
          _sum: {
            generationsThisMonth: 5,
            downloadsThisMonth: 3,
          },
        },
      ];

      (prisma.user.groupBy as jest.Mock).mockResolvedValue(mockStats);

      const result = await AdminAnalyticsService.getUsageStatsByTier();

      expect(result).toHaveLength(1);
      expect(result[0].subscriptionTier).toBe('free');
    });

    it('should handle empty results', async () => {
      (prisma.user.groupBy as jest.Mock).mockResolvedValue([]);

      const result = await AdminAnalyticsService.getUsageStatsByTier();

      expect(result).toEqual([]);
    });
  });
});
