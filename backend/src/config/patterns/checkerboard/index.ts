import { PatternDefinition } from '../types';
import { CHECKERBOARD_TEMPLATE } from './template';
import { CHECKERBOARD_PROMPT } from './prompt';

const Checkerboard: PatternDefinition = {
  id: 'checkerboard',
  name: 'Checkerboard',
  template: CHECKERBOARD_TEMPLATE,
  prompt: CHECKERBOARD_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Checkerboard uses 2 colors in alternating squares
   * With multiple fabrics, creates "scrappy" look by rotating the second color
   * COLOR1 stays consistent; COLOR2 rotates per block
   */
 getColors: (fabricColors: string[], opts: { row?: number; col?: number }): string[] => {
    const colorA = fabricColors[0];
    const colorB = fabricColors[1] || fabricColors[0];
    const row = opts.row || 0;
    const col = opts.col || 0;
    const color = (row + col) % 2 === 0 ? colorA : colorB;
    return [color];
  }
};

export default Checkerboard;