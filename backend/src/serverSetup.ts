import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import patternRoutes from "./routes/patternRoutes";
import adminRoutes from "./routes/adminRoutes";
import { StripeController } from "./controllers/stripeController";
import { initializeCronJobs } from "./jobs/cronJobs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Stripe controller
const stripeController = new StripeController();

// -------------------------------------
// Allowed CORS origins
// -------------------------------------
const allowedOrigins = [
  "https://www.quiltplannerpro.com",
  "https://qpp-frontend-production.up.railway.app",
  "http://localhost:3000",
];

console.log("🔍 Allowed CORS origins:", allowedOrigins);

// -------------------------------------
// CORS
// -------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("🚫 BLOCKED ORIGIN:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Needed for preflight
app.options('/', cors());
app.options('/api/*', cors());

// -------------------------------------
// Stripe webhook (must use raw body)
// -------------------------------------
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => stripeController.handleWebhook(req, res)
);

// -------------------------------------
// JSON Parsers
// -------------------------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
app.use("/api/patterns", patternRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);

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
// Error Handler
// -------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// -------------------------------------
// START SERVER
// -------------------------------------
app.listen(port, () => {
  console.log(`⚡ API running on port ${port}`);
  initializeCronJobs();
});
