import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_TIERS } from '../../config/stripe.config';

const prisma = new PrismaClient();
const TIER_ORDER = ['free', 'basic', 'intermediate', 'advanced'] as const;

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
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        generationsThisMonth: true,
        downloadsThisMonth: true,
        badge: true,
        createdAt: true,
        lastLogIn: true,
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
    const grouped = await prisma.user.groupBy({
      by: ['subscriptionTier'],
      _count: { id: true },
      _sum: {
        generationsThisMonth: true,
        downloadsThisMonth: true,
      },
    });

    return grouped
      .map((row) => {
        const tierKey = row.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS;
        const tierConfig = SUBSCRIPTION_TIERS[tierKey];
        const users = row._count.id ?? 0;
        const creditsConsumedThisMonth = row._sum.generationsThisMonth ?? 0;
        const downloadsThisMonth = row._sum.downloadsThisMonth ?? 0;
        const creditsPerUser = tierConfig?.creditsPerMonth ?? null;
        const tierCreditCapacity =
          typeof creditsPerUser === 'number' && Number.isFinite(creditsPerUser)
            ? users * creditsPerUser
            : null;
        const utilizationPercent =
          tierCreditCapacity && tierCreditCapacity > 0
            ? Number(((creditsConsumedThisMonth / tierCreditCapacity) * 100).toFixed(1))
            : null;

        return {
          subscriptionTier: row.subscriptionTier,
          tierName: tierConfig?.name ?? row.subscriptionTier,
          users,
          creditsPerUser,
          creditsConsumedThisMonth,
          downloadsThisMonth,
          tierCreditCapacity,
          utilizationPercent,
        };
      })
      .sort((a, b) => {
        const left = TIER_ORDER.indexOf(a.subscriptionTier as typeof TIER_ORDER[number]);
        const right = TIER_ORDER.indexOf(b.subscriptionTier as typeof TIER_ORDER[number]);
        return (left === -1 ? Number.MAX_SAFE_INTEGER : left) - (right === -1 ? Number.MAX_SAFE_INTEGER : right);
      });
  }
}
