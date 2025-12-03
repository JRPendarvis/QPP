import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import stripeRoutes from './routes/stripeRoutes';
import patternRoutes from './routes/patternRoutes';
import adminRoutes from './routes/adminRoutes'; // ✅ ADD THIS
import { StripeController } from './controllers/stripeController';
import { initializeCronJobs } from './jobs/cronJobs'; // ✅ ADD THIS

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const stripeController = new StripeController();

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook with raw body
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => stripeController.handleWebhook(req, res)
);

// JSON parser for other routes
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/admin', adminRoutes); // ✅ ADD THIS
app.use('/api/stripe', stripeRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start server and initialize cron jobs
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: Health check at http://localhost:${port}/health`);
  console.log(`⚡️[server]: Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // ✅ Initialize cron jobs
  initializeCronJobs();
});