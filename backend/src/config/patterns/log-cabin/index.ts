import { PatternDefinition } from '../types';
import { LOG_CABIN_TEMPLATE } from './template';
import { LOG_CABIN_PROMPT } from './prompt';

const LogCabin: PatternDefinition = {
  id: 'log-cabin',
  name: 'Log Cabin',
  template: LOG_CABIN_TEMPLATE,
  prompt: LOG_CABIN_PROMPT,
  minFabrics: 3,
  maxFabrics: 8,
  allowRotation: false,  rotationStrategy: 'none',
  /**
   * Log Cabin color assignments:
   * fabricColors[0] = Background (center "hearth" square)
   * fabricColors[1] = Primary (first light strip - round 1)
   * fabricColors[2] = Secondary (first dark strip - round 1)
   * fabricColors[3] = Accent (second light strip - round 2)
   * fabricColors[4] = Contrast (second dark strip - round 2)
   * fabricColors[5] = Additional light (round 3)
   * fabricColors[6] = Additional dark (round 3)
   * fabricColors[7] = Additional light (round 4)
   * 
   * Strips alternate light/dark as they spiral outward from center
   * Light strips typically on one half (top+right)
   * Dark strips on opposite half (bottom+left)
   * 
   * 3 fabrics: Hearth + one light + one dark (traditional)
   * 4-8 fabrics: Adds variety with multiple lights/darks in progressive rounds
   * 
   * Returns: [hearth, light1, dark1, light2, dark2, light3, dark3, light4]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0]; // hearth
    const primary = fabricColors[1] || background; // light 1
    const secondary = fabricColors[2] || primary; // dark 1
    const accent = fabricColors[3] || primary; // light 2
    const contrast = fabricColors[4] || secondary; // dark 2
    const light3 = fabricColors[5] || accent; // light 3
    const dark3 = fabricColors[6] || contrast; // dark 3
    const light4 = fabricColors[7] || light3; // light 4
    
    return [background, primary, secondary, accent, contrast, light3, dark3, light4];
  }
};

export default LogCabin;