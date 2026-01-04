import { PatternDefinition } from '../../../types/PatternDefinition';
import { KALEIDOSCOPE_STAR_TEMPLATE } from './template';
import { KALEIDOSCOPE_STAR_PROMPT } from './prompt';

const KaleidoscopeStar: PatternDefinition = {
  id: 'kaleidoscope-star',
  name: 'Kaleidoscope Star',
  template: KALEIDOSCOPE_STAR_TEMPLATE,
  prompt: KALEIDOSCOPE_STAR_PROMPT,
  minFabrics: 3,
  maxFabrics: 5,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background Corners',
    'Star Points',
    'Center Square',
    'Accent Star Points',
    'Additional Accent',
  ],
  
  /**
   * Kaleidoscope Star - classic 8-pointed star made from quarter-square triangles
   * fabricColors[0] = Background (4 corner squares)
   * fabricColors[1] = Primary (8 star points from QSTs)
   * fabricColors[2] = Secondary (center square)
   * fabricColors[3] = Accent (alternate star points - optional)
   * fabricColors[4] = Additional accent (optional)
   * 
   * 3 fabrics: Background corners + Primary star + Secondary center
   * 4 fabrics: Background corners + Primary/Accent alternating star points + Secondary center
   * 5 fabrics: Background corners + Primary/Accent alternating star points + Secondary center + Additional accent
   * 
   * Returns: [background, star_points, center, accent, additional_accent]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1];
    const secondary = fabricColors[2];
    const accent = fabricColors[3] || primary;
    const additionalAccent = fabricColors[4] || accent;
    
    return [background, primary, secondary, accent, additionalAccent];
  }
};

export default KaleidoscopeStar;
