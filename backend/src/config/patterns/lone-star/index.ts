import { PatternDefinition } from '../types';
import { LONE_STAR_TEMPLATE } from './template';
import { LONE_STAR_PROMPT } from './prompt';

const LoneStar: PatternDefinition = {
  id: 'lone-star',
  name: 'Lone Star',
  template: LONE_STAR_TEMPLATE,
  prompt: LONE_STAR_PROMPT,
  minFabrics: 4,
  maxFabrics: 8,
  allowRotation: false,
  
  /**
   * Lone Star (Star of Bethlehem) - 8 diamond points radiating from center
   * fabricColors[0] = Background (corner squares, negative space)
   * fabricColors[1] = Primary (innermost diamond ring - center of star)
   * fabricColors[2] = Secondary (second diamond ring)
   * fabricColors[3] = Accent (third diamond ring)
   * fabricColors[4] = Contrast (fourth diamond ring)
   * fabricColors[5] = Additional (fifth diamond ring)
   * fabricColors[6] = Additional (sixth diamond ring)
   * fabricColors[7] = Additional (outermost diamond ring - tips of points)
   * 
   * Colors must stay CONSISTENT across all blocks - the radiating/graduated 
   * effect requires perfect color placement and alignment
   * 
   * Each star point is made of graduated diamonds creating concentric rings
   * 4-8 fabrics create rings from center outward, creating depth and dimension
   * 
   * Returns: [background, ring1, ring2, ring3, ring4, ring5, ring6, ring7]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const ring1 = fabricColors[1] || background;
    const ring2 = fabricColors[2] || ring1;
    const ring3 = fabricColors[3] || ring2;
    const ring4 = fabricColors[4] || ring3;
    const ring5 = fabricColors[5] || ring4;
    const ring6 = fabricColors[6] || ring5;
    const ring7 = fabricColors[7] || ring6;
    
    return [background, ring1, ring2, ring3, ring4, ring5, ring6, ring7];
  }
};

export default LoneStar;