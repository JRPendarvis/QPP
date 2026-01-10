import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PDFService } from '../services/pdfService';
import { PatternGenerationService } from '../services/patternGenerationService';
import { PatternValidators } from '../validators/patternValidators';
import { getAllPatterns } from '../config/patterns';
import { getQuiltPattern } from '../config/quiltPatterns';
import { normalizePatternId } from '../utils/patternNormalization';
import { SUBSCRIPTION_TIERS } from '../config/stripe.config';

const prisma = new PrismaClient();

export class PatternController {
  private pdfService: PDFService;
  private generationService: PatternGenerationService;

  constructor() {
    this.pdfService = new PDFService();
    this.generationService = new PatternGenerationService();
  }

  async generatePattern(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { fabricImages, fabrics, fabricTypes, skillLevel, challengeMe, selectedPattern, roleAssignments } = req.body;
      const images = fabricImages || fabrics;
      const imageTypes = fabricTypes || [];

      console.log('📸 Images count:', images?.length, 'Types count:', imageTypes.length);
      console.log('📋 Raw selectedPattern:', selectedPattern);

      // Validation
      const validationError =
        PatternValidators.validateUserId(userId) ||
        PatternValidators.validateImages(images) ||
        PatternValidators.validateImageSizes(images) ||
        PatternValidators.validateSkillLevel(skillLevel);

      if (validationError) {
        return res.status(validationError.statusCode).json(validationError);
      }

      const result = await this.generationService.generate({
        userId: userId!,
        images,
        imageTypes,
        skillLevel,
        challengeMe,
        selectedPattern,
        roleAssignments,
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Pattern generation error:', error);

      if (error instanceof Error) {
        if (error.message === 'USER_NOT_FOUND') {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (error.message === 'SUBSCRIPTION_EXPIRED') {
          return res.status(403).json({
            success: false,
            message: 'Your subscription has expired. Please renew to generate patterns.',
          });
        }
        if (error.message === 'GENERATION_LIMIT_REACHED') {
          return res.status(403).json({
            success: false,
            message: "You've reached your monthly generation limit. Upgrade your plan for more!",
          });
        }
      }

      let message = 'Failed to generate quilt pattern. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('high demand') || error.message.includes('experiencing')) {
          message = error.message;
        } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
          message = 'Pattern generation timed out. Please try again with fewer images.';
        } else if (error.message.includes('rate limit')) {
          message = 'Service is busy. Please wait a moment and try again.';
        }
      }

      res.status(500).json({ success: false, message });
    }
  }

  async downloadPattern(req: Request, res: Response) {
    try {
      const { id: patternId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

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
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.subscriptionStatus === 'canceled' || (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())) {
        return res.status(403).json({
          success: false,
          message: 'Your subscription has expired. Please renew to download patterns.',
        });
      }

      const pattern = await prisma.pattern.findFirst({
        where: { id: patternId, userId: userId },
      });

      if (!pattern) {
        return res.status(404).json({
          success: false,
          message: 'Pattern not found or you do not have permission to download it',
        });
      }

      const isFirstDownload = !pattern.downloaded;

      if (isFirstDownload) {
        const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

        if (user.downloadsThisMonth >= tierConfig.downloadsPerMonth) {
          return res.status(403).json({
            success: false,
            message: `You've reached your monthly download limit of ${tierConfig.downloadsPerMonth}. Upgrade your plan for more downloads!`,
            currentUsage: user.downloadsThisMonth,
            limit: tierConfig.downloadsPerMonth,
          });
        }
      }

      const pdfBuffer = await this.pdfService.generatePatternPDF(pattern.patternData as any, user.name || user.email);

      if (isFirstDownload) {
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: userId },
            data: { downloadsThisMonth: { increment: 1 } },
          });

          await tx.pattern.update({
            where: { id: patternId },
            data: { downloaded: true, downloadedAt: new Date() },
          });
        });
      }

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

  async listPatterns(req: Request, res: Response) {
    try {
      const allPatterns = getAllPatterns()
        .filter((patternDef) => {
          if (process.env.NODE_ENV !== 'production') {
            return true;
          }
          return patternDef.enabled !== false;
        })
        .map((patternDef) => {
          const quiltPattern = getQuiltPattern(patternDef.id);
          return {
            id: patternDef.id,
            name: patternDef.name,
            skillLevel: quiltPattern?.skillLevel || 'intermediate',
            description: quiltPattern?.description || '',
            recommendedFabricCount: quiltPattern?.recommendedFabricCount || null,
            minColors: patternDef.minFabrics,
            maxFabrics: patternDef.maxFabrics,
            allowRotation: patternDef.allowRotation ?? true,
          };
        });

      res.json({ success: true, data: allPatterns });
    } catch (error) {
      console.error('List patterns error:', error);
      res.status(500).json({ success: false, message: 'Failed to list patterns' });
    }
  }

  async getFabricRoles(req: Request, res: Response) {
    try {
      const patternId = normalizePatternId(req.params.id);

      if (patternId === 'auto') {
        return res.status(400).json({
          success: false,
          message: 'Cannot get fabric roles for auto pattern selection',
        });
      }

      const patterns = getAllPatterns();
      const pattern = patterns.find((p) => p.id === patternId);

      if (!pattern) {
        return res.status(404).json({ success: false, message: 'Pattern not found' });
      }

      const defaultRoles = ['Background', 'Primary', 'Secondary', 'Accent', 'Contrast', 'Highlight', 'Border', 'Binding'];
      const fabricRoles = pattern.fabricRoles || defaultRoles.slice(0, pattern.maxFabrics);

      res.json({
        success: true,
        data: {
          patternId: pattern.id,
          patternName: pattern.name,
          fabricRoles: fabricRoles,
          minFabrics: pattern.minFabrics,
          maxFabrics: pattern.maxFabrics,
        },
      });
    } catch (error) {
      console.error('Get fabric roles error:', error);
      res.status(500).json({ success: false, message: 'Failed to get fabric roles' });
    }
  }
}
