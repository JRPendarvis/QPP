import { PatternDefinition } from '../types';
import { CHECKERBOARD_TEMPLATE } from './template';
import { CHECKERBOARD_PROMPT } from './prompt';

const Checkerboard: PatternDefinition = {
  id: 'checkerboard',
  name: 'Checkerboard',
  template: CHECKERBOARD_TEMPLATE,
  prompt: CHECKERBOARD_PROMPT,
  minFabrics: 2,
  maxFabrics: 2,
  allowRotation: true,
  rotationStrategy: 'none',

  /**
   * Checkerboard alternates two colors based on position
   * fabricColors[0] = Background (even positions: row + col = even)
   * fabricColors[1] = Primary (odd positions: row + col = odd)
   * 
   * Uses row + col to determine color - creates classic checkerboard effect
   * Returns: [color] (single color for the square at this position)
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const row = opts.row ?? 0;
    const col = opts.col ?? 0;
    
    // Alternating pattern based on position
    // Even positions (row + col is even) = Background
    // Odd positions (row + col is odd) = Primary
    const color = (row + col) % 2 === 0 ? background : primary;
    return [color];
  }
};

export default Checkerboard;