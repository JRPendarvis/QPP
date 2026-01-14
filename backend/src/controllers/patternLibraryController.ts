import { Request, Response } from 'express';
import { PatternLibraryService } from '../services/pattern/patternLibraryService';
import { PDFService } from '../services/pdf/pdfService';

const patternLibraryService = new PatternLibraryService();
const pdfService = new PDFService();

/**
 * Get all downloaded patterns for the authenticated user
 */
export const getUserPatterns = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const patterns = await patternLibraryService.getUserPatterns(userId);

    // Return patterns with minimal data for list view
    const patternsForList = patterns.map((pattern) => ({
      id: pattern.id,
      patternType: pattern.patternType,
      patternName: pattern.patternName,
      fabricColors: pattern.fabricColors,
      downloadedAt: pattern.downloadedAt,
      createdAt: pattern.createdAt,
    }));

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

    const pattern = await patternLibraryService.getPatternById(patternId, userId);

    if (!pattern) {
      res.status(404).json({
        success: false,
        message: 'Pattern not found or not downloaded',
      });
      return;
    }

    // Generate PDF from stored pattern data
    const pdfBuffer = await pdfService.generatePatternPDF(
      pattern.patternData as any,
      'QuiltPlannerPro User'
    );

    const fileName = `${pattern.patternName || 'pattern'}-${pattern.id.slice(0, 8)}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ [PatternLibrary] Re-download pattern error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to re-download pattern',
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
