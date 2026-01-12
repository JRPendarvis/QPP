import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_TIERS } from '../config/stripe.config';

const prisma = new PrismaClient();

export interface UserDownloadValidation {
  canDownload: boolean;
  error?: {
    statusCode: number;
    message: string;
    currentUsage?: number;
    limit?: number;
  };
}

export class PatternDownloadService {
  /**
   * Validate user can download a pattern
   */
  static async validateDownload(
    userId: string,
    patternId: string
  ): Promise<{ user: any; pattern: any; validation: UserDownloadValidation }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        downloadsThisMonth: true,
      },
    });

    if (!user) {
      return {
        user: null,
        pattern: null,
        validation: {
          canDownload: false,
          error: { statusCode: 404, message: 'User not found' },
        },
      };
    }

    if (
      user.subscriptionStatus === 'canceled' ||
      (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())
    ) {
      return {
        user,
        pattern: null,
        validation: {
          canDownload: false,
          error: {
            statusCode: 403,
            message: 'Your subscription has expired. Please renew to download patterns.',
          },
        },
      };
    }

    const pattern = await prisma.pattern.findFirst({
      where: { id: patternId, userId: userId },
    });

    if (!pattern) {
      return {
        user,
        pattern: null,
        validation: {
          canDownload: false,
          error: {
            statusCode: 404,
            message: 'Pattern not found or you do not have permission to download it',
          },
        },
      };
    }

    const isFirstDownload = !pattern.downloaded;

    if (isFirstDownload) {
      const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

      if (user.downloadsThisMonth >= tierConfig.downloadsPerMonth) {
        return {
          user,
          pattern,
          validation: {
            canDownload: false,
            error: {
              statusCode: 403,
              message: `You've reached your monthly download limit of ${tierConfig.downloadsPerMonth}. Upgrade your plan for more downloads!`,
              currentUsage: user.downloadsThisMonth,
              limit: tierConfig.downloadsPerMonth,
            },
          },
        };
      }
    }

    return {
      user,
      pattern,
      validation: { canDownload: true },
    };
  }

  /**
   * Record pattern download
   */
  static async recordDownload(userId: string, patternId: string, isFirstDownload: boolean): Promise<void> {
    if (!isFirstDownload) return;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { downloadsThisMonth: { increment: 1 } },
      });

      await tx.pattern.update({
        where: { id: patternId },
        data: { downloaded: true, downloadedAt: new Date() },
      });
    });
  }

  /**
   * Generate PDF filename from pattern data
   */
  static generateFileName(patternData: any): string {
    return `${patternData.patternName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  }
}
