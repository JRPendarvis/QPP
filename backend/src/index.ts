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

const stripeController = new StripeController();

/* -----------------------------------------------------
   ✅ Allowed CORS Origins
----------------------------------------------------- */
const allowedOrigins: string[] = [
  'https://www.quiltplannerpro.com',                 // Primary production domain
  'https://qpp-frontend-production.up.railway.app',  // Railway frontend
  'http://localhost:3000'                            // Local dev
];

/* -----------------------------------------------------
   ✅ CORS Middleware (Fixes Preflight 400/401 issues)
----------------------------------------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without an Origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS Blocked Origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

/* -----------------------------------------------------
   ❌ Allow CORS for all routes (temporary workaround)
----------------------------------------------------- */

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Allow OPTIONS for all routes (important for preflight)
app.options('*', cors());

/* -----------------------------------------------------
   ✅ Stripe Webhook — must use raw body
----------------------------------------------------- */
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => stripeController.handleWebhook(req, res)
);

/* -----------------------------------------------------
   ✅ JSON Parsers (after Stripe webhook)
----------------------------------------------------- */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* -----------------------------------------------------
   ✅ Health Check
----------------------------------------------------- */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'QuiltPlannerPro API is running',
    timestamp: new Date().toISOString()
  });
});

/* -----------------------------------------------------
   ✅ API Routes
----------------------------------------------------- */
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


/* -----------------------------------------------------
   ❌ 404 Not Found Handler
----------------------------------------------------- */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

/* -----------------------------------------------------
   ❌ Global Error Handler
----------------------------------------------------- */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

/* -----------------------------------------------------
   🚀 Start Server
----------------------------------------------------- */
app.listen(port, () => {
  console.log(`⚡️ Server listening on port ${port}`);
  console.log(`⚡️ Health check at http://localhost:${port}/health`);
  console.log(`⚡️ Environment: ${process.env.NODE_ENV || 'development'}`);

  initializeCronJobs();
});
