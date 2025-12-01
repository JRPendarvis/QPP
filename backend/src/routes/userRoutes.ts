import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// GET /api/user/profile
router.get('/profile', (req: Request, res: Response) =>
  userController.getProfile(req, res)
);

// PUT /api/user/profile
router.put('/profile', (req: Request, res: Response) =>
  userController.updateProfile(req, res)
);

export default router;