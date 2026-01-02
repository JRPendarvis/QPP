import { PatternPrompt } from '../../../types/PatternPrompt';

export const GRANDMOTHERS_FLOWER_GARDEN_PROMPT: PatternPrompt = {
  patternName: "Grandmother's Flower Garden",
  recommendedFabricCount: 4,
  
  characteristics: `Grandmother's Flower Garden is a classic hexagon-based pattern forming flower clusters:
- Each flower has one center hexagon surrounded by rings of petal hexagons
- All hexagons are identical in size and shape (equilateral sides and angles)
- Hexagons share edges to form interlocking flower rosettes
- Flowers are separated by "garden path" background hexagons
- One of the most beloved vintage quilt patterns, often passed down through generations
- Traditionally made with English Paper Piecing (EPP) technique
- Can be arranged in rows, honeycomb patterns, or as a medallion
- Often features scrappy petals for a charming, collected-over-time look`,

  fabricRoleGuidance: `Grandmother's Flower Garden fabric assignments (supports 3-5 fabrics):

WITH 3 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): Garden path hexagons between flowers
- PRIMARY (fabricColors[1]): Center hexagon (the flower's heart)
- SECONDARY (fabricColors[2]): All 6 petal hexagons surrounding center

Classic simple flower: one color for petals, one for center, background as negative space.

WITH 4 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Garden path between flowers
- PRIMARY (fabricColors[1]): Center hexagon (flower's focal point)
- SECONDARY (fabricColors[2]): Inner ring petals (typically 6 hexagons in first ring)
- ACCENT (fabricColors[3]): Outer ring petals (for larger flowers with multiple rings)

Creates more complex flowers with multiple petal rings radiating from the center.

WITH 5 FABRICS (maximum variety):
- BACKGROUND (fabricColors[0]): Garden path between flowers
- PRIMARY (fabricColors[1]): Primary flower centers
- SECONDARY (fabricColors[2]): Inner petal ring
- ACCENT (fabricColors[3]): Outer petal ring
- CONTRAST (fabricColors[4]): Alternate flower centers (creates variety across the quilt)

Using two different center colors (Primary and Contrast alternating) adds visual interest 
and prevents the quilt from feeling too repetitive.

DESIGN TIP: Choose a calm, neutral Background fabric (white, cream, or soft print) so the 
flowers stand out. Use high contrast between center and petals. For multi-ring flowers, 
graduate petal colors from light to dark or use complementary colors for drama.`,

  cuttingInstructions: `Grandmother's Flower Garden cutting specifics:

Cut all hexagons to the same size using templates or die cutters:
- BACKGROUND fabric (fabricColors[0]): Many hexagons for pathways
- PRIMARY fabric (fabricColors[1]): 1 hexagon per flower (center)
- SECONDARY fabric (fabricColors[2]): 6 hexagons per flower (inner petal ring)
- ACCENT fabric (fabricColors[3]) - if using: 12 hexagons per flower (outer petal ring)
- CONTRAST fabric (fabricColors[4]) - if using: 1 hexagon for alternate flower centers

CUTTING METHODS:
1. **Acrylic templates**: Trace and cut carefully with scissors or rotary cutter
2. **Die cutters** (Accuquilt, Sizzix): Most consistent and efficient
3. **Paper templates for EPP**: Cut fabric slightly larger than paper (1/4" on all sides)

Standard hexagon sizes: 1", 1.5", or 2" per side (finished)
For EPP, cut fabric hexagons 1/4" to 3/8" larger than paper templates on all sides.

One simple flower (3 fabrics) = 7 hexagons total (1 center + 6 petals)
One complex flower (4 fabrics) = 19 hexagons total (1 center + 6 inner + 12 outer)`,

  assemblyNotes: `Assembly tips for Grandmother's Flower Garden:

ENGLISH PAPER PIECING (EPP - traditional method):
1. Cut paper templates to exact finished hexagon size
2. Baste fabric hexagons over paper templates (fold seam allowance over edges)
3. Whipstitch hexagons together edge-to-edge with tiny, tight stitches
4. Start with flower center, attach first ring of 6 petals around it
5. For larger flowers: add second ring of 12 petals around first ring
6. Build complete flowers before joining them with background pathway hexagons
7. Remove papers after surrounding hexagons are attached (maintains shape during construction)
8. Press gently after removing papers

CONSTRUCTION ORDER:
- Build each individual flower rosette first
- Lay out all flowers to plan arrangement
- Add background pathway hexagons to connect flowers
- Join flowers in rows or in a honeycomb pattern
- Work from center outward for medallion-style layouts

MACHINE PIECING (advanced alternative):
- Requires Y-seams (3 pieces meeting at one point)
- Much more challenging than EPP
- Use precise 1/4" seam allowances
- Pin carefully at each junction
- Not recommended for beginners

ACCURACY TIPS:
- All hexagons must be EXACTLY the same size (even 1/16" off causes gaps)
- Whipstitch tension should be firm but not tight (prevents puckering)
- Align edges precisely before stitching (gaps are very visible with hexagons)
- Use thread color matching the lighter fabric at each seam
- Take your time - EPP is a slow, meditative process`,

  commonMistakes: `Avoid these Grandmother's Flower Garden mistakes:
- Inconsistent hexagon sizes (flowers won't nest together, creates gaps and puckers)
- Stretching bias edges when basting or stitching (hexagons distort from true shape)
- Pulling whipstitches too tight (creates puckering and dimples at seams)
- Not aligning hexagon edges precisely before stitching (visible gaps in finished quilt)
- Removing paper templates too early (hexagons lose their shape and distort)
- Using directional prints for hexagons (pattern orientation gets chaotic)
- Insufficient contrast between petals and background (flowers blend into pathways)
- Not pressing after removing papers (hexagons don't lie flat)
- Attempting machine piecing as a beginner (Y-seams are very challenging)
- Skipping the layout step (creates unbalanced color distribution across quilt)`
};