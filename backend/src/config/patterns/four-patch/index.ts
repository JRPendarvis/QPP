import { PatternDefinition } from '../types';
import { FOUR_PATCH_TEMPLATE } from './template';
import { FOUR_PATCH_PROMPT } from './prompt';

const FourPatch: PatternDefinition = {
  id: 'four-patch',
  name: 'Four Patch',
  template: FOUR_PATCH_TEMPLATE,
  prompt: FOUR_PATCH_PROMPT,
  minColors: 3,
  maxColors: 8,
  allowRotation: true,
  
  /**
   * Four Patch color assignments:
   * Each block is a 2x2 grid of squares. With multiple colors, we create
   * varied combinations across blocks for a scrappy, interesting look.
   * 
   * Layout within each block:
   * [COLOR1] [COLOR2]
   * [COLOR3] [COLOR4]
   * 
   * Strategy:
   * - Use blockIndex to vary which colors appear in each block
   * - Maintain diagonal pairing for visual cohesion (top-left matches bottom-right feel)
   * - Cycle through available colors to use them all
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const count = fabricColors.length;
    const blockIndex = opts.blockIndex ?? 0;
    
    if (count < 3) {
      // Fallback for insufficient colors (shouldn't happen with minColors: 3)
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[0]
      ];
    }
    
    if (count === 3) {
      // 3 colors: Create diagonal pairs with variation
      // Pattern: Two colors form diagonal pairs, third color adds variety
      const patterns = [
        [0, 1, 2, 0],  // Block type A: color0 diagonal, color1 & color2 opposite corners
        [1, 2, 0, 1],  // Block type B: color1 diagonal
        [2, 0, 1, 2],  // Block type C: color2 diagonal
        [0, 2, 1, 0],  // Block type D: color0 diagonal, swapped opposites
      ];
      const pattern = patterns[blockIndex % patterns.length];
      return pattern.map(i => fabricColors[i]);
    }
    
    if (count === 4) {
      // 4 colors: Each block uses all 4, but rotate positions
      const rotations = [
        [0, 1, 2, 3],  // Original
        [1, 3, 0, 2],  // Rotated 90°
        [3, 2, 1, 0],  // Rotated 180°
        [2, 0, 3, 1],  // Rotated 270°
      ];
      const rotation = rotations[blockIndex % rotations.length];
      return rotation.map(i => fabricColors[i]);
    }
    
    if (count === 5) {
      // 5 colors: Cycle through combinations, always using 4 per block
      const combinations = [
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 0],
        [3, 4, 0, 1],
        [4, 0, 1, 2],
      ];
      const combo = combinations[blockIndex % combinations.length];
      return combo.map(i => fabricColors[i]);
    }
    
    if (count === 6) {
      // 6 colors: More combinations possible
      const combinations = [
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 0],
        [4, 5, 0, 1],
        [5, 0, 1, 2],
      ];
      const combo = combinations[blockIndex % combinations.length];
      return combo.map(i => fabricColors[i]);
    }
    
    if (count === 7) {
      // 7 colors: Cycle with variety
      const combinations = [
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [4, 5, 6, 0],
        [5, 6, 0, 1],
        [6, 0, 1, 2],
      ];
      const combo = combinations[blockIndex % combinations.length];
      return combo.map(i => fabricColors[i]);
    }
    
    // 8 colors: Maximum variety
    const combinations = [
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6],
      [4, 5, 6, 7],
      [5, 6, 7, 0],
      [6, 7, 0, 1],
      [7, 0, 1, 2],
      [0, 2, 4, 6],  // Even indices
      [1, 3, 5, 7],  // Odd indices
      [0, 3, 4, 7],  // Skip pattern
      [1, 2, 5, 6],  // Another skip pattern
    ];
    const combo = combinations[blockIndex % combinations.length];
    return combo.map(i => fabricColors[i]);
  }
};

export default FourPatch;