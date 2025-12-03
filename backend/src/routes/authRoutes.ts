import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiters';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', registerLimiter, (req, res) => authController.register(req, res));

// POST /api/auth/login
router.post('/login', loginLimiter, (req, res) => authController.login(req, res));

export default router;