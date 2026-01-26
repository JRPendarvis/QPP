// src/services/pattern/skillLevelResolver.ts

import { SKILL_LEVEL_DESCRIPTIONS } from '../../config/skill-levels';

/**
 * Resolves skill level descriptions from skill level keys
 * Single Responsibility: Skill level text resolution only
 */
export class SkillLevelResolver {
  /**
   * Get descriptive text for skill level
   * @param skillLevel - Skill level key (beginner, intermediate, advanced)
   * @returns Full description of skill level requirements
   */
  static getDescription(skillLevel: string): string {
    return SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
  }
}
