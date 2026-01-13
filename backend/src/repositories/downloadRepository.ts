import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserDownloadData {
  id: string;
  name: string | null;
  email: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  currentPeriodEnd: Date | null;
  downloadsThisMonth: number;
}

export interface PatternDownloadData {
  id: string;
  userId: string;
  downloaded: boolean;
  downloadedAt: Date | null;
}

/**
 * Repository for download-related database operations
 * Single Responsibility: Data access layer for downloads
 */
export class DownloadRepository {
  /**
   * Get user data relevant for download validation
   */
  async getUserDownloadData(userId: string): Promise<UserDownloadData | null> {
    return await prisma.user.findUnique({
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
  }

  /**
   * Get pattern owned by user
   */
  async getUserPattern(patternId: string, userId: string): Promise<PatternDownloadData | null> {
    return await prisma.pattern.findFirst({
      where: { id: patternId, userId: userId },
      select: {
        id: true,
        userId: true,
        downloaded: true,
        downloadedAt: true,
      },
    });
  }

  /**
   * Record pattern download (increment user counter + mark pattern downloaded)
   * Only executes if this is the first download
   */
  async recordDownload(userId: string, patternId: string): Promise<void> {
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
}
