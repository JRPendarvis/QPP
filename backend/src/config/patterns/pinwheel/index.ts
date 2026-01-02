import { PatternDefinition } from '../../../types/PatternDefinition';
import { PINWHEEL_TEMPLATE } from './template';
import { PINWHEEL_PROMPT } from './prompt';

const Pinwheel: PatternDefinition = {
  id: 'pinwheel',
  name: 'Pinwheel',
  template: PINWHEEL_TEMPLATE,
  prompt: PINWHEEL_PROMPT,
  minFabrics: 2,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'random',

  /**
   * Pinwheel - 4 half-square triangles creating a spinning effect
   * fabricColors[0] = Background (4 triangles - one per HST)
   * fabricColors[1] = Primary (4 blade triangles creating the pinwheel)
   * fabricColors[2] = Secondary (alternate blade color for scrappy look)
   * fabricColors[3] = Accent (more blade variety)
   * 
   * 2 fabrics: Classic pinwheel (Background + Primary blades)
   * 3-4 fabrics: Scrappy pinwheels - Background consistent, blades rotate
   * 
   * Returns: [background, blades]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: traditional pinwheel
      return [background, primary];
    }
    
    // 3-4 fabrics: Background consistent, rotate through Primary, Secondary, Accent for blades
    const bladeOptions = fabricColors.slice(1); // Primary, Secondary, Accent
    const blade = bladeOptions[blockIndex % bladeOptions.length];
    
    return [background, blade];
  }
};

export default Pinwheel;