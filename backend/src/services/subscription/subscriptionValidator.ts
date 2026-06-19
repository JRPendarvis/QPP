// src/services/subscriptionValidator.ts

import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_TIERS } from '../../config/stripe.config';

const prisma = new PrismaClient();

export interface ValidatedUser {
  user: {
    id: string;
    email: string;
    name: string | null;
    skillLevel: string;
    subscriptionTier: string;
    subscriptionStatus: string;
    currentPeriodEnd: Date | null;
    generationsThisMonth: number;
    role: string;
  };
  tierConfig: {
    creditsPerMonth: number;
    downloadsPerMonth: number;
  };
}

/**
 * Validates user subscription status and usage limits
 * Single Responsibility: User subscription validation only
 */
export class SubscriptionValidator {
  async validateUser(userId: string, requiredCredits = 1): Promise<ValidatedUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        skillLevel: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        generationsThisMonth: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // Staff users bypass all limits
    if (user.role === 'staff') {
      const tierConfig = {
        creditsPerMonth: Infinity,
        downloadsPerMonth: Infinity,
      };
      return { user, tierConfig };
    }

    if (
      user.subscriptionStatus === 'canceled' ||
      (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())
    ) {
      throw new Error('SUBSCRIPTION_EXPIRED');
    }

    const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

    if (user.generationsThisMonth + requiredCredits > tierConfig.creditsPerMonth) {
      throw new Error('GENERATION_LIMIT_REACHED');
    }

    return { user, tierConfig };
  }
}
