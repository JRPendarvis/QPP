import { Request, Response } from 'express';
import { PDFService } from '../services/pdf/pdfService';
import { PatternGenerationService } from '../services/pattern/patternGenerationService';
import { PatternDownloadService } from '../services/pattern/patternDownloadService';
import { PatternListService } from '../services/pattern/patternListService';
import { PatternRequestValidator } from '../services/pattern/patternRequestValidator';
import { PatternErrorHandler } from './helpers/patternErrorHandler';
import { FabricCoordinationService } from '../services/ai/fabricCoordinationService';
import {
  logPatternGenerationRequest,
  buildDebugInfo,
} from './helpers/patternControllerUtils';

export class PatternController {
  private pdfService: PDFService;
  private generationService: PatternGenerationService;
  private downloadService: PatternDownloadService;

  constructor() {
    this.pdfService = new PDFService();
    this.generationService = new PatternGenerationService();
    this.downloadService = new PatternDownloadService();
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

      const normalizedPattern = PatternRequestValidator.normalizePattern(selectedPattern);

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

  async listPatterns(req: Request, res: Response) {
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
      const { fabrics } = req.body;

      // Validation
      if (!fabrics || !Array.isArray(fabrics)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request: fabrics array is required',
        });
      }

      if (fabrics.length < 1) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least 1 fabric for auto-assignment',
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
        (fabric: any) => fabric.imageData && fabric.fileName && typeof fabric.imageData === 'string'
      );

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fabric data format',
        });
      }

      console.log(`[PatternController] Auto-assigning roles for ${fabrics.length} fabrics`);

      const coordinationService = new FabricCoordinationService();
      const roleAssignments = await coordinationService.autoAssignRoles(fabrics);

      res.json({
        success: true,
        data: roleAssignments,
        message: 'Fabric roles automatically coordinated',
      });
    } catch (error) {
      console.error('[PatternController] Auto-assign fabric roles error:', error);
      const message = error instanceof Error ? error.message : 'Failed to auto-assign fabric roles';
      
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
}
