import { BorderSizeCalculator } from '../borderSizeCalculator';
import { Border } from '../../types/Border';

describe('BorderSizeCalculator', () => {
  describe('calculateBorderDimensions', () => {
    it('should calculate correct dimensions for a single border', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 }
      ];
      const quiltTopWidth = 60;
      const quiltTopHeight = 72;

      const result = BorderSizeCalculator.calculateBorderDimensions(
        borders,
        quiltTopWidth,
        quiltTopHeight
      );

      expect(result.quiltTopWidth).toBe(60);
      expect(result.quiltTopHeight).toBe(72);
      expect(result.totalBorderWidth).toBe(2.5);
      expect(result.finishedWidth).toBe(65); // 60 + (2 * 2.5)
      expect(result.finishedHeight).toBe(77); // 72 + (2 * 2.5)
    });

    it('should calculate correct dimensions for multiple borders', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];

      const result = BorderSizeCalculator.calculateBorderDimensions(
        borders,
        60,
        72
      );

      expect(result.totalBorderWidth).toBe(5.5); // 2.5 + 3.0
      expect(result.finishedWidth).toBe(71); // 60 + (2 * 5.5)
      expect(result.finishedHeight).toBe(83); // 72 + (2 * 5.5)
    });

    it('should handle empty borders array', () => {
      const result = BorderSizeCalculator.calculateBorderDimensions(
        [],
        60,
        72
      );

      expect(result.totalBorderWidth).toBe(0);
      expect(result.finishedWidth).toBe(60);
      expect(result.finishedHeight).toBe(72);
    });
  });

  describe('calculateDifferenceFromTarget', () => {
    it('should calculate difference when finished size differs from target', () => {
      const result = BorderSizeCalculator.calculateDifferenceFromTarget(
        65, // finishedWidth
        77, // finishedHeight
        70, // targetWidth
        82  // targetHeight
      );

      expect(result.width).toBe(-5); // 5 inches smaller than target
      expect(result.height).toBe(-5); // 5 inches smaller than target
    });

    it('should calculate positive difference when finished size is larger', () => {
      const result = BorderSizeCalculator.calculateDifferenceFromTarget(
        75, // finishedWidth
        87, // finishedHeight
        70, // targetWidth
        82  // targetHeight
      );

      expect(result.width).toBe(5); // 5 inches too wide
      expect(result.height).toBe(5); // 5 inches too tall
    });

    it('should return zero when dimensions match exactly', () => {
      const result = BorderSizeCalculator.calculateDifferenceFromTarget(
        70,
        82,
        70,
        82
      );

      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
    });
  });

  describe('getDimensionsAtEachBorderLevel', () => {
    it('should track dimensions as each border is added', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];

      const result = BorderSizeCalculator.getDimensionsAtEachBorderLevel(
        borders,
        60,
        72
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        width: 65,  // 60 + (2 * 2.5)
        height: 77, // 72 + (2 * 2.5)
        borderNumber: 1
      });
      expect(result[1]).toEqual({
        width: 71,  // 65 + (2 * 3.0)
        height: 83, // 77 + (2 * 3.0)
        borderNumber: 2
      });
    });

    it('should handle single border', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 3.0, fabricIndex: 0 }
      ];

      const result = BorderSizeCalculator.getDimensionsAtEachBorderLevel(
        borders,
        60,
        72
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        width: 66,  // 60 + 6
        height: 78, // 72 + 6
        borderNumber: 1
      });
    });

    it('should return empty array for no borders', () => {
      const result = BorderSizeCalculator.getDimensionsAtEachBorderLevel(
        [],
        60,
        72
      );

      expect(result).toHaveLength(0);
    });
  });

  describe('formatSize', () => {
    it('should format dimensions correctly', () => {
      expect(BorderSizeCalculator.formatSize(60, 72)).toBe('60" × 72"');
      expect(BorderSizeCalculator.formatSize(70.5, 82.5)).toBe('70.5" × 82.5"');
    });
  });
});
