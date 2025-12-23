import { PatternDefinition } from '../types';
import { SIMPLE_SQUARES_TEMPLATE } from './template';
import { SIMPLE_SQUARES_PROMPT } from './prompt';

const SimpleSquares: PatternDefinition = {
  id: 'simple-squares',
  name: 'Simple Squares',
  template: SIMPLE_SQUARES_TEMPLATE,
  prompt: SIMPLE_SQUARES_PROMPT,
  minColors: 1,
  maxColors: 8,
  
  /**
   * Simple Squares - each block is a single solid square
   * Rotates through all available colors block by block
   * Creates a patchwork effect with all fabrics represented
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;

    // Rotate through all colors - each block gets the next color
    const color = fabricColors[blockIndex % fabricColors.length];
    
    return [color];
  }
};

export default SimpleSquares;