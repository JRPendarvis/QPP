import express, { Express, Request, Response, NextFunction } from 'express';
import { loginLimiter, registerLimiter, patternLimiter, generalLimiter } from './middleware/rateLimiters';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import stripeRoutes from './routes/stripeRoutes';
import patternRoutes from './routes/patternRoutes';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ⚠️ CRITICAL: Stripe webhook MUST come BEFORE express.json()
// Webhook needs raw body for signature verification
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeRoutes
);

// NOW apply JSON parser to all other routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'QuiltPlannerPro API is running',
    timestamp: new Date().toISOString()
  });
});

// Apply general rate limiter to all API routes
app.use('/api', generalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/stripe', stripeRoutes); // Other Stripe routes (not webhook)

// 404 handler - must come AFTER all routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler - must come LAST
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: Health check at http://localhost:${port}/health`);
  console.log(`⚡️[server]: Environment: ${process.env.NODE_ENV || 'development'}`);
});