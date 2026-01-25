import { BORDER_CONSTRAINTS } from '@/types/Border';

/**
 * Validates border width against constraints
 */
export class BorderValidator {
  /**
   * Validate border width value
   * @param width - Width to validate
   * @returns Validation result with error message if invalid
   */
  static validateBorderWidth(width: number): { valid: boolean; error?: string } {
    if (width < BORDER_CONSTRAINTS.MIN_WIDTH) {
      return { 
        valid: false, 
        error: `Border width must be at least ${BORDER_CONSTRAINTS.MIN_WIDTH}"` 
      };
    }
    
    if (width > BORDER_CONSTRAINTS.MAX_WIDTH) {
      return { 
        valid: false, 
        error: `Border width cannot exceed ${BORDER_CONSTRAINTS.MAX_WIDTH}"` 
      };
    }
    
    // Check if width is a valid increment
    const remainder = width % BORDER_CONSTRAINTS.STEP;
    if (Math.abs(remainder) > 0.01 && Math.abs(remainder - BORDER_CONSTRAINTS.STEP) > 0.01) {
      return { 
        valid: false, 
        error: `Border width must be in ${BORDER_CONSTRAINTS.STEP}" increments` 
      };
    }
    
    return { valid: true };
  }
}
