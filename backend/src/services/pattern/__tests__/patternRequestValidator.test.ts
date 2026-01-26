import { PatternRequestValidator } from '../patternRequestValidator';

// Mock dependencies
jest.mock('../../../validators/patternValidators');
jest.mock('../../../utils/patternNormalization');

import { PatternValidators } from '../../../validators/patternValidators';
import { normalizePatternId } from '../../../utils/patternNormalization';

describe('PatternRequestValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateGenerationRequest', () => {
    it('should return null when all validations pass', () => {
      (PatternValidators.validateUserId as jest.Mock).mockReturnValue(null);
      (PatternValidators.validateImages as jest.Mock).mockReturnValue(null);
      (PatternValidators.validateImageSizes as jest.Mock).mockReturnValue(null);
      (PatternValidators.validateSkillLevel as jest.Mock).mockReturnValue(null);

      const result = PatternRequestValidator.validateGenerationRequest({
        userId: 'user123',
        images: ['image1', 'image2'],
        skillLevel: 'beginner',
      });

      expect(result).toBeNull();
    });

    it('should return error from userId validation', () => {
      const error = { statusCode: 401, message: 'Unauthorized' };
      (PatternValidators.validateUserId as jest.Mock).mockReturnValue(error);

      const result = PatternRequestValidator.validateGenerationRequest({
        userId: undefined,
        images: ['image1'],
        skillLevel: 'beginner',
      });

      expect(result).toEqual(error);
    });

    it('should return error from images validation', () => {
      (PatternValidators.validateUserId as jest.Mock).mockReturnValue(null);
      const error = { statusCode: 400, message: 'Invalid images' };
      (PatternValidators.validateImages as jest.Mock).mockReturnValue(error);

      const result = PatternRequestValidator.validateGenerationRequest({
        userId: 'user123',
        images: [],
        skillLevel: 'beginner',
      });

      expect(result).toEqual(error);
    });

    it('should return error from image sizes validation', () => {
      (PatternValidators.validateUserId as jest.Mock).mockReturnValue(null);
      (PatternValidators.validateImages as jest.Mock).mockReturnValue(null);
      const error = { statusCode: 400, message: 'Image too large' };
      (PatternValidators.validateImageSizes as jest.Mock).mockReturnValue(error);

      const result = PatternRequestValidator.validateGenerationRequest({
        userId: 'user123',
        images: ['huge-image'],
        skillLevel: 'beginner',
      });

      expect(result).toEqual(error);
    });

    it('should return error from skillLevel validation', () => {
      (PatternValidators.validateUserId as jest.Mock).mockReturnValue(null);
      (PatternValidators.validateImages as jest.Mock).mockReturnValue(null);
      (PatternValidators.validateImageSizes as jest.Mock).mockReturnValue(null);
      const error = { statusCode: 400, message: 'Invalid skill level' };
      (PatternValidators.validateSkillLevel as jest.Mock).mockReturnValue(error);

      const result = PatternRequestValidator.validateGenerationRequest({
        userId: 'user123',
        images: ['image1'],
        skillLevel: 'invalid',
      });

      expect(result).toEqual(error);
    });

    it('should return first validation error encountered', () => {
      const userError = { statusCode: 401, message: 'Unauthorized' };
      const imageError = { statusCode: 400, message: 'Invalid images' };
      
      (PatternValidators.validateUserId as jest.Mock).mockReturnValue(userError);
      (PatternValidators.validateImages as jest.Mock).mockReturnValue(imageError);

      const result = PatternRequestValidator.validateGenerationRequest({
        userId: undefined,
        images: [],
        skillLevel: 'beginner',
      });

      // Should return first error (userId)
      expect(result).toEqual(userError);
    });
  });

  describe('normalizePattern', () => {
    it('should normalize pattern ID using normalizePatternId utility', () => {
      (normalizePatternId as jest.Mock).mockReturnValue('nine-patch');

      const result = PatternRequestValidator.normalizePattern('Nine Patch');

      expect(normalizePatternId).toHaveBeenCalledWith('Nine Patch');
      expect(result).toBe('nine-patch');
    });

    it('should handle undefined pattern ID', () => {
      (normalizePatternId as jest.Mock).mockReturnValue('auto');

      const result = PatternRequestValidator.normalizePattern(undefined);

      expect(normalizePatternId).toHaveBeenCalledWith(undefined);
      expect(result).toBe('auto');
    });

    it('should normalize various pattern formats', () => {
      const testCases = [
        { input: 'Four Patch', expected: 'four-patch' },
        { input: 'NINE-PATCH', expected: 'nine-patch' },
        { input: 'log cabin', expected: 'log-cabin' },
      ];

      testCases.forEach(({ input, expected }) => {
        (normalizePatternId as jest.Mock).mockReturnValue(expected);
        
        const result = PatternRequestValidator.normalizePattern(input);
        
        expect(result).toBe(expected);
      });
    });
  });

  describe('canGetFabricRoles', () => {
    it('should return true for valid pattern IDs', () => {
      (normalizePatternId as jest.Mock).mockReturnValue('nine-patch');

      const result = PatternRequestValidator.canGetFabricRoles('nine-patch');

      expect(result).toBe(true);
    });

    it('should return false for auto pattern selection', () => {
      (normalizePatternId as jest.Mock).mockReturnValue('auto');

      const result = PatternRequestValidator.canGetFabricRoles('auto');

      expect(result).toBe(false);
    });

    it('should normalize pattern ID before checking', () => {
      (normalizePatternId as jest.Mock).mockReturnValue('auto');

      PatternRequestValidator.canGetFabricRoles('AUTO');

      expect(normalizePatternId).toHaveBeenCalledWith('AUTO');
    });

    it('should handle various non-auto patterns', () => {
      const validPatterns = ['four-patch', 'log-cabin', 'checkerboard'];

      validPatterns.forEach(pattern => {
        (normalizePatternId as jest.Mock).mockReturnValue(pattern);
        
        const result = PatternRequestValidator.canGetFabricRoles(pattern);
        
        expect(result).toBe(true);
      });
    });

    it('should handle edge cases with empty strings', () => {
      (normalizePatternId as jest.Mock).mockReturnValue('auto');

      const result = PatternRequestValidator.canGetFabricRoles('');

      expect(result).toBe(false);
    });
  });
});
