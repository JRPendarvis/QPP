import { PatternPrompt } from '../types';

export const FOUR_PATCH_PROMPT: PatternPrompt = {
  patternName: 'Four Patch',
  recommendedFabricCount: 4,
  
  characteristics: `Four Patch is a fundamental building-block pattern based on 2x2 units:
- Each four-patch unit is a 2x2 grid with matching colors on opposite diagonals
- The diagonal pairing creates visual continuity within each unit
- Multiple four-patch units combine to showcase more fabrics (3-8 colors)
- With 2 colors: identical to Checkerboard
- With 4+ colors: multiple four-patch units tile together, each using a paired set
- Foundation for many complex patterns (Double Four Patch, Sixteen Patch, etc.)`,

  fabricRoleGuidance: `For Four Patch specifically:
- Colors are used in pairs — each pair shares a four-patch unit
- 2 colors: COLOR1/COLOR2 on opposite diagonals
- 4 colors: Two pairs (COLOR1/COLOR2 and COLOR3/COLOR4)
- 6 colors: Three pairs
- 8 colors: Four unique pairs, one per quadrant
- Contrast within each pair defines the checkerboard effect; contrast between pairs adds variety`,

  cuttingInstructions: `Four Patch cutting specifics:
- Cut equal-sized squares from each fabric
- Four squares make one four-patch unit (two of each paired color)
- Strip piecing is efficient: sew strips together, crosscut, then join segments
- All squares within a unit must be identical size`,

  assemblyNotes: `Assembly tips for Four Patch:
- Sew paired squares into two-patches first
- Join two-patches with seams nesting (press in opposite directions)
- For multi-unit layouts, arrange units before sewing to balance color placement
- Press final seams consistently for flat intersections`,

  commonMistakes: `Avoid these Four Patch mistakes:
- Placing same colors adjacent instead of diagonal within a unit
- Inconsistent square sizes (intersections won't align)
- Not planning color pair placement across multiple units
- Pressing all seams the same direction (seams won't nest)`
};