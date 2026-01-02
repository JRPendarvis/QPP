import { PatternDefinition } from '../../../types/PatternDefinition';
import { BOW_TIE_TEMPLATE } from './template';
import { BOW_TIE_PROMPT } from './prompt';

const BowTie: PatternDefinition = {
  id: 'bow-tie',
  name: 'Bow Tie',
  template: BOW_TIE_TEMPLATE,
  prompt: BOW_TIE_PROMPT,

  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: true,
  rotationStrategy: 'alternate-180',

  /**
   * Traditional Bow Tie fabric roles:
   * - 2 fabrics: Background + Tie (triangles use Tie)
   * - 3 fabrics: Background + Tie + Accent (triangles use Accent)
   *
   * Template contract:
   * - COLOR1 = Background squares
   * - COLOR2 = Tie squares
   * - COLOR3 = Inner-corner triangles (Tie for 2 fabrics; Accent for 3 fabrics)
   *
   * Returns colors in this order: [COLOR1, COLOR2, COLOR3]
   */
getColors: (
  fabricColors: string[],
  opts: { blockIndex?: number; row?: number; col?: number } = {}
): string[] => {
  const background = fabricColors[0];  
  const tieEnds = fabricColors[1] || background;  
  const tieKnot = fabricColors[2] || tieEnds;  // No 3rd fabric, so = Blue
  
  return [background, tieEnds, tieKnot];
  // Returns: [White, Blue, Blue]
},
};

export default BowTie;
