import { PatternValidators } from '../../validators/patternValidators';
import { normalizePatternId } from '../../utils/patternNormalization';

/**
 * Validates and normalizes pattern generation requests
 */
export class PatternRequestValidator {
  /**
   * Validate all required fields for pattern generation
   * @returns Validation error object or null if valid
   */
  static validateGenerationRequest(request: {
    userId?: string;
    images: any[];
    skillLevel?: string;
  }): { statusCode: number; message: string } | null {
    return (
      PatternValidators.validateUserId(request.userId) ||
      PatternValidators.validateImages(request.images) ||
      PatternValidators.validateImageSizes(request.images) ||
      PatternValidators.validateSkillLevel(request.skillLevel)
    );
  }

  /**
   * Normalize and validate pattern ID
   * @param selectedPattern - Pattern ID from request
   * @returns Normalized pattern ID
   */
  static normalizePattern(selectedPattern: string | undefined): string {
    return normalizePatternId(selectedPattern);
  }

  /**
   * Check if pattern ID is valid for fabric role lookup
   * @param patternId - Pattern ID to check
   * @returns True if valid for fabric roles, false if 'auto'
   */
  static canGetFabricRoles(patternId: string): boolean {
    return normalizePatternId(patternId) !== 'auto';
  }
}
