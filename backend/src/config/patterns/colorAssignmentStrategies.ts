/**
 * Reusable color assignment strategies for quilt patterns.
 * 
 * Reduces code duplication across pattern definitions by providing
 * factory functions for common color distribution patterns.
 * 
 * Each factory returns a getColors function matching PatternDefinition signature.
 */

export type GetColorsOptions = {
  blockIndex?: number;
  row?: number;
  col?: number;
};

export type GetColorsFunction = (
  fabricColors: string[],
  opts?: GetColorsOptions
) => string[];

/**
 * Cyclic rotation strategy: rotate through all available colors by block index.
 * Used for patterns like Simple Squares, where each block gets a different color.
 * 
 * Example: 3 colors, block 0→color 0, block 1→color 1, block 2→color 0...
 */
export const createCyclicRotation: GetColorsFunction = (
  fabricColors: string[],
  opts: GetColorsOptions = {}
): string[] => {
  const blockIndex = opts.blockIndex ?? 0;
  const color = fabricColors[blockIndex % fabricColors.length];
  return [color];
};

/**
 * Diagonal rotation strategy: rotate colors based on row + col position.
 * Prevents "rail fence" banding when color count matches grid width.
 * Used for Simple Squares to create organic patchwork look.
 * 
 * Example: block at (2, 1) with 3 colors → (2+1) % 3 = 0 → color 0
 */
export const createDiagonalRotation: GetColorsFunction = (
  fabricColors: string[],
  opts: GetColorsOptions = {}
): string[] => {
  const row = opts.row ?? 0;
  const col = opts.col ?? 0;
  const color = fabricColors[(row + col) % fabricColors.length];
  return [color];
};

/**
 * Stable positional strategy: assign each position a fabric based on its index in the input array.
 * No rotation—positions stay consistent.
 * Used for Pinwheel and other patterns where position matters more than block variety.
 * 
 * Example: fabricColors = [bg, primary, secondary, accent] → always returns in that order
 */
export const createStablePositional: GetColorsFunction = (
  fabricColors: string[],
  _opts: GetColorsOptions = {}
): string[] => {
  return [...fabricColors];
};

/**
 * Conditional strategy: branch logic based on fabric count.
 * Returns different arrangements depending on how many fabrics the user provided.
 * Used for patterns that have distinct 2-fabric vs multi-fabric looks.
 */
export const createConditionalByCount = (
  whenShort: (colors: string[], opts: GetColorsOptions) => string[],
  whenLong: (colors: string[], opts: GetColorsOptions) => string[],
  threshold: number = 2
): GetColorsFunction => {
  return (fabricColors: string[], opts: GetColorsOptions = {}): string[] => {
    if (fabricColors.length <= threshold) {
      return whenShort(fabricColors, opts);
    }
    return whenLong(fabricColors, opts);
  };
};

/**
 * Pattern rotation strategy: cycle through predefined patterns.
 * Each pattern is a specific arrangement of the input fabrics.
 * Used for Four Patch with different arrangements for 3 vs 4 fabrics.
 * 
 * Example: 3-fabric patterns with diagonal arrangements, rotated per block.
 */
export const createPatternRotation = (
  patterns: string[][]
): GetColorsFunction => {
  return (_fabricColors: string[], opts: GetColorsOptions = {}): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const pattern = patterns[blockIndex % patterns.length];
    return pattern;
  };
};

/**
 * Fixed primary/secondary strategy: first N fabrics stay constant,
 * remaining fabrics rotate based on block index.
 * Used for Nine Patch, where corners/center (background) stay constant.
 */
export const createFixedPrimary = (
  primaryCount: number = 1
): GetColorsFunction => {
  return (fabricColors: string[], opts: GetColorsOptions = {}): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const primary = fabricColors.slice(0, primaryCount);
    const rotating = fabricColors.slice(primaryCount);
    
    if (rotating.length === 0) {
      return primary;
    }
    
    const rotated = rotating[blockIndex % rotating.length];
    return [...primary, rotated];
  };
};

/**
 * Checkerboard strategy: alternate between two colors in a checkerboard pattern.
 * Position determined by (row + col) % 2.
 * Used for simple alternating patterns.
 */
export const createCheckerboard: GetColorsFunction = (
  fabricColors: string[],
  opts: GetColorsOptions = {}
): string[] => {
  const row = opts.row ?? 0;
  const col = opts.col ?? 0;
  const isEven = (row + col) % 2 === 0;
  const colorIndex = isEven ? 0 : Math.min(1, fabricColors.length - 1);
  return [fabricColors[colorIndex]];
};

/**
 * Multi-position rotation: rotate through multiple position groups.
 * Each "slot" (position in the returned array) cycles through dedicated fabric options.
 * Used for patterns with multiple color roles (e.g., corners vs cross in Nine Patch).
 */
export const createMultiPositionRotation = (
  positionFabricGroups: string[][]
): GetColorsFunction => {
  return (_fabricColors: string[], opts: GetColorsOptions = {}): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    return positionFabricGroups.map(group => group[blockIndex % group.length]);
  };
};
