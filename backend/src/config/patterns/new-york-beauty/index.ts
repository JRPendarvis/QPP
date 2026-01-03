import { PatternDefinition } from '../../../types/PatternDefinition';
import { NEW_YORK_BEAUTY_TEMPLATE } from './template';
import { NEW_YORK_BEAUTY_PROMPT } from './prompt';

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
   * New York Beauty (Corner Fan) color assignments:
   *
   * fabricColors[0] = Background
   * fabricColors[1] = Fan Base (curved band / wedge field)
   * fabricColors[2] = Fan Wedges (repeating wedge slices)
   * fabricColors[3] = Corner Quarter-Circle (anchor)
   * fabricColors[4] = Alternate Fan Wedges (optional)
   * fabricColors[5] = Alternate Fan Base (optional)
   * fabricColors[6] = Wedge Accent (optional)
   * fabricColors[7] = Extra Contrast (optional)
   *
   * Notes:
   * - We keep colors consistent (no per-block randomization) for alignment realism.
   * - If fewer fabrics are supplied, we fall back in a predictable way.
   *
   * Returns (always): [
   *  background,
   *  fanBase,
   *  fanWedges,
   *  corner,
   *  altFanWedges,
   *  altFanBase,
   *  wedgeAccent,
   *  extraContrast
   * ]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];

    const fanBase = fabricColors[1] || background;
    const fanWedges = fabricColors[2] || fanBase;

    const corner = fabricColors[3] || fanBase;

    const altFanWedges = fabricColors[4] || fanWedges;
    const altFanBase = fabricColors[5] || fanBase;

    const wedgeAccent = fabricColors[6] || altFanWedges;
    const extraContrast = fabricColors[7] || fanWedges;

    return [
      background,
      fanBase,
      fanWedges,
      corner,
      altFanWedges,
      altFanBase,
      wedgeAccent,
      extraContrast,
    ];
  },
};

export default NewYorkBeauty;
