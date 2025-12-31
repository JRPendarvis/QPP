import { PatternDefinition } from '../types';
import { COMPLEX_MEDALLION_TEMPLATE } from './template';
import { COMPLEX_MEDALLION_PROMPT } from './prompt';

const ComplexMedallion: PatternDefinition = {
  id: 'complex-medallion',
  name: 'Complex Medallion',
  template: COMPLEX_MEDALLION_TEMPLATE,
  prompt: COMPLEX_MEDALLION_PROMPT,
  minFabrics: 4,
  maxFabrics: 8,
  allowRotation: false,
  
  /**
   * Complex Medallion has a central focal point with radiating borders/frames
   * Colors must stay CONSISTENT across all blocks for the medallion to radiate properly
   * 
   * fabricColors[0] = Background (outermost frame/border)
   * fabricColors[1] = Primary (center medallion/focal point)
   * fabricColors[2] = Secondary (first inner border)
   * fabricColors[3] = Accent (second inner border)
   * fabricColors[4] = Contrast (third inner border - if provided)
   * fabricColors[5-7] = Additional borders (if provided)
   * 
   * Returns: All fabric colors in order (up to 8) for consistent radiating pattern
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || secondary;
    
    // Build array with available fabrics (up to 8)
    const colors = [background, primary, secondary, accent];
    
    // Add any additional fabrics (contrast and beyond)
    for (let i = 4; i < Math.min(fabricColors.length, 8); i++) {
      colors.push(fabricColors[i]);
    }
    
    return colors;
  }
};

export default ComplexMedallion;