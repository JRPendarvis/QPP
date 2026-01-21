// src/repositories/userRepository.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
  billingInterval: string | null;
  subscriptionStatus: string;
  skillLevel: string;
  generationsThisMonth: number;
  downloadsThisMonth: number;
  lastResetDate: Date;
  createdAt: Date;
  badge: string | null;
  role: string;
}

export interface UserUpdateData {
  name?: string;
  skillLevel?: string;
}

/**
 * Data access layer for user operations
 * Single Responsibility: Database operations for user data only
 * Follows Repository pattern for Dependency Inversion
 */
export class UserRepository {
  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns User profile data or null
   */
  async getUserProfile(userId: string): Promise<UserProfileData | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        billingInterval: true,
        subscriptionStatus: true,
        skillLevel: true,
        generationsThisMonth: true,
        downloadsThisMonth: true,
        lastResetDate: true,
        createdAt: true,
        badge: true,
        role: true,
      },
    });

    return user as UserProfileData | null;
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Update data
   * @returns Updated user profile
   */
  async updateUserProfile(userId: string, data: UserUpdateData): Promise<UserProfileData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        billingInterval: true,
        subscriptionStatus: true,
        skillLevel: true,
        generationsThisMonth: true,
        downloadsThisMonth: true,
        lastResetDate: true,
        createdAt: true,
        badge: true,
      },
    });

    return user as UserProfileData;
  }
}
