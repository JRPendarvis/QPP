import { normalizePatternId } from '../patternNormalization';

// Mock the getAllPatterns function
jest.mock('../../config/patterns', () => ({
  getAllPatterns: () => [
    { id: 'four-patch', name: 'Four Patch' },
    { id: 'strip-quilt', name: 'Strip Quilt' },
    { id: 'drunkards-path', name: "Drunkard's Path" },
    { id: 'log-cabin', name: 'Log Cabin' },
    { id: 'nine-patch', name: 'Nine Patch' },
  ]
}));

describe('patternNormalization', () => {
  describe('normalizePatternId', () => {
    it('should return "auto" for undefined input', () => {
      expect(normalizePatternId(undefined)).toBe('auto');
    });

    it('should return "auto" for empty string', () => {
      expect(normalizePatternId('')).toBe('auto');
    });

    it('should return "auto" when input is "auto"', () => {
      expect(normalizePatternId('auto')).toBe('auto');
    });

    it('should return ID unchanged when already in ID format', () => {
      expect(normalizePatternId('four-patch')).toBe('four-patch');
      expect(normalizePatternId('strip-quilt')).toBe('strip-quilt');
      expect(normalizePatternId('log-cabin')).toBe('log-cabin');
    });

    it('should convert display name to ID format', () => {
      expect(normalizePatternId('Four Patch')).toBe('four-patch');
      expect(normalizePatternId('Strip Quilt')).toBe('strip-quilt');
      expect(normalizePatternId('Log Cabin')).toBe('log-cabin');
    });

    it('should handle apostrophes correctly', () => {
      expect(normalizePatternId("Drunkard's Path")).toBe('drunkards-path');
      expect(normalizePatternId("Drunkard's Path")).toBe('drunkards-path'); // curly apostrophe
    });

    it('should convert multiple spaces to single dash', () => {
      expect(normalizePatternId('Nine  Patch')).toBe('nine-patch');
      expect(normalizePatternId('Log   Cabin')).toBe('log-cabin');
    });

    it('should collapse repeated dashes', () => {
      expect(normalizePatternId('Four--Patch')).toBe('four-patch');
      expect(normalizePatternId('Strip---Quilt')).toBe('strip-quilt');
    });

    it('should handle mixed case input', () => {
      expect(normalizePatternId('FOUR PATCH')).toBe('four-patch');
      expect(normalizePatternId('FoUr PaTcH')).toBe('four-patch');
    });

    it('should return "auto" for unknown patterns', () => {
      expect(normalizePatternId('Unknown Pattern')).toBe('auto');
      expect(normalizePatternId('invalid-id')).toBe('auto');
      expect(normalizePatternId('nonexistent')).toBe('auto');
    });

    it('should handle edge cases', () => {
      expect(normalizePatternId('  Four Patch  ')).toBe('auto'); // Leading/trailing spaces won't match
      expect(normalizePatternId('four patch')).toBe('four-patch'); // Lowercase with space
    });
  });
});
