import { PatternPrompt } from '../types';

export const STRIP_QUILT_PROMPT: PatternPrompt = {
  patternName: 'Strip Quilt',
  recommendedFabricCount: 4,

  characteristics: `Strip Quilt is a simple vertical strip pattern:
- Vertical strips of equal width running the full height of the block
- Number of strips matches number of fabrics provided (2-8)
- Each fabric appears once as a single vertical strip
- When blocks are tiled, creates continuous vertical columns across the quilt
- Can be rotated 90° during layout to create horizontal stripes instead
- One of the fastest and easiest patterns to piece
- Perfect for showcasing fabric collections, creating ombré effects, or bold graphic designs
- Beginner-friendly - teaches strip piecing and straight seams`,

  fabricRoleGuidance: `Strip Quilt fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- BACKGROUND (fabricColors[0]): Left strip
- PRIMARY (fabricColors[1]): Right strip

Creates bold two-tone vertical columns. High contrast creates dramatic stripes.

WITH 3 FABRICS:
- BACKGROUND (fabricColors[0]): Left strip
- PRIMARY (fabricColors[1]): Center strip
- SECONDARY (fabricColors[2]): Right strip

Arrange light-to-dark for gradient effect, or use contrasting values for bold stripes.

WITH 4 FABRICS (recommended):
- BACKGROUND through ACCENT (fabricColors[0-3]): Four equal vertical strips, left to right

Consider arrangements:
- Gradient: Light → Medium → Dark → Darkest
- Symmetrical: Light-Dark-Dark-Light
- Contrasting: Alternate light and dark values

WITH 5-8 FABRICS:
- All fabrics (fabricColors[0-7]): Each fabric gets one strip, arranged left to right
- More fabrics = narrower strips
- Arrange by value for ombré/gradient effect
- Alternate values for bold striped effect

ALL FABRICS ARE TREATED EQUALLY - no background/foreground hierarchy. 
The visual impact comes from the order and value arrangement of the strips.

DESIGN TIP: Arrange fabrics by value (light to dark) for smooth gradient/ombré 
effect, or alternate high-contrast fabrics for bold, graphic stripes. Color 
temperature progression (cool to warm) also creates beautiful effects.`,

  cuttingInstructions: `Strip Quilt cutting specifics:

Strip width formula: Finished block width ÷ number of fabrics + seam allowance
Example: For 12" finished block with 4 fabrics: 12 ÷ 4 = 3" + 0.5" seam = 3.5" strips

Cut vertical strips from each fabric:
- BACKGROUND through ADDITIONAL (fabricColors[0-7]): Cut equal-width strips

CUTTING METHOD:
1. Cut strips the full length needed (block height or quilt height)
2. All strips same width for equal vertical columns
3. Cut straight along grain (selvage to selvage or lengthwise)

For 2 fabrics: Each strip is 50% of width
For 3 fabrics: Each strip is 33.33% of width
For 4 fabrics: Each strip is 25% of width
For 8 fabrics: Each strip is 12.5% of width

EFFICIENCY TIP: This pattern is ideal for using full-width-of-fabric strips. 
Cut strips selvage to selvage, sew together, then crosscut into blocks if making 
smaller blocks rather than a full quilt.`,

  assemblyNotes: `Assembly tips for Strip Quilt:

CONSTRUCTION:
1. **Arrange strips in desired order** (left to right)
2. **Pin strips right sides together** along long edges
3. **Sew strips together** with consistent 1/4" seam allowance
4. **Press seams in one direction** (typically toward darker fabric)
5. Repeat for all strips until complete

ACCURACY TIPS:
- Keep strips aligned at top and bottom edges while sewing
- For very long strips, pin every 6-8 inches to prevent shifting
- Don't stretch strips while sewing (causes wavy seams)
- Press carefully without distorting - long strips can easily stretch
- Use walking foot if available for long straight seams

LAYOUT OPTIONS:
- **Vertical stripes**: Use blocks as constructed
- **Horizontal stripes**: Rotate all blocks 90° during layout
- **Mixed orientation**: Alternate vertical and horizontal for basket weave effect

PRESSING:
- Press all seams in one consistent direction (toward darker fabrics)
- Press from the right side to ensure seams lie flat
- Don't overpress - can stretch the long strips`,

  commonMistakes: `Avoid these Strip Quilt mistakes:
- Unequal strip widths (creates wonky, uneven columns)
- Stretching long strips while sewing (causes waves and rippling)
- Not pinning long seams adequately (strips shift, edges don't align)
- Pressing too hard (stretches and distorts long strips)
- Not pressing seams consistently in one direction (wavy seams, bulk)
- Cutting strips off-grain (causes bias stretch and distortion)
- Forgetting that strip order determines the visual sequence (can't rearrange after sewing)
- Rotating blocks randomly instead of consistently (breaks column continuity across quilt)
- Using all same-value fabrics (stripes blend together, lose definition)`
};