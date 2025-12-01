import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
          skillLevel: true,
          downloadsThisMonth: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
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
          skillLevel: true,
          downloadsThisMonth: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
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