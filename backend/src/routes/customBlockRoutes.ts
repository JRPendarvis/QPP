import express from 'express';
import {
  createBlock,
  getUserBlocks,
  getBlockById,
  updateBlock,
  deleteBlock,
  checkBlockLimit,
} from '../controllers/customBlockController';
import {
  generatePatternFromBlock,
  getBlocksForPatterns,
} from '../controllers/customBlockPatternController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Check block creation limit
router.get('/limit-check', checkBlockLimit);

// Get blocks available for pattern generation
router.get('/available-for-patterns', getBlocksForPatterns);

// Generate pattern from a block
router.post('/:id/generate-pattern', generatePatternFromBlock);

// CRUD operations
router.post('/', createBlock);
router.get('/', getUserBlocks);
router.get('/:id', getBlockById);
router.put('/:id', updateBlock);
router.delete('/:id', deleteBlock);

export default router;
