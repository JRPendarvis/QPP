import { 
  calculateBorderDimensions, 
  calculateTotalBorderWidth,
  isValidBorderWidth 
} from '../borderSizeUtils';
import { Border } from '../../types/Border';

describe('borderSizeUtils', () => {
  describe('calculateTotalBorderWidth', () => {
    it('should sum all border widths', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];
      
      expect(calculateTotalBorderWidth(borders)).toBe(5.5);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalBorderWidth([])).toBe(0);
    });

    it('should handle single border', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 4.5, fabricIndex: 0 }
      ];
      
      expect(calculateTotalBorderWidth(borders)).toBe(4.5);
    });
  });

  describe('calculateBorderDimensions', () => {
    it('should calculate finished dimensions with borders', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 }
      ];
      const quiltWidth = 60;
      const quiltHeight = 72;

      const result = calculateBorderDimensions(borders, quiltWidth, quiltHeight);

      expect(result.totalBorderWidth).toBe(2.5);
      expect(result.finishedWidth).toBe(65); // 60 + (2 * 2.5)
      expect(result.finishedHeight).toBe(77); // 72 + (2 * 2.5)
    });

    it('should calculate dimensions for multiple borders', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];

      const result = calculateBorderDimensions(borders, 60, 72);

      expect(result.totalBorderWidth).toBe(5.5);
      expect(result.finishedWidth).toBe(71); // 60 + (2 * 5.5)
      expect(result.finishedHeight).toBe(83); // 72 + (2 * 5.5)
    });

    it('should return quilt dimensions when no borders', () => {
      const result = calculateBorderDimensions([], 60, 72);

      expect(result.totalBorderWidth).toBe(0);
      expect(result.finishedWidth).toBe(60);
      expect(result.finishedHeight).toBe(72);
    });
  });

  describe('isValidBorderWidth', () => {
    it('should accept valid border widths', () => {
      expect(isValidBorderWidth(0.5)).toBe(true);
      expect(isValidBorderWidth(2.5)).toBe(true);
      expect(isValidBorderWidth(6.0)).toBe(true);
      expect(isValidBorderWidth(12.0)).toBe(true);
    });

    it('should reject widths below minimum', () => {
      expect(isValidBorderWidth(0)).toBe(false);
      expect(isValidBorderWidth(0.4)).toBe(false);
      expect(isValidBorderWidth(-1)).toBe(false);
    });

    it('should reject widths above maximum', () => {
      expect(isValidBorderWidth(12.5)).toBe(false);
      expect(isValidBorderWidth(15)).toBe(false);
      expect(isValidBorderWidth(100)).toBe(false);
    });

    it('should reject invalid increments', () => {
      expect(isValidBorderWidth(1.7)).toBe(false); // Not 0.5 increment
      expect(isValidBorderWidth(2.3)).toBe(false);
      expect(isValidBorderWidth(3.1)).toBe(false);
    });

    it('should accept all valid 0.5 increments', () => {
      const validWidths = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 
                           4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0,
                           8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0];
      
      validWidths.forEach(width => {
        expect(isValidBorderWidth(width)).toBe(true);
      });
    });
  });
});
