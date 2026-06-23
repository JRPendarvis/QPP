import { Request, Response } from 'express';
import { PDFService } from '../services/pdf/pdfService';
import { PatternGenerationService } from '../services/pattern/patternGenerationService';
import { PatternDownloadService } from '../services/pattern/patternDownloadService';
import { PatternListService } from '../services/pattern/patternListService';
import { PatternRequestValidator } from '../services/pattern/patternRequestValidator';
import { PatternErrorHandler } from './helpers/patternErrorHandler';
import { FabricCoordinationService } from '../services/ai/fabricCoordinationService';
import { SubscriptionValidator } from '../services/subscription/subscriptionValidator';
import { UserUsageRepository } from '../services/user/userUsageRepository';
import { getCreditCost } from '../config/credits.config';
import {
  logPatternGenerationRequest,
  buildDebugInfo,
} from './helpers/patternControllerUtils';

export class PatternController {
  private pdfService: PDFService;
  private generationService: PatternGenerationService;
  private downloadService: PatternDownloadService;
  private subscriptionValidator: SubscriptionValidator;
  private userUsageRepository: UserUsageRepository;

  constructor() {
    this.pdfService = new PDFService();
    this.generationService = new PatternGenerationService();
    this.downloadService = new PatternDownloadService();
    this.subscriptionValidator = new SubscriptionValidator();
    this.userUsageRepository = new UserUsageRepository();
  }

  async generatePattern(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const body = req.body ?? {};
      const {
        fabricImages,
        fabrics,
        fabricTypes,
        skillLevel,
        challengeMe,
        selectedPattern,
        forceUnique,
        roleAssignments,
        quiltSize,
        borderConfiguration,
      } = body as any;

      const images = fabricImages || fabrics;
      const imageTypes = fabricTypes || [];

      logPatternGenerationRequest(body);

      // Validation
      const validationError = PatternRequestValidator.validateGenerationRequest({
        userId,
        images,
        skillLevel,
      });

      if (validationError) {
        return res.status(validationError.statusCode).json({
          ...validationError,
          debug: buildDebugInfo(userId, images, imageTypes, selectedPattern, skillLevel),
        });
      }

      const normalizedPattern = forceUnique
        ? 'unique'
        : PatternRequestValidator.normalizePattern(selectedPattern);
      console.log('[PatternController] Pattern normalization:', {
        selectedPattern,
        forceUnique,
        normalizedPattern,
      });

      const result = await this.generationService.generate({
        userId: userId!,
        images,
        imageTypes,
        skillLevel,
        challengeMe,
        selectedPattern: normalizedPattern,
        roleAssignments,
        quiltSize,
        borderConfiguration,
      });

      console.log('🎯 [PatternController] Result to send to client:', {
        hasPattern: !!result.pattern,
        hasVisualSvg: !!result.pattern?.visualSvg,
        visualSvgLength: result.pattern?.visualSvg?.length || 0,
        patternKeys: result.pattern ? Object.keys(result.pattern) : []
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      return PatternErrorHandler.handleGenerationError(error, res);
    }
  }

  async generateUniquePattern(req: Request, res: Response) {
    try {
      const body = req.body ?? {};
      const forcedBody = {
        ...body,
        selectedPattern: 'unique',
        forceUnique: true,
      };

      req.body = forcedBody;
      return this.generatePattern(req, res);
    } catch (error) {
      return PatternErrorHandler.handleGenerationError(error, res);
    }
  }

  async downloadPattern(req: Request, res: Response) {
    try {
      const { id: patternId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { user, pattern, validation } = await this.downloadService.validateDownload(userId, patternId);

      if (!validation.canDownload && validation.error) {
        return res.status(validation.error.statusCode).json({
          success: false,
          ...validation.error,
        });
      }

      if (!pattern || !user) {
        return res.status(404).json({ success: false, message: 'Pattern or user not found' });
      }

      const isFirstDownload = !pattern.downloaded;
      const pdfBuffer = await this.pdfService.generatePatternPDF(pattern.patternData as any, user.name || user.email);

      await this.downloadService.recordDownload(userId, patternId, isFirstDownload, pattern.patternData);

      const fileName = this.downloadService.generateFileName(pattern.patternData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      return PatternErrorHandler.handleDownloadError(error, res);
    }
  }

  async listPatterns(_req: Request, res: Response) {
    try {
      const patterns = PatternListService.getAvailablePatterns();
      res.json({ success: true, data: patterns });
    } catch (error) {
      return PatternErrorHandler.handleGenericError(error, res, 'List patterns');
    }
  }

  async getFabricRoles(req: Request, res: Response) {
    try {
      const patternId = req.params.id;

      if (!PatternRequestValidator.canGetFabricRoles(patternId)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot get fabric roles for auto pattern selection',
        });
      }

      const fabricRoles = PatternListService.getFabricRolesForPattern(patternId);

      if (!fabricRoles) {
        return res.status(404).json({ success: false, message: 'Pattern not found' });
      }

      res.json({
        success: true,
        data: fabricRoles,
      });
    } catch (error) {
      return PatternErrorHandler.handleGenericError(error, res, 'Get fabric roles');
    }
  }

  /**
   * Auto-assign fabric roles using AI coordination
   * Analyzes uploaded fabrics and assigns optimal roles for a coordinated quilt design
   */
  async autoAssignFabricRoles(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { fabrics } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Validation
      if (!fabrics || !Array.isArray(fabrics)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request: fabrics array is required',
        });
      }

      if (fabrics.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least 2 fabrics for auto-assignment',
        });
      }

      if (fabrics.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 fabrics allowed for auto-assignment',
        });
      }

      // Validate fabric data structure
      const isValid = fabrics.every(
        (fabric: any) =>
          fabric.imageData &&
          fabric.fileName &&
          typeof fabric.imageData === 'string' &&
          (!fabric.imageType || typeof fabric.imageType === 'string')
      );

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fabric data format',
        });
      }

      console.log(`[PatternController] Auto-assigning roles for ${fabrics.length} fabrics`);

      const creditsRequired = getCreditCost('fabricCoordination');
      const { user, tierConfig } = await this.subscriptionValidator.validateUser(userId, creditsRequired);

      const coordinationService = new FabricCoordinationService();
      const roleAssignments = await coordinationService.autoAssignRoles(fabrics);

      let creditsUsed = user.generationsThisMonth;
      if (user.role !== 'staff') {
        const updatedUsage = await this.userUsageRepository.incrementCreditsUsed(user.id, creditsRequired);
        creditsUsed = updatedUsage.generationsThisMonth;
      }

      const creditsRemaining = tierConfig.creditsPerMonth === Infinity
        ? Infinity
        : Math.max(0, tierConfig.creditsPerMonth - creditsUsed);

      res.json({
        success: true,
        data: roleAssignments,
        message: 'Fabric roles automatically coordinated',
        usage: {
          credits: {
            used: creditsUsed,
            limit: tierConfig.creditsPerMonth,
            remaining: creditsRemaining,
          },
        },
      });
    } catch (error) {
      console.error('[PatternController] Auto-assign fabric roles error:', error);

      if (error instanceof Error) {
        if (error.message === 'USER_NOT_FOUND') {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (error.message === 'SUBSCRIPTION_EXPIRED') {
          return res.status(403).json({ success: false, message: 'Your subscription has expired. Please renew to continue.' });
        }
        if (error.message === 'GENERATION_LIMIT_REACHED') {
          return res.status(403).json({ success: false, message: "You've reached your monthly credit limit. Upgrade your plan for more credits!" });
        }
      }

      const message = error instanceof Error ? error.message : 'Failed to auto-assign fabric roles';
      
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
}
