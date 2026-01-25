/**
 * Ensures pattern data has required patternId for PDF generation
 */
export class PatternDataNormalizer {
  /**
   * Adds patternId to pattern data if missing
   */
  static ensurePatternId(
    patternData: any,
    patternType: string
  ): any {
    return {
      ...patternData,
      patternId: patternData.patternId || patternType || 'unknown',
    };
  }
}
