import { UserRegistrationProcessor } from '../userRegistrationProcessor';

describe('UserRegistrationProcessor', () => {
  describe('determineBadge', () => {
    it('should return tester badge before cutoff date', () => {
      const beforeCutoff = new Date('2026-01-01');
      const badge = UserRegistrationProcessor.determineBadge(beforeCutoff);

      expect(badge).toBe('tester');
    });

    it('should return undefined after cutoff date', () => {
      const afterCutoff = new Date('2026-03-01');
      const badge = UserRegistrationProcessor.determineBadge(afterCutoff);

      expect(badge).toBeUndefined();
    });

    it('should return undefined on cutoff date', () => {
      const cutoffDate = new Date('2026-02-28T23:59:59Z');
      const badge = UserRegistrationProcessor.determineBadge(cutoffDate);

      // At exactly cutoff time, should not be less than
      expect(badge).toBeUndefined();
    });

    it('should return tester badge one second before cutoff', () => {
      const justBeforeCutoff = new Date('2026-02-28T23:59:58Z');
      const badge = UserRegistrationProcessor.determineBadge(justBeforeCutoff);

      expect(badge).toBe('tester');
    });

    it('should use current date when not provided', () => {
      // Since we're in Jan 2026, should get tester badge
      const badge = UserRegistrationProcessor.determineBadge();

      expect(badge).toBe('tester');
    });
  });

  describe('createLegalTimestamps', () => {
    it('should create timestamps when both accepted', () => {
      const currentDate = new Date('2026-01-25T12:00:00Z');
      const timestamps = UserRegistrationProcessor.createLegalTimestamps(true, true, currentDate);

      expect(timestamps.termsAcceptedAt).toEqual(currentDate);
      expect(timestamps.privacyAcceptedAt).toEqual(currentDate);
    });

    it('should return null when terms not accepted', () => {
      const currentDate = new Date();
      const timestamps = UserRegistrationProcessor.createLegalTimestamps(false, true, currentDate);

      expect(timestamps.termsAcceptedAt).toBeNull();
      expect(timestamps.privacyAcceptedAt).toEqual(currentDate);
    });

    it('should return null when privacy not accepted', () => {
      const currentDate = new Date();
      const timestamps = UserRegistrationProcessor.createLegalTimestamps(true, false, currentDate);

      expect(timestamps.termsAcceptedAt).toEqual(currentDate);
      expect(timestamps.privacyAcceptedAt).toBeNull();
    });

    it('should return null for both when neither accepted', () => {
      const currentDate = new Date();
      const timestamps = UserRegistrationProcessor.createLegalTimestamps(false, false, currentDate);

      expect(timestamps.termsAcceptedAt).toBeNull();
      expect(timestamps.privacyAcceptedAt).toBeNull();
    });

    it('should handle undefined values as false', () => {
      const currentDate = new Date();
      const timestamps = UserRegistrationProcessor.createLegalTimestamps(undefined, undefined, currentDate);

      expect(timestamps.termsAcceptedAt).toBeNull();
      expect(timestamps.privacyAcceptedAt).toBeNull();
    });

    it('should use current date when not provided', () => {
      const before = Date.now();
      const timestamps = UserRegistrationProcessor.createLegalTimestamps(true, true);
      const after = Date.now();

      expect(timestamps.termsAcceptedAt?.getTime()).toBeGreaterThanOrEqual(before);
      expect(timestamps.termsAcceptedAt?.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('createUserData', () => {
    it('should create complete user data with all fields', () => {
      const userData = UserRegistrationProcessor.createUserData(
        'user@example.com',
        'hashedPassword123',
        'John Doe',
        true,
        true
      );

      expect(userData.email).toBe('user@example.com');
      expect(userData.passwordHash).toBe('hashedPassword123');
      expect(userData.name).toBe('John Doe');
      expect(userData.subscriptionTier).toBe('free');
      expect(userData.subscriptionStatus).toBe('active');
      expect(userData.badge).toBe('tester'); // Current date is before cutoff
      expect(userData.termsAcceptedAt).toBeInstanceOf(Date);
      expect(userData.privacyAcceptedAt).toBeInstanceOf(Date);
    });

    it('should create user data without name', () => {
      const userData = UserRegistrationProcessor.createUserData(
        'user@test.com',
        'hash',
        undefined,
        true,
        true
      );

      expect(userData.name).toBeUndefined();
      expect(userData.email).toBe('user@test.com');
    });

    it('should create user data without legal acceptances', () => {
      const userData = UserRegistrationProcessor.createUserData(
        'user@test.com',
        'hash',
        'Name'
      );

      expect(userData.termsAcceptedAt).toBeNull();
      expect(userData.privacyAcceptedAt).toBeNull();
    });

    it('should always set free tier and active status', () => {
      const userData1 = UserRegistrationProcessor.createUserData('email1@test.com', 'hash1');
      const userData2 = UserRegistrationProcessor.createUserData('email2@test.com', 'hash2', 'Name');

      expect(userData1.subscriptionTier).toBe('free');
      expect(userData1.subscriptionStatus).toBe('active');
      expect(userData2.subscriptionTier).toBe('free');
      expect(userData2.subscriptionStatus).toBe('active');
    });

    it('should include tester badge for current date', () => {
      const userData = UserRegistrationProcessor.createUserData(
        'tester@example.com',
        'hash'
      );

      // Current date (Jan 2026) is before cutoff (Feb 28, 2026)
      expect(userData.badge).toBe('tester');
    });

    it('should handle partial legal acceptance', () => {
      const userData1 = UserRegistrationProcessor.createUserData(
        'email@test.com',
        'hash',
        undefined,
        true,
        false
      );

      expect(userData1.termsAcceptedAt).toBeInstanceOf(Date);
      expect(userData1.privacyAcceptedAt).toBeNull();

      const userData2 = UserRegistrationProcessor.createUserData(
        'email@test.com',
        'hash',
        undefined,
        false,
        true
      );

      expect(userData2.termsAcceptedAt).toBeNull();
      expect(userData2.privacyAcceptedAt).toBeInstanceOf(Date);
    });
  });
});
