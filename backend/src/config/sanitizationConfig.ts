/**
 * Sanitization Configuration
 * Responsible for defining which fields should skip sanitization
 */

/**
 * Fields that should not be sanitized (contain raw/binary data or hashed values)
 */
export const SKIP_SANITIZATION_FIELDS = [
  'password',
  'passwordHash',
  'fabricImages',
  'fabrics',
  'token',
  'resetToken',
] as const;
