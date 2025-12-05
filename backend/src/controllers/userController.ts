import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_TIERS } from '../config/stripe.config';

const prisma = new PrismaClient();

export class UserController {
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
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Calculate usage limits based on tier
      const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];
      
      // Calculate days until reset (30 days from lastResetDate)
      const nextResetDate = new Date(user.lastResetDate);
      nextResetDate.setDate(nextResetDate.getDate() + 30);
      const daysUntilReset = Math.max(0, Math.ceil((nextResetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      res.status(200).json({
        success: true,
        data: {
          ...user,
          usage: {
            generations: {
              used: user.generationsThisMonth,
              limit: tierConfig.generationsPerMonth,
              remaining: Math.max(0, tierConfig.generationsPerMonth - user.generationsThisMonth),
            },
            downloads: {
              used: user.downloadsThisMonth,
              limit: tierConfig.downloadsPerMonth,
              remaining: Math.max(0, tierConfig.downloadsPerMonth - user.downloadsThisMonth),
            },
            resetDate: nextResetDate.toISOString(),
            daysUntilReset,
          },
          tierInfo: {
            name: tierConfig.name,
            price: user.billingInterval 
              ? tierConfig.price[user.billingInterval as 'monthly' | 'yearly']
              : 0,
          }
        },
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
      const validSkillLevels = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
      if (skillLevel && !validSkillLevels.includes(skillLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid skill level',
        });
      }

      // Build update object
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (skillLevel !== undefined) updateData.skillLevel = skillLevel;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
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
        },
      });

      // Calculate usage stats for response
      const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];
      const nextResetDate = new Date(user.lastResetDate);
      nextResetDate.setDate(nextResetDate.getDate() + 30);
      const daysUntilReset = Math.max(0, Math.ceil((nextResetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...user,
          usage: {
            generations: {
              used: user.generationsThisMonth,
              limit: tierConfig.generationsPerMonth,
              remaining: Math.max(0, tierConfig.generationsPerMonth - user.generationsThisMonth),
            },
            downloads: {
              used: user.downloadsThisMonth,
              limit: tierConfig.downloadsPerMonth,
              remaining: Math.max(0, tierConfig.downloadsPerMonth - user.downloadsThisMonth),
            },
            resetDate: nextResetDate.toISOString(),
            daysUntilReset,
          },
          tierInfo: {
            name: tierConfig.name,
            price: user.billingInterval 
              ? tierConfig.price[user.billingInterval as 'monthly' | 'yearly']
              : 0,
          }
        },
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