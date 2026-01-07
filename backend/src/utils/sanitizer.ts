/**
 * Sanitizer Utility
 * Orchestrates sanitization of strings and objects to prevent XSS attacks
 */

import { StringSanitizer } from '../services/stringSanitizer';
import { ObjectSanitizer } from '../services/objectSanitizer';
import { ConditionalSanitizer } from '../services/conditionalSanitizer';
import type { Sanitizable } from '../types/Sanitizable';

/**
 * Sanitize a string by removing potentially dangerous characters and HTML tags
 */
export function sanitizeString(input: string): string {
  return StringSanitizer.sanitize(input);
}

/**
 * Recursively sanitize object properties
 */
export function sanitizeObject(obj: Sanitizable): Sanitizable {
  return ObjectSanitizer.sanitize(obj);
}

/**
 * Sanitize an object while skipping specified fields
 */
export function sanitizeWithSkipFields(data: Sanitizable, skipFields: string[]): Sanitizable {
  return ConditionalSanitizer.sanitizeWithSkipFields(data, skipFields);
}
