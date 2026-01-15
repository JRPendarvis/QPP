/**
 * Validators for pattern library operations
 * Single Responsibility: Input validation logic
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class PatternLibraryValidators {
  /**
   * Validate pattern name for rename operation
   */
  static validatePatternName(name: unknown): ValidationResult {
    if (!name || typeof name !== 'string') {
      return {
        isValid: false,
        error: 'Pattern name is required',
      };
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return {
        isValid: false,
        error: 'Pattern name cannot be empty',
      };
    }

    if (trimmedName.length > 200) {
      return {
        isValid: false,
        error: 'Pattern name must be 200 characters or less',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate user ID
   */
  static validateUserId(userId: unknown): ValidationResult {
    if (!userId || typeof userId !== 'string') {
      return {
        isValid: false,
        error: 'User ID is required',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate pattern ID
   */
  static validatePatternId(patternId: unknown): ValidationResult {
    if (!patternId || typeof patternId !== 'string') {
      return {
        isValid: false,
        error: 'Pattern ID is required',
      };
    }

    return { isValid: true };
  }
}
