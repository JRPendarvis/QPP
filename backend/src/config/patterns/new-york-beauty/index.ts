import { PatternDefinition } from '../../../types/PatternDefinition';
import { NEW_YORK_BEAUTY_TEMPLATE } from './template';
import { NEW_YORK_BEAUTY_PROMPT } from './prompt';

const NewYorkBeauty: PatternDefinition = {
  id: 'new-york-beauty',
  name: 'New York Beauty',
  template: NEW_YORK_BEAUTY_TEMPLATE,
  prompt: NEW_YORK_BEAUTY_PROMPT,
  minFabrics: 3,
  maxFabrics: 5,
  allowRotation: false,
  rotationStrategy: 'none',

  /**
   * New York Beauty - curved pieced arc with radiating spikes from corner
   * fabricColors[0] = Background (main block area, negative space)
   * fabricColors[1] = Primary (arc base/background of spike section)
   * fabricColors[2] = Secondary (spikes/points radiating from corner)
   * fabricColors[3] = Accent (corner quarter-circle)
   * fabricColors[4] = Contrast (alternating spikes for more detail - optional)
   * 
   * Colors must stay CONSISTENT - curved arcs and spikes require perfect alignment
   * The curved piecing creates the signature "crown" or "sunburst" effect
   * 
   * 3 fabrics: Background + Arc base + Spikes
   * 4 fabrics: Adds distinct corner quarter-circle
   * 5 fabrics: Adds alternating spike colors for more intricate effect
   * 
   * Returns: [background, arc_base, spikes, corner, alternating_spikes]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || primary;
    const contrast = fabricColors[4] || secondary;
    
    return [background, primary, secondary, accent, contrast];
  }
};

export default NewYorkBeauty;