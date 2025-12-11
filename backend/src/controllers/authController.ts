import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AUTH_CONSTANTS } from '../config/constants';

const authService = new AuthService();

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
}