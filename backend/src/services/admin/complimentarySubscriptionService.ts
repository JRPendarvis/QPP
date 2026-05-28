import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ComplimentarySubscriptionRequest {
  email: string;
  tier: 'basic' | 'intermediate' | 'advanced';
  durationMonths: number;
  reason?: string;
}

export interface ComplimentarySubscriptionResult {
  userId: string;
  email: string;
  tier: string;
  expiresAt: Date;
  granted: boolean;
}

/**
 * Service for granting complimentary subscriptions without payment
 * Use cases: Beta testers, promotional access, partnerships, etc.
 */
export class ComplimentarySubscriptionService {
  /**
   * Grant complimentary subscription to a single user
   * Creates the user if they don't exist
   * 
   * @param request - Subscription details
   * @param adminEmail - Email of admin granting access
   * @returns Result with subscription details
   */
  async grantComplimentarySubscription(
    request: ComplimentarySubscriptionRequest,
    adminEmail: string
  ): Promise<ComplimentarySubscriptionResult> {
    const { email, tier, durationMonths, reason } = request;

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, subscriptionTier: true },
    });

    if (!user) {
      // Create user with temporary password (they'll need to reset it)
      const tempPassword = this.generateTemporaryPassword();
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          subscriptionTier: tier,
          subscriptionStatus: 'active',
          currentPeriodEnd: expiresAt,
          // No Stripe IDs - this is complimentary
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        select: { id: true, email: true, subscriptionTier: true },
      });

      console.log(`[Complimentary] Created new user: ${email} (temp password required)`);
    } else {
      // Update existing user's subscription
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: tier,
          subscriptionStatus: 'active',
          currentPeriodEnd: expiresAt,
          // Keep existing Stripe IDs if they have them
        },
      });

      console.log(`[Complimentary] Updated existing user: ${email}`);
    }

    // Log the grant for auditing
    console.log(`[Complimentary] Granted by: ${adminEmail} | User: ${email} | Tier: ${tier} | Duration: ${durationMonths}mo | Reason: ${reason || 'N/A'}`);

    return {
      userId: user.id,
      email: user.email,
      tier,
      expiresAt,
      granted: true,
    };
  }

  /**
   * Grant complimentary subscriptions to multiple users at once
   * 
   * @param requests - Array of subscription requests
   * @param adminEmail - Email of admin granting access
   * @returns Results for all users
   */
  async grantBulkComplimentarySubscriptions(
    requests: ComplimentarySubscriptionRequest[],
    adminEmail: string
  ): Promise<{
    successful: ComplimentarySubscriptionResult[];
    failed: { email: string; error: string }[];
  }> {
    const successful: ComplimentarySubscriptionResult[] = [];
    const failed: { email: string; error: string }[] = [];

    for (const request of requests) {
      try {
        const result = await this.grantComplimentarySubscription(request, adminEmail);
        successful.push(result);
      } catch (error) {
        console.error(`[Complimentary] Failed for ${request.email}:`, error);
        failed.push({
          email: request.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`[Complimentary] Bulk grant complete: ${successful.length} successful, ${failed.length} failed`);

    return { successful, failed };
  }

  /**
   * Get all users with complimentary subscriptions
   * (Users with active subscriptions but no Stripe IDs)
   */
  async getComplimentarySubscribers(): Promise<Array<{
    id: string;
    email: string;
    name: string | null;
    subscriptionTier: string;
    subscriptionStatus: string;
    currentPeriodEnd: Date | null;
    createdAt: Date;
  }>> {
    return prisma.user.findMany({
      where: {
        AND: [
          { subscriptionTier: { not: 'free' } },
          { stripeCustomerId: null },
          { stripeSubscriptionId: null },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        createdAt: true,
      },
      orderBy: { currentPeriodEnd: 'asc' },
    });
  }

  /**
   * Extend an existing complimentary subscription
   * 
   * @param userId - User ID
   * @param additionalMonths - Months to add
   * @returns Updated expiration date
   */
  async extendComplimentarySubscription(
    userId: string,
    additionalMonths: number
  ): Promise<Date> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentPeriodEnd: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Start from current expiration or now, whichever is later
    const baseDate = user.currentPeriodEnd && user.currentPeriodEnd > new Date()
      ? user.currentPeriodEnd
      : new Date();

    const newExpiresAt = new Date(baseDate);
    newExpiresAt.setMonth(newExpiresAt.getMonth() + additionalMonths);

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentPeriodEnd: newExpiresAt,
        subscriptionStatus: 'active',
      },
    });

    console.log(`[Complimentary] Extended subscription for user ${userId} by ${additionalMonths}mo to ${newExpiresAt}`);

    return newExpiresAt;
  }

  /**
   * Revoke complimentary subscription
   * 
   * @param userId - User ID
   */
  async revokeComplimentarySubscription(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        currentPeriodEnd: null,
      },
    });

    console.log(`[Complimentary] Revoked subscription for user ${userId}`);
  }

  /**
   * Generate a temporary password for new users
   */
  private generateTemporaryPassword(): string {
    return `Temp${Math.random().toString(36).slice(2, 10)}!`;
  }
}
