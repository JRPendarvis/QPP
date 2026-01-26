import { Request, Response } from 'express';
import { PatternLibraryService } from '../services/pattern/patternLibraryService';
import { PDFService } from '../services/pdf/pdfService';
import { PatternLibraryValidators } from '../validators/patternLibraryValidators';
import { PatternListMapper } from '../services/pattern/patternListMapper';
import { PatternDataNormalizer } from '../services/pattern/patternDataNormalizer';
import { PatternFileNameGenerator } from '../services/pattern/patternFileNameGenerator';

const patternLibraryService = new PatternLibraryService();
const pdfService = new PDFService();

/**
 * Get all downloaded patterns for the authenticated user
 */
export const getUserPatterns = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const patterns = await patternLibraryService.getUserPatterns(userId);
    const patternsForList = PatternListMapper.toListView(patterns);

    res.json({
      success: true,
      data: {
        patterns: patternsForList,
        count: patternsForList.length,
      },
    });
  } catch (error) {
    console.error('❌ [PatternLibrary] Get user patterns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pattern library',
    });
  }
};

/**
 * Get a specific pattern's full data for re-downloading
 */
export const getPatternById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { patternId } = req.params;

    const pattern = await patternLibraryService.getPatternById(patternId, userId);

    if (!pattern) {
      res.status(404).json({
        success: false,
        message: 'Pattern not found or not downloaded',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        pattern: pattern.patternData,
        metadata: {
          id: pattern.id,
          patternType: pattern.patternType,
          patternName: pattern.patternName,
          downloadedAt: pattern.downloadedAt,
          createdAt: pattern.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ [PatternLibrary] Get pattern by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pattern',
    });
  }
};

/**
 * Re-download a pattern as PDF (doesn't count against generation limit)
 */
export const redownloadPattern = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { patternId } = req.params;

    console.log('📥 [PatternLibrary] Redownload request:', { userId, patternId });

    const pattern = await patternLibraryService.getPatternById(patternId, userId);

    if (!pattern) {
      console.log('❌ [PatternLibrary] Pattern not found');
      res.status(404).json({
        success: false,
        message: 'Pattern not found or not downloaded',
      });
      return;
    }

    console.log('📋 [PatternLibrary] Pattern found:', {
      id: pattern.id,
      patternName: pattern.patternName,
      hasPatternData: !!pattern.patternData,
      patternDataType: typeof pattern.patternData,
    });

    if (!pattern.patternData) {
      console.error('❌ [PatternLibrary] Pattern data is missing');
      res.status(500).json({
        success: false,
        message: 'Pattern data is corrupted or missing',
      });
      return;
    }

    const patternDataWithId = PatternDataNormalizer.ensurePatternId(
      pattern.patternData,
      pattern.patternType || 'unknown'
    );

    console.log('📄 [PatternLibrary] Generating PDF with patternId:', patternDataWithId.patternId);

    const pdfBuffer = await pdfService.generatePatternPDF(
      patternDataWithId,
      'QuiltPlannerPro User'
    );

    console.log('✅ [PatternLibrary] PDF generated successfully, size:', pdfBuffer.length);

    const fileName = PatternFileNameGenerator.generate(pattern);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ [PatternLibrary] Re-download pattern error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      message: 'Failed to re-download pattern',
      error: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
    });
  }
};

/**
 * Delete a pattern from the user's library
 */
export const deletePattern = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { patternId } = req.params;

    const deleted = await patternLibraryService.deletePattern(patternId, userId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Pattern not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Pattern deleted successfully',
    });
  } catch (error) {
    console.error('❌ [PatternLibrary] Delete pattern error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pattern',
    });
  }
};

/**
 * Rename a pattern in library
 * Single Responsibility: HTTP request/response handling only
 */
export const renamePattern = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { patternId } = req.params;
    const { newName } = req.body;

    // Validate inputs using validator
    const nameValidation = PatternLibraryValidators.validatePatternName(newName);
    if (!nameValidation.isValid) {
      res.status(400).json({
        success: false,
        message: nameValidation.error,
      });
      return;
    }

    const updatedPattern = await patternLibraryService.renamePattern(
      patternId,
      userId,
      newName.trim()
    );

    if (!updatedPattern) {
      res.status(404).json({
        success: false,
        message: 'Pattern not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Pattern renamed successfully',
      data: {
        id: updatedPattern.id,
        patternName: updatedPattern.patternName,
      },
    });
  } catch (error) {
    console.error('❌ [PatternLibrary] Rename pattern error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rename pattern',
    });
  }
};
