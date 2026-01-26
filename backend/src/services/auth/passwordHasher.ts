import bcrypt from 'bcryptjs';

/**
 * Service for password hashing and verification
 */
export class PasswordHasher {
  /**
   * Hash a plaintext password
   * 
   * @param password - Plaintext password
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Hashed password
   */
  static async hash(password: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify a password against a hash
   * 
   * @param password - Plaintext password
   * @param hash - Hashed password
   * @returns True if password matches hash
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
