import { Request, Response } from 'express';
import { AdminAnalyticsService } from '../services/admin/adminAnalyticsService';

/**
 * Admin Controller - Staff-only reports and analytics
 */
export class AdminController {
  /**
   * GET /api/admin/overview
   * Overall platform statistics
   */
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await AdminAnalyticsService.getOverviewStats();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Admin overview error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch overview' });
    }
  }

  /**
   * GET /api/admin/users
   * User list with subscription details
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await AdminAnalyticsService.getUserList();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Admin users error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  }

  /**
   * GET /api/admin/patterns
   * Recent pattern generations
   */
  async getPatterns(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const patterns = await AdminAnalyticsService.getRecentPatterns(limit);
      res.json({ success: true, data: patterns });
    } catch (error) {
      console.error('Admin patterns error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch patterns' });
    }
  }

  /**
   * GET /api/admin/feedback
   * All user feedback with votes
   */
  async getFeedback(req: Request, res: Response): Promise<void> {
    try {
      console.log('[Admin] Fetching feedback...');
      const feedback = await AdminAnalyticsService.getAllFeedback();
      console.log('[Admin] Feedback fetched:', feedback.length, 'items');
      res.json({ success: true, data: feedback });
    } catch (error) {
      console.error('Admin feedback error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch feedback', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  /**
   * GET /api/admin/usage-stats
   * Monthly usage statistics by tier
   */
  async getUsageStats(req: Request, res: Response): Promise<void> {
    try {
      const usersByTier = await AdminAnalyticsService.getUsageStatsByTier();
      res.json({ success: true, data: usersByTier });
    } catch (error) {
      console.error('Admin usage stats error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch usage stats' });
    }
  }
}
