/**
 * Service for processing user registration data
 */
export class UserRegistrationProcessor {
  /**
   * Determine if user should get tester badge
   * 
   * @param currentDate - Current date (for testing)
   * @returns Badge name or undefined
   */
  static determineBadge(currentDate: Date = new Date()): string | undefined {
    const cutoffDate = new Date('2026-02-28T23:59:59Z');
    return currentDate < cutoffDate ? 'tester' : undefined;
  }

  /**
   * Create legal acceptance timestamps
   * 
   * @param acceptTerms - Whether user accepted terms
   * @param acceptPrivacy - Whether user accepted privacy policy
   * @param currentDate - Current date (for testing)
   * @returns Object with timestamp fields
   */
  static createLegalTimestamps(
    acceptTerms?: boolean,
    acceptPrivacy?: boolean,
    currentDate: Date = new Date()
  ): {
    termsAcceptedAt: Date | null;
    privacyAcceptedAt: Date | null;
  } {
    return {
      termsAcceptedAt: acceptTerms ? currentDate : null,
      privacyAcceptedAt: acceptPrivacy ? currentDate : null
    };
  }

  /**
   * Create default user data for new registration
   * 
   * @param email - User email
   * @param passwordHash - Hashed password
   * @param name - User name (optional)
   * @param acceptTerms - Terms acceptance
   * @param acceptPrivacy - Privacy acceptance
   * @returns User data object for Prisma create
   */
  static createUserData(
    email: string,
    passwordHash: string,
    name?: string,
    acceptTerms?: boolean,
    acceptPrivacy?: boolean
  ) {
    const badge = this.determineBadge();
    const legalTimestamps = this.createLegalTimestamps(acceptTerms, acceptPrivacy);

    return {
      email,
      passwordHash,
      name,
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      badge,
      ...legalTimestamps
    };
  }
}
