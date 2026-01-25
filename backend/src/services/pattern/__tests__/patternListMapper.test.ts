import { PatternListMapper } from '../patternListMapper';
import { Pattern } from '@prisma/client';

describe('PatternListMapper', () => {
  describe('toListView', () => {
    it('should map full patterns to list view format', () => {
      const patterns: Pattern[] = [
        {
          id: 'pattern-1',
          userId: 'user-1',
          patternType: 'nine-patch',
          patternName: 'My Nine Patch',
          patternData: { test: 'data' } as any,
          fabricColors: ['#FF0000', '#00FF00'],
          downloaded: true,
          downloadedAt: new Date('2024-01-01'),
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'pattern-2',
          userId: 'user-1',
          patternType: 'checkerboard',
          patternName: 'Checker Pattern',
          patternData: { test: 'data' } as any,
          fabricColors: ['#0000FF'],
          downloaded: true,
          downloadedAt: new Date('2024-01-02'),
          createdAt: new Date('2024-01-02'),
        },
      ];

      const result = PatternListMapper.toListView(patterns);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'pattern-1',
        patternType: 'nine-patch',
        patternName: 'My Nine Patch',
        fabricColors: ['#FF0000', '#00FF00'],
        downloadedAt: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
      });
      expect(result[1]).toEqual({
        id: 'pattern-2',
        patternType: 'checkerboard',
        patternName: 'Checker Pattern',
        fabricColors: ['#0000FF'],
        downloadedAt: new Date('2024-01-02'),
        createdAt: new Date('2024-01-02'),
      });
    });

    it('should exclude patternData and userId from list view', () => {
      const patterns: Pattern[] = [
        {
          id: 'pattern-1',
          userId: 'user-1',
          patternType: 'nine-patch',
          patternName: 'Test',
          patternData: { sensitive: 'data' } as any,
          fabricColors: [],
          downloaded: true,
          downloadedAt: new Date(),
          createdAt: new Date(),
        },
      ];

      const result = PatternListMapper.toListView(patterns);

      expect(result[0]).not.toHaveProperty('patternData');
      expect(result[0]).not.toHaveProperty('userId');
      expect(result[0]).not.toHaveProperty('updatedAt');
    });

    it('should handle empty array', () => {
      const result = PatternListMapper.toListView([]);
      expect(result).toEqual([]);
    });

    it('should preserve all fabric colors', () => {
      const patterns: Pattern[] = [
        {
          id: 'pattern-1',
          userId: 'user-1',
          patternType: 'nine-patch',
          patternName: 'Colorful',
          patternData: {} as any,
          fabricColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
          downloaded: true,
          downloadedAt: new Date(),
          createdAt: new Date(),
        },
      ];

      const result = PatternListMapper.toListView(patterns);

      expect(result[0].fabricColors).toEqual(['#FF0000', '#00FF00', '#0000FF', '#FFFF00']);
    });
  });
});
