import { PasswordHasher } from '../passwordHasher';
import bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs');

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('PasswordHasher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should hash password with default salt rounds', async () => {
      const password = 'myPassword123';
      const hashedPassword = '$2a$10$hashedPasswordValue';
      mockBcrypt.hash.mockResolvedValueOnce(hashedPassword as never);

      const result = await PasswordHasher.hash(password);

      expect(result).toBe(hashedPassword);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should hash password with custom salt rounds', async () => {
      const password = 'securePass456';
      const hashedPassword = '$2a$12$customHashValue';
      mockBcrypt.hash.mockResolvedValueOnce(hashedPassword as never);

      const result = await PasswordHasher.hash(password, 12);

      expect(result).toBe(hashedPassword);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 12);
    });

    it('should handle different password values', async () => {
      const passwords = ['short', 'LongPasswordWith123Numbers!@#', ''];
      
      mockBcrypt.hash.mockResolvedValue('hashed' as never);

      for (const password of passwords) {
        await PasswordHasher.hash(password);
        expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      }
    });

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Hashing failed');
      mockBcrypt.hash.mockRejectedValueOnce(error as never);

      await expect(PasswordHasher.hash('password')).rejects.toThrow('Hashing failed');
    });
  });

  describe('verify', () => {
    it('should return true for matching password', async () => {
      const password = 'correctPassword';
      const hash = '$2a$10$hash';
      mockBcrypt.compare.mockResolvedValueOnce(true as never);

      const result = await PasswordHasher.verify(password, hash);

      expect(result).toBe(true);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false for non-matching password', async () => {
      const password = 'wrongPassword';
      const hash = '$2a$10$hash';
      mockBcrypt.compare.mockResolvedValueOnce(false as never);

      const result = await PasswordHasher.verify(password, hash);

      expect(result).toBe(false);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should handle multiple verification attempts', async () => {
      mockBcrypt.compare
        .mockResolvedValueOnce(true as never)
        .mockResolvedValueOnce(false as never)
        .mockResolvedValueOnce(true as never);

      const result1 = await PasswordHasher.verify('pass1', 'hash1');
      const result2 = await PasswordHasher.verify('pass2', 'hash2');
      const result3 = await PasswordHasher.verify('pass3', 'hash3');

      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(result3).toBe(true);
      expect(mockBcrypt.compare).toHaveBeenCalledTimes(3);
    });

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Comparison failed');
      mockBcrypt.compare.mockRejectedValueOnce(error as never);

      await expect(PasswordHasher.verify('password', 'hash')).rejects.toThrow('Comparison failed');
    });
  });
});
