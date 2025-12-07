import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';

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

// ---------------------------------------------
// 🚀 Startup Logging
// ---------------------------------------------
console.log("🚀 Starting QuiltPlannerPro backend...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// ---------------------------------------------
// Express App
// ---------------------------------------------
const app: Express = express();
const port = process.env.PORT || 3001;

const stripeController = new StripeController();

// ---------------------------------------------
// Allowed Origins
// ---------------------------------------------
const allowedOrigins = [
  'https://www.quiltplannerpro.com',
  'https://qpp-frontend-production.up.railway.app',
  'http://localhost:3000'
];

// ---------------------------------------------
// CORS Middleware
// ---------------------------------------------
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ---------------------------------------------
// Stripe Webhook (MUST use raw)
// ---------------------------------------------
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => stripeController.handleWebhook(req, res)
);

// ---------------------------------------------
// JSON Body Parsing
// ---------------------------------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ---------------------------------------------
// Health Check
// ---------------------------------------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "QuiltPlannerPro API running",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------
// API Routes
// ---------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patterns", patternRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);

console.log("✅ Routes registered:");
console.log("   → /api/auth");
console.log("   → /api/user");
console.log("   → /api/patterns");
console.log("   → /api/admin");
console.log("   → /api/stripe");

// ---------------------------------------------
// 404 Handler
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// ---------------------------------------------
// Start Server
// ---------------------------------------------
app.listen(port, () => {
  console.log(`⚡ API listening on port ${port}`);
  console.log(`⚡ Health check → http://localhost:${port}/health`);

  initializeCronJobs();
});
