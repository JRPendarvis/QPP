// src/services/patternSelector.ts

import { getPatternsForSkillLevel } from '../../utils/skillLevelHelper';
import { getPatternById, calculateFabricCountScore } from '../../config/quiltPatterns';
import { normalizePatternId } from '../../utils/patternNormalization';
import { PatternFormatter } from '../../utils/patternFormatter';
import { PATTERNS_BY_SKILL } from '../../config/skill-levels';

export interface PatternSelectionResult {
  patternForSvg: string;
  patternInstruction: string;
  patternId?: string;
}

/**
 * Selects appropriate quilt pattern based on skill level and fabric count
 * Single Responsibility: Pattern selection logic only
 */
export class PatternSelector {
  /**
   * Select pattern based on skill level, user preference, and fabric count
   * @param skillLevel - User's skill level
   * @param selectedPattern - User's pattern choice (or 'auto')
   * @param fabricCount - Number of fabrics being used
   * @returns Pattern selection result with SVG name, instruction, and ID
   */
  selectPattern(skillLevel: string, selectedPattern?: string, fabricCount?: number): PatternSelectionResult {
    // User explicitly selected a pattern
    if (selectedPattern && selectedPattern !== 'auto') {
      return this.selectUserChosenPattern(selectedPattern);
    }

    // Auto-select pattern based on skill level and fabric count
    return this.autoSelectPattern(skillLevel, fabricCount);
  }

  /**
   * Handle user-chosen pattern selection
   */
  private selectUserChosenPattern(selectedPattern: string): PatternSelectionResult {
    const patternId = normalizePatternId(selectedPattern);
    const patternForSvg = PatternFormatter.formatPatternName(patternId);
    const patternInstruction = `**REQUIRED PATTERN TYPE:** You MUST create a "${patternForSvg}" pattern. This is the user's specific choice.`;

    return { patternForSvg, patternInstruction, patternId };
  }

  /**
   * Auto-select best pattern for skill level and fabric count
   * Prioritizes patterns at the user's exact skill level for better matching
   */
  private autoSelectPattern(skillLevel: string, fabricCount?: number): PatternSelectionResult {
    // First try: Get patterns at EXACT skill level (preferred for matching user expertise)
    let filteredPatterns = this.getFilteredPatternsForLevel(skillLevel, fabricCount, true);

    // Fallback: If no patterns at exact level, try all accessible patterns (including lower levels)
    if (filteredPatterns.length === 0) {
      console.log(`[Pattern Selection] No patterns at exact ${skillLevel} level, trying all accessible patterns`);
      filteredPatterns = this.getFilteredPatternsForLevel(skillLevel, fabricCount, false);
    }

    if (filteredPatterns.length === 0) {
      return {
        patternForSvg: '',
        patternInstruction: `**ERROR:** No valid pattern found for your skill level and number of fabrics.`,
        patternId: undefined
      };
    }

    // Score patterns and select from top 3
    const selectedPattern = this.selectFromTopPatterns(filteredPatterns, fabricCount);
    const patternForSvg = selectedPattern.name;
    const patternId = selectedPattern.id;
    const patternInstruction = `**REQUIRED PATTERN TYPE:** Create a "${patternForSvg}" pattern. This pattern is appropriate for the ${skillLevel} skill level.`;

    console.log(`[Pattern Selection] Auto-selected "${patternId}" for ${skillLevel} with ${filteredPatterns.length} compatible patterns`);

    return { patternForSvg, patternInstruction, patternId };
  }

  /**
   * Get filtered patterns for a skill level with optional exact-level-only filter
   * @param skillLevel - User's skill level
   * @param fabricCount - Number of fabrics
   * @param exactLevelOnly - If true, only return patterns at this exact skill level (not lower levels)
   */
  private getFilteredPatternsForLevel(skillLevel: string, fabricCount: number | undefined, exactLevelOnly: boolean): any[] {
    let availablePatternIds: string[];

    if (exactLevelOnly) {
      // Get patterns ONLY at this exact skill level
      availablePatternIds = PATTERNS_BY_SKILL[skillLevel] || [];
    } else {
      // Get patterns at this level and all lower levels (fallback)
      availablePatternIds = getPatternsForSkillLevel(skillLevel);
    }

    let filteredPatterns = availablePatternIds
      .map((id) => getPatternById(id))
      .filter((p): p is any => !!p && typeof p.minColors === 'number' && typeof p.maxFabrics === 'number');

    // Filter by fabric count if provided
    if (typeof fabricCount === 'number') {
      filteredPatterns = filteredPatterns.filter(
        (pattern) => fabricCount >= pattern.minColors && fabricCount <= pattern.maxFabrics
      );
    }

    return filteredPatterns;
  }

  /**
   * Score patterns and randomly select from top 3
   */
  private selectFromTopPatterns(patterns: any[], fabricCount?: number): any {
    const scoredPatterns = patterns
      .map((pattern) => ({
        pattern,
        score: calculateFabricCountScore(pattern, fabricCount ?? pattern.recommendedFabricCount),
      }))
      .sort((a, b) => b.score - a.score);

    const topPatterns = scoredPatterns.slice(0, Math.min(3, scoredPatterns.length));
    const selected = topPatterns[Math.floor(Math.random() * topPatterns.length)];

    return selected.pattern;
  }
}
