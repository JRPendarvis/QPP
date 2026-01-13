import { Fabric } from '../../types/Fabric';
import { getPattern } from '../../config/patterns';

/**
 * Service for generating SVG blocks for quilt patterns
 */
export class BlockGenerator {
  private static readonly GRID_ROWS = 4;
  private static readonly GRID_COLS = 3;
  private static readonly BLOCK_SIZE = 100;
  private static readonly ROTATIONS = [0, 90, 180, 270];

  /**
   * Generates SVG blocks for the quilt pattern using the provided fabrics.
   * 
   * @param template - SVG template string
   * @param fabrics - Array of fabric objects
   * @param patternDef - Pattern definition from config
   * @returns SVG blocks as a string
   * 
   * @example
   * ```typescript
   * const blocks = BlockGenerator.generate(template, fabrics, patternDef);
   * ```
   */
  static generate(
    template: string,
    fabrics: Fabric[],
    patternDef?: ReturnType<typeof getPattern>
  ): string {
    let blocks = '';
    const canRotate = patternDef?.allowRotation ?? true;

    for (let row = 0; row < this.GRID_ROWS; row++) {
      for (let col = 0; col < this.GRID_COLS; col++) {
        const blockIndex = row * this.GRID_COLS + col;
        const x = col * this.BLOCK_SIZE;
        const y = row * this.BLOCK_SIZE;
        
        const blockFabrics = this.selectBlockFabrics(fabrics, patternDef, blockIndex, row, col);
        const blockTemplate = this.applyFabricsToTemplate(template, blockFabrics, fabrics, patternDef);
        const transform = this.calculateTransform(x, y, canRotate);
        
        blocks += `    <g transform="${transform}">\n      ${blockTemplate.trim()}\n    </g>\n`;
      }
    }

    return blocks;
  }

  /**
   * Selects fabrics for a specific block
   */
  private static selectBlockFabrics(
    fabrics: Fabric[],
    patternDef: ReturnType<typeof getPattern> | undefined,
    blockIndex: number,
    row: number,
    col: number
  ): Fabric[] {
    if (patternDef?.getColors) {
      const colorArr = patternDef.getColors(fabrics.map(f => f.color), { blockIndex, row, col });
      return colorArr.map(color => fabrics.find(f => f.color === color) || fabrics[0]);
    }

    // Default fabric selection
    const blockFabrics = fabrics.slice(0, Math.max(3, fabrics.length));
    while (blockFabrics.length < 8) {
      blockFabrics.push(fabrics[blockFabrics.length % fabrics.length]);
    }
    return blockFabrics;
  }

  /**
   * Applies fabrics to template by replacing color placeholders
   */
  private static applyFabricsToTemplate(
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
      return `url(#fabricImage${allFabrics.indexOf(fabric)})`;
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

  /**
   * Calculates the transform attribute for a block
   */
  private static calculateTransform(x: number, y: number, canRotate: boolean): string {
    if (canRotate) {
      const rotation = this.ROTATIONS[Math.floor(Math.random() * this.ROTATIONS.length)];
      return rotation > 0
        ? `translate(${x},${y}) rotate(${rotation} 50 50)`
        : `translate(${x},${y})`;
    }
    return `translate(${x},${y})`;
  }
}
