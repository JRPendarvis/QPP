import { PatternDefinition } from '../types';
import { SAWTOOTH_STAR_TEMPLATE } from './template';
import { SAWTOOTH_STAR_PROMPT } from './prompt';

const SawtoothStar: PatternDefinition = {
  id: 'sawtooth-star',
  name: 'Sawtooth Star',
  template: SAWTOOTH_STAR_TEMPLATE,
  prompt: SAWTOOTH_STAR_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: true,
  
  /**
   * Sawtooth Star - 8-pointed star with flying geese units
   * fabricColors[0] = Background (4 corner squares + sky triangles in flying geese)
   * fabricColors[1] = Primary (8 star points from flying geese units)
   * fabricColors[2] = Secondary (center square - optional)
   * 
   * 2 fabrics: Background corners/sky + Primary star points and center
   * 3 fabrics: Background corners/sky + Primary star points + Secondary center
   * 
   * Returns: [background, star_points, center]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    
    return [background, primary, secondary];
  }
};

export default SawtoothStar;