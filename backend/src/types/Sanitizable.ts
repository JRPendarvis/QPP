/**
 * Type Definitions for Sanitization
 */

/**
 * Any value that can be sanitized
 */
export type Sanitizable = string | number | boolean | null | undefined | SanitizableObject | SanitizableArray;

/**
 * An object with string keys that can be sanitized
 */
export interface SanitizableObject {
  [key: string]: Sanitizable;
}

/**
 * An array of sanitizable values
 */
export type SanitizableArray = Sanitizable[];
