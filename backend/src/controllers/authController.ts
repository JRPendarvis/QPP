import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Password strength validation (min 8 characters)
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      const result = await authService.register({ email, password, name });

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
      res.json({ success: true, message: 'Logged out' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'Failed to logout' });
    }
  }
}