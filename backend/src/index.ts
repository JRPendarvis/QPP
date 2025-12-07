import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import stripeRoutes from './routes/stripeRoutes';
import patternRoutes from './routes/patternRoutes';
import adminRoutes from './routes/adminRoutes';
import { StripeController } from './controllers/stripeController';
import { initializeCronJobs } from './jobs/cronJobs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Stripe Controller
const stripeController = new StripeController();

// ---------------------------------------------
// ✅ Allowed Frontend Origins
// ---------------------------------------------
const allowedOrigins = [
  'https://www.quiltplannerpro.com',                     // Your domain
  'https://qpp-frontend-production.up.railway.app',      // Railway deployed frontend
  'http://localhost:3000',                               // Local frontend
];

// ---------------------------------------------
// ✅ CORS Configuration (Fixes 400/401 CORS Errors)
// ---------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS Blocked Origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight OPTIONS for all routes
app.options('*', cors());

// ---------------------------------------------
// Stripe webhook (raw body)
// ---------------------------------------------
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => stripeController.handleWebhook(req, res)
);

// ---------------------------------------------
// JSON Body Parsers
// ---------------------------------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ---------------------------------------------
// Health Check
// ---------------------------------------------
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'QuiltPlannerPro API is running',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------
// API Routes
// ---------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);

console.log('✅ Routes registered:');
console.log('   /api/auth');
console.log('   /api/user');
console.log('   /api/patterns');
console.log('   /api/admin');
console.log('   /api/stripe');

// ---------------------------------------------
// 404 Not Found Handler
// ---------------------------------------------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ---------------------------------------------
// Global Error Handler
// ---------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ---------------------------------------------
// Start Server
// ---------------------------------------------
app.listen(port, () => {
  console.log(`⚡️ Server listening on port ${port}`);
  console.log(`⚡️ Health check at http://localhost:${port}/health`);
  console.log(`⚡️ Environment: ${process.env.NODE_ENV || 'development'}`);

  // Init scheduled jobs
  initializeCronJobs();
});
