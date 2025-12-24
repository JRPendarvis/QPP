import { PatternDefinition } from '../types';
import { CHURN_DASH_TEMPLATE } from './template';
import { CHURN_DASH_PROMPT } from './prompt';

const ChurnDash: PatternDefinition = {
  id: 'churn-dash',
  name: 'Churn Dash',
  template: CHURN_DASH_TEMPLATE,
  prompt: CHURN_DASH_PROMPT,
  minColors: 2,
  maxColors: 8,
   allowRotation: true,
  /**
   * Churn Dash uses 2 colors per block: background + feature
   * With multiple fabrics, creates "scrappy" look by rotating feature colors
   * Background (COLOR1) stays consistent; feature (COLOR2) rotates per block
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const { blockIndex = 0 } = opts;

    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    
    if (fabricColors.length === 2) {
      return [fabricColors[0], fabricColors[1]];
    }
    
    // 3+ fabrics: first is always background, rotate through rest for feature
    const background = fabricColors[0];
    const featureOptions = fabricColors.slice(1);
    const feature = featureOptions[blockIndex % featureOptions.length];
    
    return [background, feature];
  }
};

export default ChurnDash;