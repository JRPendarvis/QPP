// src/repositories/patternRepository.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SavePatternRequest {
  userId: string;
  patternData: any;
}

export interface SavedPattern {
  id: string;
  userId: string;
  patternData: any;
  downloaded: boolean;
  createdAt: Date;
}

/**
 * Data access layer for pattern operations
 * Single Responsibility: Database operations for patterns only
 * Follows Repository pattern for Dependency Inversion
 */
export class PatternRepository {
  /**
   * Save a generated pattern and increment user's generation count
   * Uses transaction to ensure data consistency
   * 
   * @param request - Pattern data and user ID
   * @returns Saved pattern with database ID
   */
  async savePattern(request: SavePatternRequest): Promise<SavedPattern> {
    const { userId, patternData } = request;

    const savedPattern = await prisma.$transaction(async (tx) => {
      const newPattern = await tx.pattern.create({
        data: {
          userId,
          patternData: patternData as any,
          downloaded: false,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          generationsThisMonth: { increment: 1 },
        },
      });

      return newPattern;
    });

    return savedPattern as SavedPattern;
  }

  /**
   * Get a pattern by ID
   * @param patternId - Pattern database ID
   * @returns Pattern or null if not found
   */
  async getPatternById(patternId: string): Promise<SavedPattern | null> {
    const pattern = await prisma.pattern.findUnique({
      where: { id: patternId },
    });

    return pattern as SavedPattern | null;
  }

  /**
   * Get all patterns for a user
   * @param userId - User ID
   * @returns Array of user's patterns
   */
  async getPatternsByUserId(userId: string): Promise<SavedPattern[]> {
    const patterns = await prisma.pattern.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return patterns as SavedPattern[];
  }
}
