import { PatternDefinition } from '../../../types/PatternDefinition';
import { PINWHEEL_TEMPLATE } from './template';
import { PINWHEEL_PROMPT } from './prompt';
import buildPinwheelPlan from './plan';

const Pinwheel: PatternDefinition = {
  id: 'pinwheel',
  name: 'Pinwheel',
  template: PINWHEEL_TEMPLATE,
  prompt: PINWHEEL_PROMPT,

  minFabrics: 2,
  maxFabrics: 4,

  // Pinwheel identity comes from rotation, not color shuffling
  allowRotation: true,
  rotationStrategy: 'alternate-90',

  fabricRoles: [
    'Background',
    'Blades (Primary)',
    'Blades (Secondary)',
    'Blades (Accent)',
  ],

   getColors: (fabricColors: string[]): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] ?? background;
    const secondary = fabricColors[2] ?? primary;
    const accent = fabricColors[3] ?? primary;

    // Always return stable positions
    return [background, primary, secondary, accent];
  },
};

export default Pinwheel;

// Named export used by deterministic instruction generation
export { buildPinwheelPlan };
