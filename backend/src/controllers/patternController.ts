import { Request, Response } from 'express';
import { ClaudeService } from '../services/claudeService';
import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_TIERS } from '../config/stripe.config';

const claudeService = new ClaudeService();
const prisma = new PrismaClient();

const NEXT_LEVEL: Record<string, string> = {
  beginner: 'advanced_beginner',
  advanced_beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'expert',
  expert: 'expert',
};

export class PatternController {
  async generatePattern(req: Request, res: Response) {
    try {
      const { fabrics, skillLevel, challengeMe } = req.body;
      const userId = req.user?.userId;

      // Validate user is authenticated
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Validate input
      if (!fabrics || !Array.isArray(fabrics) || fabrics.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least 2 fabric images',
        });
      }

      if (fabrics.length > 8) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 8 fabric images allowed',
        });
      }

      // Validate fabrics are base64 strings
      const validFabrics = fabrics.every(
        (fabric: any) => typeof fabric === 'string' && fabric.length > 0
      );

      if (!validFabrics) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fabric data format',
        });
      }

      // ✅ FIX #1: Get user and check subscription status
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // ✅ FIX #2: Check if subscription is active (for paid tiers)
      if (user.subscriptionTier !== 'free') {
        if (user.subscriptionStatus !== 'active') {
          return res.status(403).json({
            success: false,
            message: 'Subscription is not active. Please update your payment method.',
          });
        }

        // Check if subscription has expired
        if (user.currentPeriodEnd && user.currentPeriodEnd < new Date()) {
          return res.status(403).json({
            success: false,
            message: 'Subscription has expired. Please renew your subscription.',
          });
        }
      }

      // ✅ FIX #3: Check usage limits
      const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];
      
      if (!tierConfig) {
        return res.status(500).json({
          success: false,
          message: 'Invalid subscription tier',
        });
      }

      // Check if user has exceeded generation limit
      if (user.generationsThisMonth >= tierConfig.generationsPerMonth) {
        return res.status(403).json({
          success: false,
          message: `You've reached your monthly limit of ${tierConfig.generationsPerMonth} pattern generations. Upgrade your plan for more!`,
          currentUsage: user.generationsThisMonth,
          limit: tierConfig.generationsPerMonth,
        });
      }

      // Determine target skill level
      let targetSkillLevel = skillLevel || user.skillLevel || 'beginner';
      
      if (challengeMe && targetSkillLevel !== 'expert') {
        targetSkillLevel = NEXT_LEVEL[targetSkillLevel] || targetSkillLevel;
      }

      // Generate pattern using Claude
      const pattern = await claudeService.generateQuiltPattern(fabrics, targetSkillLevel);

      // ✅ FIX #4: Save pattern to database
      const savedPattern = await prisma.pattern.create({
        data: {
          userId: user.id,
          patternData: pattern,
        }
      });

      // ✅ FIX #5: Increment generation counter
      await prisma.user.update({
        where: { id: user.id },
        data: {
          generationsThisMonth: user.generationsThisMonth + 1,
        }
      });

      res.status(200).json({
        success: true,
        message: 'Pattern generated successfully',
        data: {
          pattern,
          patternId: savedPattern.id,
          usage: {
            used: user.generationsThisMonth + 1,
            limit: tierConfig.generationsPerMonth,
            remaining: tierConfig.generationsPerMonth - (user.generationsThisMonth + 1),
          }
        },
      });

    } catch (error) {
      console.error('Pattern generation error:', error);
      
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate pattern',
        });
      }
    }
  }
}