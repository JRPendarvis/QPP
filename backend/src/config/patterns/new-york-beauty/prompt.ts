import { PatternPrompt } from '../types';

export const NEW_YORK_BEAUTY_PROMPT: PatternPrompt = {
  patternName: 'New York Beauty',
  recommendedFabricCount: 4,
  
  characteristics: `New York Beauty is a dramatic curved pattern with radiating spikes:
- Quarter-circle design radiating from one corner of the block
- Curved arc band contains foundation paper-pieced spikes pointing outward
- Spikes radiate from the corner like a sunrise, crown, or fan
- Inner quarter-circle anchors the design at the corner (the "sun")
- Background fills the remaining block area
- All curved piecing - requires advanced skills
- Also known as: Rocky Mountain Road, Crown of Thorns
- Creates stunning secondary patterns when blocks are rotated during layout
- Advanced to expert skill level - combines foundation piecing with curved seams`,

  fabricRoleGuidance: `New York Beauty fabric assignments (supports 3-5 fabrics):

WITH 3 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): Main block area (outer background square)
- PRIMARY (fabricColors[1]): Arc band (background behind spikes)
- SECONDARY (fabricColors[2]): All spikes (radiating points) + corner quarter-circle

Classic approach with maximum clarity and drama.

WITH 4 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Main block area (outer background square)
- PRIMARY (fabricColors[1]): Arc band (background behind the spikes)
- SECONDARY (fabricColors[2]): All spikes (radiating triangular points)
- ACCENT (fabricColors[3]): Inner corner quarter-circle (the "sun")

Separates the corner piece from the spikes for better definition and focal point.

WITH 5 FABRICS (maximum detail):
- BACKGROUND (fabricColors[0]): Main block area (outer background square)
- PRIMARY (fabricColors[1]): Arc band (background behind spikes)
- SECONDARY (fabricColors[2]): Half of the spikes (alternating)
- ACCENT (fabricColors[3]): Inner corner quarter-circle
- CONTRAST (fabricColors[4]): Other half of spikes (alternating with Secondary)

Creates checkerboard effect on spikes for maximum visual interest.

DESIGN TIP: Use high contrast between Secondary (spikes) and Primary (arc band) 
so the radiating points read clearly. The corner Accent piece should be bold to 
anchor the design. Consider value gradation from corner outward (light to dark 
or dark to light) to enhance the sunburst effect.

IMPORTANT: Block orientation is fixed during construction. Rotation happens at 
the layout stage to create secondary patterns like pinwheels, stars, or continuous curves.`,

  cuttingInstructions: `New York Beauty cutting specifics:

FOUNDATION PAPER PIECING (REQUIRED):
The spike section MUST be foundation paper pieced for accuracy
- Print FPP templates with spike triangles marked
- Each spike is a small triangle pointing outward from the arc
- Typically 8-12 spikes per quarter-circle

BACKGROUND fabric (fabricColors[0]):
- Cut main block square with quarter-circle removed from one corner
- Use curved template to cut accurate quarter-circle curve

PRIMARY fabric (fabricColors[1]):
- Cut curved arc band pieces (background behind spikes)
- Use curved templates for precision

SECONDARY fabric (fabricColors[2]):
- Cut spike triangles (piece onto foundation paper)
- For 5-fabric version: cut half of the spikes

ACCENT fabric (fabricColors[3]):
- Cut inner corner quarter-circle
- Use curved template

CONTRAST fabric (fabricColors[4]) - if using 5 fabrics:
- Cut remaining spike triangles (alternating with Secondary)

CRITICAL: All curved pieces require templates or freezer paper for accuracy. 
This is an ADVANCED pattern - even small cutting errors are magnified.`,

  assemblyNotes: `Assembly tips for New York Beauty:

CONSTRUCTION SEQUENCE:
1. **Foundation paper piece the spike section**:
   - Piece spikes onto foundation paper in sequence
   - Alternate Secondary and Contrast colors if using 5 fabrics
   - Trim arc to exact curved edge after piecing

2. **Join Primary arc band to spike section** (curved seam):
   - Pin at center, ends, and several points along curve
   - Sew with concave piece (arc band) on top for better control
   - Ease fullness gently along curve
   - Clip concave seam allowance if needed

3. **Add Accent corner quarter-circle** (curved seam):
   - Pin carefully at center and edges
   - Sew with concave piece on top
   - Press seam toward quarter-circle

4. **Set completed quarter-circle into Background** (curved seam):
   - Pin extensively along curve
   - Sew slowly, easing fabric as you go
   - Clip Background seam allowance to allow curve to lie flat

CURVED SEAM TECHNIQUE:
- Pin at center point first, then ends, then intermediate points
- Use many pins (every 1-2 inches along curve)
- Sew with concave (inward) curve on top for visibility and control
- Don't stretch bias edges - let fabric ease naturally
- Clip concave seam allowances perpendicular to stitching line
- Press gently following the curve - don't flatten it

ACCURACY TIPS:
- Foundation paper piecing is NON-NEGOTIABLE for spikes
- Use spray starch before cutting to stabilize all pieces
- Mark curved seam starting/stopping points clearly
- Remove paper only after all surrounding seams are sewn
- Check that curves lie flat after each seam - adjust if puckering

This is an ADVANCED to EXPERT pattern. Master simpler curved piecing 
(like Drunkard's Path) before attempting New York Beauty.`,

  commonMistakes: `Avoid these New York Beauty mistakes:
- Attempting spikes without foundation paper piecing (accuracy is impossible)
- Stretching bias edges when sewing curves (causes rippling and distortion)
- Not clipping concave seam allowances (creates puckers and bulges)
- Inconsistent spike angles or sizes (breaks the radiating symmetry)
- Rushing curved seams without adequate pinning (creates pleats and misalignment)
- Sewing curves with convex piece on top (can't see where you're going)
- Low contrast between spikes and arc band (pattern loses all impact)
- Pressing curves completely flat (loses the dimensional curve)
- Removing foundation paper too early (spikes lose their shape)
- Not using starch to stabilize fabrics (bias edges stretch too easily)
- Attempting this pattern without prior curved piecing experience
- Random block rotation instead of planned layout (misses secondary pattern opportunities)`
};