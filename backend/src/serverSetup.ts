import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import patternRoutes from "./routes/patternRoutes";
import patternLibraryRoutes from "./routes/patternLibraryRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import adminRoutes from "./routes/adminRoutes";
import debugRoutes from "./routes/debugRoutes";
import customBlockRoutes from "./routes/customBlockRoutes";

import { StripeWebhookController } from "./controllers/stripeWebhookController";
import { initializeCronJobs } from "./jobs/cronJobs";
import { SERVER_CONSTANTS, CORS_ORIGINS } from "./config/constants";
import { sanitizeInput } from "./middleware/sanitization";
import { requestLogger } from "./middleware/requestLogger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || SERVER_CONSTANTS.DEFAULT_PORT;

// Trust proxy only if running behind a trusted proxy (e.g., Railway, Heroku, Vercel)
// Use environment variable or default to false for local/dev
const isProduction = process.env.NODE_ENV === "production";
const trustProxySetting = process.env.TRUST_PROXY || (isProduction ? 1 : false);
app.set("trust proxy", trustProxySetting);

// Stripe webhook controller
const stripeWebhookController = new StripeWebhookController();

// -------------------------------------
// CORS
// -------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      console.warn("🚫 BLOCKED ORIGIN:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Needed for preflight
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    // Include admin/debug headers for MVP tooling (safe; only matters if you use them)
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Admin-Key, X-Debug-Key"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

// -------------------------------------
// Stripe webhook (must use raw body)
// -------------------------------------
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => stripeWebhookController.handleWebhook(req, res)
);

// -------------------------------------
// JSON Parsers
// -------------------------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// -------------------------------------
// Security Middleware
// -------------------------------------
app.use(requestLogger); // Request logging for audit trails
app.use(sanitizeInput); // XSS protection via input sanitization

// -------------------------------------
// Health Route
// -------------------------------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "QuiltPlannerPro API running",
    time: new Date().toISOString(),
  });
});

// -------------------------------------
// Routes
// -------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patterns/library", patternLibraryRoutes);
app.use("/api/patterns", patternRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/blocks", customBlockRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);

// Debug routes (dev only) — DO NOT expose in production
if (!isProduction) {
  app.use("/api/debug", debugRoutes);
  console.log("🧪 Debug routes enabled (non-production)");
} else {
  console.log("🔒 Debug routes disabled (production)");
}

console.log("✅ Routes loaded");

// -------------------------------------
// 404
// -------------------------------------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// -------------------------------------
// Error Handler (do not leak internals in prod)
// -------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ GLOBAL ERROR:", err);

  if (isProduction) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
    stack: err.stack,
    details: err,
  });
});

// -------------------------------------
// START SERVER
// -------------------------------------
app.listen(port, () => {
  console.log(`⚡ API running on port ${port}`);
  initializeCronJobs();
});
