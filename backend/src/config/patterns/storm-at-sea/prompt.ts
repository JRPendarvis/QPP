import { PatternPrompt } from '../types';

export const STORM_AT_SEA_PROMPT: PatternPrompt = {
  patternName: 'Storm at Sea',
  recommendedFabricCount: 3,
  
  characteristics: `Storm at Sea creates an optical illusion of rolling waves or turbulent water:
- Complex pattern using square-in-a-square units and precise piecing
- Multiple diamond shapes nested within each other
- Corner units, side connector units, and center unit all work together
- When blocks are tiled, creates the illusion of curved, undulating waves using only straight seams
- The "movement" comes from careful value placement and how units connect across block boundaries
- One of the most challenging traditional patterns - requires exceptional accuracy
- Advanced to expert skill level
- Block orientation is critical - wave illusion requires consistent alignment across all blocks`,

  fabricRoleGuidance: `Storm at Sea fabric assignments (supports 3-4 fabrics):

WITH 3 FABRICS (traditional - recommended):
- BACKGROUND (fabricColors[0]): The "sea" - negative space and large squares
- PRIMARY (fabricColors[1]): Wave/diamond shapes creating the turbulent water effect
- SECONDARY (fabricColors[2]): Centers of square-in-a-square units (adds depth)

Classic approach creates strongest optical illusion with clear value contrast between 
Background (sea) and Primary (waves).

WITH 4 FABRICS:
- BACKGROUND (fabricColors[0]): The sea/negative space (must stay consistent)
- PRIMARY (fabricColors[1]): Main wave/diamond shapes
- SECONDARY (fabricColors[2]): Secondary wave/diamond shapes or connectors
- ACCENT (fabricColors[3]): Centers of square-in-a-square units

Adds more complexity and depth while maintaining the wave illusion.

CRITICAL: 
- Background MUST remain consistent across all blocks for the wave illusion to work
- High contrast between Background and Primary creates the strongest wave effect
- Value placement is more important than color choice
- The optical illusion only emerges when multiple blocks are tiled together

DESIGN TIP: Use a light Background (white, cream) with dark Primary (navy, black) 
for maximum wave effect, or reverse for dramatic negative space. The Secondary 
centers add dimension - use a medium value between Background and Primary.`,

  cuttingInstructions: `Storm at Sea cutting specifics:

This is an ADVANCED pattern - foundation paper piecing is STRONGLY RECOMMENDED 
for all units to ensure accuracy.

BACKGROUND fabric (fabricColors[0]):
- Cut squares and pieces for negative space areas
- Use templates or FPP patterns

PRIMARY fabric (fabricColors[1]):
- Cut pieces for wave/diamond shapes
- Use templates or FPP patterns

SECONDARY fabric (fabricColors[2]):
- Cut pieces for square-in-a-square centers
- Use templates or FPP patterns

ACCENT fabric (fabricColors[3]) - if using 4 fabrics:
- Cut additional pieces for unit centers or variety

CONSTRUCTION UNITS:
- Corner units: Small square-in-a-square diamonds (4 per block)
- Side connectors: Elongated diamond shapes (4 per block)
- Center unit: Large square-in-a-square diamond (1 per block)

Each unit contains multiple pieces that must be precisely cut and sewn.

CRITICAL: Use templates or foundation paper piecing - freehand cutting will not 
provide sufficient accuracy for the wave illusion to work.`,

  assemblyNotes: `Assembly tips for Storm at Sea:

CONSTRUCTION SEQUENCE:
1. **Build all units using FPP or templates**:
   - 4 corner square-in-a-square units
   - 4 side connector units
   - 1 center square-in-a-square unit

2. **Arrange units** to verify correct orientation

3. **Sew units together**:
   - Join corner units to side connectors
   - Attach side sections to center unit
   - Work in sections, then join sections

4. **Press carefully** - follow seam allowances in FPP pattern

ACCURACY REQUIREMENTS:
- ALL seam allowances must be precise (scant 1/4")
- Points must meet exactly at all intersections
- Units must be exactly the same size
- Even 1/16" error multiplies across the block

TESTING THE ILLUSION:
- Make at least 4 blocks before judging success
- Arrange blocks in 2x2 grid
- The wave pattern should be clearly visible
- If illusion doesn't work, check value contrast and unit accuracy

This is an EXPERT-LEVEL pattern. Master simpler square-in-a-square patterns 
before attempting Storm at Sea.`,

  commonMistakes: `Avoid these Storm at Sea mistakes:
- Attempting without foundation paper piecing (accuracy is nearly impossible otherwise)
- Insufficient value contrast between Background and Primary (illusion disappears)
- Inconsistent seam allowances (points don't meet, wave pattern breaks)
- Misaligning diamond points (disrupts the wave flow between blocks)
- Varying the Background fabric across blocks (destroys the continuous sea effect)
- Not making enough blocks to see the full wave pattern (need at least 4 blocks tiled)
- Rotating blocks randomly (breaks the wave illusion - orientation must be consistent)
- Pressing seams too hard (distorts bias edges in diamond shapes)
- Attempting this pattern without prior experience with precise piecing
- Not using templates or FPP (freehand cutting cannot achieve required accuracy)`
};