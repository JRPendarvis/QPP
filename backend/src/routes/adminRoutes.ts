import { Router } from "express";
import { UsageResetService } from "../services/user/usageResetService";
import { AdminController } from "../controllers/adminController";
import { authenticate } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();
const usageResetService = new UsageResetService();
const adminController = new AdminController();

// All admin routes require authentication + staff role
router.use(authenticate);
router.use(requireAdmin);

// Analytics & Reports
router.get("/overview", (req, res) => adminController.getOverview(req, res));
router.get("/users", (req, res) => adminController.getUsers(req, res));
router.get("/patterns", (req, res) => adminController.getPatterns(req, res));
router.get("/feedback", (req, res) => adminController.getFeedback(req, res));
router.get("/usage-stats", (req, res) => adminController.getUsageStats(req, res));

// POST /api/admin/reset-usage - Manual usage reset trigger
router.post("/reset-usage", async (_req, res) => {
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

// GET /api/admin/reset-stats - Get reset statistics
router.get("/reset-stats", async (_req, res) => {
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

// Complimentary Subscription Management
router.post("/grant-complimentary", (req, res) => adminController.grantComplimentary(req, res));
router.post("/grant-complimentary-bulk", (req, res) => adminController.grantComplimentaryBulk(req, res));
router.get("/complimentary-subscribers", (req, res) => adminController.getComplimentarySubscribers(req, res));
router.post("/extend-complimentary/:userId", (req, res) => adminController.extendComplimentary(req, res));
router.delete("/revoke-complimentary/:userId", (req, res) => adminController.revokeComplimentary(req, res));

export default router;
