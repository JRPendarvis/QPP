import { PatternDataNormalizer } from '../patternDataNormalizer';

describe('PatternDataNormalizer', () => {
  describe('ensurePatternId', () => {
    it('should preserve existing patternId', () => {
      const patternData = {
        patternId: 'existing-id',
        name: 'Test Pattern',
      };

      const result = PatternDataNormalizer.ensurePatternId(patternData, 'nine-patch');

      expect(result.patternId).toBe('existing-id');
    });

    it('should add patternId from patternType when missing', () => {
      const patternData = {
        name: 'Test Pattern',
      };

      const result = PatternDataNormalizer.ensurePatternId(patternData, 'checkerboard');

      expect(result.patternId).toBe('checkerboard');
    });

    it('should use "unknown" when both patternId and patternType are missing', () => {
      const patternData = {
        name: 'Test Pattern',
      };

      const result = PatternDataNormalizer.ensurePatternId(patternData, '');

      expect(result.patternId).toBe('unknown');
    });

    it('should preserve all other properties', () => {
      const patternData = {
        name: 'Test Pattern',
        difficulty: 'intermediate',
        fabricColors: ['#FF0000'],
      };

      const result = PatternDataNormalizer.ensurePatternId(patternData, 'nine-patch');

      expect(result.name).toBe('Test Pattern');
      expect(result.difficulty).toBe('intermediate');
      expect(result.fabricColors).toEqual(['#FF0000']);
    });

    it('should handle null patternId', () => {
      const patternData = {
        patternId: null,
        name: 'Test',
      };

      const result = PatternDataNormalizer.ensurePatternId(patternData, 'four-patch');

      expect(result.patternId).toBe('four-patch');
    });

    it('should handle undefined patternId', () => {
      const patternData = {
        patternId: undefined,
        name: 'Test',
      };

      const result = PatternDataNormalizer.ensurePatternId(patternData, 'log-cabin');

      expect(result.patternId).toBe('log-cabin');
    });

    it('should not mutate original object', () => {
      const patternData = {
        name: 'Test Pattern',
      };

      PatternDataNormalizer.ensurePatternId(patternData, 'nine-patch');

      expect(patternData).not.toHaveProperty('patternId');
    });
  });
});
