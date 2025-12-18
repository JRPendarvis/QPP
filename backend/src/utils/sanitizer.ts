/**
 * Sanitizer Utility
 * Responsible for sanitizing strings and objects to prevent XSS attacks
 */

/**
 * Sanitize a string by removing potentially dangerous characters and HTML tags
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Recursively sanitize object properties
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Sanitize an object while skipping specified fields
 */
export function sanitizeWithSkipFields(data: any, skipFields: string[]): any {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized: any = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      sanitized[key] = skipFields.includes(key) 
        ? data[key] 
        : sanitizeObject(data[key]);
    }
  }
  return sanitized;
}
