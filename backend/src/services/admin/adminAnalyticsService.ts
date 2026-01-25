import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service for admin analytics queries
 * Consolidates all Prisma database queries for admin endpoints
 */
export class AdminAnalyticsService {
  /**
   * Get overall platform statistics
   */
  static async getOverviewStats() {
    const [
      totalUsers,
      activeSubscribers,
      totalPatterns,
      totalGenerationsThisMonth,
      totalDownloadsThisMonth,
      totalFeedback,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          subscriptionStatus: 'active',
          subscriptionTier: { not: 'free' },
        },
      }),
      prisma.pattern.count(),
      prisma.user.aggregate({
        _sum: { generationsThisMonth: true },
      }),
      prisma.user.aggregate({
        _sum: { downloadsThisMonth: true },
      }),
      prisma.feedback.count(),
    ]);

    return {
      totalUsers,
      activeSubscribers,
      totalPatterns,
      totalGenerationsThisMonth: totalGenerationsThisMonth._sum.generationsThisMonth || 0,
      totalDownloadsThisMonth: totalDownloadsThisMonth._sum.downloadsThisMonth || 0,
      totalFeedback,
    };
  }

  /**
   * Get user list with subscription details
   */
  static async getUserList() {
    return prisma.user.findMany({
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
  }

  /**
   * Get recent pattern generations with user details
   * @param limit - Maximum number of patterns to return
   */
  static async getRecentPatterns(limit: number = 50) {
    return prisma.pattern.findMany({
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
      take: limit,
    });
  }

  /**
   * Get all feedback with author and vote details
   */
  static async getAllFeedback() {
    return prisma.feedback.findMany({
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
  }

  /**
   * Get monthly usage statistics grouped by subscription tier
   */
  static async getUsageStatsByTier() {
    return prisma.user.groupBy({
      by: ['subscriptionTier'],
      _count: { id: true },
      _sum: {
        generationsThisMonth: true,
        downloadsThisMonth: true,
      },
    });
  }
}
