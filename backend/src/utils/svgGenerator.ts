import { TemplateFinder } from '../services/pattern/templateFinder';
import { BlockGenerator } from '../services/pattern/blockGenerator';
import { ImagePatternBuilder } from '../services/image/imagePatternBuilder';
import { SvgWrapper } from '../services/pattern/svgWrapper';
import { Fabric } from '../types/Fabric';

// Re-export Fabric type for backward compatibility
export type { Fabric };

/**
 * Main service for generating SVG quilt patterns
 */
export class SvgGenerator {
  /**
   * Generates an SVG string for a given pattern type and fabrics.
   * 
   * @param patternType - The name of the quilt pattern
   * @param fabrics - Array of fabric objects
   * @returns Complete SVG string
   * 
   * @example
   * ```typescript
   * const fabrics = [
   *   { color: '#ff0000', type: 'solid' },
   *   { color: '#00ff00', type: 'printed', image: 'base64...' }
   * ];
   * const svg = SvgGenerator.generateFromTemplate('nine-patch', fabrics);
   * ```
   */
  static generateFromTemplate(patternType: string, fabrics: Fabric[]): string {
    // Validate inputs
    this.validateInputs(patternType, fabrics);

    // Find template
    const { template, patternDef } = TemplateFinder.find(patternType);
    
    if (!template) {
      throw new Error(`SVG template not found for pattern type: ${patternType}`);
    }

    // Generate components
    const blocks = BlockGenerator.generate(template, fabrics, patternDef);
    const imageDefs = ImagePatternBuilder.build(fabrics);
    
    // Wrap and return
    return SvgWrapper.wrap(blocks, imageDefs);
  }

  /**
   * Validates input parameters
   */
  private static validateInputs(patternType: string, fabrics: Fabric[]): void {
    if (!Array.isArray(fabrics) || fabrics.length === 0) {
      throw new Error('At least one fabric must be provided.');
    }
  }
}

