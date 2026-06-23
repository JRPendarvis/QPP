/**
 * String Sanitizer Service
 * Handles sanitization of strings to prevent XSS attacks
 */

export class StringSanitizer {
  /**
   * Sanitize a string by removing potentially dangerous characters and HTML tags
   */
  static sanitize(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
      .trim();
  }
}
