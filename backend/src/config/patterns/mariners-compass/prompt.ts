import { PatternPrompt } from '../types';

export const MARINERS_COMPASS_PROMPT: PatternPrompt = {
  patternName: "Mariner's Compass",
  recommendedFabricCount: 4,
  
  characteristics: `Mariner's Compass is a dramatic circular pattern with radiating points like a navigational compass rose:
- Typically 16-32 pointed wedges radiating from a center circle
- Points alternate in length creating layered depth effect
- Long points (cardinal directions: N, E, S, W)
- Medium points (ordinal directions: NE, SE, SW, NW)
- Short points (intermediate directions between the above)
- All pieced from triangular wedges using foundation paper piecing or set-in seams
- Center circle anchors the entire design
- Background circle surrounds the compass rose
- One of the most challenging and impressive traditional quilt patterns
- Expert-level skill required - precise angles and Y-seams throughout
- Typically a single large statement block, not a repeating pattern`,

  fabricRoleGuidance: `Mariner's Compass fabric assignments (supports 4-6 fabrics):

WITH 4 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Circular background and corner squares
- PRIMARY (fabricColors[1]): Long cardinal points (N, E, S, W)
- SECONDARY (fabricColors[2]): Medium ordinal points (NE, SE, SW, NW)
- ACCENT (fabricColors[3]): Center circle + short intermediate points

Creates classic three-tier compass rose with clear visual hierarchy.

WITH 5 FABRICS:
- BACKGROUND (fabricColors[0]): Circular background and corner squares
- PRIMARY (fabricColors[1]): Long cardinal points (most prominent)
- SECONDARY (fabricColors[2]): Medium ordinal points
- ACCENT (fabricColors[3]): Center circle (focal anchor)
- CONTRAST (fabricColors[4]): Short intermediate points

Separates center circle from short points for more definition.

WITH 6 FABRICS (maximum complexity):
- BACKGROUND (fabricColors[0]): Circular background and corner squares
- PRIMARY (fabricColors[1]): Long cardinal points
- SECONDARY (fabricColors[2]): Medium ordinal points
- ACCENT (fabricColors[3]): Center circle
- CONTRAST (fabricColors[4]): Half of short intermediate points
- ADDITIONAL (fabricColors[5]): Other half of short points (alternating)

Creates maximum visual interest with alternating colors on shortest points.

DESIGN TIP: Use high contrast between all point layers and Background. Consider 
value gradation from center outward (light to dark or dark to light) to enhance 
the radiating effect. The center circle should be bold to anchor the entire design.`,

  cuttingInstructions: `Mariner's Compass cutting specifics:

COMPASS POINTS:
All points are elongated triangular wedges (kite shapes with pointed ends)
- LONG points (PRIMARY): 4-8 pieces (cardinal directions)
- MEDIUM points (SECONDARY): 4-8 pieces (ordinal directions)
- SHORT points (ACCENT/CONTRAST): 8-16 pieces (intermediate directions)

BACKGROUND fabric (fabricColors[0]):
- Cut circular background piece (or construct from arc segments)
- Cut 4 corner squares (fill space between circle and square block edges)

ACCENT fabric (fabricColors[3]):
- Cut center circle or octagon (compass hub)

CUTTING METHODS:
1. **Foundation paper piecing** (STRONGLY RECOMMENDED):
   - Print templates with all seam lines and angles marked
   - Provides most accurate results for complex angles
   - Essential for expert-level precision

2. **Template method**:
   - Create acrylic templates for each point length
   - Trace and cut carefully with rotary cutter
   - Requires extreme precision - even 1° off multiplies across 16-32 points

CRITICAL: All compass wedges must be cut with EXACT angles. Small errors compound 
dramatically - a 1° error per wedge creates 16-32° of mismatch at the circle edge.`,

  assemblyNotes: `Assembly tips for Mariner's Compass:

CONSTRUCTION SEQUENCE:
1. **Foundation paper piece wedges** (if using FPP):
   - Follow printed lines precisely
   - Build each point from center outward
   - Trim each unit to template edge

2. **Construct compass in quarters**:
   - Each quarter contains 4-8 points
   - Join points in pairs, then quarters
   - Press seams in alternating directions to reduce bulk

3. **Join quarters into halves**:
   - Pin at center and seam intersections
   - Sew carefully - all points must meet precisely at center

4. **Join halves to complete compass rose**:
   - Pin extensively at center and all seam intersections
   - Many seams converge at center - use very small stitches

5. **Set center circle** (Y-seams):
   - Pin circle into center opening
   - Sew using Y-seam technique (partial seams, pivot at corners)
   - Start and stop stitching 1/4" from each point

6. **Set compass into background**:
   - More Y-seams to attach circular background
   - Add corner squares last to complete block square

PRESSING:
- Press seams away from center to reduce bulk
- Press center seam allowances open (too many layers converge)
- Handle all pieces gently - many bias edges

ACCURACY REQUIREMENTS:
- Foundation paper piecing is STRONGLY RECOMMENDED
- Every angle must be perfect - errors compound across all wedges
- Pin at every seam intersection before sewing
- Use very small stitch length (1.5-2.0) for precision
- Check compass flatness frequently during construction

This is an EXPERT-LEVEL pattern. Master simpler circular patterns 
(like New York Beauty) before attempting Mariner's Compass.`,

  commonMistakes: `Avoid these Mariner's Compass mistakes:
- Inaccurate wedge angles (compass won't lie flat, will ripple or pucker)
- Not using foundation paper piecing (nearly impossible to achieve accuracy without it)
- Stretching bias edges on wedges (all edges except block edges are bias)
- Inconsistent seam allowances (points won't meet precisely at center)
- Rushing Y-seams when setting center circle and background (causes puckers)
- Not pressing seams open at center (too much bulk, center won't lie flat)
- Low contrast between points and background (pattern loses drama and definition)
- Adjacent point lengths with too-similar colors (layered depth effect disappears)
- Attempting this pattern without prior experience with set-in seams and precise piecing
- Not checking that all wedges are identical before assembly (errors multiply)
- Pulling or stretching at center when sewing (distorts the entire compass)
- Using directional prints for wedges (pattern orientation gets chaotic)`
};