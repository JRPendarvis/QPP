import { Request, Response, NextFunction } from "express";

/**
 * MVP-safe admin gate.
 *
 * Allows access if:
 * 1) x-admin-key header matches ADMIN_API_KEY, OR
 * 2) authenticated user email matches ADMIN_EMAIL
 *
 * Recommended for MVP until you add roles/claims.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.header("x-admin-key");
  const expectedKey = process.env.ADMIN_API_KEY;

  // Option 1: API key header
  if (expectedKey && adminKey && adminKey === expectedKey) {
    return next();
  }

  // Option 2: email allowlist
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const userEmail = (req.user?.email || "").toLowerCase().trim();

  if (adminEmail && userEmail && adminEmail === userEmail) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Admin access required",
  });
}
