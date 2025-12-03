import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsageResetService {
  
  /**
   * Reset usage counters for users whose reset date has passed
   * Runs daily to check if 30 days have elapsed since last reset
   */
  async resetMonthlyUsage(): Promise<void> {
    try {
      const now = new Date();
      
      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      
      // Find users whose last reset was more than 30 days ago
      const usersToReset = await prisma.user.findMany({
        where: {
          lastResetDate: {
            lte: thirtyDaysAgo
          }
        },
        select: {
          id: true,
          email: true,
          subscriptionTier: true,
          generationsThisMonth: true,
          downloadsThisMonth: true,
          lastResetDate: true
        }
      });

      if (usersToReset.length === 0) {
        console.log('✅ [Usage Reset] No users need reset at this time');
        return;
      }

      console.log(`🔄 [Usage Reset] Resetting usage for ${usersToReset.length} users`);

      // Reset each user's counters
      for (const user of usersToReset) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            generationsThisMonth: 0,
            downloadsThisMonth: 0,
            lastResetDate: now
          }
        });

        console.log(`✅ [Usage Reset] Reset user ${user.email} (${user.subscriptionTier})`);
      }

      console.log(`✅ [Usage Reset] Successfully reset ${usersToReset.length} users`);
      
    } catch (error) {
      console.error('❌ [Usage Reset] Error during monthly usage reset:', error);
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