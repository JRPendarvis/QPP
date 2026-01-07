import { SVG_TEMPLATES, SVG_TEMPLATES_BY_ID } from '../config/templates';
import { getPattern } from '../config/patterns';

/**
 * Represents the result of finding a template for a pattern type.
 */
export type TemplateResult = {
  template: string;
  patternDef: ReturnType<typeof getPattern> | undefined;
};

/**
 * Service for finding SVG templates for quilt patterns
 */
export class TemplateFinder {
  /**
   * Finds the SVG template and pattern definition for a given pattern type.
   * 
   * @param patternType - The name of the quilt pattern
   * @returns Template string and pattern definition
   * 
   * @example
   * ```typescript
   * const result = TemplateFinder.find('nine-patch');
   * // Returns: { template: '<svg>...</svg>', patternDef: {...} }
   * ```
   */
  static find(patternType: string): TemplateResult {
    const { normalizePatternId } = require('../controllers/patternController');
    const patternId = normalizePatternId(this.toPatternId(patternType));
    const patternDef = getPattern(patternId);
    
    let template: string | undefined;
    
    // Try to find by pattern ID first
    if (typeof SVG_TEMPLATES_BY_ID !== 'undefined' && SVG_TEMPLATES_BY_ID[patternId]) {
      template = SVG_TEMPLATES_BY_ID[patternId];
    } 
    // Try exact match by pattern type
    else if (SVG_TEMPLATES[patternType]) {
      template = SVG_TEMPLATES[patternType];
    } 
    // Try fuzzy match
    else {
      template = this.findFuzzyMatch(patternType);
    }
    
    return { template: template ?? '', patternDef };
  }

  /**
   * Normalizes a pattern type string to a pattern ID.
   */
  private static toPatternId(patternType: string): string {
    return patternType
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }

  /**
   * Finds a fuzzy match for the pattern type in available templates
   */
  private static findFuzzyMatch(patternType: string): string {
    const templateKeys = Object.keys(SVG_TEMPLATES);
    const closeMatch = templateKeys.find(key =>
      key.toLowerCase().includes(patternType.toLowerCase()) ||
      patternType.toLowerCase().includes(key.toLowerCase())
    );
    
    if (closeMatch) {
      return SVG_TEMPLATES[closeMatch];
    }
    
    // Fallback to default template
    return SVG_TEMPLATES['Simple Squares'];
  }
}
