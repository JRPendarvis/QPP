import { PatternPrompt } from '../types';

export const FLYING_GEESE_PROMPT: PatternPrompt = {
  patternName: 'Flying Geese',
  recommendedFabricCount: 2,
  
  characteristics: `Flying Geese is a classic directional pattern of stacked triangular units:
- Each "goose" is a large triangle pointing upward
- Two smaller "sky" triangles flank each goose on either side
- Geese stack vertically, all pointing the same direction (upward)
- Number of geese per block adjusts based on fabrics provided (1-7 geese)
- Creates strong directional movement when tiled
- Simple two-piece unit construction
- All geese point upward — direction is fixed for the flight effect`,

  fabricRoleGuidance: `Flying Geese fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): Goose triangle — the dominant directional element
- COLOR2 (SKY): Sky triangles — consistent framing on both sides

WITH 3 FABRICS:
- COLOR1 (PRIMARY): Top goose
- COLOR2 (SECONDARY): Bottom goose
- COLOR3 (SKY): All sky triangles — consistent throughout

WITH 4 FABRICS:
- COLOR1-3 (GEESE): Three geese stacked top to bottom
- COLOR4 (SKY): All sky triangles — consistent throughout

WITH 5-8 FABRICS (multiple geese):
- COLOR1 through COLOR(N-1): Each goose is a unique fabric, stacked top to bottom
- Last color (SKY): All sky triangles — consistent throughout
- More fabrics = more geese per block (up to 7 geese with 8 fabrics)

Arrange goose fabrics light-to-dark for a gradient effect, or vary for scrappy charm.

Sky fabric should contrast with all goose fabrics so the points read clearly.`,

  cuttingInstructions: `Flying Geese cutting specifics:
- Traditional flying geese ratio is 2:1 (width to height)
- For each goose: cut one large triangle (or use no-waste method with squares)
- For each sky pair: cut two small triangles (quarter-square size)
- No-waste method: 1 large square + 2 small squares yields 4 flying geese units
- Stitch-and-flip method also works well for accuracy
- For multiple geese: cut goose triangles from each fabric`,

  assemblyNotes: `Assembly tips for Flying Geese:
- Build each goose unit separately (goose triangle + two sky triangles)
- Stack and sew units together in desired order (top to bottom)
- Press seams toward the goose (darker triangle) or open for less bulk
- Ensure all geese point upward before joining
- Trim dog ears to reduce bulk
- For multi-goose blocks: plan goose color order before assembling`,

  commonMistakes: `Avoid these Flying Geese mistakes:
- Cutting off goose points with seam allowances (use scant 1/4" seams)
- Geese pointing different directions (all must point upward)
- Inconsistent unit sizes (won't stack evenly)
- Low contrast between geese and sky (points disappear)
- Not trimming to exact size before joining units
- Using sky fabric as a goose (breaks the visual consistency)`
};