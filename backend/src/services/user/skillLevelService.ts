// src/services/skillLevelService.ts

/**
 * Determines appropriate skill level for pattern generation
 * Single Responsibility: Skill level calculation logic only
 */
export class SkillLevelService {
  private readonly skillProgression = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];

  /**
   * Determine target skill level based on user preferences
   * @param skillLevel - Requested skill level for this generation
   * @param userSkillLevel - User's default skill level from profile
   * @param challengeMe - Whether to increase difficulty by one level
   * @returns The target skill level to use for generation
   */
  determineSkillLevel(skillLevel?: string, userSkillLevel?: string, challengeMe?: boolean): string {
    let targetSkillLevel = skillLevel || userSkillLevel || 'beginner';

    if (challengeMe) {
      const currentIndex = this.skillProgression.indexOf(targetSkillLevel);
      if (currentIndex < this.skillProgression.length - 1) {
        targetSkillLevel = this.skillProgression[currentIndex + 1];
      }
    }

    return targetSkillLevel;
  }

  /**
   * Get the next skill level in progression
   * @param currentLevel - Current skill level
   * @returns Next skill level or current if already at max
   */
  getNextLevel(currentLevel: string): string {
    const currentIndex = this.skillProgression.indexOf(currentLevel);
    if (currentIndex < this.skillProgression.length - 1) {
      return this.skillProgression[currentIndex + 1];
    }
    return currentLevel;
  }

  /**
   * Check if a skill level is valid
   * @param level - Skill level to validate
   * @returns True if valid skill level
   */
  isValidLevel(level: string): boolean {
    return this.skillProgression.includes(level);
  }
}
