import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FeedbackRequirementStatus {
  isRequired: boolean;
  isMet: boolean;
  daysUntilRequired: number;
  message: string;
  canGenerate: boolean;
}

/**
 * Service for enforcing monthly feedback requirements
 * Used for complimentary subscriptions that require feedback
 */
export class FeedbackRequirementService {
  /**
   * Check if user meets feedback requirement
   * Users must submit feedback at least once per month during their complimentary period
   */
  static async checkFeedbackRequirement(userId: string): Promise<FeedbackRequirementStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        requiresMonthlyFeedback: true,
        feedbackRequirementStartDate: true,
        feedbackRequirementEndDate: true,
        lastFeedbackSubmittedAt: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If feedback is not required, allow generation
    if (!user.requiresMonthlyFeedback) {
      return {
        isRequired: false,
        isMet: true,
        daysUntilRequired: 0,
        message: 'Feedback not required',
        canGenerate: true,
      };
    }

    const now = new Date();
    const startDate = user.feedbackRequirementStartDate;
    const endDate = user.feedbackRequirementEndDate;

    // Check if requirement period has ended
    if (endDate && now > endDate) {
      // Period ended, automatically disable requirement
      await prisma.user.update({
        where: { id: userId },
        data: { requiresMonthlyFeedback: false },
      });

      return {
        isRequired: false,
        isMet: true,
        daysUntilRequired: 0,
        message: 'Feedback requirement period has ended',
        canGenerate: true,
      };
    }

    // Check if requirement period has started
    if (startDate && now < startDate) {
      const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isRequired: true,
        isMet: true,
        daysUntilRequired: daysUntil,
        message: `Feedback requirement starts in ${daysUntil} days`,
        canGenerate: true,
      };
    }

    // Calculate if feedback is due
    const lastFeedback = user.lastFeedbackSubmittedAt;
    const gracePeriodDays = 30; // Must submit feedback every 30 days

    if (!lastFeedback) {
      // Never submitted feedback - give 7 days grace period from start
      const gracePeriodEnd = startDate 
        ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (now > gracePeriodEnd) {
        return {
          isRequired: true,
          isMet: false,
          daysUntilRequired: 0,
          message: 'Please submit feedback to continue using Pro features. This is required for complimentary access.',
          canGenerate: false,
        };
      }

      const daysRemaining = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isRequired: true,
        isMet: true,
        daysUntilRequired: daysRemaining,
        message: `Please submit your first feedback within ${daysRemaining} days to maintain Pro access`,
        canGenerate: true,
      };
    }

    // Check if feedback is overdue (30 days since last submission)
    const daysSinceLastFeedback = Math.floor((now.getTime() - lastFeedback.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastFeedback > gracePeriodDays) {
      return {
        isRequired: true,
        isMet: false,
        daysUntilRequired: 0,
        message: 'Monthly feedback required. Please submit feedback to continue using Pro features.',
        canGenerate: false,
      };
    }

    // Feedback submitted recently
    const daysUntilNext = gracePeriodDays - daysSinceLastFeedback;
    return {
      isRequired: true,
      isMet: true,
      daysUntilRequired: daysUntilNext,
      message: daysUntilNext <= 7 
        ? `Feedback due in ${daysUntilNext} days to maintain Pro access`
        : 'Feedback requirement met',
      canGenerate: true,
    };
  }

  /**
   * Update last feedback submitted timestamp
   * Called when user submits new feedback
   */
  static async recordFeedbackSubmission(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastFeedbackSubmittedAt: new Date() },
    });

    console.log(`[FeedbackRequirement] Recorded feedback submission for user ${userId}`);
  }

  /**
   * Get all users with overdue feedback
   * Useful for admin monitoring and email reminders
   */
  static async getUsersWithOverdueFeedback(): Promise<Array<{
    id: string;
    email: string;
    daysSinceLastFeedback: number;
  }>> {
    const users = await prisma.user.findMany({
      where: {
        requiresMonthlyFeedback: true,
        feedbackRequirementEndDate: { gt: new Date() },
      },
      select: {
        id: true,
        email: true,
        lastFeedbackSubmittedAt: true,
        feedbackRequirementStartDate: true,
      },
    });

    const now = new Date();
    const overdueUsers = [];

    for (const user of users) {
      const lastFeedback = user.lastFeedbackSubmittedAt;
      const startDate = user.feedbackRequirementStartDate || new Date();
      
      let daysSince: number;
      
      if (!lastFeedback) {
        // Never submitted - calculate from start date
        daysSince = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 7) { // 7 day grace period
          overdueUsers.push({ id: user.id, email: user.email, daysSinceLastFeedback: daysSince });
        }
      } else {
        daysSince = Math.floor((now.getTime() - lastFeedback.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 30) { // 30 day requirement
          overdueUsers.push({ id: user.id, email: user.email, daysSinceLastFeedback: daysSince });
        }
      }
    }

    return overdueUsers;
  }
}
