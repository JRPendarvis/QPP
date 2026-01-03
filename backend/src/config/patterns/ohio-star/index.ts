import { PatternDefinition } from '../../../types/PatternDefinition';
import { OHIO_STAR_TEMPLATE } from './template';
import { OHIO_STAR_PROMPT } from './prompt';

const OhioStar: PatternDefinition = {
  id: 'ohio-star',
  name: 'Ohio Star',
  template: OHIO_STAR_TEMPLATE,
  prompt: OHIO_STAR_PROMPT,
  minFabrics: 3,
  maxFabrics: 4,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background Corners',
    'Star Points',
    'Center Square',
    'Accent Star Points',
  ],
  
  /**
   * Ohio Star - classic 8-pointed star made from quarter-square triangles
   * fabricColors[0] = Background (4 corner squares)
   * fabricColors[1] = Primary (8 star points from QSTs)
   * fabricColors[2] = Secondary (center square)
   * fabricColors[3] = Accent (alternate star points - optional)
   * 
   * 3 fabrics: Background corners + Primary star + Secondary center
   * 4 fabrics: Background corners + Primary/Accent alternating star points + Secondary center
   * 
   * Returns: [background, star_points, center, accent]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1];
    const secondary = fabricColors[2];
    const accent = fabricColors[3] || primary;
    
    return [background, primary, secondary, accent];
  }
};

export default OhioStar;