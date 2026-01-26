import { Fabric } from '../../types/Fabric';
import { getPattern } from '../../config/patterns';

/**
 * Service for selecting appropriate fabrics for each quilt block
 */
export class FabricSelector {
  /**
   * Selects fabrics for a specific block based on pattern definition
   * 
   * @param fabrics - All available fabrics
   * @param patternDef - Pattern definition (optional)
   * @param blockIndex - Index of the block
   * @param row - Row position
   * @param col - Column position
   * @returns Array of fabrics for this block
   */
  static selectForBlock(
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

    return this.selectDefault(fabrics);
  }

  /**
   * Default fabric selection when no pattern-specific logic exists
   */
  private static selectDefault(fabrics: Fabric[]): Fabric[] {
    const blockFabrics = fabrics.slice(0, Math.max(3, fabrics.length));
    while (blockFabrics.length < 8) {
      blockFabrics.push(fabrics[blockFabrics.length % fabrics.length]);
    }
    return blockFabrics;
  }
}
