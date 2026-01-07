/**
 * Conditional Sanitizer Service
 * Handles sanitization with field exclusions
 */

import { ObjectSanitizer } from './objectSanitizer';
import type { Sanitizable, SanitizableObject } from '../types/Sanitizable';

export class ConditionalSanitizer {
  /**
   * Sanitize an object while skipping specified fields
   */
  static sanitizeWithSkipFields(
    data: Sanitizable,
    skipFields: string[]
  ): Sanitizable {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return data;
    }
    
    return this.sanitizeObjectWithSkip(data as SanitizableObject, skipFields);
  }

  /**
   * Sanitize object properties, skipping specified fields
   */
  private static sanitizeObjectWithSkip(
    data: SanitizableObject,
    skipFields: string[]
  ): SanitizableObject {
    const sanitized: SanitizableObject = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = skipFields.includes(key) 
          ? data[key] 
          : ObjectSanitizer.sanitize(data[key]);
      }
    }
    
    return sanitized;
  }
}
