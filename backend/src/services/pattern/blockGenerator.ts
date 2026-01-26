import { Fabric } from '../../types/Fabric';
import { getPattern } from '../../config/patterns';
import { FabricSelector } from './fabricSelector';
import { TemplateApplicator } from './templateApplicator';
import { TransformCalculator } from './transformCalculator';

/**
 * Service for generating SVG blocks for quilt patterns
 * Orchestrates fabric selection, template application, and transform generation
 */
export class BlockGenerator {
  private static readonly GRID_ROWS = 4;
  private static readonly GRID_COLS = 3;
  private static readonly BLOCK_SIZE = 100;

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
        
        const blockFabrics = FabricSelector.selectForBlock(fabrics, patternDef, blockIndex, row, col);
        const blockTemplate = TemplateApplicator.apply(template, blockFabrics, fabrics, patternDef);
        const transform = TransformCalculator.calculate(x, y, canRotate);
        
        blocks += `    <g transform="${transform}">\n      ${blockTemplate.trim()}\n    </g>\n`;
      }
    }

    return blocks;
  }
}
