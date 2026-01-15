import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AUTH_CONSTANTS } from '../../config/constants';

const prisma = new PrismaClient();

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  // Register a new user
  async register(input: RegisterInput) {
    const { email, password, name, acceptTerms, acceptPrivacy } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine if user gets tester badge (registered before Feb 28, 2026)
    const cutoffDate = new Date('2026-02-28T23:59:59Z');
    const badge = new Date() < cutoffDate ? 'tester' : undefined;

    // Prepare legal acceptance timestamps
    const now = new Date();
    const termsAcceptedAt = acceptTerms ? now : null;
    const privacyAcceptedAt = acceptPrivacy ? now : null;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        badge,
        termsAcceptedAt,
        privacyAcceptedAt
      }
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier
      },
      token
    };
  }

  // Login user
  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier
      },
      token
    };
  }

  // Generate JWT token
  private generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
      { userId, email },
      secret,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
    );
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string; email: string } {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
      const decoded = jwt.verify(token, secret) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}