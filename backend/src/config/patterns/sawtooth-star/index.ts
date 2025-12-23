import { PatternDefinition } from '../types';
import { SAWTOOTH_STAR_TEMPLATE } from './template';
import { SAWTOOTH_STAR_PROMPT } from './prompt';

const SawtoothStar: PatternDefinition = {
  id: 'sawtooth-star',
  name: 'Sawtooth Star',
  template: SAWTOOTH_STAR_TEMPLATE,
  prompt: SAWTOOTH_STAR_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Sawtooth Star has background, star points, and center
   * With multiple fabrics, creates "scrappy" stars by rotating point colors
   * COLOR1 = background (corners + behind points), COLOR2 = star points, COLOR3 = center
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;

    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0], fabricColors[0]];
    }
    
    if (fabricColors.length === 2) {
      // 2 fabrics: background + star (center matches star)
      return [fabricColors[0], fabricColors[1], fabricColors[1]];
    }
    
    if (fabricColors.length === 3) {
      // 3 fabrics: background + star points + center
      return [fabricColors[0], fabricColors[1], fabricColors[2]];
    }
    
    // 4+ fabrics: background consistent, rotate star point colors, center from remaining
    const background = fabricColors[0];
    const pointOptions = fabricColors.slice(1, -1); // All except first and last
    const center = fabricColors[fabricColors.length - 1]; // Last color for center
    const points = pointOptions[blockIndex % pointOptions.length];
    
    return [background, points, center];
  }
};

export default SawtoothStar;