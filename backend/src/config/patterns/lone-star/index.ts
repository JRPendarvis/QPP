// src/patterns/blocks/lone-star/index.ts

import { PatternDefinition } from '../../../types/PatternDefinition';
import { LONE_STAR_TEMPLATE } from './template';
import { LONE_STAR_PROMPT } from './prompt';

const LoneStar: PatternDefinition = {
  id: 'lone-star',
  name: 'Lone Star',
  template: LONE_STAR_TEMPLATE,
  prompt: LONE_STAR_PROMPT,
  minFabrics: 4,
  maxFabrics: 8,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Center Diamond',
    'Ring 1 (Cardinal)',
    'Ring 1 (Diagonal)',
    'Ring 2 (Cardinal)',
    'Ring 2 (Diagonal)',
    'Ring 3 (Cardinal)',
    'Ring 3 (Diagonal)',
    'Background',
  ],

  /**
   * Lone Star (Star of Bethlehem) - TRUE diamond star with 8 points
   *
   * IMPORTANT: This pattern is NOT a block-grid star (no HST grid). It is a diamond/rhombus star.
   * Rotation must remain NONE; symmetry is structural.
   *
   * TEMPLATE COLOR SLOT MAPPING (matches template.ts):
   * - COLOR1 = Center diamond
   * - COLOR2 = Ring 1 (cardinal directions: E, N, W, S)
   * - COLOR3 = Ring 1 (diagonal directions: NE, NW, SW, SE)
   * - COLOR4 = Ring 2 (cardinal directions)
   * - COLOR5 = Ring 2 (diagonal directions)
   * - COLOR6 = Ring 3 (cardinal directions)
   * - COLOR7 = Ring 3 (diagonal directions)
   * - COLOR8 = Background / setting area (negative space)
   *
   * FABRIC INPUT GUIDANCE (what the quilter picks in the UI):
   * fabricColors[0] = Background / setting area
   * fabricColors[1] = Center (or inner focal)
   * fabricColors[2] = Ring 1 (cardinal)
   * fabricColors[3] = Ring 1 (diagonal)
   * fabricColors[4] = Ring 2 (cardinal) (optional)
   * fabricColors[5] = Ring 2 (diagonal) (optional)
   * fabricColors[6] = Ring 3 (cardinal) (optional)
   * fabricColors[7] = Ring 3 (diagonal) (optional)
   *
   * Returns array MUST match template order:
   * [COLOR1, COLOR2, COLOR3, COLOR4, COLOR5, COLOR6, COLOR7, COLOR8]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    // UI selection order
    const background = fabricColors[0] ?? '#ffffff';

    // If user provides only 4 fabrics, we still produce a valid gradient by cascading.
    const center = fabricColors[1] ?? background;

    const r1Cardinal = fabricColors[2] ?? center;
    const r1Diagonal = fabricColors[3] ?? r1Cardinal;

    const r2Cardinal = fabricColors[4] ?? r1Diagonal;
    const r2Diagonal = fabricColors[5] ?? r2Cardinal;

    const r3Cardinal = fabricColors[6] ?? r2Diagonal;
    const r3Diagonal = fabricColors[7] ?? r3Cardinal;

    // Template order: COLOR1..COLOR8
    return [
      center,      // COLOR1
      r1Cardinal,  // COLOR2
      r1Diagonal,  // COLOR3
      r2Cardinal,  // COLOR4
      r2Diagonal,  // COLOR5
      r3Cardinal,  // COLOR6
      r3Diagonal,  // COLOR7
      background   // COLOR8
    ];
  }
};

export default LoneStar;
