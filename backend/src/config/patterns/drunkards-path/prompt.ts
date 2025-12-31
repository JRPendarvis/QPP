import { PatternPrompt } from '../types';

export const DRUNKARDS_PATH_PROMPT: PatternPrompt = {
  patternName: "Drunkard's Path",
  recommendedFabricCount: 2,
  
  characteristics: `Drunkard's Path is a classic curved two-piece unit that creates flowing designs:
- Each block contains one quarter-circle "pie slice" and one background piece with concave curve
- Simple two-piece construction, but curves require careful sewing
- When multiple blocks are arranged and rotated, creates meandering curved paths across the quilt
- Block rotation creates many secondary patterns: Love Ring, Vine of Friendship, Falling Timbers, Wonder of the World
- One of the most versatile and beloved curved-piecing patterns
- Traditional version uses just 2 fabrics for maximum contrast
- Intermediate skill level - good introduction to curved piecing`,

  fabricRoleGuidance: `Drunkard's Path fabric assignments (supports 2-4 fabrics):

WITH 2 FABRICS (traditional - recommended):
- BACKGROUND (fabricColors[0]): Background pieces with concave curves
- PRIMARY (fabricColors[1]): All quarter-circle arcs - forms the curved path

The classic high-contrast approach creates the clearest winding path effect.

WITH 3 FABRICS (scrappy paths):
- BACKGROUND (fabricColors[0]): Consistent background across all blocks
- PRIMARY (fabricColors[1]): First quarter-circle color
- SECONDARY (fabricColors[2]): Second quarter-circle color (rotates with Primary)

Blocks alternate between Primary and Secondary paths for subtle variety.

WITH 4 FABRICS (maximum scrappy):
- BACKGROUND (fabricColors[0]): Consistent background across all blocks
- PRIMARY (fabricColors[1]): First path color
- SECONDARY (fabricColors[2]): Second path color
- ACCENT (fabricColors[3]): Third path color

Path colors rotate across blocks (Primary → Secondary → Accent → Primary...) 
creating a scrappy look while maintaining the overall winding path design.

DESIGN TIP: High contrast between Background and path colors emphasizes the wandering effect.
For scrappy versions, use path colors with similar values so they read as a unified meandering line.

CRITICAL: Block rotation at layout time dramatically changes the overall design. 
Plan your layout carefully to create the desired secondary pattern.`,

  cuttingInstructions: `Drunkard's Path cutting specifics:

BACKGROUND fabric (fabricColors[0]):
- Cut squares with concave (inward) curve removed
- Each piece is approximately 3/4 of a square with one curved edge

PRIMARY fabric (fabricColors[1]):
- Cut quarter-circle pieces (pie slice shape)
- Each piece has one curved (convex/outward) edge

SECONDARY/ACCENT fabrics (fabricColors[2-3]) - if using:
- Cut additional quarter-circle pieces
- Same dimensions as Primary quarter-circles

CUTTING TECHNIQUES:
- Use acrylic templates or specialty rulers (highly recommended)
- Accuquilt dies make cutting accurate curves easier
- Add 1/4" seam allowance to both convex and concave edges
- Mark center point on both pieces before sewing
- Cut on straight grain when possible to minimize bias stretch

For scrappy quilts: Cut quarter-circles from multiple fabrics, but keep background consistent.`,

  assemblyNotes: `Assembly tips for Drunkard's Path:
- This is an INTERMEDIATE pattern requiring curved piecing skills

CURVED PIECING TECHNIQUE:
1. Mark the center point on both the quarter-circle and background piece
2. Pin at the center first, matching center marks
3. Pin at both ends of the curve
4. Add 2-3 pins between center and ends, easing fullness evenly
5. Sew with the concave (background) piece on TOP for better control
6. Sew slowly, removing pins as you approach them
7. Check frequently that fabric isn't puckering

PRESSING:
- Press seam toward the quarter-circle (convex piece)
- Press following the curve - don't flatten it
- Consider finger-pressing first before using iron

LAYOUT:
- Lay out ALL blocks before sewing them together
- Rotate blocks to create your desired secondary pattern
- Common arrangements: circles, waves, diagonal paths, or random meandering
- For scrappy versions: distribute path colors evenly across the layout

ACCURACY TIP: All blocks must be identical size for proper alignment. 
Measure each block and trim if needed before assembly.`,

  commonMistakes: `Avoid these Drunkard's Path mistakes:
- Stretching bias edges on curves (causes puckering and distortion)
- Not pinning enough along the curve (creates pleats and tucks)
- Sewing with convex piece on top (harder to control the curve)
- Pressing curves completely flat (loses the dimensional curve)
- Random block rotation without planning (loses the intended path effect)
- Inconsistent seam allowances (blocks won't match in size)
- Clipping the convex seam allowance (only clip concave side if needed)
- In scrappy versions: placing similar colors adjacent (reduces visual flow)
- Not testing technique on scrap fabric first (wastes good fabric)
- Rushing the curved seam (take your time for best results)`
};