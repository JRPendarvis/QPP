import { PatternDefinition } from '../types';
import { LOG_CABIN_TEMPLATE } from './template';
import { LOG_CABIN_PROMPT } from './prompt';

const LogCabin: PatternDefinition = {
  id: 'log-cabin',
  name: 'Log Cabin',
  template: LOG_CABIN_TEMPLATE,
  prompt: LOG_CABIN_PROMPT,
  minColors: 3,
  maxColors: 4,
  
  /**
   * Log Cabin has strips/logs built around a center square (hearth)
   * Light strips on two sides, dark strips on two sides
   * Colors must stay CONSISTENT - the light/dark arrangement creates secondary patterns
   * COLOR1 = center (hearth), COLOR2 = light side logs, COLOR3 = dark side logs
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[0]
      ];
    }
    
    // Consistent colors every block - light/dark sides create barn raising, straight furrow, etc.
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default LogCabin;