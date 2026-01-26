import { PrismaClient } from '@prisma/client';
import { PasswordHasher } from './passwordHasher';
import { JwtTokenManager } from './jwtTokenManager';
import { UserRegistrationProcessor } from './userRegistrationProcessor';

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
  private tokenManager: JwtTokenManager;

  constructor() {
    this.tokenManager = new JwtTokenManager();
  }

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
    const passwordHash = await PasswordHasher.hash(password);

    // Create user data
    const userData = UserRegistrationProcessor.createUserData(
      email,
      passwordHash,
      name,
      acceptTerms,
      acceptPrivacy
    );

    // Create user
    const user = await prisma.user.create({
      data: userData
    });

    // Generate JWT token
    const token = this.tokenManager.generate(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        role: user.role
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
    const isValidPassword = await PasswordHasher.verify(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.tokenManager.generate(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        role: user.role
      },
      token
    };
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string; email: string } {
    return this.tokenManager.verify(token);
  }
}