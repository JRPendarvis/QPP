import { PrismaClient } from '@prisma/client';
import { UsageResetCalculator } from './usageResetCalculator';
import { UserUsageRepository } from './userUsageRepository';

const prisma = new PrismaClient();

export class UsageResetService {
  private repository: UserUsageRepository;

  constructor(repository?: UserUsageRepository) {
    this.repository = repository || new UserUsageRepository(prisma);
  }
  
  /**
   * Reset usage counters for users whose reset date has passed
   * Runs daily to check if 30 days have elapsed since last reset
   */
  async resetMonthlyUsage(): Promise<void> {
    try {
      const cutoffDate = UsageResetCalculator.getResetCutoffDate();

      // Find users who need reset
      const usersToReset = await this.repository.findUsersNeedingReset(cutoffDate);

      console.log(`🔄 Found ${usersToReset.length} users needing usage reset`);

      // Reset each user
      for (const user of usersToReset) {
        const resetData = UsageResetCalculator.createResetData(user.subscriptionTier);
        const shouldResetDownloads = UsageResetCalculator.shouldResetDownloads(user.subscriptionTier);

        await this.repository.updateUserUsage(user.id, resetData);

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
      const resetData = {
        generationsThisMonth: 0,
        downloadsThisMonth: 0,
        lastResetDate: new Date()
      };

      await this.repository.updateUserUsage(userId, resetData);

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
      const cutoffDate = UsageResetCalculator.getResetCutoffDate();

      const usersNeedingReset = await this.repository.countUsersNeedingReset(cutoffDate);

      // Find the next user who needs reset
      const nextUser = await this.repository.findNextUserToReset(cutoffDate);

      let nextResetDate = null;
      if (nextUser) {
        nextResetDate = UsageResetCalculator.calculateNextResetDate(nextUser.lastResetDate);
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