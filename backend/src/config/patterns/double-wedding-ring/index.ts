import { PatternDefinition } from '../types';
import { DOUBLE_WEDDING_RING_TEMPLATE } from './template';
import { DOUBLE_WEDDING_RING_PROMPT } from './prompt';

const DoubleWeddingRing: PatternDefinition = {
  id: 'double-wedding-ring',
  name: 'Double Wedding Ring',
  template: DOUBLE_WEDDING_RING_TEMPLATE,
  prompt: DOUBLE_WEDDING_RING_PROMPT,
  minFabrics: 3,
  maxFabrics: 6,
  allowRotation: false,
  rotationStrategy: 'none',
  
  /**
   * Double Wedding Ring color assignments:
   * fabricColors[0] = Background (shows through ring centers, melon backgrounds)
   * fabricColors[1] = Primary (first arc/ring color)
   * fabricColors[2] = Secondary (second arc/ring color - creates interlocking effect)
   * fabricColors[3] = Accent (corner melon connectors - optional)
   * fabricColors[4] = Contrast (additional arc variation - optional)
   * fabricColors[5] = Additional (more arc variation - optional)
   * 
   * The interlocking rings are created by alternating Primary and Secondary colors.
   * With 4+ fabrics, additional colors add variety to the pieced arcs.
   * 
   * Returns: [background, primary, secondary, accent, contrast, additional]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || secondary;
    const contrast = fabricColors[4] || accent;
    const additional = fabricColors[5] || contrast;
    
    return [background, primary, secondary, accent, contrast, additional];
  }
};

export default DoubleWeddingRing;