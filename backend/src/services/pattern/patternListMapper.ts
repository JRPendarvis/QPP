import { Pattern } from '@prisma/client';

/**
 * Maps pattern data for list view display
 */
export class PatternListMapper {
  /**
   * Maps full pattern to minimal list view format
   */
  static toListView(patterns: Pattern[]) {
    return patterns.map((pattern) => ({
      id: pattern.id,
      patternType: pattern.patternType,
      patternName: pattern.patternName,
      fabricColors: pattern.fabricColors,
      downloadedAt: pattern.downloadedAt,
      createdAt: pattern.createdAt,
    }));
  }
}
