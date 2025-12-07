import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import stripeRoutes from './routes/stripeRoutes';
import patternRoutes from './routes/patternRoutes';
import adminRoutes from './routes/adminRoutes';
import { initializeCronJobs } from './jobs/cronJobs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// ============================================
// 1️⃣ CORS MUST BE FIRST
// ============================================

const allowedOrigins = [
  'https://www.quiltplannerpro.com',
  'https://qpp-frontend-production.up.railway.app',
  'http://localhost:3000',
];

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

app.options('*', cors());

// ============================================
// 2️⃣ JSON Body Parser (NO express.raw())
// ============================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// 3️⃣ Health Route
// ============================================

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'QuiltPlannerPro API is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 4️⃣ API Routes
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);

// ============================================
// 5️⃣ 404 Handler
// ============================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ============================================
// 6️⃣ Error Handler
// ============================================

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ============================================
// 7️⃣ Start Server
// ============================================

app.listen(port, () => {
  console.log(`⚡ Server running on port ${port}`);
  initializeCronJobs();
});
