import { PrismaClient, Pattern } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service for managing user's pattern library
 */
export class PatternLibraryService {
  /**
   * Get all downloaded patterns for a user
   */
  async getUserPatterns(userId: string): Promise<Pattern[]> {
    try {
      const patterns = await prisma.pattern.findMany({
        where: {
          userId,
          downloaded: true,
        },
        orderBy: {
          downloadedAt: 'desc',
        },
      });

      return patterns;
    } catch (error) {
      console.error('❌ [PatternLibrary] Failed to fetch user patterns:', error);
      throw new Error('Failed to fetch patterns');
    }
  }

  /**
   * Get a specific pattern by ID (only if user owns it and it's downloaded)
   */
  async getPatternById(patternId: string, userId: string): Promise<Pattern | null> {
    try {
      const pattern = await prisma.pattern.findFirst({
        where: {
          id: patternId,
          userId,
          downloaded: true,
        },
      });

      return pattern;
    } catch (error) {
      console.error('❌ [PatternLibrary] Failed to fetch pattern:', error);
      throw new Error('Failed to fetch pattern');
    }
  }

  /**
   * Delete a pattern from user's library
   */
  async deletePattern(patternId: string, userId: string): Promise<boolean> {
    try {
      const result = await prisma.pattern.deleteMany({
        where: {
          id: patternId,
          userId,
        },
      });

      return result.count > 0;
    } catch (error) {
      console.error('❌ [PatternLibrary] Failed to delete pattern:', error);
      throw new Error('Failed to delete pattern');
    }
  }
}
