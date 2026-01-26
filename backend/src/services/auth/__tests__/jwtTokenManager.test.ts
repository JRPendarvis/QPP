import { JwtTokenManager } from '../jwtTokenManager';
import jwt from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('JwtTokenManager', () => {
  const originalEnv = process.env;
  let tokenManager: JwtTokenManager;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should initialize with JWT_SECRET', () => {
      process.env.JWT_SECRET = 'test-secret';
      
      expect(() => new JwtTokenManager()).not.toThrow();
    });

    it('should throw error if JWT_SECRET is missing', () => {
      delete process.env.JWT_SECRET;

      expect(() => new JwtTokenManager()).toThrow('JWT_SECRET is not defined in environment variables');
    });
  });

  describe('generate', () => {
    beforeEach(() => {
      process.env.JWT_SECRET = 'test-secret';
      tokenManager = new JwtTokenManager();
    });

    it('should generate JWT token', () => {
      const userId = 'user-123';
      const email = 'user@example.com';
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      mockJwt.sign.mockReturnValueOnce(mockToken as any);

      const result = tokenManager.generate(userId, email);

      expect(result).toBe(mockToken);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId, email },
        'test-secret',
        expect.objectContaining({ expiresIn: expect.any(String) })
      );
    });

    it('should generate different tokens for different users', () => {
      mockJwt.sign.mockReturnValue('token' as any);

      tokenManager.generate('user1', 'user1@test.com');
      tokenManager.generate('user2', 'user2@test.com');

      expect(mockJwt.sign).toHaveBeenCalledTimes(2);
      expect(mockJwt.sign).toHaveBeenNthCalledWith(
        1,
        { userId: 'user1', email: 'user1@test.com' },
        'test-secret',
        expect.any(Object)
      );
      expect(mockJwt.sign).toHaveBeenNthCalledWith(
        2,
        { userId: 'user2', email: 'user2@test.com' },
        'test-secret',
        expect.any(Object)
      );
    });

    it('should use JWT_SECRET from environment', () => {
      process.env.JWT_SECRET = 'custom-secret-key';
      tokenManager = new JwtTokenManager();
      mockJwt.sign.mockReturnValueOnce('token' as any);

      tokenManager.generate('userId', 'email@test.com');

      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        'custom-secret-key',
        expect.any(Object)
      );
    });
  });

  describe('verify', () => {
    beforeEach(() => {
      process.env.JWT_SECRET = 'test-secret';
      tokenManager = new JwtTokenManager();
    });

    it('should verify and decode valid token', () => {
      const token = 'valid.jwt.token';
      const decoded = { userId: 'user-123', email: 'user@example.com' };
      mockJwt.verify.mockReturnValueOnce(decoded as any);

      const result = tokenManager.verify(token);

      expect(result).toEqual(decoded);
      expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid.token';
      mockJwt.verify.mockImplementationOnce(() => {
        throw new Error('jwt malformed');
      });

      expect(() => tokenManager.verify(token)).toThrow('Invalid or expired token');
    });

    it('should throw error for expired token', () => {
      const token = 'expired.token';
      mockJwt.verify.mockImplementationOnce(() => {
        throw new Error('jwt expired');
      });

      expect(() => tokenManager.verify(token)).toThrow('Invalid or expired token');
    });

    it('should verify multiple tokens', () => {
      const decoded1 = { userId: 'user1', email: 'user1@test.com' };
      const decoded2 = { userId: 'user2', email: 'user2@test.com' };
      
      mockJwt.verify
        .mockReturnValueOnce(decoded1 as any)
        .mockReturnValueOnce(decoded2 as any);

      const result1 = tokenManager.verify('token1');
      const result2 = tokenManager.verify('token2');

      expect(result1).toEqual(decoded1);
      expect(result2).toEqual(decoded2);
    });

    it('should use correct secret for verification', () => {
      process.env.JWT_SECRET = 'verify-secret';
      tokenManager = new JwtTokenManager();
      mockJwt.verify.mockReturnValueOnce({} as any);

      tokenManager.verify('token');

      expect(mockJwt.verify).toHaveBeenCalledWith('token', 'verify-secret');
    });
  });
});
