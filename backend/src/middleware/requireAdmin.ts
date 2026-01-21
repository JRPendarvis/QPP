import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Admin authorization middleware
 *
 * Allows access if:
 * 1) x-admin-key header matches ADMIN_API_KEY, OR
 * 2) authenticated user email matches ADMIN_EMAIL, OR
 * 3) authenticated user has role='staff'
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
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

  // Option 3: role='staff' in database
  if (req.user?.userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { role: true },
      });

      if (user?.role === "staff") {
        return next();
      }
    } catch (error) {
      console.error("Admin role check error:", error);
    }
  }

  return res.status(403).json({
    success: false,
    message: "Admin access required",
  });
}
