import { PatternDefinition } from '../../../types/PatternDefinition';
import { MARINERS_COMPASS_TEMPLATE } from './template';
import { MARINERS_COMPASS_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const MarinersCompass: PatternDefinition = {
  id: 'mariners-compass',
  name: "Mariner's Compass",
  template: MARINERS_COMPASS_TEMPLATE,
  prompt: MARINERS_COMPASS_PROMPT,
  minFabrics: 4,
  maxFabrics: 6,
  allowRotation: false,
  rotationStrategy: 'none',
  enabled: false,
  fabricRoles: [
    'Background',
    'Main Compass Points',
    'Secondary Points',
    'Center Circle',
    'Accent Points',
    'Additional Details',
  ],

  /**
   * Mariner's Compass - stable positional colors for radiating points.
   * Background, points, and center stay consistent for alignment.
   */
  getColors: createStablePositional
};

export default MarinersCompass;