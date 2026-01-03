import { PatternDefinition } from '../../../types/PatternDefinition';
import { BOW_TIE_TEMPLATE } from './template';
import { BOW_TIE_PROMPT } from './prompt';

const BowTie: PatternDefinition = {
  id: 'bow-tie',
  name: 'Bow Tie',
  template: BOW_TIE_TEMPLATE,
  prompt: BOW_TIE_PROMPT,

  minFabrics: 2,
  maxFabrics: 8,
  allowRotation: true,
  rotationStrategy: 'random',

  /**
   * Bow Tie fabric roles:
   * - COLOR1 = Background squares
   * - COLOR2 = Bow / tie squares (3.5" squares)
   * - COLOR3 = Inner-corner triangles (knot) (from 2.5" square / corner patches)
   *
   * Fabric behavior:
   * - 2 fabrics:
   *   Background = C1
   *   Bow = C2
   *   Knot = C2
   *
   * - 3 fabrics (your requirement):
   *   Background = C1
   *   Bow alternates:  even parity -> C2, odd parity -> C3
   *   Knot alternates: even parity -> C3, odd parity -> C2 (opposite of bow)
   *
   * - 4–8 fabrics:
   *   Background = C1
   *   Bow/Knot rotate through the remaining fabrics for a scrappy look.
   *
   * Returns colors in this order: [COLOR1, COLOR2, COLOR3]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const blockIndex = opts.blockIndex ?? 0;

    const row = opts.row ?? 0;
    const col = opts.col ?? blockIndex;

    const parity = (row + col) % 2; // 0 even, 1 odd

    // Safety
    if (fabricColors.length < 2) {
      return [background, background, background];
    }

    // 2 fabrics
    if (fabricColors.length === 2) {
      const tie = fabricColors[1];
      return [background, tie, tie];
    }

    // 3 fabrics (exact alternation + swapped knot)
    if (fabricColors.length === 3) {
      const c2 = fabricColors[1];
      const c3 = fabricColors[2];

      const bow = parity === 0 ? c2 : c3;
      const knot = parity === 0 ? c3 : c2;

      return [background, bow, knot];
    }

    // 4–8 fabrics: scrappy rotation through fabrics 1+
    const pool = fabricColors.slice(1); // excludes background
    const bow = pool[blockIndex % pool.length] ?? background;
    const knot = pool[(blockIndex + 1) % pool.length] ?? bow;

    return [background, bow, knot];
  },
};

export default BowTie;
