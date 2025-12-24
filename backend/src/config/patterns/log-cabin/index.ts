import { PatternDefinition } from '../types';
import { 
  LOG_CABIN_TEMPLATE, 
  LOG_CABIN_4,
  LOG_CABIN_5,
  LOG_CABIN_6,
  LOG_CABIN_7,
  LOG_CABIN_8
} from './template';
import { LOG_CABIN_PROMPT } from './prompt';

const LogCabin: PatternDefinition = {
  id: 'log-cabin',
  name: 'Log Cabin',
  template: LOG_CABIN_TEMPLATE,
  prompt: LOG_CABIN_PROMPT,
  minColors: 3,
  maxColors: 8,
  allowRotation: false,

  /**
   * Log Cabin color assignment:
   * - COLOR1: Center hearth (consistent across all blocks)
   * - COLOR2, COLOR4, COLOR6, COLOR8: Light side strips (top + right)
   * - COLOR3, COLOR5, COLOR7: Dark side strips (bottom + left)
   * 
   * With fewer colors, we use what's available:
   * - 3 colors: hearth + 1 light + 1 dark
   * - 5 colors: hearth + 2 lights + 2 darks (alternating by round)
   * - 8 colors: hearth + 4 lights + 3 darks (each round unique)
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const count = fabricColors.length;
    
    if (count <= 3) {
      // Basic: hearth, light, dark
      return [
        fabricColors[0],                           // COLOR1: hearth
        fabricColors[1] || fabricColors[0],        // COLOR2: light
        fabricColors[2] || fabricColors[1] || fabricColors[0]  // COLOR3: dark
      ];
    }
    
    if (count === 4) {
      // hearth + 2 lights + 1 dark
      return [
        fabricColors[0],  // COLOR1: hearth
        fabricColors[1],  // COLOR2: light 1
        fabricColors[2],  // COLOR3: dark
        fabricColors[3],  // COLOR4: light 2
      ];
    }
    
    if (count === 5) {
      // hearth + 2 lights + 2 darks
      return [
        fabricColors[0],  // COLOR1: hearth
        fabricColors[1],  // COLOR2: light 1
        fabricColors[2],  // COLOR3: dark 1
        fabricColors[3],  // COLOR4: light 2
        fabricColors[4],  // COLOR5: dark 2
      ];
    }
    
    if (count === 6) {
      // hearth + 3 lights + 2 darks
      return [
        fabricColors[0],  // COLOR1: hearth
        fabricColors[1],  // COLOR2: light 1
        fabricColors[2],  // COLOR3: dark 1
        fabricColors[3],  // COLOR4: light 2
        fabricColors[4],  // COLOR5: dark 2
        fabricColors[5],  // COLOR6: light 3
      ];
    }
    
    if (count === 7) {
      // hearth + 3 lights + 3 darks
      return [
        fabricColors[0],  // COLOR1: hearth
        fabricColors[1],  // COLOR2: light 1
        fabricColors[2],  // COLOR3: dark 1
        fabricColors[3],  // COLOR4: light 2
        fabricColors[4],  // COLOR5: dark 2
        fabricColors[5],  // COLOR6: light 3
        fabricColors[6],  // COLOR7: dark 3
      ];
    }
    
    // 8 colors: hearth + 4 lights + 3 darks
    return [
      fabricColors[0],  // COLOR1: hearth
      fabricColors[1],  // COLOR2: light 1
      fabricColors[2],  // COLOR3: dark 1
      fabricColors[3],  // COLOR4: light 2
      fabricColors[4],  // COLOR5: dark 2
      fabricColors[5],  // COLOR6: light 3
      fabricColors[6],  // COLOR7: dark 3
      fabricColors[7],  // COLOR8: light 4
    ];
  },

  /**
   * Select appropriate template based on color count
   */
  getTemplate: (colors: string[]): string => {
    const count = colors.length;
    if (count <= 3) return LOG_CABIN_TEMPLATE;
    if (count === 4) return LOG_CABIN_4;
    if (count === 5) return LOG_CABIN_5;
    if (count === 6) return LOG_CABIN_6;
    if (count === 7) return LOG_CABIN_7;
    return LOG_CABIN_8;
  }
};

export default LogCabin;
