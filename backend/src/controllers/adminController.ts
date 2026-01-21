import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      const [
        totalUsers,
        activeSubscribers,
        totalPatterns,
        totalGenerationsThisMonth,
        totalDownloadsThisMonth,
        totalFeedback,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            subscriptionStatus: 'active',
            subscriptionTier: { not: 'free' },
          },
        }),
        prisma.pattern.count(),
        prisma.user.aggregate({
          _sum: { generationsThisMonth: true },
        }),
        prisma.user.aggregate({
          _sum: { downloadsThisMonth: true },
        }),
        prisma.feedback.count(),
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          activeSubscribers,
          totalPatterns,
          totalGenerationsThisMonth: totalGenerationsThisMonth._sum.generationsThisMonth || 0,
          totalDownloadsThisMonth: totalDownloadsThisMonth._sum.downloadsThisMonth || 0,
          totalFeedback,
        },
      });
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
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          skillLevel: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
          generationsThisMonth: true,
          downloadsThisMonth: true,
          badge: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

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

      const patterns = await prisma.pattern.findMany({
        select: {
          id: true,
          userId: true,
          patternData: true,
          downloaded: true,
          downloadedAt: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true,
              subscriptionTier: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

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
      const feedback = await prisma.feedback.findMany({
        include: {
          author: {
            select: {
              email: true,
              name: true,
            },
          },
          votes: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: feedback });
    } catch (error) {
      console.error('Admin feedback error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
    }
  }

  /**
   * GET /api/admin/usage-stats
   * Monthly usage statistics by tier
   */
  async getUsageStats(req: Request, res: Response): Promise<void> {
    try {
      const usersByTier = await prisma.user.groupBy({
        by: ['subscriptionTier'],
        _count: { id: true },
        _sum: {
          generationsThisMonth: true,
          downloadsThisMonth: true,
        },
      });

      res.json({ success: true, data: usersByTier });
    } catch (error) {
      console.error('Admin usage stats error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch usage stats' });
    }
  }
}
