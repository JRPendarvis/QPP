/**
 * Service for processing Stripe subscription events into application data
 */
export class SubscriptionDataProcessor {
  /**
   * Extract subscription metadata from checkout session
   * 
   * @param metadata - Session metadata object
   * @returns Tier and interval with fallback values
   */
  static extractMetadata(metadata: Record<string, string> | null | undefined): {
    tier: string;
    interval: string;
  } {
    return {
      tier: metadata?.tier || 'basic',
      interval: metadata?.interval || 'monthly'
    };
  }

  /**
   * Convert Unix timestamp to Date object with fallback
   * 
   * @param unixTimestamp - Unix timestamp in seconds
   * @returns Date object or 30-day fallback
   */
  static convertPeriodEnd(unixTimestamp: number | undefined): Date {
    if (unixTimestamp) {
      return new Date(unixTimestamp * 1000);
    }
    // Fallback: 30 days from now
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  /**
   * Create cancellation data for resetting user to free tier
   * 
   * @returns Data object for subscription cancellation
   */
  static createCancellationData(): {
    subscriptionTier: string;
    subscriptionStatus: string;
    stripeSubscriptionId: null;
    billingInterval: null;
  } {
    return {
      subscriptionTier: 'free',
      subscriptionStatus: 'canceled',
      stripeSubscriptionId: null,
      billingInterval: null
    };
  }
}
