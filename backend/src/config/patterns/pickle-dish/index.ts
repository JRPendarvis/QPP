import { PatternDefinition } from '../types';
import { PICKLE_DISH_TEMPLATE } from './template';
import { PICKLE_DISH_PROMPT } from './prompt';

const PickleDish: PatternDefinition = {
  id: 'pickle-dish',
  name: 'Pickle Dish',
  template: PICKLE_DISH_TEMPLATE,
  prompt: PICKLE_DISH_PROMPT,
  minFabrics: 4,
  maxFabrics: 6,
  allowRotation: false,
  rotationStrategy: 'none',
  
  /**
   * Pickle Dish - curved pieced arcs with radiating wedges creating interlocking pattern
   * fabricColors[0] = Background (negative space between arcs)
   * fabricColors[1] = Primary (arc wedges/teeth - first ring)
   * fabricColors[2] = Secondary (arc wedges/teeth - second ring)
   * fabricColors[3] = Accent (melon/center pieces where arcs connect)
   * fabricColors[4] = Contrast (additional arc ring - optional)
   * fabricColors[5] = Additional (inner melon or arc detail - optional)
   * 
   * Colors must stay CONSISTENT across all blocks - curved arcs must align
   * when blocks are tiled to create the interlocking "pickle dish" effect
   * 
   * 4 fabrics: Background + 2 arc rings + Melons
   * 5-6 fabrics: Adds more arc rings for complexity
   * 
   * Returns: [background, arc_ring1, arc_ring2, melons, arc_ring3, detail]
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
    const additional = fabricColors[5] || accent;
    
    return [background, primary, secondary, accent, contrast, additional];
  }
};

export default PickleDish;