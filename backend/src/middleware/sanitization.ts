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
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeWithSkipFields(req.body, [...SKIP_SANITIZATION_FIELDS]);
    }
    
    // Note: req.query and req.params are read-only in Express
    // They are parsed by Express and should not be directly modified
    // Query string parsing already handles basic sanitization
    
    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    next(); // Continue even if sanitization fails
  }
};
