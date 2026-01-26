import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../../config/constants';

/**
 * Service for JWT token generation and verification
 */
export class JwtTokenManager {
  private secret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    this.secret = secret;
  }

  /**
   * Generate JWT token for user
   * 
   * @param userId - User ID
   * @param email - User email
   * @returns JWT token string
   */
  generate(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      this.secret,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
    );
  }

  /**
   * Verify and decode JWT token
   * 
   * @param token - JWT token string
   * @returns Decoded token payload
   * @throws Error if token is invalid or expired
   */
  verify(token: string): { userId: string; email: string } {
    try {
      const decoded = jwt.verify(token, this.secret) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
