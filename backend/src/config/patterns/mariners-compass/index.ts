import { PatternDefinition } from '../types';
import { MARINERS_COMPASS_TEMPLATE } from './template';
import { MARINERS_COMPASS_PROMPT } from './prompt';

const MarinersCompass: PatternDefinition = {
  id: 'mariners-compass',
  name: "Mariner's Compass",
  template: MARINERS_COMPASS_TEMPLATE,
  prompt: MARINERS_COMPASS_PROMPT,
  minFabrics: 4,
  maxFabrics: 6,
  allowRotation: false,
  
  /**
   * Mariner's Compass - radiating points like a navigational compass rose
   * fabricColors[0] = Background (circle background, corner squares)
   * fabricColors[1] = Primary (main compass points - typically 8 or 16)
   * fabricColors[2] = Secondary (secondary/shorter compass points)
   * fabricColors[3] = Accent (center circle)
   * fabricColors[4] = Contrast (tertiary compass points - optional)
   * fabricColors[5] = Additional (decorative elements - optional)
   * 
   * Colors must stay CONSISTENT - precision compass requires perfect alignment
   * The radiating points create a circular compass rose pattern
   * 
   * 4 fabrics: Background + Primary points + Secondary points + Center circle
   * 5-6 fabrics: Adds Contrast for additional point layers or decorative elements
   * 
   * Returns: [background, primary_points, secondary_points, center, contrast, additional]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || secondary;
    const contrast = fabricColors[4] || primary;
    const additional = fabricColors[5] || background;
    
    return [background, primary, secondary, accent, contrast, additional];
  }
};

export default MarinersCompass;