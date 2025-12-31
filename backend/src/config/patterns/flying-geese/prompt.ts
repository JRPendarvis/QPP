import { PatternPrompt } from '../types';

export const FLYING_GEESE_PROMPT: PatternPrompt = {
  patternName: 'Flying Geese',
  recommendedFabricCount: 2,
  
  characteristics: `Flying Geese is a classic directional pattern of triangular units:
- Each "goose" unit is a large triangle pointing upward
- Two smaller "sky" triangles flank each goose on either side
- Traditional block contains 4 flying geese units arranged in a 2x2 grid
- Creates strong directional movement suggesting birds in flight
- Simple three-triangle unit construction (1 goose + 2 sky triangles)
- Can be arranged in rows, columns, or blocks for different effects
- Intermediate skill level - requires accurate piecing for sharp points`,

  fabricRoleGuidance: `Flying Geese fabric assignments (supports 2-6 fabrics):

WITH 2 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): Sky triangles - consistent framing throughout
- PRIMARY (fabricColors[1]): All goose triangles - the directional element

Classic high-contrast approach creates the clearest flight pattern.

WITH 3 FABRICS (scrappy geese):
- BACKGROUND (fabricColors[0]): Sky triangles - consistent throughout all units
- PRIMARY (fabricColors[1]): First goose color
- SECONDARY (fabricColors[2]): Second goose color (alternates with Primary)

In a 2x2 block of 4 geese, colors alternate for variety.

WITH 4 FABRICS:
- BACKGROUND (fabricColors[0]): Sky triangles - consistent throughout
- PRIMARY (fabricColors[1]): First goose
- SECONDARY (fabricColors[2]): Second goose
- ACCENT (fabricColors[3]): Third goose

Creates more scrappy variety across the block.

WITH 5-6 FABRICS (maximum scrappy):
- BACKGROUND (fabricColors[0]): Sky triangles - always consistent
- PRIMARY through ADDITIONAL (fabricColors[1-5]): Goose colors rotate across blocks

Each of the 4 geese in a block can be different colors, with colors rotating 
block-to-block for an overall scrappy effect.

DESIGN TIP: Sky fabric should contrast strongly with ALL goose fabrics so the 
triangular points read clearly. For scrappy versions, use goose fabrics with 
similar values so they read as a unified flock rather than competing elements.

CRITICAL: The Background (sky) must remain consistent throughout all blocks and 
units. Only the goose colors vary.`,

  cuttingInstructions: `Flying Geese cutting specifics:

BACKGROUND fabric (fabricColors[0]):
- Cut small triangles for sky (2 per flying geese unit)
- Each block (4 geese) needs 8 sky triangles total
- Sky triangles are quarter the size of goose triangles

PRIMARY, SECONDARY, ACCENT, CONTRAST, ADDITIONAL fabrics (fabricColors[1-5]):
- Cut large triangles for geese (1 per unit)
- Traditional flying geese ratio is 2:1 (width to height)
- For a finished 4" x 2" unit: cut 4.5" x 2.5" rectangles

CUTTING METHODS:
1. **Traditional method**: Cut triangles directly
2. **No-waste method**: 1 large square (goose) + 2 small squares (sky) = 4 units
3. **Stitch-and-flip method**: Use rectangles and squares, trim after sewing

The no-waste and stitch-and-flip methods are recommended for accuracy and 
to preserve sharp goose points.

For scrappy quilts: Cut goose triangles from multiple fabrics, keeping sky fabric consistent.`,

  assemblyNotes: `Assembly tips for Flying Geese:

UNIT CONSTRUCTION:
1. Build each flying geese unit individually (1 goose + 2 sky triangles)
2. Sew sky triangles to opposite sides of goose triangle
3. Press seams toward goose (darker fabric) to reduce bulk
4. Trim dog ears for clean edges
5. Square up each unit to exact size before joining

BLOCK ASSEMBLY (2x2 grid of 4 geese):
1. Lay out 4 flying geese units in 2x2 arrangement
2. All geese should point upward (in same direction)
3. For scrappy blocks: arrange goose colors for pleasing variety
4. Sew units into 2 rows of 2 units each
5. Join rows together, matching seam intersections carefully

PRESSING:
- Press seams consistently (toward geese or open)
- Don't overpress - can distort bias edges
- Use starch to stabilize small pieces

ACCURACY TIPS:
- Use scant 1/4" seam allowance to preserve sharp points
- Don't cut off goose points with seams (test on scrap first)
- All units must be identical size for proper alignment
- Pin at seam intersections when joining units

For scrappy quilts: Plan goose color rotation before assembling blocks for 
balanced color distribution across the quilt.`,

  commonMistakes: `Avoid these Flying Geese mistakes:
- Cutting off goose points with seam allowances (use scant 1/4" seams and test first)
- Geese pointing different directions within a block (all must point same way)
- Inconsistent unit sizes (causes alignment problems when joining)
- Low contrast between geese and sky (points disappear, pattern is lost)
- Not trimming dog ears (creates bulk at intersections)
- Not squaring up units before assembly (small errors multiply)
- Stretching bias edges (handle carefully, use starch)
- In scrappy versions: using sky fabric as a goose color (breaks visual consistency)
- Using directional prints for geese that don't read well when triangulated
- Pressing too hard (distorts the bias edges of triangles)`
};