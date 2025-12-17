import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize input to prevent XSS attacks
 * Removes potentially dangerous characters and HTML tags
 */
function sanitizeString(input: string): string {
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
function sanitizeObject(obj: any): any {
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
 * Middleware to sanitize request body, query, and params
 * Protects against XSS attacks
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip sanitization for certain fields that need raw data
    const skipFields = ['password', 'passwordHash', 'fabricImages', 'fabrics', 'token'];
    
    // Sanitize body
    if (req.body) {
      const sanitized: any = {};
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          sanitized[key] = skipFields.includes(key) 
            ? req.body[key] 
            : sanitizeObject(req.body[key]);
        }
      }
      req.body = sanitized;
    }
    
    // Sanitize query params
    if (req.query) {
      const sanitized: any = {};
      for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(req.query[key]);
        }
      }
      req.query = sanitized;
    }
    
    // Sanitize URL params
    if (req.params) {
      const sanitized: any = {};
      for (const key in req.params) {
        if (req.params.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(req.params[key]);
        }
      }
      req.params = sanitized;
    }
    
    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    next(); // Continue even if sanitization fails
  }
};
