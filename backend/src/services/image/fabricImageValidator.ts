/**
 * Fabric Image Validator Service
 * Validates minimum fabric image requirements for quilt patterns
 */

export class FabricImageValidator {
  /**
   * Check if the number of fabric images meets the minimum required for a pattern
   */
  static validate(patternId: string, imageCount: number) {
    const { getPattern } = require('../config/patterns');
    const { normalizePatternId } = require('../controllers/patternController');
    
    const normalizedId = normalizePatternId(patternId);
    const patternDef = getPattern(normalizedId);
    const minRequired = this.getMinRequiredImages(patternDef);
    const isValid = imageCount >= minRequired;
    
    return {
      minRequired,
      isValid,
      error: isValid 
        ? undefined 
        : `This pattern requires at least ${minRequired} fabric images.`
    };
  }

  /**
   * Extract minimum required images from pattern definition
   */
  private static getMinRequiredImages(patternDef: any): number {
    if (!patternDef) {
      return 2;
    }

    // Check prompt.recommendedFabricCount first
    if (patternDef.prompt?.recommendedFabricCount) {
      const recommended = patternDef.prompt.recommendedFabricCount;
      
      if (typeof recommended === 'number') {
        return recommended;
      }
      
      if (recommended.min) {
        return recommended.min;
      }
    }

    // Fallback to minColors
    if (patternDef.minColors) {
      return patternDef.minColors;
    }

    return 2;
  }
}
