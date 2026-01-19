import { Fabric } from '../../types/Fabric';

/**
 * Service for building SVG pattern definitions for printed fabrics
 */
export class ImagePatternBuilder {
  /**
   * Builds SVG <pattern> definitions for printed fabrics.
   * 
   * @param fabrics - Array of fabric objects
   * @returns SVG pattern definitions as a string
   * 
   * @example
   * ```typescript
   * const fabrics = [{ color: '#fff', type: 'printed', image: 'base64...' }];
   * const patterns = ImagePatternBuilder.build(fabrics);
   * // Returns: '<pattern id="fabricImage0">...</pattern>'
   * ```
   */
  static build(fabrics: Fabric[]): string {
    let defs = '';
    
    console.log('🖼️ [ImagePatternBuilder] Building patterns for fabrics:', fabrics.map((f, i) => ({
      index: i,
      type: f.type,
      hasImage: !!f.image,
      imageLength: f.image?.length || 0
    })));
    
    fabrics.forEach((fabric, idx) => {
      if (fabric.type === 'printed' && fabric.image) {
        defs += this.createPatternDefinition(fabric.image, idx);
        console.log(`🖼️ [ImagePatternBuilder] Created pattern definition for fabricImage${idx}`);
      }
    });
    
    console.log(`🖼️ [ImagePatternBuilder] Total pattern definitions: ${defs ? 'YES' : 'NONE'}, length: ${defs.length}`);
    
    return defs;
  }

  /**
   * Creates a single pattern definition for a fabric image
   */
  private static createPatternDefinition(imageData: string, index: number): string {
    return `\n<pattern id="fabricImage${index}" patternUnits="userSpaceOnUse" width="50" height="50">` +
      `<image href="data:image/png;base64,${imageData}" x="0" y="0" width="50" height="50" preserveAspectRatio="xMidYMid slice" />` +
      `</pattern>`;
  }
}
