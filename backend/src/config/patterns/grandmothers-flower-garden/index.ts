import { PatternDefinition } from '../../../types/PatternDefinition';
import { GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE } from './template';
import { GRANDMOTHERS_FLOWER_GARDEN_PROMPT } from './prompt';

const GrandmothersFlowerGarden: PatternDefinition = {
  id: 'grandmothers-flower-garden',
  name: "Grandmother's Flower Garden",
  template: GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE,
  prompt: GRANDMOTHERS_FLOWER_GARDEN_PROMPT,
  minFabrics: 3,
  maxFabrics: 5,
  allowRotation: false,
  rotationStrategy: 'none',
  
  /**
   * Grandmother's Flower Garden color assignments:
   * fabricColors[0] = Background (pathway hexagons between flowers)
   * fabricColors[1] = Primary (flower center hexagon)
   * fabricColors[2] = Secondary (inner ring of petals - 6 hexagons)
   * fabricColors[3] = Accent (outer ring of petals - optional for more rings)
   * fabricColors[4] = Contrast (alternate flower centers for variety - optional)
   * 
   * 3 fabrics: Background + Primary center + Secondary petals (one ring)
   * 4 fabrics: Background + Primary center + Secondary inner petals + Accent outer petals
   * 5 fabrics: Adds Contrast for alternate flower centers (creates variety across flowers)
   * 
   * Returns: [background, center, inner_petals, outer_petals, alternate_center]
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
    
    return [background, primary, secondary, accent, contrast];
  }
};

export default GrandmothersFlowerGarden;