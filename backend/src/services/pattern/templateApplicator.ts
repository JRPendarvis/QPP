import { Fabric } from '../../types/Fabric';
import { getPattern } from '../../config/patterns';

/**
 * Service for applying fabric data to SVG templates
 */
export class TemplateApplicator {
  /**
   * Applies fabrics to template by replacing color placeholders
   * 
   * @param template - Base SVG template string
   * @param blockFabrics - Fabrics selected for this block
   * @param allFabrics - All available fabrics
   * @param patternDef - Pattern definition (optional)
   * @returns Processed template with fabric values
   */
  static apply(
    template: string,
    blockFabrics: Fabric[],
    allFabrics: Fabric[],
    patternDef?: ReturnType<typeof getPattern>
  ): string {
    // Get template for this specific block
    let blockTemplate = patternDef?.getTemplate
      ? patternDef.getTemplate(blockFabrics.map(f => f.color))
      : template;

    // Replace color placeholders
    for (let i = 0; i < 8; i++) {
      const fabric = blockFabrics[i] || allFabrics[0];
      const fillValue = this.getFillValue(fabric, allFabrics);
      const colorPlaceholder = new RegExp(`COLOR${i + 1}`, 'g');
      blockTemplate = blockTemplate.replace(colorPlaceholder, fillValue);
    }

    // Clean up template
    blockTemplate = blockTemplate.replace(/<svg[^>]*>/gi, '').replace(/<\/svg>/gi, '');
    
    // Add default strokes if not present
    if (!blockTemplate.includes('stroke=')) {
      blockTemplate = this.addDefaultStrokes(blockTemplate);
    }

    return blockTemplate;
  }

  /**
   * Gets the fill value for a fabric (color or pattern URL)
   */
  private static getFillValue(fabric: Fabric, allFabrics: Fabric[]): string {
    if (fabric.type === 'printed' && fabric.image) {
      const fabricIndex = allFabrics.indexOf(fabric);
      console.log(`🎨 [TemplateApplicator] Using fabric pattern: fabricImage${fabricIndex} for printed fabric`);
      return `url(#fabricImage${fabricIndex})`;
    }
    return fabric.color;
  }

  /**
   * Adds default strokes to SVG elements
   */
  private static addDefaultStrokes(template: string): string {
    return template
      .replace(/<rect /g, '<rect stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
      .replace(/<polygon /g, '<polygon stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
      .replace(/<path /g, '<path stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
      .replace(/<circle /g, '<circle stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ');
  }
}
