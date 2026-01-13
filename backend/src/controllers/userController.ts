import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { UsageCalculator } from '../services/user/usageCalculator';
import { ProfileTransformer } from '../services/user/profileTransformer';

/**
 * HTTP controller for user profile operations
 * Single Responsibility: HTTP request/response handling only
 * Delegates business logic to services following Dependency Inversion
 */
export class UserController {
  private userRepository: UserRepository;
  private usageCalculator: UsageCalculator;
  private profileTransformer: ProfileTransformer;

  constructor() {
    this.userRepository = new UserRepository();
    this.usageCalculator = new UsageCalculator();
    this.profileTransformer = new ProfileTransformer();
  }
  // GET /api/user/profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await this.userRepository.getUserProfile(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Calculate usage statistics
      const usage = this.usageCalculator.calculateUsage(
        user.subscriptionTier,
        user.generationsThisMonth,
        user.downloadsThisMonth,
        user.lastResetDate
      );

      // Get tier configuration
      const tierConfig = this.usageCalculator.getTierConfig(user.subscriptionTier);

      // Transform to API response format
      const profileData = this.profileTransformer.transformProfile(user, usage, tierConfig);

      res.status(200).json({
        success: true,
        data: profileData,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
      });
    }
  }

  // PUT /api/user/profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { name, skillLevel } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // Validate skillLevel if provided
      if (skillLevel && !this.profileTransformer.isValidSkillLevel(skillLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid skill level',
        });
      }

      // Build update object
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (skillLevel !== undefined) updateData.skillLevel = skillLevel;

      const user = await this.userRepository.updateUserProfile(userId, updateData);

      // Calculate usage statistics
      const usage = this.usageCalculator.calculateUsage(
        user.subscriptionTier,
        user.generationsThisMonth,
        user.downloadsThisMonth,
        user.lastResetDate
      );

      // Get tier configuration
      const tierConfig = this.usageCalculator.getTierConfig(user.subscriptionTier);

      // Transform to API response format
      const profileData = this.profileTransformer.transformProfile(user, usage, tierConfig);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profileData,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  }
}