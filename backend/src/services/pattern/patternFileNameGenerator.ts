import { Pattern } from '@prisma/client';

/**
 * Generates PDF filename from pattern metadata
 */
export class PatternFileNameGenerator {
  /**
   * Generates filename for pattern PDF download
   */
  static generate(pattern: Pattern): string {
    const name = pattern.patternName || 'pattern';
    const shortId = pattern.id.slice(0, 8);
    return `${name}-${shortId}.pdf`;
  }
}
