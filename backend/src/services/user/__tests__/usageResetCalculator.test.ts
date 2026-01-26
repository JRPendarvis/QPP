import { UsageResetCalculator } from '../usageResetCalculator';

describe('UsageResetCalculator', () => {
  describe('getResetCutoffDate', () => {
    it('should return date 30 days ago', () => {
      const cutoff = UsageResetCalculator.getResetCutoffDate();
      const now = new Date();
      const expected = new Date();
      expected.setDate(expected.getDate() - 30);

      const diff = Math.abs(cutoff.getTime() - expected.getTime());
      expect(diff).toBeLessThan(1000); // Within 1 second
    });

    it('should handle month boundaries', () => {
      const cutoff = UsageResetCalculator.getResetCutoffDate();
      expect(cutoff).toBeInstanceOf(Date);
      expect(cutoff.getTime()).toBeLessThan(Date.now());
    });

    it('should return different dates on subsequent calls', () => {
      const cutoff1 = UsageResetCalculator.getResetCutoffDate();
      
      // Wait a tiny bit
      const cutoff2 = UsageResetCalculator.getResetCutoffDate();
      
      // Dates should be very close but potentially different
      const diff = Math.abs(cutoff1.getTime() - cutoff2.getTime());
      expect(diff).toBeLessThan(100); // Within 100ms
    });
  });

  describe('calculateNextResetDate', () => {
    it('should add 30 days to given date', () => {
      const lastReset = new Date('2025-01-01');
      const nextReset = UsageResetCalculator.calculateNextResetDate(lastReset);

      expect(nextReset.getFullYear()).toBe(2025);
      expect(nextReset.getMonth()).toBe(0); // January (0-indexed)
      expect(nextReset.getDate()).toBe(30);
    });

    it('should handle month boundaries', () => {
      const lastReset = new Date('2025-01-15');
      const nextReset = UsageResetCalculator.calculateNextResetDate(lastReset);

      expect(nextReset.getMonth()).toBe(1); // February
      expect(nextReset.getDate()).toBe(13);
    });

    it('should handle year boundaries', () => {
      const lastReset = new Date('2025-12-15');
      const nextReset = UsageResetCalculator.calculateNextResetDate(lastReset);

      expect(nextReset.getFullYear()).toBe(2026);
      expect(nextReset.getMonth()).toBe(0); // January
      expect(nextReset.getDate()).toBe(13);
    });

    it('should handle leap years', () => {
      const lastReset = new Date('2024-01-31'); // 2024 is a leap year
      const nextReset = UsageResetCalculator.calculateNextResetDate(lastReset);

      // 31 + 30 = March 1 (Feb has 29 days in 2024)
      expect(nextReset.getMonth()).toBe(1); // February
      expect(nextReset.getDate()).toBe(29);
    });

    it('should not modify original date', () => {
      const lastReset = new Date('2025-01-01');
      const originalTime = lastReset.getTime();

      UsageResetCalculator.calculateNextResetDate(lastReset);

      expect(lastReset.getTime()).toBe(originalTime);
    });
  });

  describe('shouldResetDownloads', () => {
    it('should return false for free tier', () => {
      expect(UsageResetCalculator.shouldResetDownloads('free')).toBe(false);
    });

    it('should return true for basic tier', () => {
      expect(UsageResetCalculator.shouldResetDownloads('basic')).toBe(true);
    });

    it('should return true for intermediate tier', () => {
      expect(UsageResetCalculator.shouldResetDownloads('intermediate')).toBe(true);
    });

    it('should return true for advanced tier', () => {
      expect(UsageResetCalculator.shouldResetDownloads('advanced')).toBe(true);
    });

    it('should return true for unknown tiers', () => {
      expect(UsageResetCalculator.shouldResetDownloads('premium')).toBe(true);
      expect(UsageResetCalculator.shouldResetDownloads('custom')).toBe(true);
    });
  });

  describe('createResetData', () => {
    it('should create reset data for free tier without downloads', () => {
      const resetData = UsageResetCalculator.createResetData('free');

      expect(resetData.generationsThisMonth).toBe(0);
      expect(resetData.downloadsThisMonth).toBeUndefined();
      expect(resetData.lastResetDate).toBeInstanceOf(Date);
    });

    it('should create reset data for basic tier with downloads', () => {
      const resetData = UsageResetCalculator.createResetData('basic');

      expect(resetData.generationsThisMonth).toBe(0);
      expect(resetData.downloadsThisMonth).toBe(0);
      expect(resetData.lastResetDate).toBeInstanceOf(Date);
    });

    it('should create reset data for intermediate tier with downloads', () => {
      const resetData = UsageResetCalculator.createResetData('intermediate');

      expect(resetData.generationsThisMonth).toBe(0);
      expect(resetData.downloadsThisMonth).toBe(0);
      expect(resetData.lastResetDate).toBeInstanceOf(Date);
    });

    it('should create reset data for advanced tier with downloads', () => {
      const resetData = UsageResetCalculator.createResetData('advanced');

      expect(resetData.generationsThisMonth).toBe(0);
      expect(resetData.downloadsThisMonth).toBe(0);
      expect(resetData.lastResetDate).toBeInstanceOf(Date);
    });

    it('should set lastResetDate to current time', () => {
      const before = Date.now();
      const resetData = UsageResetCalculator.createResetData('basic');
      const after = Date.now();

      const resetTime = resetData.lastResetDate.getTime();
      expect(resetTime).toBeGreaterThanOrEqual(before);
      expect(resetTime).toBeLessThanOrEqual(after);
    });

    it('should always reset generations to zero', () => {
      const tiers = ['free', 'basic', 'intermediate', 'advanced'];
      
      tiers.forEach(tier => {
        const resetData = UsageResetCalculator.createResetData(tier);
        expect(resetData.generationsThisMonth).toBe(0);
      });
    });
  });
});
