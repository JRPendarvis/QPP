import { Router } from 'express';
import { PatternController } from '../controllers/patternController';
import { authenticate } from '../middleware/authMiddleware';
import { patternLimiter } from '../middleware/rateLimiters';


const router = Router();
const patternController = new PatternController();

// POST /api/patterns/generate - Protected route
router.post('/generate', authenticate, patternLimiter, (req, res) => 
  patternController.generatePattern(req, res)
);

// GET /api/patterns/:id/download - Download pattern as PDF
router.get('/:id/download', authenticate, (req, res) => 
  patternController.downloadPattern(req, res)
);

export default router;