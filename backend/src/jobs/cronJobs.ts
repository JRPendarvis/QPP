import cron from 'node-cron';
import { UsageResetService } from '../services/user/usageResetService';

const usageResetService = new UsageResetService();

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs(): void {
  console.log('🕐 [Cron] Initializing scheduled jobs...');

  // Daily usage reset check - runs at 2:00 AM every day
  cron.schedule('0 2 * * *', async () => {
    console.log('🕐 [Cron] Running daily usage reset check...');
    try {
      await usageResetService.resetMonthlyUsage();
    } catch (error) {
      console.error('❌ [Cron] Usage reset failed:', error);
    }
  });

  console.log('✅ [Cron] Scheduled jobs initialized');
  console.log('   - Usage reset: Daily at 2:00 AM');
}

/**
 * For testing: manually trigger usage reset
 */
export async function triggerManualReset(): Promise<void> {
  console.log('🔄 [Manual] Triggering usage reset...');
  try {
    await usageResetService.resetMonthlyUsage();
    console.log('✅ [Manual] Usage reset completed');
  } catch (error) {
    console.error('❌ [Manual] Usage reset failed:', error);
  }
}