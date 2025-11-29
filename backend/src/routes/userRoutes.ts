import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// GET /api/user/profile - Protected route (requires authentication)
router.get('/profile', authenticate, (req: Request, res: Response) => {
  // req.user is set by the authenticate middleware
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      userId: req.user?.userId,
      email: req.user?.email
    }
  });
});

export default router;