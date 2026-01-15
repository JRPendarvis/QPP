import { AUTH_CONSTANTS } from '../config/constants';

export class AuthValidator {
  /**
   * Validate email format
   */
  static validateEmail(email: string): { valid: boolean; message?: string } {
    if (!email) {
      return { valid: false, message: 'Email is required' };
    }

    if (!AUTH_CONSTANTS.EMAIL_REGEX.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }

    return { valid: true };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }

    if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
      return {
        valid: false,
        message: `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`
      };
    }

    return { valid: true };
  }

  /**
   * Validate registration input
   */
  static validateRegistrationInput(
    email: string, 
    password: string, 
    acceptTerms?: boolean, 
    acceptPrivacy?: boolean
  ): { valid: boolean; message?: string } {
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.valid) {
      return emailValidation;
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return passwordValidation;
    }

    // Validate legal acceptance
    if (!acceptTerms) {
      return { valid: false, message: 'You must accept the Terms of Service' };
    }

    if (!acceptPrivacy) {
      return { valid: false, message: 'You must accept the Privacy Policy' };
    }

    return { valid: true };
  }

  /**
   * Validate login input
   */
  static validateLoginInput(email: string, password: string): { valid: boolean; message?: string } {
    if (!email || !password) {
      return { valid: false, message: 'Email and password are required' };
    }

    return { valid: true };
  }

  /**
   * Validate reset password input
   */
  static validateResetPasswordInput(token: string, password: string): { valid: boolean; message?: string } {
    if (!token || !password) {
      return { valid: false, message: 'Token and password are required' };
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return passwordValidation;
    }

    return { valid: true };
  }
}
