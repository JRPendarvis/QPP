import { PatternDefinition } from '../../../types/PatternDefinition';
import { OHIO_STAR_TEMPLATE } from './template';
import { OHIO_STAR_PROMPT } from './prompt';

const OhioStar: PatternDefinition = {
  id: 'ohio-star',
  name: 'Ohio Star',
  template: OHIO_STAR_TEMPLATE,
  prompt: OHIO_STAR_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: true,
  rotationStrategy: 'none',
  
  /**
   * Ohio Star - classic 8-pointed star made from quarter-square triangles
   * fabricColors[0] = Background (4 corner squares)
   * fabricColors[1] = Primary (8 star points from QSTs)
   * fabricColors[2] = Secondary (center square - optional)
   * 
   * 2 fabrics: Background corners + Primary star (center matches star)
   * 3 fabrics: Background corners + Primary star + Secondary center
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

export default OhioStar;