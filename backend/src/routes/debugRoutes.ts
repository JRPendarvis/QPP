import { Router, Request, Response, NextFunction } from "express";

const router = Router();

/**
 * Optional debug gate:
 * - If DEBUG_API_KEY is set, require header x-debug-key to match.
 * - If not set, allow (dev-only; debug routes are disabled in production in serverSetup.ts).
 */
function requireDebugKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.DEBUG_API_KEY;
  if (!expected) return next();

  const provided = req.header("x-debug-key");
  if (provided && provided === expected) return next();

  return res.status(403).json({
    success: false,
    message: "Debug access required",
  });
}

// WARNING: This endpoint returns cookie header data.
// It is intentionally gated and should never be enabled in production.
router.get("/cookies", requireDebugKey, (req: Request, res: Response) => {
  res.json({
    success: true,
    cookies: req.headers.cookie || null,
  });
});

export default router;
