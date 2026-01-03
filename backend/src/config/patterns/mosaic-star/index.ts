import { PatternDefinition } from '../../../types/PatternDefinition';
import { MOSAIC_STAR_TEMPLATE } from './template';
import { MOSAIC_STAR_PROMPT } from './prompt';

const MosaicStar: PatternDefinition = {
  id: 'mosaic-star',
  name: 'Mosaic Star',
  template: MOSAIC_STAR_TEMPLATE,
  prompt: MOSAIC_STAR_PROMPT,
  minFabrics: 3,
  maxFabrics: 5,
  allowRotation: false,
  rotationStrategy: 'none',

  /**
   * Mosaic Star color assignments:
   * fabricColors[0] = Background (negative space, setting triangles, corners)
   * fabricColors[1] = Primary (main star points)
   * fabricColors[2] = Secondary (feathers - tiny triangles around star points)
   * fabricColors[3] = Accent (center square - optional)
   * fabricColors[4] = Contrast (alternate feather color for more detail - optional)
   * 
   * 3 fabrics (minimum):
   * - Background: setting/negative space
   * - Primary: star points
   * - Secondary: feathers + center square
   * 
   * 4 fabrics (recommended):
   * - Background: setting/negative space
   * - Primary: star points
   * - Secondary: feathers
   * - Accent: center square (creates focal point)
   * 
   * 5 fabrics (maximum complexity):
   * - Background: setting/negative space
   * - Primary: star points
   * - Secondary: primary feathers
   * - Accent: center square
   * - Contrast: alternating feathers (creates more intricate feathered effect)
   * 
   * Returns: [background, primary, secondary, accent, contrast]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || secondary;
    const contrast = fabricColors[4] || secondary;
    
    return [background, primary, secondary, accent, contrast];
  }
};

export default MosaicStar;