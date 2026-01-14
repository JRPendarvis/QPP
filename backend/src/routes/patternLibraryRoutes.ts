import { Router } from 'express';
import {
  getUserPatterns,
  getPatternById,
  redownloadPattern,
  deletePattern,
} from '../controllers/patternLibraryController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/patterns/library
 * @desc    Get all downloaded patterns for the user
 * @access  Private
 */
router.get('/', getUserPatterns);

/**
 * @route   GET /api/patterns/library/:patternId
 * @desc    Get a specific pattern's full data
 * @access  Private
 */
router.get('/:patternId', getPatternById);

/**
 * @route   GET /api/patterns/library/:patternId/download
 * @desc    Re-download a pattern as PDF
 * @access  Private
 */
router.get('/:patternId/download', redownloadPattern);

/**
 * @route   DELETE /api/patterns/library/:patternId
 * @desc    Delete a pattern from library
 * @access  Private
 */
router.delete('/:patternId', deletePattern);

export default router;
