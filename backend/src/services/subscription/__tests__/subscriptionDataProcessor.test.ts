import { SubscriptionDataProcessor } from '../subscriptionDataProcessor';

describe('SubscriptionDataProcessor', () => {
  describe('extractMetadata', () => {
    it('should extract tier and interval from metadata', () => {
      const metadata = { tier: 'pro', interval: 'yearly' };
      
      const result = SubscriptionDataProcessor.extractMetadata(metadata);
      
      expect(result).toEqual({ tier: 'pro', interval: 'yearly' });
    });

    it('should use fallback values when metadata is null', () => {
      const result = SubscriptionDataProcessor.extractMetadata(null);
      
      expect(result).toEqual({ tier: 'basic', interval: 'monthly' });
    });

    it('should use fallback values when metadata is undefined', () => {
      const result = SubscriptionDataProcessor.extractMetadata(undefined);
      
      expect(result).toEqual({ tier: 'basic', interval: 'monthly' });
    });

    it('should use fallback for missing tier', () => {
      const metadata = { interval: 'yearly' };
      
      const result = SubscriptionDataProcessor.extractMetadata(metadata);
      
      expect(result).toEqual({ tier: 'basic', interval: 'yearly' });
    });

    it('should use fallback for missing interval', () => {
      const metadata = { tier: 'advanced' };
      
      const result = SubscriptionDataProcessor.extractMetadata(metadata);
      
      expect(result).toEqual({ tier: 'advanced', interval: 'monthly' });
    });

    it('should handle empty metadata object', () => {
      const metadata = {};
      
      const result = SubscriptionDataProcessor.extractMetadata(metadata);
      
      expect(result).toEqual({ tier: 'basic', interval: 'monthly' });
    });

    it('should handle all valid tier values', () => {
      const tiers = ['free', 'basic', 'intermediate', 'advanced'];
      
      tiers.forEach(tier => {
        const result = SubscriptionDataProcessor.extractMetadata({ tier });
        expect(result.tier).toBe(tier);
      });
    });

    it('should handle both billing intervals', () => {
      const monthly = SubscriptionDataProcessor.extractMetadata({ interval: 'monthly' });
      const yearly = SubscriptionDataProcessor.extractMetadata({ interval: 'yearly' });
      
      expect(monthly.interval).toBe('monthly');
      expect(yearly.interval).toBe('yearly');
    });
  });

  describe('convertPeriodEnd', () => {
    it('should convert Unix timestamp to Date', () => {
      const unixTimestamp = 1704067200; // 2024-01-01 00:00:00 UTC
      
      const result = SubscriptionDataProcessor.convertPeriodEnd(unixTimestamp);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(1704067200 * 1000);
    });

    it('should handle zero timestamp', () => {
      const result = SubscriptionDataProcessor.convertPeriodEnd(0);
      
      // Zero is falsy, should use fallback
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now());
    });

    it('should use fallback for undefined', () => {
      const before = Date.now();
      const result = SubscriptionDataProcessor.convertPeriodEnd(undefined);
      const after = Date.now();
      
      expect(result).toBeInstanceOf(Date);
      // Should be ~30 days from now
      const expectedTime = before + 30 * 24 * 60 * 60 * 1000;
      expect(result.getTime()).toBeGreaterThan(expectedTime - 1000); // 1s tolerance
      expect(result.getTime()).toBeLessThan(after + 30 * 24 * 60 * 60 * 1000 + 1000);
    });

    it('should handle future timestamps', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year from now
      
      const result = SubscriptionDataProcessor.convertPeriodEnd(futureTimestamp);
      
      expect(result.getTime()).toBe(futureTimestamp * 1000);
    });

    it('should handle past timestamps', () => {
      const pastTimestamp = 946684800; // 2000-01-01 00:00:00 UTC
      
      const result = SubscriptionDataProcessor.convertPeriodEnd(pastTimestamp);
      
      expect(result.getTime()).toBe(pastTimestamp * 1000);
    });

    it('should return date approximately 30 days ahead for fallback', () => {
      const result = SubscriptionDataProcessor.convertPeriodEnd(undefined);
      
      const expectedDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const diff = Math.abs(result.getTime() - expectedDate.getTime());
      
      expect(diff).toBeLessThan(1000); // Less than 1 second difference
    });
  });

  describe('createCancellationData', () => {
    it('should return correct cancellation data structure', () => {
      const result = SubscriptionDataProcessor.createCancellationData();
      
      expect(result).toEqual({
        subscriptionTier: 'free',
        subscriptionStatus: 'canceled',
        stripeSubscriptionId: null,
        billingInterval: null
      });
    });

    it('should reset tier to free', () => {
      const result = SubscriptionDataProcessor.createCancellationData();
      
      expect(result.subscriptionTier).toBe('free');
    });

    it('should set status to canceled', () => {
      const result = SubscriptionDataProcessor.createCancellationData();
      
      expect(result.subscriptionStatus).toBe('canceled');
    });

    it('should nullify Stripe subscription ID', () => {
      const result = SubscriptionDataProcessor.createCancellationData();
      
      expect(result.stripeSubscriptionId).toBeNull();
    });

    it('should nullify billing interval', () => {
      const result = SubscriptionDataProcessor.createCancellationData();
      
      expect(result.billingInterval).toBeNull();
    });

    it('should return same structure on multiple calls', () => {
      const result1 = SubscriptionDataProcessor.createCancellationData();
      const result2 = SubscriptionDataProcessor.createCancellationData();
      
      expect(result1).toEqual(result2);
    });
  });
});
