import { PatternDefinition } from '../types';
import { SIMPLE_SQUARES_TEMPLATE } from './template';
import { SIMPLE_SQUARES_PROMPT } from './prompt';

const SimpleSquares: PatternDefinition = {
  id: 'simple-squares',
  name: 'Simple Squares',
  template: SIMPLE_SQUARES_TEMPLATE,
  prompt: SIMPLE_SQUARES_PROMPT,
  minFabrics: 1,
  maxFabrics: 8,
  allowRotation: true,
  
  /**
   * Simple Squares - each block is a single solid square
   * fabricColors[0] = Background (or first color)
   * fabricColors[1-7] = Primary, Secondary, Accent, Contrast, Additional colors
   * 
   * Rotates through all available colors block by block to create patchwork effect
   * With 1 fabric: All blocks same color (solid quilt)
   * With 2+ fabrics: Blocks rotate through colors for scrappy patchwork look
   * 
   * Returns: [square_color]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;

    // Rotate through all colors - each block gets the next color in sequence
    const color = fabricColors[blockIndex % fabricColors.length];
    
    return [color];
  }
};

export default SimpleSquares;