// src/services/profileTransformer.ts

import type { UserProfileData } from '../repositories/userRepository';
import type { UsageStats } from './usageCalculator';

export interface ProfileResponse {
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
  usage: UsageStats;
  tierInfo: {
    name: string;
    price: number;
  };
}

/**
 * Transforms user data into API response format
 * Single Responsibility: Data transformation for API responses only
 */
export class ProfileTransformer {
  /**
   * Transform user profile data into API response format
   * @param user - User profile data from database
   * @param usage - Calculated usage statistics
   * @param tierConfig - Tier configuration
   * @returns Formatted profile response
   */
  transformProfile(user: UserProfileData, usage: UsageStats, tierConfig: any): ProfileResponse {
    return {
      ...user,
      usage,
      tierInfo: {
        name: tierConfig.name,
        price: this.getTierPrice(user.billingInterval, tierConfig),
      },
    };
  }

  /**
   * Get tier price based on billing interval
   */
  private getTierPrice(billingInterval: string | null, tierConfig: any): number {
    if (!billingInterval) return 0;
    
    const interval = billingInterval as 'monthly' | 'yearly';
    return tierConfig.price[interval] || 0;
  }

  /**
   * Validate skill level
   * @param skillLevel - Skill level to validate
   * @returns True if valid
   */
  isValidSkillLevel(skillLevel: string): boolean {
    const validSkillLevels = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
    return validSkillLevels.includes(skillLevel);
  }

  /**
   * Get list of valid skill levels
   * @returns Array of valid skill levels
   */
  getValidSkillLevels(): string[] {
    return ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
  }
}
