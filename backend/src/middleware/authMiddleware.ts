import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/authService';

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

    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers.cookie) {
      // Parse cookie header for `token`
      const cookies = req.headers.cookie.split(';').map((c) => c.trim());
      for (const c of cookies) {
        const [k, v] = c.split('=');
        if (k === 'token') {
          token = decodeURIComponent(v || '');
          break;
        }
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.'
      });
    }

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
