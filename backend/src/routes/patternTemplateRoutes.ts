import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  getPatternTemplates,
  getPatternBlockTemplate,
} from '../controllers/patternTemplateController';

const router = Router();

// Get all available pattern templates
router.get('/', authenticate, getPatternTemplates);

// Get specific pattern block template
router.get('/:patternId', authenticate, getPatternBlockTemplate);

export default router;
