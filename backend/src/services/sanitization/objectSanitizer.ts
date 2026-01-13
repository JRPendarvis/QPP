/**
 * Object Sanitizer Service
 * Handles recursive sanitization of objects and arrays
 */

import { StringSanitizer } from './stringSanitizer';
import type { Sanitizable, SanitizableObject } from '../../types/Sanitizable';

export class ObjectSanitizer {
  /**
   * Recursively sanitize object properties
   */
  static sanitize(obj: Sanitizable): Sanitizable {
    if (typeof obj === 'string') {
      return StringSanitizer.sanitize(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }
    
    if (obj && typeof obj === 'object') {
      return this.sanitizeObject(obj as SanitizableObject);
    }
    
    return obj;
  }

  /**
   * Sanitize all properties of an object
   */
  private static sanitizeObject(obj: SanitizableObject): SanitizableObject {
    const sanitized: SanitizableObject = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = this.sanitize(obj[key]);
      }
    }
    
    return sanitized;
  }
}
