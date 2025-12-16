import { Request, Response } from 'express';
import { emailService } from '../services/emailService';
import { FeedbackService } from '../services/feedbackService';
import { FeedbackValidator } from '../validators/feedbackValidator';
import { ResponseHelper } from '../utils/responseHelper';

const feedbackService = new FeedbackService();

export class FeedbackController {
  // GET /api/feedback
  async listFeedback(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      const data = await feedbackService.getFeedbackList(userId);

      return ResponseHelper.success(res, 200, 'Feedback retrieved', { feedback: data });
    } catch (error) {
      console.error('List feedback error:', error);
      return ResponseHelper.serverError(res, 'Failed to list feedback');
    }
  }

  // POST /api/feedback - create suggestion
  async createFeedback(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseHelper.unauthorizedError(res, 'Unauthorized');
      }

      const { title, description } = req.body;

      // Validate input
      const validation = FeedbackValidator.validateCreateFeedback(title);
      if (!validation.valid) {
        return ResponseHelper.validationError(res, validation.message!);
      }

      const { feedback, user } = await feedbackService.createFeedback(
        userId, 
        title, 
        description
      );

      // Send notification email (don't await - send in background)
      if (user) {
        emailService.sendFeedbackNotification(
          user.email,
          user.name || undefined,
          title,
          description || null
        ).catch(err => console.error('Feedback email failed:', err));
      }

      return ResponseHelper.success(res, 201, 'Feedback created', { feedback });
    } catch (error) {
      console.error('Create feedback error:', error);
      return ResponseHelper.serverError(res, 'Failed to create feedback');
    }
  }

  // POST /api/feedback/:id/vote - toggle vote
  async toggleVote(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseHelper.unauthorizedError(res, 'Unauthorized');
      }

      const { id } = req.params;

      // Validate feedback ID
      const validation = FeedbackValidator.validateFeedbackId(id);
      if (!validation.valid) {
        return ResponseHelper.validationError(res, validation.message!);
      }

      const result = await feedbackService.toggleVote(userId, id);

      return ResponseHelper.success(res, 200, 'Vote toggled', result);
    } catch (error) {
      console.error('Toggle vote error:', error);
      return ResponseHelper.serverError(res, 'Failed to toggle vote');
    }
  }
}
