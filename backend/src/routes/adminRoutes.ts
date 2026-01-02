import { Router } from "express";
import { UsageResetService } from "../services/usageResetService";
import { authenticate } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();
const usageResetService = new UsageResetService();

// POST /api/admin/reset-usage - Manual usage reset trigger (ADMIN ONLY)
router.post("/reset-usage", authenticate, requireAdmin, async (_req, res) => {
  try {
    await usageResetService.resetMonthlyUsage();

    res.json({
      success: true,
      message: "Usage reset completed successfully",
    });
  } catch (error) {
    console.error("Admin reset error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset usage",
    });
  }
});

// GET /api/admin/reset-stats - Get reset statistics (ADMIN ONLY)
router.get("/reset-stats", authenticate, requireAdmin, async (_req, res) => {
  try {
    const stats = await usageResetService.getResetStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get reset stats",
    });
  }
});

export default router;
