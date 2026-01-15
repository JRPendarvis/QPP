import { PrismaClient, Pattern } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Repository for pattern library data access
 * Single Responsibility: Database operations only
 */
export class PatternLibraryRepository {
  /**
   * Find all downloaded patterns for a user
   */
  async findUserPatterns(userId: string): Promise<Pattern[]> {
    return await prisma.pattern.findMany({
      where: {
        userId,
        downloaded: true,
      },
      orderBy: {
        downloadedAt: 'desc',
      },
    });
  }

  /**
   * Find a specific pattern by ID and user
   */
  async findPatternByIdAndUser(patternId: string, userId: string): Promise<Pattern | null> {
    return await prisma.pattern.findFirst({
      where: {
        id: patternId,
        userId,
        downloaded: true,
      },
    });
  }

  /**
   * Delete a pattern by ID and user
   */
  async deletePatternByIdAndUser(patternId: string, userId: string): Promise<number> {
    const result = await prisma.pattern.deleteMany({
      where: {
        id: patternId,
        userId,
      },
    });
    return result.count;
  }

  /**
   * Update pattern name
   */
  async updatePatternName(patternId: string, newName: string): Promise<Pattern> {
    return await prisma.pattern.update({
      where: { id: patternId },
      data: { patternName: newName },
    });
  }
}
