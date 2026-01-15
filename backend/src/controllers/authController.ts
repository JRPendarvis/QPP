import { Request, Response } from 'express';
import { AuthService } from '../services/auth/authService';
import { PasswordResetService } from '../services/auth/passwordResetService';
import { emailService } from '../services/auth/emailService';
import { AuthValidator } from '../validators/authValidator';
import { ResponseHelper } from '../utils/responseHelper';
import { CookieHelper } from '../utils/cookieHelper';

const authService = new AuthService();
const passwordResetService = new PasswordResetService();

export class AuthController {
  // POST /api/auth/register
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, acceptTerms, acceptPrivacy } = req.body;

      // Validate input
      const validation = AuthValidator.validateRegistrationInput(email, password, acceptTerms, acceptPrivacy);
      if (!validation.valid) {
        return ResponseHelper.validationError(res, validation.message!);
      }

      const result = await authService.register({ email, password, name, acceptTerms, acceptPrivacy });

      // Send welcome email (don't await - send in background)
      emailService.sendWelcomeEmail(email, name).catch(err => 
        console.error('Welcome email failed:', err)
      );

      // Set httpOnly cookie with the token
      CookieHelper.setAuthCookie(res, result.token);

      // Return user info WITH token in body
      return ResponseHelper.success(res, 201, 'User registered successfully', {
        token: result.token,
        user: result.user
      });
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.validationError(res, error.message);
      }
      return ResponseHelper.serverError(res);
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      const validation = AuthValidator.validateLoginInput(email, password);
      if (!validation.valid) {
        return ResponseHelper.validationError(res, validation.message!);
      }

      const result = await authService.login({ email, password });

      // Set httpOnly cookie with the token
      CookieHelper.setAuthCookie(res, result.token);

      // Return user info WITH token in body
      return ResponseHelper.success(res, 200, 'Login successful', {
        token: result.token,
        user: result.user
      });
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.unauthorizedError(res, error.message);
      }
      return ResponseHelper.serverError(res);
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response) {
    try {
      CookieHelper.clearAuthCookie(res);
      return ResponseHelper.success(res, 200, 'Logged out');
    } catch (error) {
      console.error('Logout error:', error);
      return ResponseHelper.serverError(res, 'Failed to logout');
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Validate email
      const validation = AuthValidator.validateEmail(email);
      if (!validation.valid) {
        return ResponseHelper.validationError(res, validation.message!);
      }

      const resetToken = await passwordResetService.generateResetToken(email);

      // Always return success (don't reveal if email exists)
      const message = 'If an account exists with that email, a reset link has been sent';
      
      if (!resetToken) {
        return ResponseHelper.success(res, 200, message);
      }

      // Build reset URL
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Send password reset email
      await emailService.sendPasswordResetEmail(email, resetUrl);
      console.log(`Password reset email sent to ${email}`);

      return ResponseHelper.success(res, 200, message);
    } catch (error) {
      console.error('Forgot password error:', error);
      return ResponseHelper.serverError(res, 'Failed to process request');
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      // Validate input
      const validation = AuthValidator.validateResetPasswordInput(token, password);
      if (!validation.valid) {
        return ResponseHelper.validationError(res, validation.message!);
      }

      const success = await passwordResetService.resetPassword(token, password);

      if (!success) {
        return ResponseHelper.validationError(res, 'Invalid or expired reset token');
      }

      return ResponseHelper.success(res, 200, 'Password reset successful');
    } catch (error) {
      console.error('Reset password error:', error);
      return ResponseHelper.serverError(res, 'Failed to reset password');
    }
  }
}