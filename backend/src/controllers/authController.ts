import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AUTH_CONSTANTS } from '../config/constants';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { emailService } from '../services/emailService';

const authService = new AuthService();
const prisma = new PrismaClient();

// Helper function to set auth cookie
const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_CONSTANTS.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE
  });
};

export class AuthController {
  // POST /api/auth/register
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Basic email validation
      if (!AUTH_CONSTANTS.EMAIL_REGEX.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Password strength validation
      if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
        return res.status(400).json({
          success: false,
          message: `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`
        });
      }

      const result = await authService.register({ email, password, name });

      // Send welcome email (don't await - send in background)
      emailService.sendWelcomeEmail(email, name).catch(err => 
        console.error('Welcome email failed:', err)
      );

      // Set httpOnly cookie with the token
      setAuthCookie(res, result.token);

      // Return user info WITH token in body
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token: result.token,
        data: { user: result.user }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login({ email, password });

      // Set httpOnly cookie with the token
      setAuthCookie(res, result.token);

      // Return user info WITH token in body
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: result.token,
        data: { user: result.user }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response) {
    try {
      // Clear the httpOnly cookie
      res.clearCookie(AUTH_CONSTANTS.COOKIE_NAME);
      res.json({ success: true, message: 'Logged out' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'Failed to logout' });
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      // Always return success (don't reveal if email exists)
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account exists with that email, a reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry }
      });

      // Build reset URL
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Send password reset email
      await emailService.sendPasswordResetEmail(user.email, resetUrl);
      console.log(`Password reset email sent to ${email}`);

      res.json({
        success: true,
        message: 'If an account exists with that email, a reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request'
      });
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token and password are required'
        });
      }

      if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
        return res.status(400).json({
          success: false,
          message: `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }
}