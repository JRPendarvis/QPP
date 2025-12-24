import { PatternPrompt } from '../types';

export const CHECKERBOARD_PROMPT: PatternPrompt = {
  patternName: 'Checkerboard',
  recommendedFabricCount: 2,
  
  characteristics: `Checkerboard is the classic two-color alternating grid pattern:
- Alternating squares of two contrasting colors
- Pattern emerges at the QUILT level, not block level
- Each block is a single solid color
- Adjacent blocks are always different colors
- Creates strong visual rhythm through repetition
- Maximum impact comes from high contrast between the two colors
- Uses EXACTLY 2 fabrics - no more, no less`,

  fabricRoleGuidance: `Checkerboard uses EXACTLY 2 fabrics:

IF MORE THAN 2 FABRICS ARE PROVIDED:
- Select the 2 fabrics with the BEST VALUE CONTRAST
- Ideal pairing: one LIGHT + one DARK fabric
- Return ONLY those 2 colors in the fabricColors array
- Explain in the description which 2 fabrics were selected and why

COLOR ASSIGNMENT ORDER:
- fabricColors[0] = appears in top-left corner and all "even" positions
- fabricColors[1] = appears in all "odd" positions
- Your description MUST reference the colors in this same order

WITH 2 FABRICS:
- COLOR1 (fabricColors[0]): Even squares - top-left corner, diagonal positions
- COLOR2 (fabricColors[1]): Odd squares - alternating with COLOR1

IMPORTANT: The fabricColors array must contain EXACTLY 2 hex colors.
Any additional fabrics provided should be acknowledged but not included.`,

  cuttingInstructions: `Checkerboard cutting is straightforward:
- All squares are identical size
- Calculate total squares needed (rows × columns)
- Half will be Color A, half will be Color B
- For a 6×8 layout: 24 squares of each color
- Add seam allowance (typically 1/4" on each side)
- Consider strip piecing for efficiency: sew strips, then cross-cut`,

  assemblyNotes: `Checkerboard assembly tips:
- Lay out ALL squares before sewing to verify alternating pattern
- Sew squares into rows first
- Press seams in alternating directions row by row (enables nesting)
- Row 1: press seams left; Row 2: press seams right; etc.
- Join rows, matching seam intersections
- The alternating press directions help seams nest perfectly`,

  commonMistakes: `Avoid these Checkerboard mistakes:
- Including more than 2 colors in fabricColors array
- Describing colors in different order than fabricColors array
- Choosing fabrics with insufficient contrast (pattern disappears)
- Not alternating press directions (seams don't nest, intersections bulky)
- Miscounting squares (ending up with two same-color squares adjacent)`
};