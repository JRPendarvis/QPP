// src/services/patternSelector.ts

import { getPatternsForSkillLevel } from '../../utils/skillLevelHelper';
import { getPatternById, calculateFabricCountScore } from '../../config/quiltPatterns';
import { normalizePatternId } from '../../utils/patternNormalization';
import { PatternFormatter } from '../../utils/patternFormatter';

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
   */
  private autoSelectPattern(skillLevel: string, fabricCount?: number): PatternSelectionResult {
    const availablePatternIds = getPatternsForSkillLevel(skillLevel);

    let filteredPatterns = availablePatternIds
      .map((id) => getPatternById(id))
      .filter((p): p is any => !!p && typeof p.minColors === 'number' && typeof p.maxFabrics === 'number');

    // Filter by fabric count if provided
    if (typeof fabricCount === 'number') {
      filteredPatterns = filteredPatterns.filter(
        (pattern) => fabricCount >= pattern.minColors && fabricCount <= pattern.maxFabrics
      );
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

    return { patternForSvg, patternInstruction, patternId };
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
