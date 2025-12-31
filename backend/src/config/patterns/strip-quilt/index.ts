import { PatternDefinition } from '../types';
import { STRIP_QUILT_TEMPLATE } from './template';
import { STRIP_QUILT_PROMPT } from './prompt';

const StripQuilt: PatternDefinition = {
  id: 'strip-quilt',
  name: 'Strip Quilt',
  template: STRIP_QUILT_TEMPLATE,
  prompt: STRIP_QUILT_PROMPT,
  minFabrics: 2,
  maxFabrics: 8,
  allowRotation: false,
  
  /**
   * Strip Quilt - vertical strips of equal width
   * fabricColors[0] = Background (first strip)
   * fabricColors[1] = Primary (second strip)
   * fabricColors[2] = Secondary (third strip)
   * fabricColors[3] = Accent (fourth strip)
   * fabricColors[4] = Contrast (fifth strip)
   * fabricColors[5-7] = Additional strips
   * 
   * All colors are used in order from left to right
   * Each strip is equal width, creating a simple striped pattern
   * 
   * 2 fabrics: Two equal vertical strips
   * 3-8 fabrics: Multiple vertical strips, each fabric used once
   * 
   * Returns: All fabric colors in order
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
    const additional1 = fabricColors[5] || contrast;
    const additional2 = fabricColors[6] || additional1;
    const additional3 = fabricColors[7] || additional2;
    
    return [background, primary, secondary, accent, contrast, additional1, additional2, additional3];
  }
};

export default StripQuilt;