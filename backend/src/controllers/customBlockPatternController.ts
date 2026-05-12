import { Request, Response } from 'express';
import { CustomBlockPatternService } from '../services/pattern/customBlockPatternService';

const patternService = new CustomBlockPatternService();

/**
 * Generate a quilt pattern from a custom block
 * POST /api/blocks/:id/generate-pattern
 */
export const generatePatternFromBlock = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id: blockId } = req.params;
    const { quiltWidth, quiltHeight, fabricAssignments } = req.body;

    // Validate inputs
    if (!quiltWidth || !quiltHeight) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: quiltWidth, quiltHeight',
      });
    }

    if (quiltWidth < 1 || quiltHeight < 1 || quiltWidth > 20 || quiltHeight > 20) {
      return res.status(400).json({
        success: false,
        message: 'Quilt dimensions must be between 1 and 20 blocks',
      });
    }

    const result = await patternService.generatePattern({
      userId: req.user.userId,
      blockId,
      quiltWidth: parseInt(quiltWidth),
      quiltHeight: parseInt(quiltHeight),
      fabricAssignments: fabricAssignments || {},
    });

    return res.status(201).json({
      success: true,
      message: 'Pattern generated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error generating pattern from block:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to generate pattern',
    });
  }
};

/**
 * Get user's blocks available for pattern generation
 * GET /api/blocks/available-for-patterns
 */
export const getBlocksForPatterns = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const blocks = await patternService.getUserBlocksForPatternGeneration(req.user.userId);

    return res.json({
      success: true,
      data: blocks,
    });
  } catch (error: any) {
    console.error('Error fetching blocks for patterns:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blocks',
      error: error.message,
    });
  }
};
