import { BorderValidator } from '../BorderValidator';
import { BORDER_CONSTRAINTS } from '@/types/Border';

describe('BorderValidator', () => {
  describe('validateBorderWidth', () => {
    it('should accept valid width within range', () => {
      const result = BorderValidator.validateBorderWidth(2.5);
      expect(result).toEqual({ valid: true });
    });

    it('should accept minimum width', () => {
      const result = BorderValidator.validateBorderWidth(BORDER_CONSTRAINTS.MIN_WIDTH);
      expect(result).toEqual({ valid: true });
    });

    it('should accept maximum width', () => {
      const result = BorderValidator.validateBorderWidth(BORDER_CONSTRAINTS.MAX_WIDTH);
      expect(result).toEqual({ valid: true });
    });

    it('should reject width below minimum', () => {
      const result = BorderValidator.validateBorderWidth(0.4);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should reject width above maximum', () => {
      const result = BorderValidator.validateBorderWidth(12.5); // Above MAX_WIDTH of 12
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot exceed');
    });

    it('should reject width not in valid increments', () => {
      const result = BorderValidator.validateBorderWidth(2.3);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('increments');
    });

    it('should accept valid increments of 0.5', () => {
      const validWidths = [1.0, 1.5, 2.0, 2.5, 3.0];
      
      validWidths.forEach(width => {
        const result = BorderValidator.validateBorderWidth(width);
        expect(result.valid).toBe(true);
      });
    });

    it('should handle floating point precision for valid increments', () => {
      // Test near-valid values (within 0.01 tolerance)
      const result1 = BorderValidator.validateBorderWidth(2.499);
      const result2 = BorderValidator.validateBorderWidth(2.501);
      
      // Both should be valid due to floating point tolerance
      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });

    it('should reject values clearly not in valid increments', () => {
      const invalidWidths = [1.2, 1.7, 2.3, 2.8];
      
      invalidWidths.forEach(width => {
        const result = BorderValidator.validateBorderWidth(width);
        expect(result.valid).toBe(false);
      });
    });

    it('should include constraint values in error messages', () => {
      const resultMin = BorderValidator.validateBorderWidth(0.2);
      expect(resultMin.error).toContain(BORDER_CONSTRAINTS.MIN_WIDTH.toString());

      const resultMax = BorderValidator.validateBorderWidth(15);
      expect(resultMax.error).toContain(BORDER_CONSTRAINTS.MAX_WIDTH.toString());

      const resultStep = BorderValidator.validateBorderWidth(2.3);
      expect(resultStep.error).toContain(BORDER_CONSTRAINTS.STEP.toString());
    });
  });
});
