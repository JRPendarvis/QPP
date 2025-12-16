import { PATTERNS_BY_SKILL } from '../config/patternsBySkill';

/**
 * Skill level hierarchy (from beginner to expert)
 */
const SKILL_HIERARCHY = [
  'beginner',
  'advanced_beginner',
  'intermediate',
  'advanced',
  'expert',
];

/**
 * Get all patterns available for a skill level (includes current level and all levels below)
 */
export function getPatternsForSkillLevel(skillLevel: string): string[] {
  const skillIndex = SKILL_HIERARCHY.indexOf(skillLevel);
  
  // If skill level not found, default to beginner
  if (skillIndex === -1) {
    return PATTERNS_BY_SKILL['beginner'] || [];
  }

  // Collect patterns from current level and all levels below
  const availablePatterns: string[] = [];
  
  for (let i = 0; i <= skillIndex; i++) {
    const levelPatterns = PATTERNS_BY_SKILL[SKILL_HIERARCHY[i]] || [];
    availablePatterns.push(...levelPatterns);
  }

  return availablePatterns;
}

/**
 * Get skill level hierarchy
 */
export function getSkillHierarchy(): string[] {
  return [...SKILL_HIERARCHY];
}

/**
 * Check if a skill level can access a specific pattern
 */
export function canAccessPattern(userSkillLevel: string, patternName: string): boolean {
  const availablePatterns = getPatternsForSkillLevel(userSkillLevel);
  return availablePatterns.includes(patternName);
}
