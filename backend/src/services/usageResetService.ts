import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsageResetService {
  
  /**
   * Reset usage counters for users whose reset date has passed
   * Runs daily to check if 30 days have elapsed since last reset
   */
async resetMonthlyUsage(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find users who need reset
    const usersToReset = await prisma.user.findMany({
      where: {
        lastResetDate: {
          lte: thirtyDaysAgo,
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

    console.log(`🔄 Found ${usersToReset.length} users needing usage reset`);

    // Reset each user
    for (const user of usersToReset) {
      // ✅ FREE TIER: Downloads never reset (lifetime limit)
      const shouldResetDownloads = user.subscriptionTier !== 'free';

      await prisma.user.update({
        where: { id: user.id },
        data: {
          generationsThisMonth: 0,
          // Only reset downloads for paid tiers
          ...(shouldResetDownloads && { downloadsThisMonth: 0 }),
          lastResetDate: new Date(),
        },
      });

      console.log(`✅ Reset usage for ${user.email} (${user.subscriptionTier})`);
      if (!shouldResetDownloads) {
        console.log(`   ⚠️ Downloads NOT reset (free tier - lifetime limit)`);
      }
    }

    console.log('✅ Monthly usage reset completed');
  } catch (error) {
    console.error('❌ Error resetting monthly usage:', error);
    throw error;
  }
}

  /**
   * Reset a specific user's usage (for testing or manual intervention)
   */
  async resetUserUsage(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          generationsThisMonth: 0,
          downloadsThisMonth: 0,
          lastResetDate: new Date()
        }
      });

      console.log(`✅ [Usage Reset] Manually reset user ${userId}`);
    } catch (error) {
      console.error(`❌ [Usage Reset] Error resetting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get stats about upcoming resets
   */
  async getResetStats(): Promise<{
    usersNeedingReset: number;
    nextResetDate: Date | null;
  }> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const usersNeedingReset = await prisma.user.count({
        where: {
          lastResetDate: {
            lte: thirtyDaysAgo
          }
        }
      });

      // Find the next user who needs reset
      const nextUser = await prisma.user.findFirst({
        where: {
          lastResetDate: {
            gt: thirtyDaysAgo
          }
        },
        orderBy: {
          lastResetDate: 'asc'
        },
        select: {
          lastResetDate: true
        }
      });

      let nextResetDate = null;
      if (nextUser) {
        nextResetDate = new Date(nextUser.lastResetDate);
        nextResetDate.setDate(nextResetDate.getDate() + 30);
      }

      return {
        usersNeedingReset,
        nextResetDate
      };
    } catch (error) {
      console.error('❌ [Usage Reset] Error getting reset stats:', error);
      throw error;
    }
  }
}