import { Request, Response } from 'express';
import { AdminAnalyticsService } from '../services/admin/adminAnalyticsService';
import { ComplimentarySubscriptionService } from '../services/admin/complimentarySubscriptionService';

/**
 * Admin Controller - Staff-only reports and analytics
 */
export class AdminController {
  private complimentaryService = new ComplimentarySubscriptionService();
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

  /**
   * POST /api/admin/grant-complimentary
   * Grant complimentary subscription to a single user
   * 
   * Body:
   * {
   *   "email": "user@example.com",
   *   "tier": "advanced",  // basic, intermediate, or advanced
   *   "durationMonths": 6,
   *   "reason": "Beta tester access"
   * }
   */
  async grantComplimentary(req: Request, res: Response): Promise<void> {
    try {
      const { email, tier, durationMonths, reason } = req.body;

      // Validation
      if (!email || !tier || !durationMonths) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: email, tier, durationMonths',
        });
        return;
      }

      if (!['basic', 'intermediate', 'advanced'].includes(tier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid tier. Must be basic, intermediate, or advanced',
        });
        return;
      }

      if (durationMonths < 1 || durationMonths > 24) {
        res.status(400).json({
          success: false,
          message: 'Duration must be between 1 and 24 months',
        });
        return;
      }

      const adminEmail = req.user?.email || 'unknown';
      const result = await this.complimentaryService.grantComplimentarySubscription(
        { email, tier, durationMonths, reason },
        adminEmail
      );

      res.json({
        success: true,
        message: `Complimentary ${tier} subscription granted to ${email}`,
        data: result,
      });
    } catch (error) {
      console.error('Grant complimentary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to grant complimentary subscription',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/admin/grant-complimentary-bulk
   * Grant complimentary subscriptions to multiple users
   * 
   * Body:
   * {
   *   "subscriptions": [
   *     { "email": "user1@example.com", "tier": "advanced", "durationMonths": 6, "reason": "Beta tester" },
   *     { "email": "user2@example.com", "tier": "advanced", "durationMonths": 6, "reason": "Beta tester" }
   *   ]
   * }
   */
  async grantComplimentaryBulk(req: Request, res: Response): Promise<void> {
    try {
      const { subscriptions } = req.body;

      if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
        res.status(400).json({
          success: false,
          message: 'subscriptions must be a non-empty array',
        });
        return;
      }

      if (subscriptions.length > 100) {
        res.status(400).json({
          success: false,
          message: 'Maximum 100 subscriptions per bulk request',
        });
        return;
      }

      // Validate all entries
      for (const sub of subscriptions) {
        if (!sub.email || !sub.tier || !sub.durationMonths) {
          res.status(400).json({
            success: false,
            message: 'Each subscription must have email, tier, and durationMonths',
          });
          return;
        }

        if (!['basic', 'intermediate', 'advanced'].includes(sub.tier)) {
          res.status(400).json({
            success: false,
            message: `Invalid tier for ${sub.email}: ${sub.tier}`,
          });
          return;
        }
      }

      const adminEmail = req.user?.email || 'unknown';
      const results = await this.complimentaryService.grantBulkComplimentarySubscriptions(
        subscriptions,
        adminEmail
      );

      res.json({
        success: true,
        message: `Processed ${subscriptions.length} subscriptions`,
        data: results,
      });
    } catch (error) {
      console.error('Bulk grant complimentary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to grant bulk complimentary subscriptions',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/admin/complimentary-subscribers
   * List all users with complimentary subscriptions
   */
  async getComplimentarySubscribers(req: Request, res: Response): Promise<void> {
    try {
      const subscribers = await this.complimentaryService.getComplimentarySubscribers();
      res.json({
        success: true,
        data: subscribers,
        count: subscribers.length,
      });
    } catch (error) {
      console.error('Get complimentary subscribers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch complimentary subscribers',
      });
    }
  }

  /**
   * POST /api/admin/extend-complimentary/:userId
   * Extend a complimentary subscription
   * 
   * Body: { "additionalMonths": 3 }
   */
  async extendComplimentary(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { additionalMonths } = req.body;

      if (!additionalMonths || additionalMonths < 1) {
        res.status(400).json({
          success: false,
          message: 'additionalMonths must be at least 1',
        });
        return;
      }

      const newExpiresAt = await this.complimentaryService.extendComplimentarySubscription(
        userId,
        additionalMonths
      );

      res.json({
        success: true,
        message: `Extended subscription by ${additionalMonths} months`,
        data: { newExpiresAt },
      });
    } catch (error) {
      console.error('Extend complimentary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to extend complimentary subscription',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/admin/revoke-complimentary/:userId
   * Revoke a complimentary subscription
   */
  async revokeComplimentary(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      await this.complimentaryService.revokeComplimentarySubscription(userId);

      res.json({
        success: true,
        message: 'Complimentary subscription revoked',
      });
    } catch (error) {
      console.error('Revoke complimentary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke complimentary subscription',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
