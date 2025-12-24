import { PatternDefinition } from '../types';
import { 
  FLYING_GEESE_TEMPLATE, 
  FLYING_GEESE_3, 
  FLYING_GEESE_4, 
  FLYING_GEESE_5, 
  FLYING_GEESE_6, 
  FLYING_GEESE_7, 
  FLYING_GEESE_8 
} from './template';
import { FLYING_GEESE_PROMPT } from './prompt';

const FlyingGeese: PatternDefinition = {
  id: 'flying-geese',
  name: 'Flying Geese',
  template: FLYING_GEESE_TEMPLATE,
  prompt: FLYING_GEESE_PROMPT,
  minColors: 2,
  maxColors: 8,
  allowRotation: false,
  
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    // Pass through all colors — template handles goose/sky assignment
    return fabricColors;
  },
  
  getTemplate: (colors: string[]): string => {
    const count = colors.length;
    if (count <= 2) return FLYING_GEESE_TEMPLATE;
    if (count === 3) return FLYING_GEESE_3;
    if (count === 4) return FLYING_GEESE_4;
    if (count === 5) return FLYING_GEESE_5;
    if (count === 6) return FLYING_GEESE_6;
    if (count === 7) return FLYING_GEESE_7;
    return FLYING_GEESE_8;
  }
};

export default FlyingGeese;