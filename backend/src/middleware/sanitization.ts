import { Request, Response, NextFunction } from 'express';
import { sanitizeWithSkipFields, sanitizeObject } from '../utils/sanitizer';
import { SKIP_SANITIZATION_FIELDS } from '../config/sanitizationConfig';

/**
 * Input Sanitization Middleware
 * Responsible for applying sanitization to incoming HTTP requests
 * Protects against XSS attacks by sanitizing body, query, and params
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize request body (with skip fields for raw data)
    if (req.body) {
      req.body = sanitizeWithSkipFields(req.body, [...SKIP_SANITIZATION_FIELDS]);
    }
    
    // Sanitize query params (no skip fields needed)
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    // Sanitize URL params (no skip fields needed)
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    
    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    next(); // Continue even if sanitization fails
  }
};
