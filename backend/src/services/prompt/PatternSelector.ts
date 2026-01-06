import { PatternFormatter } from '../../utils/patternFormatter';
import { getPatternsForSkillLevel } from '../../utils/skillLevelHelper';
import { getPatternById, calculateFabricCountScore } from '../../config/quiltPatterns';

export interface PatternSelectionResult {
  patternForSvg: string;
  patternInstruction: string;
  patternId?: string;
}

/**
 * Service responsible for selecting the appropriate quilt pattern
 * based on skill level, user preference, and fabric count.
 * 
 * Single Responsibility: Pattern selection logic only
 */
export class PatternSelector {
  /**
   * Select pattern based on skill level, user preference, and fabric count
   */
  static selectPattern(
    skillLevel: string,
    selectedPattern?: string,
    fabricCount?: number
  ): PatternSelectionResult {
    if (selectedPattern && selectedPattern !== 'auto') {
      return this.selectUserSpecifiedPattern(selectedPattern);
    }
    
    return this.autoSelectPattern(skillLevel, fabricCount);
  }

  /**
   * Handle user-specified pattern selection
   */
  private static selectUserSpecifiedPattern(selectedPattern: string): PatternSelectionResult {
    const patternId = selectedPattern;
    const patternForSvg = PatternFormatter.formatPatternName(selectedPattern);
    const patternInstruction = `**REQUIRED PATTERN TYPE:** You MUST create a "${patternForSvg}" pattern. This is the user's specific choice.`;
    
    console.log(`📋 User selected pattern: ${patternForSvg} (ID: ${patternId})`);
    
    return { patternForSvg, patternInstruction, patternId };
  }

  /**
   * Auto-select pattern based on skill level and fabric count
   */
  private static autoSelectPattern(
    skillLevel: string,
    fabricCount?: number
  ): PatternSelectionResult {
    const availablePatternIds = getPatternsForSkillLevel(skillLevel);
    
    let filteredPatterns = availablePatternIds
      .map(id => getPatternById(id))
      .filter((p): p is any => !!p && typeof p.minColors === 'number' && typeof p.maxFabrics === 'number');

    if (typeof fabricCount === 'number') {
      filteredPatterns = filteredPatterns.filter(
        (pattern) => fabricCount >= pattern.minColors && fabricCount <= pattern.maxFabrics
      );
    }

    if (filteredPatterns.length === 0) {
      return this.handleNoPatternFound(skillLevel, fabricCount);
    }

    return this.selectBestMatchingPattern(filteredPatterns, skillLevel, fabricCount);
  }

  /**
   * Select the best matching pattern from filtered candidates
   */
  private static selectBestMatchingPattern(
    filteredPatterns: any[],
    skillLevel: string,
    fabricCount?: number
  ): PatternSelectionResult {
    const scoredPatterns = filteredPatterns
      .map(pattern => ({
        pattern,
        score: calculateFabricCountScore(pattern, fabricCount ?? pattern.recommendedFabricCount)
      }))
      .sort((a, b) => b.score - a.score);

    const topPatterns = scoredPatterns.slice(0, Math.min(3, scoredPatterns.length));
    const selected = topPatterns[Math.floor(Math.random() * topPatterns.length)];

    const patternId = selected.pattern.id;
    const patternForSvg = selected.pattern.name;
    const patternInstruction = `**REQUIRED PATTERN TYPE:** Create a "${patternForSvg}" pattern. This pattern is appropriate for the ${skillLevel} skill level.`;

    console.log(`🎯 Auto mode: selected pattern '${patternForSvg}' (ID: ${patternId}) for fabric count ${fabricCount}`);
    console.log(`   ${filteredPatterns.length} patterns available at ${skillLevel} level for fabric count ${fabricCount}`);

    return { patternForSvg, patternInstruction, patternId };
  }

  /**
   * Handle case where no valid pattern is found
   */
  private static handleNoPatternFound(
    skillLevel: string,
    fabricCount?: number
  ): PatternSelectionResult {
    console.warn(`❌ No valid pattern found for skill level '${skillLevel}' and fabric count ${fabricCount}`);
    
    return {
      patternForSvg: '',
      patternInstruction: `**ERROR:** No valid pattern found for your skill level and number of fabrics.`,
      patternId: undefined
    };
  }
}
