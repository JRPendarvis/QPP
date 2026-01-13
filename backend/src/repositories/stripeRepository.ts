// src/repositories/stripeRepository.ts

import { PrismaClient } from '@prisma/client';
import type { SubscriptionUpdateData, SubscriptionStatusUpdate, SubscriptionCancellationData } from '../services/subscription/subscriptionService';

const prisma = new PrismaClient();

export interface UserWithStripeData {
  id: string;
  email: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

/**
 * Data access layer for Stripe-related user data
 * Single Responsibility: Database operations for Stripe subscription data
 * Follows Repository pattern for Dependency Inversion
 */
export class StripeRepository {
  /**
   * Get user by ID with Stripe data
   * @param userId - User ID
   * @returns User with Stripe fields or null
   */
  async getUserById(userId: string): Promise<UserWithStripeData | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true
      }
    });

    return user;
  }

  /**
   * Find user by Stripe subscription ID
   * @param stripeSubscriptionId - Stripe subscription ID
   * @returns User or null
   */
  async getUserBySubscriptionId(stripeSubscriptionId: string): Promise<UserWithStripeData | null> {
    const user = await prisma.user.findUnique({
      where: { stripeSubscriptionId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true
      }
    });

    return user;
  }

  /**
   * Update user with subscription data from checkout
   * @param userId - User ID
   * @param data - Subscription data to update
   */
  async updateSubscription(userId: string, data: SubscriptionUpdateData): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data
    });

    console.log(`Database updated: user ${userId} subscription activated`);
  }

  /**
   * Update subscription status
   * @param userId - User ID
   * @param data - Status update data
   */
  async updateSubscriptionStatus(userId: string, data: SubscriptionStatusUpdate): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data
    });

    console.log(`Database updated: user ${userId} subscription status updated`);
  }

  /**
   * Reset user to free tier after cancellation
   * @param userId - User ID
   * @param data - Cancellation data
   */
  async cancelSubscription(userId: string, data: SubscriptionCancellationData): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data
    });

    console.log(`Database updated: user ${userId} subscription canceled`);
  }

  /**
   * Mark subscription as cancel_at_period_end
   * @param userId - User ID
   */
  async markCancelAtPeriodEnd(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'cancel_at_period_end'
      }
    });

    console.log(`Database updated: user ${userId} marked for cancellation at period end`);
  }
}
