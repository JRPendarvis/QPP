import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FeedbackController {
  // GET /api/feedback
  async listFeedback(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      const feedback = await prisma.feedback.findMany({
        orderBy: [{ votesCount: 'desc' }, { createdAt: 'desc' }],
      });

      // If user is authenticated, fetch their votes to annotate results
      let userVotes: Record<string, boolean> = {};
      if (userId) {
        const votes = await prisma.feedbackVote.findMany({ where: { userId } });
        userVotes = votes.reduce((acc, v) => ({ ...acc, [v.feedbackId]: true }), {} as Record<string, boolean>);
      }

      const data = feedback.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        votesCount: f.votesCount,
        createdAt: f.createdAt,
        voted: !!userVotes[f.id],
      }));

      res.json({ success: true, data });
    } catch (error) {
      console.error('List feedback error:', error);
      res.status(500).json({ success: false, message: 'Failed to list feedback' });
    }
  }

  // POST /api/feedback - create suggestion
  async createFeedback(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { title, description } = req.body;
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, message: 'Title is required' });
      }

      const created = await prisma.feedback.create({
        data: {
          title,
          description: description || null,
          authorId: userId,
        },
      });

      res.status(201).json({ success: true, data: created });
    } catch (error) {
      console.error('Create feedback error:', error);
      res.status(500).json({ success: false, message: 'Failed to create feedback' });
    }
  }

  // POST /api/feedback/:id/vote - toggle vote
  async toggleVote(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { id } = req.params;
      const feedbackId = id;

      const existing = await prisma.feedbackVote.findUnique({ where: { userId_feedbackId: { userId, feedbackId } as any } });

      if (existing) {
        // remove vote
        const [_, updated] = await prisma.$transaction([
          prisma.feedbackVote.delete({ where: { id: existing.id } }),
          prisma.feedback.update({ where: { id: feedbackId }, data: { votesCount: { decrement: 1 } } }),
        ]);

        return res.json({ success: true, data: { voted: false, votesCount: updated.votesCount } });
      } else {
        // add vote
        const [vote, updated] = await prisma.$transaction([
          prisma.feedbackVote.create({ data: { userId, feedbackId } }),
          prisma.feedback.update({ where: { id: feedbackId }, data: { votesCount: { increment: 1 } } }),
        ]);

        return res.json({ success: true, data: { voted: true, votesCount: updated.votesCount } });
      }
    } catch (error) {
      console.error('Toggle vote error:', error);
      res.status(500).json({ success: false, message: 'Failed to toggle vote' });
    }
  }
}
