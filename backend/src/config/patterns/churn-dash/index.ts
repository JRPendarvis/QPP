import { PatternDefinition } from '../types';
import { CHURN_DASH_TEMPLATE } from './template';
import { CHURN_DASH_PROMPT } from './prompt';

const ChurnDash: PatternDefinition = {
  id: 'churn-dash',
  name: 'Churn Dash',
  template: CHURN_DASH_TEMPLATE,
  prompt: CHURN_DASH_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: true,
  
  /**
   * Churn Dash has corner squares, rail rectangles, and HST "churn" sections
   * fabricColors[0] = Background (corner squares)
   * fabricColors[1] = Primary (one set of rails + half of HSTs)
   * fabricColors[2] = Secondary (opposite set of rails + other half of HSTs)
   * 
   * 2 fabrics: Background + Primary (Primary used for all feature elements)
   * 3 fabrics: Background + Primary (one blade set) + Secondary (opposite blade set)
   * 
   * Returns: [background, primary, secondary]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    
    return [background, primary, secondary];
  }
};

export default ChurnDash;