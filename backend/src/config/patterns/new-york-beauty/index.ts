import { PatternDefinition } from '../../../types/PatternDefinition';
import { NEW_YORK_BEAUTY_TEMPLATE } from './template';
import { NEW_YORK_BEAUTY_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const NewYorkBeauty: PatternDefinition = {
  id: 'new-york-beauty',
  name: 'New York Beauty',
  template: NEW_YORK_BEAUTY_TEMPLATE,
  prompt: NEW_YORK_BEAUTY_PROMPT,

  /**
   * For MVP we are implementing a CORNER fan (a common NY Beauty component).
   * A convincing NY Beauty look typically needs:
   * - Background
   * - Fan (arc base / wedge field)
   * - Wedges/Points within the fan
   * - Corner quarter-circle / anchor
   */
  minFabrics: 4,
  maxFabrics: 8,
  patternStatus: 'planned',
  allowRotation: false,
  rotationStrategy: 'none',

  /**
   * Role guidance:
   * - "Fan Base" = the curved band / field the wedges sit in (if your template uses it)
   * - "Fan Wedges" = the repeating wedge slices in the fan (what your reference image shows)
   * - "Corner Quarter-Circle" = the anchor in the corner
   * - Optional alternates let users add complexity without breaking structure
   */
  fabricRoles: [
    'Background',
    'Fan Base',
    'Fan Wedges',
    'Corner Quarter-Circle',
    'Alternate Fan Wedges (Optional)',
    'Alternate Fan Base (Optional)',
    'Wedge Accent (Optional)',
    'Extra Contrast (Optional)',
  ],

  /**
   * New York Beauty (Corner Fan) - stable positional colors.
   * Fan base, wedges, and corner stay consistent across blocks for alignment.
   */
  getColors: createStablePositional,
};

export default NewYorkBeauty;
