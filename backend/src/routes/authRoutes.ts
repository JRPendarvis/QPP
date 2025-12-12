import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiters';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', registerLimiter, (req, res) => authController.register(req, res));

// POST /api/auth/login
router.post('/login', loginLimiter, (req, res) => authController.login(req, res));

// POST /api/auth/logout
router.post('/logout', (req, res) => authController.logout?.(req, res));

// POST /api/auth/forgot-password
router.post('/forgot-password', loginLimiter, (req, res) => authController.forgotPassword(req, res));

// POST /api/auth/reset-password
router.post('/reset-password', loginLimiter, (req, res) => authController.resetPassword(req, res));

export default router;