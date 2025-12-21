import { PatternDefinition } from '../types';
import { BOW_TIE_TEMPLATE } from './template';
import { BOW_TIE_PROMPT } from './prompt';

const BowTie: PatternDefinition = {
  id: 'bow-tie',
  name: 'Bow Tie',
  template: BOW_TIE_TEMPLATE,
  
  prompt: BOW_TIE_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Bow Tie uses 2 colors per block: background + bow tie
   * With multiple fabrics, creates "scrappy" look by rotating bow tie colors
   * Background (COLOR1) stays consistent; bow tie (COLOR2) rotates per block
   */
  getColors: (fabricColors: string[], blockIndex: number = 0): string[] => {
    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    
    if (fabricColors.length === 2) {
      return [fabricColors[0], fabricColors[1]];
    }
    
    // 3+ fabrics: first is always background, rotate through rest for bow tie
    const background = fabricColors[0];
    const featureOptions = fabricColors.slice(1);
    const feature = featureOptions[blockIndex % featureOptions.length];
    
    return [background, feature];
  }
};

export default BowTie;