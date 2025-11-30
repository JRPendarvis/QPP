import { Router } from 'express';
import { PatternController } from '../controllers/patternController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const patternController = new PatternController();

// POST /api/patterns/generate - Protected route
router.post('/generate', authenticate, (req, res) =>
  patternController.generatePattern(req, res)
);

export default router;