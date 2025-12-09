import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController';
import { authenticate } from '../middleware/authMiddleware';
import { generalLimiter } from '../middleware/rateLimiters';

const router = Router();
const controller = new FeedbackController();

// Public: list feedback (annotated if user is authenticated)
router.get('/', (req, res) => controller.listFeedback(req, res));

// Create suggestion (authenticated) — apply a rate limiter to prevent spam
router.post('/', authenticate, generalLimiter, (req, res) => controller.createFeedback(req, res));

// Toggle upvote (authenticated) — protect votes from abuse
router.post('/:id/vote', authenticate, generalLimiter, (req, res) => controller.toggleVote(req, res));

export default router;
