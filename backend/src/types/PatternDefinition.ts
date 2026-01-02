import { PatternPrompt } from './PatternPrompt';

/**
 * How a pattern should be rotated when tiled across a quilt.
 * - none: no rotation
 * - alternate-180: rotate every other block by 180° using (row+col)%2 parity
 * - alternate-90: rotate every other block by 90° using (row+col)%2 parity
 * - checkerboard-90: rotate by 0/90/180/270 in a 2×2 repeating grid
 */
export type RotationStrategy = 'none' | 'alternate-180' | 'alternate-90' | 'checkerboard-90' | 'random';

/**
 * Defines the complete structure of a quilt pattern including its
 * configuration, template generation, and color mapping logic.
 */
export interface PatternDefinition {
  id: string;                          // 'churn-dash'
  name: string;                        // 'Churn Dash'
  template: string;                    // SVG with COLOR1, COLOR2, etc. (optional if getTemplate is used)
  prompt: PatternPrompt;
  minFabrics: number;                  // Minimum fabrics needed
  maxFabrics: number;                  // Maximum fabrics supported
  enabled?: boolean;                   // If false, pattern is hidden from production users (defaults to true)

  /**
   * Returns an array of resolved colors in the order the template expects:
   * e.g. [COLOR1, COLOR2, COLOR3, ...]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number }
  ) => string[];

  /**
   * Optional: dynamic SVG block template generator
   */
  getTemplate?: (colors: string[]) => string;

  /**
   * If true, the renderer is allowed to rotate blocks.
   * Defaults to true if undefined.
   */
  allowRotation?: boolean;

  /**
   * NEW: Declares how the block should be rotated when tiled.
   * Defaults to 'none' if undefined.
   *
   * NOTE: This is separate from allowRotation:
   * - allowRotation controls whether renderer may rotate
   * - rotationStrategy specifies the required/desired tiling behavior
   */
  rotationStrategy?: RotationStrategy;
}
