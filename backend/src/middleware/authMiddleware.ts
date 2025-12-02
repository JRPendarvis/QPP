import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

// Extend Express Request type to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.'
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user info to request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};
