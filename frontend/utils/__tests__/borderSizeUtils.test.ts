import { BorderSizeUtils } from '../borderSizeUtils';
import { Border } from '../../types/Border';

describe('BorderSizeUtils', () => {
  describe('calculateDimensions', () => {
    it('should sum all border widths', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];
      
      const result = BorderSizeUtils.calculateDimensions(borders, 60, 72);
      expect(result.totalBorderWidth).toBe(5.5);
    });

    it('should return 0 for empty array', () => {
      const result = BorderSizeUtils.calculateDimensions([], 60, 72);
      expect(result.totalBorderWidth).toBe(0);
    });

    it('should handle single border', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 4.5, fabricIndex: 0 }
      ];
      
      const result = BorderSizeUtils.calculateDimensions(borders, 60, 72);
      expect(result.totalBorderWidth).toBe(4.5);
    });

    it('should calculate finished dimensions with borders', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 }
      ];
      const quiltWidth = 60;
      const quiltHeight = 72;

      const result = BorderSizeUtils.calculateDimensions(borders, quiltWidth, quiltHeight);

      expect(result.totalBorderWidth).toBe(2.5);
      expect(result.finishedWidth).toBe(65); // 60 + (2 * 2.5)
      expect(result.finishedHeight).toBe(77); // 72 + (2 * 2.5)
    });

    it('should calculate dimensions for multiple borders', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];

      const result = BorderSizeUtils.calculateDimensions(borders, 60, 72);

      expect(result.totalBorderWidth).toBe(5.5);
      expect(result.finishedWidth).toBe(71); // 60 + (2 * 5.5)
      expect(result.finishedHeight).toBe(83); // 72 + (2 * 5.5)
    });

    it('should return quilt dimensions when no borders', () => {
      const result = BorderSizeUtils.calculateDimensions([], 60, 72);

      expect(result.totalBorderWidth).toBe(0);
      expect(result.finishedWidth).toBe(60);
      expect(result.finishedHeight).toBe(72);
    });

    it('should calculate difference from target when provided', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 4, fabricIndex: 0 }
      ];
      
      const result = BorderSizeUtils.calculateDimensions(borders, 60, 72, 80, 96);
      
      expect(result.differenceFromTarget).toBeDefined();
      expect(result.differenceFromTarget?.width).toBe(-12); // 68 - 80
      expect(result.differenceFromTarget?.height).toBe(-16); // 80 - 96
    });
  });

  describe('formatSize', () => {
    it('should format dimensions with proper units', () => {
      expect(BorderSizeUtils.formatSize(60, 72)).toBe('60" × 72"');
    });

    it('should handle decimal dimensions', () => {
      expect(BorderSizeUtils.formatSize(60.5, 72.8)).toBe('60.5" × 72.8"');
    });
  });

  describe('parseQuiltSize', () => {
    it('should parse valid size strings', () => {
      const result = BorderSizeUtils.parseQuiltSize('60 × 72');
      expect(result?.width).toBe(60);
      expect(result?.height).toBe(72);
    });

    it('should return null for invalid strings', () => {
      expect(BorderSizeUtils.parseQuiltSize('invalid')).toBeNull();
      expect(BorderSizeUtils.parseQuiltSize('')).toBeNull();
    });
  });
});
