import { PatternMetadataFormatter } from '../patternMetadataFormatter';

// Mock PatternFormatter
jest.mock('../../../utils/patternFormatter', () => ({
  PatternFormatter: {
    extractDisplayName: jest.fn((claudeName: string, patternForSvg: string) => {
      // Simple mock implementation
      return claudeName || patternForSvg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    })
  }
}));

describe('PatternMetadataFormatter', () => {
  describe('extractPatternName', () => {
    it('should extract pattern name using PatternFormatter', () => {
      const result = PatternMetadataFormatter.extractPatternName('My Pattern', 'nine-patch');
      expect(result).toBe('My Pattern');
    });

    it('should handle empty Claude name', () => {
      const result = PatternMetadataFormatter.extractPatternName('', 'nine-patch');
      expect(result).toBe('Nine Patch');
    });
  });

  describe('formatDifficulty', () => {
    it('should replace underscores with spaces', () => {
      expect(PatternMetadataFormatter.formatDifficulty('skill_level_beginner')).toBe('skill level beginner');
      expect(PatternMetadataFormatter.formatDifficulty('advanced_expert')).toBe('advanced expert');
    });

    it('should handle strings without underscores', () => {
      expect(PatternMetadataFormatter.formatDifficulty('beginner')).toBe('beginner');
      expect(PatternMetadataFormatter.formatDifficulty('intermediate')).toBe('intermediate');
    });

    it('should handle multiple underscores', () => {
      expect(PatternMetadataFormatter.formatDifficulty('very_advanced_level')).toBe('very advanced level');
    });

    it('should handle empty string', () => {
      expect(PatternMetadataFormatter.formatDifficulty('')).toBe('');
    });
  });

  describe('getBorderFabricName', () => {
    it('should return "Border" for single border', () => {
      expect(PatternMetadataFormatter.getBorderFabricName(0, 1, {})).toBe('Border');
    });

    it('should return "Inner Border" and "Outer Border" for two borders', () => {
      expect(PatternMetadataFormatter.getBorderFabricName(0, 2, {})).toBe('Inner Border');
      expect(PatternMetadataFormatter.getBorderFabricName(1, 2, {})).toBe('Outer Border');
    });

    it('should return correct names for three borders', () => {
      expect(PatternMetadataFormatter.getBorderFabricName(0, 3, {})).toBe('Inner Border');
      expect(PatternMetadataFormatter.getBorderFabricName(1, 3, {})).toBe('Middle Border');
      expect(PatternMetadataFormatter.getBorderFabricName(2, 3, {})).toBe('Outer Border');
    });

    it('should return numbered borders for four or more borders', () => {
      expect(PatternMetadataFormatter.getBorderFabricName(0, 4, {})).toBe('Border 1');
      expect(PatternMetadataFormatter.getBorderFabricName(1, 4, {})).toBe('Border 2');
      expect(PatternMetadataFormatter.getBorderFabricName(2, 4, {})).toBe('Border 3');
      expect(PatternMetadataFormatter.getBorderFabricName(3, 4, {})).toBe('Border 4');
    });

    it('should handle five borders', () => {
      expect(PatternMetadataFormatter.getBorderFabricName(0, 5, {})).toBe('Border 1');
      expect(PatternMetadataFormatter.getBorderFabricName(4, 5, {})).toBe('Border 5');
    });
  });
});
