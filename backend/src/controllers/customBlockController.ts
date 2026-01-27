import { Request, Response } from 'express';
import { CustomBlockService } from '../services/customBlockService';

const blockService = new CustomBlockService();

/**
 * Create a new custom block
 * POST /api/blocks
 */
export const createBlock = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, description, blockSize, gridData, thumbnail } = req.body;

    // Validate required fields
    if (!name || !blockSize || !gridData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, blockSize, gridData',
      });
    }

    // Validate gridData is a 2D array
    if (!Array.isArray(gridData) || !gridData.every(row => Array.isArray(row))) {
      return res.status(400).json({
        success: false,
        message: 'gridData must be a 2D array',
      });
    }

    // Check if user can create more blocks
    const canCreate = await blockService.canCreateBlock(req.user.userId);
    if (!canCreate.allowed) {
      return res.status(403).json({
        success: false,
        message: canCreate.reason,
        currentCount: canCreate.currentCount,
        limit: canCreate.limit,
      });
    }

    const block = await blockService.createBlock({
      userId: req.user.userId,
      name,
      description,
      blockSize,
      gridData,
      thumbnail,
    });

    return res.status(201).json({
      success: true,
      message: 'Block created successfully',
      data: block,
    });
  } catch (error: any) {
    console.error('Error creating block:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create block',
      error: error.message,
    });
  }
};

/**
 * Get all blocks for the authenticated user
 * GET /api/blocks
 */
export const getUserBlocks = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const blocks = await blockService.getUserBlocks(req.user.userId);

    return res.json({
      success: true,
      data: blocks,
    });
  } catch (error: any) {
    console.error('Error fetching blocks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blocks',
      error: error.message,
    });
  }
};

/**
 * Get a specific block by ID
 * GET /api/blocks/:id
 */
export const getBlockById = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    const block = await blockService.getBlockById(id, req.user.userId);

    return res.json({
      success: true,
      data: block,
    });
  } catch (error: any) {
    console.error('Error fetching block:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch block',
    });
  }
};

/**
 * Update a block
 * PUT /api/blocks/:id
 */
export const updateBlock = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const updates = req.body;

    const updatedBlock = await blockService.updateBlock(id, req.user.userId, updates);

    return res.json({
      success: true,
      message: 'Block updated successfully',
      data: updatedBlock,
    });
  } catch (error: any) {
    console.error('Error updating block:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update block',
    });
  }
};

/**
 * Delete a block
 * DELETE /api/blocks/:id
 */
export const deleteBlock = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    await blockService.deleteBlock(id, req.user.userId);

    return res.json({
      success: true,
      message: 'Block deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting block:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to delete block',
    });
  }
};

/**
 * Check block creation limit
 * GET /api/blocks/limit-check
 */
export const checkBlockLimit = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const limitInfo = await blockService.canCreateBlock(req.user.userId);

    return res.json({
      success: true,
      data: limitInfo,
    });
  } catch (error: any) {
    console.error('Error checking block limit:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check block limit',
      error: error.message,
    });
  }
};
