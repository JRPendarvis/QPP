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
    it('should calculate positive difference when finished size is smaller', () => {
      const result = BorderSizeCalculator.calculateDifferenceFromTarget(
        65, // finishedWidth
        77, // finishedHeight
        70, // targetWidth
        82  // targetHeight
      );

      expect(result.widthDiff).toBe(5); // Need 5 more inches
      expect(result.heightDiff).toBe(5); // Need 5 more inches
    });

    it('should calculate negative difference when finished size is larger', () => {
      const result = BorderSizeCalculator.calculateDifferenceFromTarget(
        75, // finishedWidth
        87, // finishedHeight
        70, // targetWidth
        82  // targetHeight
      );

      expect(result.widthDiff).toBe(-5); // 5 inches too wide
      expect(result.heightDiff).toBe(-5); // 5 inches too tall
    });

    it('should return zero when dimensions match exactly', () => {
      const result = BorderSizeCalculator.calculateDifferenceFromTarget(
        70,
        82,
        70,
        82
      );

      expect(result.widthDiff).toBe(0);
      expect(result.heightDiff).toBe(0);
    });
  });

  describe('suggestBorderAdjustment', () => {
    it('should suggest wider borders when quilt is too small', () => {
      const result = BorderSizeCalculator.suggestBorderAdjustment(
        60, // currentWidth
        72, // currentHeight
        70, // targetWidth
        82, // targetHeight
        2.5 // currentBorderWidth
      );

      expect(result.suggestedBorderWidth).toBeGreaterThan(2.5);
      expect(result.message).toContain('increase');
    });

    it('should suggest narrower borders when quilt is too large', () => {
      const result = BorderSizeCalculator.suggestBorderAdjustment(
        80, // currentWidth (too wide)
        92, // currentHeight (too tall)
        70, // targetWidth
        82, // targetHeight
        5.0 // currentBorderWidth
      );

      expect(result.suggestedBorderWidth).toBeLessThan(5.0);
      expect(result.message).toContain('decrease');
    });

    it('should suggest no change when dimensions are close enough', () => {
      const result = BorderSizeCalculator.suggestBorderAdjustment(
        70,
        82,
        70,
        82,
        2.5
      );

      expect(result.suggestedBorderWidth).toBe(2.5);
      expect(result.message).toContain('perfect');
    });
  });
});
