import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const controller = new FeedbackController();

// Public: list feedback (annotated if user is authenticated)
router.get('/', (req, res) => controller.listFeedback(req, res));

// Create suggestion (authenticated)
router.post('/', authenticate, (req, res) => controller.createFeedback(req, res));

// Toggle upvote (authenticated)
router.post('/:id/vote', authenticate, (req, res) => controller.toggleVote(req, res));

export default router;
