import { PatternFormatter } from '../../utils/patternFormatter';
import { BorderConfiguration } from '../../types/Border';

/**
 * Formats pattern metadata for display
 */
export class PatternMetadataFormatter {
  /**
   * Extracts display name from Claude's pattern name
   */
  static extractPatternName(
    claudeName: string,
    patternForSvg: string
  ): string {
    return PatternFormatter.extractDisplayName(claudeName, patternForSvg);
  }

  /**
   * Formats difficulty level for display
   */
  static formatDifficulty(skillLevel: string): string {
    return skillLevel.replace(/_/g, ' ');
  }

  /**
   * Gets display name for a border fabric based on position
   */
  static getBorderFabricName(
    index: number,
    totalBorders: number,
    fabric: any
  ): string {
    if (totalBorders === 1) {
      return 'Border';
    }
    
    if (totalBorders === 2) {
      return index === 0 ? 'Inner Border' : 'Outer Border';
    }
    
    if (totalBorders === 3) {
      if (index === 0) return 'Inner Border';
      if (index === 1) return 'Middle Border';
      return 'Outer Border';
    }
    
    return `Border ${index + 1}`;
  }
}
