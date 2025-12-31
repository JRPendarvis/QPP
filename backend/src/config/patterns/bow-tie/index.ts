import { PatternDefinition } from '../types';
import { BOW_TIE_TEMPLATE } from './template';
import { BOW_TIE_PROMPT } from './prompt';

const BowTie: PatternDefinition = {
  id: 'bow-tie',
  name: 'Bow Tie',
  template: BOW_TIE_TEMPLATE,
  prompt: BOW_TIE_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: true,
  
  /**
   * Bow Tie pattern fabric roles:
   * 2 fabrics: Background (setting squares) + Primary (tie and knot same color)
   * 3 fabrics: Background (setting squares) + Primary (tie) + Secondary (knot)
   * 
   * fabricColors[0] = Background (always the corner squares)
   * fabricColors[1] = Primary (the bow tie fabric)
   * fabricColors[2] = Secondary (the knot/center square)
   * 
   * Returns: [tie, background, knot]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: tie and knot use the same fabric (primary)
      return [primary, background, primary];
    }
    
    // 3 fabrics: separate tie and knot colors
    const secondary = fabricColors[2];
    return [primary, background, secondary];
  }
};

export default BowTie;