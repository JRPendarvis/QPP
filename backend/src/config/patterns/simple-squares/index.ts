import { PatternDefinition } from '../../../types/PatternDefinition';
import { SIMPLE_SQUARES_TEMPLATE } from './template';
import { SIMPLE_SQUARES_PROMPT } from './prompt';

const SimpleSquares: PatternDefinition = {
  id: 'simple-squares',
  name: 'Simple Squares',
  template: SIMPLE_SQUARES_TEMPLATE,
  prompt: SIMPLE_SQUARES_PROMPT,
  minFabrics: 2,
  maxFabrics: 8,
  allowRotation: true,
  rotationStrategy: 'random',
  fabricRoles: [
    'Color 1',
    'Color 2',
    'Color 3',
    'Color 4',
    'Color 5',
    'Color 6',
    'Color 7',
    'Color 8',
  ],
  
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
    const row = opts.row ?? 0;
    const col = opts.col ?? 0;

    // Offset each row by the row number so colors shift diagonally instead of
    // repeating straight down — prevents a "rail fence" appearance when the
    // fabric count equals the column count (e.g. 3 fabrics on a 3-col grid).
    const color = fabricColors[(row + col) % fabricColors.length];

    return [color];
  }
};

export default SimpleSquares;