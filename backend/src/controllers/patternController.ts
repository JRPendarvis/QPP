import { Request, Response } from 'express';
import { PDFService } from '../services/pdfService';
import { PatternGenerationService } from '../services/patternGenerationService';
import { PatternDownloadService } from '../services/patternDownloadService';
import { PatternListService } from '../services/patternListService';
import { PatternValidators } from '../validators/patternValidators';
import { normalizePatternId } from '../utils/patternNormalization';
import { PatternErrorHandler } from './helpers/patternErrorHandler';
import {
  logPatternGenerationRequest,
  buildDebugInfo,
} from './helpers/patternControllerUtils';

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
      const body = req.body ?? {};
      const {
        fabricImages,
        fabrics,
        fabricTypes,
        skillLevel,
        challengeMe,
        selectedPattern,
        roleAssignments,
      } = body as any;

      const images = fabricImages || fabrics;
      const imageTypes = fabricTypes || [];

      logPatternGenerationRequest(body);

      // Validation
      const validationError =
        PatternValidators.validateUserId(userId) ||
        PatternValidators.validateImages(images) ||
        PatternValidators.validateImageSizes(images) ||
        PatternValidators.validateSkillLevel(skillLevel);

      if (validationError) {
        return res.status(validationError.statusCode).json({
          ...validationError,
          debug: buildDebugInfo(userId, images, imageTypes, selectedPattern, skillLevel),
        });
      }

      const normalizedPattern = normalizePatternId(selectedPattern);

      const result = await this.generationService.generate({
        userId: userId!,
        images,
        imageTypes,
        skillLevel,
        challengeMe,
        selectedPattern: normalizedPattern,
        roleAssignments,
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

      const { user, pattern, validation } = await PatternDownloadService.validateDownload(userId, patternId);

      if (!validation.canDownload && validation.error) {
        return res.status(validation.error.statusCode).json({
          success: false,
          ...validation.error,
        });
      }

      const isFirstDownload = !pattern.downloaded;
      const pdfBuffer = await this.pdfService.generatePatternPDF(pattern.patternData as any, user.name || user.email);

      await PatternDownloadService.recordDownload(userId, patternId, isFirstDownload);

      const fileName = PatternDownloadService.generateFileName(pattern.patternData);

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

      if (normalizePatternId(patternId) === 'auto') {
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
}
