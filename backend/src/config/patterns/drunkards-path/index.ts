import { PatternDefinition } from '../types';
import { DRUNKARDS_PATH_TEMPLATE } from './template';
import { DRUNKARDS_PATH_PROMPT } from './prompt';

const DrunkardsPath: PatternDefinition = {
  id: 'drunkards-path',
  name: "Drunkard's Path",
  template: DRUNKARDS_PATH_TEMPLATE,
  prompt: DRUNKARDS_PATH_PROMPT,
  minFabrics: 2,
  maxFabrics: 4,
  allowRotation: true,
  
  /**
   * Drunkard's Path has a quarter circle creating curved, winding paths
   * fabricColors[0] = Background (the square minus the quarter circle)
   * fabricColors[1] = Primary (the quarter circle "path")
   * fabricColors[2] = Secondary (optional - alternate path color for variety)
   * fabricColors[3] = Accent (optional - additional path variation)
   * 
   * The winding path effect is created through block rotation at the quilt level.
   * With 2 fabrics: consistent background + path creates traditional look
   * With 3-4 fabrics: can create scrappy paths by rotating through Primary, Secondary, Accent
   * 
   * Returns: [background, path] for 2 fabrics, or [background, rotated_path] for 3-4 fabrics
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: traditional consistent path
      return [background, primary];
    }
    
    // 3-4 fabrics: rotate through Primary, Secondary, Accent for scrappy paths
    const pathOptions = fabricColors.slice(1); // Primary, Secondary, Accent
    const path = pathOptions[blockIndex % pathOptions.length];
    
    return [background, path];
  }
};

export default DrunkardsPath;