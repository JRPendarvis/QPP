import { PatternPrompt } from '../../../types/PatternPrompt';

export const SIMPLE_SQUARES_PROMPT: PatternPrompt = {
  patternName: 'Simple Squares',
  recommendedFabricCount: 4,
  
  characteristics: `Simple Squares is the most basic and versatile quilt pattern:
- A grid of equal-sized squares - no piecing within blocks
- Each block is a single solid square of fabric
- No triangles, no complex piecing - just squares sewn together
- Perfect for showcasing fabric collections, novelty prints, or large-scale designs
- When tiled, creates a classic scrappy patchwork look
- Ideal beginner pattern - teaches basic sewing and layout planning
- Visual interest comes from fabric selection and placement, not construction complexity`,

  fabricRoleGuidance: `Simple Squares fabric assignments (supports 1-8 fabrics):

WITH 1 FABRIC:
- Single solid color quilt (or tone-on-tone for subtle texture)

WITH 2 FABRICS:
- BACKGROUND (fabricColors[0]): Half of the squares
- PRIMARY (fabricColors[1]): Remaining squares
- Arranged to avoid same-color adjacency (checkerboard effect)

WITH 3-4 FABRICS (recommended):
- BACKGROUND through ACCENT: Distributed evenly across the grid
- Each fabric rotates block-to-block for balanced distribution
- Arranged to avoid same-color adjacency where possible
- Creates pleasing scrappy patchwork effect

WITH 5-8 FABRICS (maximum variety):
- All fabrics distributed across the grid
- Blocks rotate through all available colors
- Each fabric appears multiple times for balance
- Arranged to maximize variety and avoid same-color adjacency

ALL FABRICS ARE TREATED EQUALLY - no background/foreground hierarchy. 
High contrast between fabrics creates a bold, graphic patchwork look. 
Low contrast creates subtle texture and movement.

DESIGN TIP: Large-scale prints, novelty prints, and directional fabrics work 
beautifully since each square showcases the fabric uninterrupted. Consider 
"fussy cutting" to center specific motifs in each square.`,

  cuttingInstructions: `Simple Squares cutting specifics:

Square size formula: Desired finished size + 1/2" seam allowance
Example: For 6" finished squares, cut 6.5" squares

Cut equal-sized squares from each fabric:
- BACKGROUND through ADDITIONAL (fabricColors[0-7]): Cut equal quantities

CUTTING METHOD - STRIP CUTTING (recommended):
1. Cut strips equal to square size (e.g., 6.5" strips)
2. Cross-cut strips into squares
3. Much faster than cutting individual squares

For scrappy quilts: Cut roughly equal numbers from each fabric for balanced 
distribution. The getColors() rotation ensures even placement across the quilt.

PLANNING:
- Determine total squares needed (rows × columns)
- Divide by number of fabrics for quantities per fabric
- Cut a few extra for flexibility during layout`,

  assemblyNotes: `Assembly tips for Simple Squares:

LAYOUT PLANNING:
1. **Lay out ALL squares** before sewing (use design wall or floor)
2. **Rotate through fabrics** - blocks cycle through available colors
3. **Avoid same-color adjacency** where possible
4. **Check value distribution** - step back and view from distance
5. **Take photo** of final layout before sewing

CONSTRUCTION:
1. **Sew squares into rows**
2. **Press seams in alternating directions** row by row:
   - Row 1: press seams right
   - Row 2: press seams left
   - Row 3: press seams right
   - Continue alternating
3. **Pin rows together** at seam intersections, nesting seams
4. **Join rows** carefully - all seam intersections should align
5. **Press final seams** consistently (typically downward)

ACCURACY TIPS:
- All squares must be EXACTLY the same size
- Consistent scant 1/4" seam allowance throughout
- Alternating seam directions ensures seams nest perfectly
- Pin at every seam intersection when joining rows

For scrappy layouts: The rotation through fabrics happens automatically via 
blockIndex, but you can still rearrange squares during layout for aesthetic preferences.`,

  commonMistakes: `Avoid these Simple Squares mistakes:
- Sewing without planning layout first (creates chaotic or unbalanced distribution)
- Not cutting all squares to exact same size (misaligned intersections)
- Placing same fabrics adjacent unintentionally (unless creating intentional blocks)
- Inconsistent seam allowances (causes wavy rows and misaligned intersections)
- Not pressing seams in alternating directions (seams won't nest, creates bulk)
- Pressing all seams same direction (bulk at intersections, seams don't nest)
- In scrappy versions: clustering similar colors or values in one area (loses visual balance)
- Not stepping back to check overall composition before sewing (hard to fix later)
- Using all same-value fabrics (quilt looks flat, lacks visual interest)`
};