import { PatternDefinition } from '../types';
import { CHECKERBOARD_TEMPLATE } from './template';
import { CHECKERBOARD_PROMPT } from './prompt';

const Checkerboard: PatternDefinition = {
  id: 'checkerboard',
  name: 'Checkerboard',
  template: CHECKERBOARD_TEMPLATE,
  prompt: CHECKERBOARD_PROMPT,
  minColors: 2,
  maxColors: 2,
  allowRotation: true,
  /**
   * Checkerboard alternates colors based on position
   * Uses row + col to determine color - creates classic checkerboard effect
   * COLOR1 = even positions, COLOR2 = odd positions
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const colorA = fabricColors[0];
    const colorB = fabricColors[1] || fabricColors[0];
    const row = opts.row ?? 0;
    const col = opts.col ?? 0;
    
    // Alternating pattern based on position
    const color = (row + col) % 2 === 0 ? colorA : colorB;
    return [color];
  }
};

export default Checkerboard;