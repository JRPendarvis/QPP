import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ClaudeService } from '../services/claudeService';
import { SUBSCRIPTION_TIERS } from '../config/stripe.config';
import { PDFService } from '../services/pdfService';
import { getAllPatterns } from '../config/patterns';
import { getPatternsForSkillLevel, getQuiltPattern } from '../config/quiltPatterns';

const prisma = new PrismaClient();

/**
 * Get valid pattern IDs from the pattern registry
 */
function getValidPatternIds(): string[] {
  return ['auto', ...getAllPatterns().map(p => p.id)];
}

export class PatternController {
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = new ClaudeService();
  }

  // POST /api/patterns/generate
  async generatePattern(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // Accept both 'fabricImages' and 'fabrics' field names, plus selectedPattern
      const { fabricImages, fabrics, fabricTypes, skillLevel, challengeMe, selectedPattern } = req.body;
      const images = fabricImages || fabrics;
      const imageTypes = fabricTypes || [];

      console.log('📸 Received image types:', imageTypes);
      console.log('📸 Images count:', images.length, 'Types count:', imageTypes.length);

      // Validation
      if (!images || !Array.isArray(images) || images.length < 2 || images.length > 8) {
        return res.status(400).json({
          success: false,
          message: 'Please provide 2-8 fabric images',
        });
      }

      // Validate image sizes (5MB per image in base64)
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < images.length; i++) {
        const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
        const sizeInBytes = (base64Data.length * 3) / 4;
        if (sizeInBytes > MAX_IMAGE_SIZE) {
          return res.status(400).json({
            success: false,
            message: `Image ${i + 1} exceeds 5MB limit`,
          });
        }
      }

      const validSkillLevels = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
      if (skillLevel && !validSkillLevels.includes(skillLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid skill level',
        });
      }

      // Validate selectedPattern if provided
      const validPatternIds = getValidPatternIds();
      const patternToUse = selectedPattern && validPatternIds.includes(selectedPattern) 
        ? selectedPattern 
        : 'auto';

      // Get user with subscription info
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
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check subscription status
      if (user.subscriptionStatus === 'canceled' || 
          (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())) {
        return res.status(403).json({
          success: false,
          message: 'Your subscription has expired. Please renew to generate patterns.',
        });
      }

      // Get tier configuration
      const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

      // Check usage limits
      if (user.generationsThisMonth >= tierConfig.generationsPerMonth) {
        return res.status(403).json({
          success: false,
          message: `You've reached your monthly limit of ${tierConfig.generationsPerMonth} pattern generations. Upgrade your plan for more!`,
          currentUsage: user.generationsThisMonth,
          limit: tierConfig.generationsPerMonth,
        });
      }

      // Determine skill level to use
      let targetSkillLevel = skillLevel || user.skillLevel || 'beginner';

      // Apply "Challenge Me" logic
      if (challengeMe) {
        const skillProgression = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = skillProgression.indexOf(targetSkillLevel);
        if (currentIndex < skillProgression.length - 1) {
          targetSkillLevel = skillProgression[currentIndex + 1];
        }
      }

      // Generate pattern using Claude - with validated selectedPattern
      const pattern = await this.claudeService.generateQuiltPattern(
        images,
        imageTypes,
        targetSkillLevel,
        patternToUse
      );

      // Use transaction to ensure both operations succeed or fail together
      const savedPattern = await prisma.$transaction(async (tx) => {
        // Save pattern to database
        const newPattern = await tx.pattern.create({
          data: {
            userId: user.id,
            patternData: pattern as any,
            downloaded: false,
          },
        });

        // Increment generation counter
        await tx.user.update({
          where: { id: userId },
          data: {
            generationsThisMonth: { increment: 1 },
          },
        });

        return newPattern;
      });

      // Calculate remaining usage
      const remainingGenerations = tierConfig.generationsPerMonth - (user.generationsThisMonth + 1);

      console.log('Pattern structure:', {
        hasInstructions: !!pattern.instructions,
        instructionsLength: pattern.instructions?.length,
        instructionsComplete: pattern.instructions?.every((i: string) => i.length > 10)
      });

      res.status(200).json({
        success: true,
        data: {
          pattern: {
            ...pattern,
            id: savedPattern.id,
          },
          usage: {
            used: user.generationsThisMonth + 1,
            limit: tierConfig.generationsPerMonth,
            remaining: remainingGenerations,
          },
        },
      });
    } catch (error) {
      console.error('Pattern generation error:', error);
      
      // Provide more helpful error messages
      let message = 'Failed to generate quilt pattern. Please try again.';
      if (error instanceof Error) {
        // Check for Claude overload message (from retry logic)
        if (error.message.includes('high demand') || error.message.includes('experiencing')) {
          message = error.message; // Use the friendly message from retry logic
        } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
          message = 'Pattern generation timed out. Please try again with fewer images.';
        } else if (error.message.includes('rate limit')) {
          message = 'Service is busy. Please wait a moment and try again.';
        }
      }
      
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  // GET /api/patterns/:id/download
  async downloadPattern(req: Request, res: Response) {
    try {
      const { id: patternId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // Get user with subscription info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
          downloadsThisMonth: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check subscription status
      if (user.subscriptionStatus === 'canceled' || 
          (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())) {
        return res.status(403).json({
          success: false,
          message: 'Your subscription has expired. Please renew to download patterns.',
        });
      }

      // Get the pattern
      const pattern = await prisma.pattern.findFirst({
        where: {
          id: patternId,
          userId: userId,
        },
      });

      if (!pattern) {
        return res.status(404).json({
          success: false,
          message: 'Pattern not found or you do not have permission to download it',
        });
      }

      // ✅ FIX: Only count against limit if this is a FIRST download
      const isFirstDownload = !pattern.downloaded;

      if (isFirstDownload) {
        // Get tier configuration
        const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

        // Check download limits only for first download
        if (user.downloadsThisMonth >= tierConfig.downloadsPerMonth) {
          return res.status(403).json({
            success: false,
            message: `You've reached your monthly download limit of ${tierConfig.downloadsPerMonth}. Upgrade your plan for more downloads!`,
            currentUsage: user.downloadsThisMonth,
            limit: tierConfig.downloadsPerMonth,
          });
        }
      }

      // Generate PDF
      const pdfService = new PDFService();
      const pdfBuffer = await pdfService.generatePatternPDF(
        pattern.patternData as any,
        user.name || user.email
      );

      // ✅ FIX: Only increment counter and mark downloaded on FIRST download
      if (isFirstDownload) {
        await prisma.$transaction(async (tx) => {
          // Increment download counter
          await tx.user.update({
            where: { id: userId },
            data: {
              downloadsThisMonth: { increment: 1 },
            },
          });

          // Mark pattern as downloaded
          await tx.pattern.update({
            where: { id: patternId },
            data: {
              downloaded: true,
              downloadedAt: new Date(),
            },
          });
        });
      }

      // Send PDF
      const fileName = `${(pattern.patternData as any).patternName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);

    } catch (error) {
      console.error('Download pattern error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download pattern. Please try again.',
      });
    }
  }

  // GET /api/patterns/list - Get all available patterns with metadata
  async listPatterns(req: Request, res: Response) {
    try {
      // Get all patterns from the new pattern system
      const allPatterns = getAllPatterns().map(patternDef => {
        const quiltPattern = getQuiltPattern(patternDef.id);
        return {
          id: patternDef.id,
          name: patternDef.name,
          skillLevel: quiltPattern?.skillLevel || 'intermediate',
          description: quiltPattern?.description || '',
          recommendedFabricCount: quiltPattern?.recommendedFabricCount || null,
          minColors: patternDef.minColors,
          maxColors: patternDef.maxColors,
          allowRotation: patternDef.allowRotation ?? true,
        };
      });

      res.json({
        success: true,
        data: allPatterns
      });
    } catch (error) {
      console.error('List patterns error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list patterns'
      });
    }
  }
}