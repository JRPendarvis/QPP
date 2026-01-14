import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service for cleaning up old non-downloaded patterns
 */
export class PatternCleanupService {
  /**
   * Delete patterns that weren't downloaded within 48 hours of creation
   */
  async cleanupOldPatterns(): Promise<{ deletedCount: number }> {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    try {
      const result = await prisma.pattern.deleteMany({
        where: {
          downloaded: false,
          createdAt: {
            lt: fortyEightHoursAgo,
          },
        },
      });

      console.log(
        `🧹 [Cleanup] Deleted ${result.count} non-downloaded patterns older than 48 hours`
      );

      return { deletedCount: result.count };
    } catch (error) {
      console.error('❌ [Cleanup] Pattern cleanup failed:', error);
      throw error;
    }
  }
}
