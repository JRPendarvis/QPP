import { SUBSCRIPTION_TIERS } from '../../config/stripe.config';
import type { UserDownloadData, PatternDownloadData } from '../../repositories/downloadRepository';

export interface DownloadValidationResult {
  canDownload: boolean;
  error?: {
    statusCode: number;
    message: string;
    currentUsage?: number;
    limit?: number;
  };
}

/**
 * Service for validating download permissions
 * Single Responsibility: Download eligibility business logic
 */
export class DownloadValidator {
  /**
   * Validate user exists
   */
  validateUserExists(user: UserDownloadData | null): DownloadValidationResult {
    if (!user) {
      return {
        canDownload: false,
        error: { statusCode: 404, message: 'User not found' },
      };
    }
    return { canDownload: true };
  }

  /**
   * Validate subscription is active
   */
  validateSubscriptionActive(user: UserDownloadData): DownloadValidationResult {
    if (
      user.subscriptionStatus === 'canceled' ||
      (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())
    ) {
      return {
        canDownload: false,
        error: {
          statusCode: 403,
          message: 'Your subscription has expired. Please renew to download patterns.',
        },
      };
    }
    return { canDownload: true };
  }

  /**
   * Validate pattern exists and belongs to user
   */
  validatePatternOwnership(pattern: PatternDownloadData | null): DownloadValidationResult {
    if (!pattern) {
      return {
        canDownload: false,
        error: {
          statusCode: 404,
          message: 'Pattern not found or you do not have permission to download it',
        },
      };
    }
    return { canDownload: true };
  }

  /**
   * Validate download limit (only for first-time downloads)
   */
  validateDownloadLimit(
    user: UserDownloadData,
    isFirstDownload: boolean
  ): DownloadValidationResult {
    if (!isFirstDownload) {
      return { canDownload: true };
    }

    // Staff users bypass download limits
    if (user.role === 'staff') {
      return { canDownload: true };
    }

    const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

    if (user.downloadsThisMonth >= tierConfig.downloadsPerMonth) {
      return {
        canDownload: false,
        error: {
          statusCode: 403,
          message: `You've reached your monthly download limit of ${tierConfig.downloadsPerMonth}. Upgrade your plan for more downloads!`,
          currentUsage: user.downloadsThisMonth,
          limit: tierConfig.downloadsPerMonth,
        },
      };
    }

    return { canDownload: true };
  }

  /**
   * Comprehensive validation of download eligibility
   * Returns first validation error encountered, or success
   */
  validateDownload(
    user: UserDownloadData | null,
    pattern: PatternDownloadData | null
  ): DownloadValidationResult {
    // Validate user exists
    const userValidation = this.validateUserExists(user);
    if (!userValidation.canDownload) return userValidation;

    // Validate subscription is active
    const subscriptionValidation = this.validateSubscriptionActive(user!);
    if (!subscriptionValidation.canDownload) return subscriptionValidation;

    // Validate pattern ownership
    const patternValidation = this.validatePatternOwnership(pattern);
    if (!patternValidation.canDownload) return patternValidation;

    // Validate download limit (only for first downloads)
    const isFirstDownload = !pattern!.downloaded;
    const limitValidation = this.validateDownloadLimit(user!, isFirstDownload);
    if (!limitValidation.canDownload) return limitValidation;

    return { canDownload: true };
  }
}
