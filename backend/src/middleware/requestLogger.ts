import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request type to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Request logging middleware for security audits and debugging
 * Assigns a unique ID to each request and logs request details
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique request ID
  const requestId = randomUUID();
  req.requestId = requestId;
  
  // Set request ID in response headers for tracing
  res.setHeader('X-Request-ID', requestId);
  
  const startTime = Date.now();
  
  // Log request
  console.log(`[${requestId}] ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
  });
  
  // Log response when finished
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, data);
  };
  
  next();
};
