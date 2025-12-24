import { PatternDefinition } from '../types';
import { BOW_TIE_TEMPLATE } from './template';
import { BOW_TIE_PROMPT } from './prompt';

const BowTie: PatternDefinition = {
  id: 'bow-tie',
  name: 'Bow Tie',
  template: BOW_TIE_TEMPLATE,
  prompt: BOW_TIE_PROMPT,
  minColors: 3,
  maxColors: 8,
  allowRotation: true,
  
  /**
   * Bow Tie has tie squares, background squares, and center knot
   * COLOR1 = tie (diagonal pair), COLOR2 = background (opposite diagonal), COLOR3 = knot
   * With multiple fabrics, creates "scrappy" look by rotating tie colors
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;

    if (fabricColors.length < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0]
      ];
    }
    
    if (fabricColors.length === 3) {
      // 3 fabrics: tie + background + knot
      return [fabricColors[0], fabricColors[1], fabricColors[2]];
    }
    
    // 4+ fabrics: background + knot consistent, rotate tie colors for scrappy look
    const background = fabricColors[0];
    const knot = fabricColors[fabricColors.length - 1];
    const tieOptions = fabricColors.slice(1, -1);
    const tie = tieOptions[blockIndex % tieOptions.length];
    
    return [tie, background, knot];
  }
};

export default BowTie;