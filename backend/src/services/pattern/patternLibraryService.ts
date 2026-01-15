import { Pattern } from '@prisma/client';
import { PatternLibraryRepository } from '../../repositories/patternLibraryRepository';

/**
 * Service for pattern library business logic
 * Single Responsibility: Orchestrate business operations
 * Dependency Inversion: Depends on repository abstraction
 */
export class PatternLibraryService {
  private repository: PatternLibraryRepository;

  constructor(repository?: PatternLibraryRepository) {
    this.repository = repository || new PatternLibraryRepository();
  }

  /**
   * Get all downloaded patterns for a user
   */
  async getUserPatterns(userId: string): Promise<Pattern[]> {
    try {
      return await this.repository.findUserPatterns(userId);
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
      return await this.repository.findPatternByIdAndUser(patternId, userId);
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
      const deletedCount = await this.repository.deletePatternByIdAndUser(patternId, userId);
      return deletedCount > 0;
    } catch (error) {
      console.error('❌ [PatternLibrary] Failed to delete pattern:', error);
      throw new Error('Failed to delete pattern');
    }
  }

  /**
   * Rename a pattern in user's library
   */
  async renamePattern(patternId: string, userId: string, newName: string): Promise<Pattern | null> {
    try {
      // Verify pattern exists and belongs to user
      const existingPattern = await this.repository.findPatternByIdAndUser(patternId, userId);

      if (!existingPattern) {
        return null;
      }

      // Update pattern name
      return await this.repository.updatePatternName(patternId, newName);
    } catch (error) {
      console.error('❌ [PatternLibrary] Failed to rename pattern:', error);
      throw new Error('Failed to rename pattern');
    }
  }
}
