import { PatternFileNameGenerator } from '../patternFileNameGenerator';
import { Pattern } from '@prisma/client';

describe('PatternFileNameGenerator', () => {
  describe('generate', () => {
    it('should generate filename with pattern name and short ID', () => {
      const pattern: Pattern = {
        id: 'abcdef12-3456-7890-abcd-ef1234567890',
        userId: 'user-1',
        patternType: 'nine-patch',
        patternName: 'My Nine Patch',
        patternData: {} as any,
        fabricColors: [],
        downloaded: true,
        downloadedAt: new Date(),
        createdAt: new Date(),
      };

      const result = PatternFileNameGenerator.generate(pattern);

      expect(result).toBe('My Nine Patch-abcdef12.pdf');
    });

    it('should use "pattern" as default name when patternName is null', () => {
      const pattern: Pattern = {
        id: '12345678-1234-1234-1234-123456789012',
        userId: 'user-1',
        patternType: 'checkerboard',
        patternName: null as any,
        patternData: {} as any,
        fabricColors: [],
        downloaded: true,
        downloadedAt: new Date(),
        createdAt: new Date(),
      };

      const result = PatternFileNameGenerator.generate(pattern);

      expect(result).toBe('pattern-12345678.pdf');
    });

    it('should use "pattern" as default name when patternName is empty', () => {
      const pattern: Pattern = {
        id: 'xyz12345-6789-0abc-def0-123456789012',
        userId: 'user-1',
        patternType: 'four-patch',
        patternName: '',
        patternData: {} as any,
        fabricColors: [],
        downloaded: true,
        downloadedAt: new Date(),
        createdAt: new Date(),
      };

      const result = PatternFileNameGenerator.generate(pattern);

      expect(result).toBe('pattern-xyz12345.pdf');
    });

    it('should extract first 8 characters from ID', () => {
      const pattern: Pattern = {
        id: 'abcdefgh-ijkl-mnop-qrst-uvwxyz123456',
        userId: 'user-1',
        patternType: 'log-cabin',
        patternName: 'Log Cabin',
        patternData: {} as any,
        fabricColors: [],
        downloaded: true,
        downloadedAt: new Date(),
        createdAt: new Date(),
      };

      const result = PatternFileNameGenerator.generate(pattern);

      expect(result).toBe('Log Cabin-abcdefgh.pdf');
    });

    it('should handle pattern names with special characters', () => {
      const pattern: Pattern = {
        id: '11111111-2222-3333-4444-555555555555',
        userId: 'user-1',
        patternType: 'nine-patch',
        patternName: "Grandma's Quilt",
        patternData: {} as any,
        fabricColors: [],
        downloaded: true,
        downloadedAt: new Date(),
        createdAt: new Date(),
      };

      const result = PatternFileNameGenerator.generate(pattern);

      expect(result).toBe("Grandma's Quilt-11111111.pdf");
    });

    it('should handle short IDs (less than 8 characters)', () => {
      const pattern: Pattern = {
        id: 'abc123',
        userId: 'user-1',
        patternType: 'nine-patch',
        patternName: 'Test',
        patternData: {} as any,
        fabricColors: [],
        downloaded: true,
        downloadedAt: new Date(),
        createdAt: new Date(),
      };

      const result = PatternFileNameGenerator.generate(pattern);

      expect(result).toBe('Test-abc123.pdf');
    });
  });
});
