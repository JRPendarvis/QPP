import { PatternPrompt } from '../types';

export const CHECKERBOARD_PROMPT: PatternPrompt = {
  patternName: 'Checkerboard',
  recommendedFabricCount: 2,
  
  characteristics: `A Checkerboard is the simplest alternating pattern:
- A 2x2 four-patch grid
- Two colors alternate in a diagonal arrangement
- COLOR1 on one diagonal (top-left and bottom-right)
- COLOR2 on the opposite diagonal (top-right and bottom-left)
- When tiled, creates the classic checkerboard effect
- No triangles, no center overlay — just four equal squares`,

  fabricRoleGuidance: `For Checkerboard specifically:
- COLOR1 (PRIMARY): One diagonal pair of squares
- COLOR2 (SECONDARY): The opposite diagonal pair
- High contrast between the two colors creates the strongest visual impact
- Can also use low contrast for a subtle, textured look`,

  cuttingInstructions: `Checkerboard cutting specifics:
- Cut equal-sized squares in two fabrics
- Two squares of each color per block
- All four squares are identical in size (50% of block width)`,

  assemblyNotes: `Assembly tips for Checkerboard:
- Arrange squares so same colors are on opposite diagonals
- Sew into two rows of two, then join rows
- Press seams toward the darker fabric
- Nest seams when joining rows for precise intersections`,

  commonMistakes: `Avoid these Checkerboard mistakes:
- Placing same colors adjacent instead of diagonal (makes stripes, not checks)
- Inconsistent seam allowances (causes misaligned intersections when tiled)
- Using fabrics with too similar values (pattern disappears)`
};