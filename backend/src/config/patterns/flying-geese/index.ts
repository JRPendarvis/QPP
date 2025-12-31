import { PatternDefinition } from '../types';
import { FLYING_GEESE_TEMPLATE } from './template';
import { FLYING_GEESE_PROMPT } from './prompt';

const FlyingGeese: PatternDefinition = {
  id: 'flying-geese',
  name: 'Flying Geese',
  template: FLYING_GEESE_TEMPLATE,
  prompt: FLYING_GEESE_PROMPT,
  minFabrics: 2,
  maxFabrics: 6,
  allowRotation: true,
  
  /**
   * Flying Geese color assignments:
   * fabricColors[0] = Background (the "sky" - corner triangles)
   * fabricColors[1] = Primary (first "goose" - center triangle)
   * fabricColors[2] = Secondary (second "goose" - alternates with Primary)
   * fabricColors[3] = Accent (third "goose" - more variety)
   * fabricColors[4] = Contrast (fourth "goose" - additional variety)
   * fabricColors[5] = Additional (fifth "goose" - maximum variety)
   * 
   * 2 fabrics: Background sky + Primary goose (all geese same color)
   * 3+ fabrics: Background sky consistent, geese rotate through Primary, Secondary, Accent, Contrast, Additional
   * 
   * Each block contains 4 flying geese units arranged in a 2x2 grid
   * With 3+ fabrics, geese colors rotate for scrappy look
   * 
   * Returns: [background, goose1, goose2, goose3, goose4] 
   * where goose colors rotate through available fabrics
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: all geese are the same color (Primary)
      return [background, primary, primary, primary, primary];
    }
    
    // 3-6 fabrics: rotate geese through available colors
    const geeseOptions = fabricColors.slice(1); // Primary, Secondary, Accent, Contrast, Additional
    
    // Each block has 4 geese - rotate through available goose colors
    const goose1 = geeseOptions[(blockIndex * 4 + 0) % geeseOptions.length];
    const goose2 = geeseOptions[(blockIndex * 4 + 1) % geeseOptions.length];
    const goose3 = geeseOptions[(blockIndex * 4 + 2) % geeseOptions.length];
    const goose4 = geeseOptions[(blockIndex * 4 + 3) % geeseOptions.length];
    
    return [background, goose1, goose2, goose3, goose4];
  }
};

export default FlyingGeese;