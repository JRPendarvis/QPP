import { PatternDefinition } from '../types';
import { OHIO_STAR_TEMPLATE } from './template';
import { OHIO_STAR_PROMPT } from './prompt';

const OhioStar: PatternDefinition = {
  id: 'ohio-star',
  name: 'Ohio Star',
  template: OHIO_STAR_TEMPLATE,
  prompt: OHIO_STAR_PROMPT,
  minColors: 2,
  maxColors: 8,
   allowRotation: true,
  /**
   * Ohio Star has background, quarter-square triangle points, and center
   * COLOR1 = background (corners), COLOR2 = star points, COLOR3 = center
   * With multiple fabrics, creates "scrappy" stars by rotating point colors
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
    
    // 4+ fabrics: background consistent, rotate star point colors, center from last
    const background = fabricColors[0];
    const pointOptions = fabricColors.slice(1, -1);
    const center = fabricColors[fabricColors.length - 1];
    const points = pointOptions[blockIndex % pointOptions.length];
    
    return [background, points, center];
  }
};

export default OhioStar;