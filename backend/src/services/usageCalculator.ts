// src/services/usageCalculator.ts

import { SUBSCRIPTION_TIERS } from '../config/stripe.config';

export interface UsageStats {
  generations: {
    used: number;
    limit: number;
    remaining: number;
  };
  downloads: {
    used: number;
    limit: number;
    remaining: number;
  };
  resetDate: string;
  daysUntilReset: number;
}

/**
 * Calculates usage limits and reset dates for user subscriptions
 * Single Responsibility: Usage statistics calculation logic only
 */
export class UsageCalculator {
  /**
   * Calculate usage statistics for a user
   * @param subscriptionTier - User's subscription tier
   * @param generationsUsed - Number of generations used this month
   * @param downloadsUsed - Number of downloads used this month
   * @param lastResetDate - Date of last usage reset
   * @returns Complete usage statistics
   */
  calculateUsage(
    subscriptionTier: string,
    generationsUsed: number,
    downloadsUsed: number,
    lastResetDate: Date
  ): UsageStats {
    const tierConfig = SUBSCRIPTION_TIERS[subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];
    const nextResetDate = this.calculateNextResetDate(lastResetDate);
    const daysUntilReset = this.calculateDaysUntilReset(nextResetDate);

    return {
      generations: {
        used: generationsUsed,
        limit: tierConfig.generationsPerMonth,
        remaining: Math.max(0, tierConfig.generationsPerMonth - generationsUsed),
      },
      downloads: {
        used: downloadsUsed,
        limit: tierConfig.downloadsPerMonth,
        remaining: Math.max(0, tierConfig.downloadsPerMonth - downloadsUsed),
      },
      resetDate: nextResetDate.toISOString(),
      daysUntilReset,
    };
  }

  /**
   * Calculate next reset date (30 days from last reset)
   * @param lastResetDate - Date of last reset
   * @returns Next reset date
   */
  private calculateNextResetDate(lastResetDate: Date): Date {
    const nextResetDate = new Date(lastResetDate);
    nextResetDate.setDate(nextResetDate.getDate() + 30);
    return nextResetDate;
  }

  /**
   * Calculate days until next reset
   * @param nextResetDate - Next reset date
   * @returns Days until reset (minimum 0)
   */
  private calculateDaysUntilReset(nextResetDate: Date): number {
    const daysUntilReset = Math.ceil((nextResetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysUntilReset);
  }

  /**
   * Get tier configuration
   * @param subscriptionTier - Subscription tier
   * @returns Tier configuration
   */
  getTierConfig(subscriptionTier: string) {
    return SUBSCRIPTION_TIERS[subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];
  }
}
