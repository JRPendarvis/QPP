import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FeedbackWithVote {
  id: string;
  title: string;
  description: string | null;
  votesCount: number;
  createdAt: Date;
  voted: boolean;
}

export interface VoteResult {
  voted: boolean;
  votesCount: number;
}

export class FeedbackService {
  /**
   * Get all feedback with user's vote status
   */
  async getFeedbackList(userId?: string): Promise<FeedbackWithVote[]> {
    const feedback = await prisma.feedback.findMany({
      orderBy: [{ votesCount: 'desc' }, { createdAt: 'desc' }],
    });

    // If user is authenticated, fetch their votes
    let userVotes: Record<string, boolean> = {};
    if (userId) {
      const votes = await prisma.feedbackVote.findMany({ where: { userId } });
      userVotes = votes.reduce((acc, v) => ({ ...acc, [v.feedbackId]: true }), {} as Record<string, boolean>);
    }

    return feedback.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      votesCount: f.votesCount,
      createdAt: f.createdAt,
      voted: !!userVotes[f.id],
    }));
  }

  /**
   * Create new feedback
   */
  async createFeedback(userId: string, title: string, description?: string) {
    const created = await prisma.feedback.create({
      data: {
        title,
        description: description || null,
        authorId: userId,
      },
    });

    // Get user info for notifications
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return { feedback: created, user };
  }

  /**
   * Toggle vote on feedback
   * @returns vote result with new vote status and count
   */
  async toggleVote(userId: string, feedbackId: string): Promise<VoteResult> {
    const existing = await prisma.feedbackVote.findFirst({ 
      where: { userId, feedbackId } 
    });

    if (existing) {
      // Remove vote
      const [_, updated] = await prisma.$transaction([
        prisma.feedbackVote.delete({ where: { id: existing.id } }),
        prisma.feedback.update({ 
          where: { id: feedbackId }, 
          data: { votesCount: { decrement: 1 } } 
        }),
      ]);

      return { voted: false, votesCount: updated.votesCount };
    } else {
      // Add vote
      const [vote, updated] = await prisma.$transaction([
        prisma.feedbackVote.create({ data: { userId, feedbackId } }),
        prisma.feedback.update({ 
          where: { id: feedbackId }, 
          data: { votesCount: { increment: 1 } } 
        }),
      ]);

      return { voted: true, votesCount: updated.votesCount };
    }
  }
}
