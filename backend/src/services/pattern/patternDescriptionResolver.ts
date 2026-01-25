// src/services/pattern/patternDescriptionResolver.ts

import { PatternFormatter } from '../../utils/patternFormatter';

/**
 * Resolves pattern descriptions from prompts or fallback formatter
 * Single Responsibility: Pattern description text resolution only
 */
export class PatternDescriptionResolver {
  /**
   * Get pattern description from prompt configuration or formatter
   * @param patternForSvg - Pattern name for SVG rendering
   * @param patternPrompt - Optional detailed pattern prompt config
   * @returns Pattern description text
   */
  static getDescription(patternForSvg: string, patternPrompt: any): string {
    return patternPrompt 
      ? patternPrompt.characteristics 
      : PatternFormatter.getPatternDescription(patternForSvg);
  }
}
