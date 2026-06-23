import { PatternDefinition } from '../../../types/PatternDefinition';
import { FLYING_GEESE_TEMPLATE } from './template';
import { FLYING_GEESE_PROMPT } from './prompt';
import { createConditionalByCount } from '../colorAssignmentStrategies';

const FlyingGeese: PatternDefinition = {
  id: 'flying-geese',
  name: 'Flying Geese',
  template: FLYING_GEESE_TEMPLATE,
  prompt: FLYING_GEESE_PROMPT,
  minFabrics: 2,
  maxFabrics: 6,
  allowRotation: true,
  rotationStrategy: 'parity-2x2',
  fabricRoles: [
    'Sky (Background)',
    'Geese (Primary)',
    'Geese (Secondary)',
    'Geese (Accent)',
    'Geese (Contrast)',
    'Geese (Additional)',
  ],

  /**
   * Flying Geese - background sky stays consistent, geese colors rotate for scrappy effect.
   * Each block has 4 geese arranged in a 2x2 grid.
   */
  getColors: createConditionalByCount(
    // 2 fabrics: all geese same color
    (colors) => [colors[0], colors[1] || colors[0], colors[1] || colors[0], colors[1] || colors[0], colors[1] || colors[0]],
    // 3+ fabrics: geese rotate through available colors
    (colors, opts) => {
      const blockIndex = opts.blockIndex ?? 0;
      const background = colors[0];
      const geeseOptions = colors.slice(1);
      const goose1 = geeseOptions[(blockIndex * 4 + 0) % geeseOptions.length];
      const goose2 = geeseOptions[(blockIndex * 4 + 1) % geeseOptions.length];
      const goose3 = geeseOptions[(blockIndex * 4 + 2) % geeseOptions.length];
      const goose4 = geeseOptions[(blockIndex * 4 + 3) % geeseOptions.length];
      return [background, goose1, goose2, goose3, goose4];
    },
    2
  )
};

export default FlyingGeese;