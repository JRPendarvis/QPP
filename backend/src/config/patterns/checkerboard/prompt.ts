import { PatternPrompt } from '../../../types/PatternPrompt';

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
- Requires EXACTLY 2 fabrics`,

  fabricRoleGuidance: `Checkerboard uses EXACTLY 2 fabrics:

BACKGROUND (fabricColors[0]): Even-positioned squares
- Appears in top-left corner (row 0, col 0)
- Fills all positions where (row + col) is even
- Creates the "light" squares in traditional checkerboards

PRIMARY (fabricColors[1]): Odd-positioned squares
- Appears in positions where (row + col) is odd
- Alternates with background to create the checker pattern
- Creates the "dark" squares in traditional checkerboards

CONTRAST RECOMMENDATIONS:
- Choose fabrics with strong value contrast (one light, one dark)
- High contrast creates the most striking checkerboard effect
- Low contrast will make the pattern disappear
- Consider tone-on-tone prints for visual texture while maintaining the grid`,

  cuttingInstructions: `Checkerboard cutting is straightforward:

BACKGROUND fabric (fabricColors[0]):
- Cut half of total squares needed
- All squares are identical size
- For a 6×8 layout: cut 24 squares

PRIMARY fabric (fabricColors[1]):
- Cut remaining half of total squares
- All squares are identical size  
- For a 6×8 layout: cut 24 squares

Add seam allowance (typically 1/4" on each side).
Consider strip piecing for efficiency: sew strips of alternating colors, then cross-cut into rows.`,

  assemblyNotes: `Checkerboard assembly tips:
- Lay out ALL squares before sewing to verify alternating pattern
- First row starts with BACKGROUND (fabricColors[0])
- Second row starts with PRIMARY (fabricColors[1])
- Continue alternating the starting color for each row
- Sew squares into rows first
- Press seams in alternating directions row by row (enables nesting)
- Row 1: press seams left; Row 2: press seams right; etc.
- Join rows, matching seam intersections
- The alternating press directions help seams nest perfectly for crisp intersections`,

  commonMistakes: `Avoid these Checkerboard mistakes:
- Choosing fabrics with insufficient value contrast (pattern disappears)
- Not alternating the starting color for each row (creates stripes instead of checkerboard)
- Not alternating press directions (seams don't nest, intersections are bulky)
- Miscounting squares (ending up with two same-color squares adjacent)
- Using prints that are too busy (obscures the geometric grid effect)`
};