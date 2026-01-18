import { TemplateFinder } from '../services/pattern/templateFinder';
import { BlockGenerator } from '../services/pattern/blockGenerator';
import { ImagePatternBuilder } from '../services/image/imagePatternBuilder';
import { SvgWrapper } from '../services/pattern/svgWrapper';
import { SvgBorderRenderer } from '../services/pattern/svgBorderRenderer';
import { Fabric } from '../types/Fabric';
import { BorderConfiguration } from '../types/Border';

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
   * @param fabrics - Array of fabric objects (pattern fabrics only)
   * @param borderConfiguration - Optional border configuration
   * @param allFabrics - All fabrics including border fabrics (if borders enabled)
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
  static generateFromTemplate(
    patternType: string, 
    fabrics: Fabric[],
    borderConfiguration?: BorderConfiguration,
    allFabrics?: Fabric[]
  ): string {
    console.log('🎨 [SvgGenerator] Called with:', {
      patternType,
      fabricCount: fabrics.length,
      allFabricsCount: allFabrics?.length || 0,
      borderEnabled: borderConfiguration?.enabled || false,
      borderCount: borderConfiguration?.borders?.length || 0,
      fabricColors: fabrics.map(f => f.color),
      allFabricColors: allFabrics?.map(f => f.color) || []
    });
    
    // Validate inputs
    this.validateInputs(patternType, fabrics);

    // Find template
    const { template, patternDef } = TemplateFinder.find(patternType);
    
    if (!template) {
      throw new Error(`SVG template not found for pattern type: ${patternType}`);
    }

    // Base SVG dimensions (quilt blocks only)
    const baseWidth = 300;
    const baseHeight = 400;

    // Generate components
    const blocks = BlockGenerator.generate(template, fabrics, patternDef);
    const fabricsForDefs = allFabrics || fabrics;
    const imageDefs = ImagePatternBuilder.build(fabricsForDefs);
    
    // Generate border SVG if configured (borders extend around blocks at negative coords)
    const borderSvg = borderConfiguration && allFabrics
      ? SvgBorderRenderer.renderBorders(borderConfiguration, allFabrics, baseWidth, baseHeight)
      : '';
    
    // Wrap and return (viewBox is generous enough for max borders)
    return SvgWrapper.wrap(blocks, imageDefs, borderSvg, baseWidth, baseHeight);
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

