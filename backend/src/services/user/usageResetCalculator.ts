/**
 * Service for calculating usage reset dates and eligibility
 */
export class UsageResetCalculator {
  /**
   * Calculate the cutoff date for 30-day reset period
   */
  static getResetCutoffDate(): Date {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return cutoff;
  }

  /**
   * Calculate next reset date from a given last reset date
   */
  static calculateNextResetDate(lastResetDate: Date): Date {
    const nextReset = new Date(lastResetDate);
    nextReset.setDate(nextReset.getDate() + 30);
    return nextReset;
  }

  /**
   * Determine if downloads should be reset for a subscription tier
   * FREE tier has lifetime download limit, so downloads never reset
   */
  static shouldResetDownloads(subscriptionTier: string): boolean {
    return subscriptionTier !== 'free';
  }

  /**
   * Create reset data object based on subscription tier
   */
  static createResetData(subscriptionTier: string): {
    generationsThisMonth: number;
    downloadsThisMonth?: number;
    lastResetDate: Date;
  } {
    const shouldResetDownloads = this.shouldResetDownloads(subscriptionTier);
    
    return {
      generationsThisMonth: 0,
      ...(shouldResetDownloads && { downloadsThisMonth: 0 }),
      lastResetDate: new Date()
    };
  }
}
