/**
 * Base interface for pattern-specific prompts
 */
export interface PatternPrompt {
  patternName: string;
  recommendedFabricCount?: number | { min: number; max: number }; // For best results (optional for stubs)
  characteristics: string;
  fabricRoleGuidance: string;
  cuttingInstructions: string;
  assemblyNotes: string;
  commonMistakes: string;
}

/**
 * Generic/template prompt for patterns without specific guidance yet
 */
export const GENERIC_PATTERN_PROMPT = {
  patternName: 'Generic Pattern',
  recommendedFabricCount: { min: 2, max: 6 },
  
  characteristics: `This is a traditional quilt pattern. Follow standard quilting principles for construction.`,

  fabricRoleGuidance: `Standard fabric role guidance:
- BACKGROUND: Light value fabrics that recede, provide negative space
- PRIMARY: Medium to dark fabrics with good contrast to background
- SECONDARY: Coordinates with primary, adds depth
- ACCENT: Optional pops of color or contrast`,

  cuttingInstructions: `Standard cutting instructions:
- Measure and cut pieces according to pattern requirements
- Add 1/4 inch seam allowances to all sides
- Cut on grain unless bias is required for stretch`,

  assemblyNotes: `Standard assembly:
- Pin pieces carefully before sewing
- Use 1/4 inch seam allowance consistently
- Press seams as you go, usually toward darker fabric
- Nest seams where blocks meet`,

  commonMistakes: `Common quilting mistakes to avoid:
- Inconsistent seam allowances
- Not pressing seams properly
- Insufficient contrast between fabrics
- Skipping the planning/layout step`
};

// Import all pattern-specific prompts
import { SIMPLE_SQUARES_PROMPT } from '../patterns/simple-squares/prompt';
import { STRIP_QUILT_PROMPT } from '../patterns/strip-quilt/prompt';
import { CHECKERBOARD_PROMPT } from '../patterns/checkerboard/prompt';
import { RAIL_FENCE_PROMPT } from '../patterns/rail-fence/prompt';
import { FOUR_PATCH_PROMPT } from '../patterns/four-patch/four-patch.prompt';
import { NINE_PATCH_PROMPT } from '../patterns/nine-patch/nine-patch.prompt';
import { HALF_SQUARE_TRIANGLES_PROMPT } from '../patterns/half-square-triangles/half-square-triangles.prompt';
import { HOURGLASS_PROMPT } from '../patterns/hourglass/hourglass.prompt';
import { BOW_TIE_PROMPT } from '../patterns/bow-tie/prompt';
import { FLYING_GEESE_PROMPT } from '../patterns/flying-geese/prompt';
import { PINWHEEL_PROMPT } from '../patterns/pinwheel/prompt';
import { LOG_CABIN_PROMPT } from '../patterns/log-cabin/log-cabin.prompt';
import { SAWTOOTH_STAR_PROMPT } from '../patterns/sawtooth-star/prompt';
import { OHIO_STAR_PROMPT } from '../patterns/ohio-star/ohio-star.prompt';
import { CHURN_DASH_PROMPT } from '../patterns/churn-dash/prompt';
import { LONE_STAR_PROMPT } from '../patterns/lone-star/lone-star.prompt';
import { MARINERS_COMPASS_PROMPT } from '../patterns/mariners-compass/mariners-compass.prompt';
import { NEW_YORK_BEAUTY_PROMPT } from '../patterns/new-york-beauty/new-york-beauty.prompt';
import { STORM_AT_SEA_PROMPT } from '../patterns/storm-at-sea/prompt';
import { DRUNKARDS_PATH_PROMPT } from '../patterns/drunkards-path/prompt';
import { FEATHERED_STAR_PROMPT } from '../patterns/feathered-star/prompt';
import { GRANDMOTHERS_FLOWER_GARDEN_PROMPT } from '../patterns/grandmothers-flower-garden/grandmothers-flower-garden.prompt';
import { DOUBLE_WEDDING_RING_PROMPT } from '../patterns/double-wedding-ring/prompt';
import { PICKLE_DISH_PROMPT } from '../patterns/pickle-dish/pickle-dish.prompt';
import { COMPLEX_MEDALLION_PROMPT } from '../patterns/complex-medallion/prompt';

/**
 * Map of pattern IDs to their specific prompts
 */
export const PATTERN_PROMPTS: Record<string, PatternPrompt> = {
  'simple-squares': SIMPLE_SQUARES_PROMPT,
  'strip-quilt': STRIP_QUILT_PROMPT,
  'checkerboard': CHECKERBOARD_PROMPT,
  'rail-fence': RAIL_FENCE_PROMPT,
  'four-patch': FOUR_PATCH_PROMPT,
  'nine-patch': NINE_PATCH_PROMPT,
  'half-square-triangles': HALF_SQUARE_TRIANGLES_PROMPT,
  'hourglass': HOURGLASS_PROMPT,
  'bow-tie': BOW_TIE_PROMPT,
  'flying-geese': FLYING_GEESE_PROMPT,
  'pinwheel': PINWHEEL_PROMPT,
  'log-cabin': LOG_CABIN_PROMPT,
  'sawtooth-star': SAWTOOTH_STAR_PROMPT,
  'ohio-star': OHIO_STAR_PROMPT,
  'churn-dash': CHURN_DASH_PROMPT,
  'lone-star': LONE_STAR_PROMPT,
  'mariners-compass': MARINERS_COMPASS_PROMPT,
  'new-york-beauty': NEW_YORK_BEAUTY_PROMPT,
  'storm-at-sea': STORM_AT_SEA_PROMPT,
  'drunkards-path': DRUNKARDS_PATH_PROMPT,
  'feathered-star': FEATHERED_STAR_PROMPT,
  'grandmothers-flower-garden': GRANDMOTHERS_FLOWER_GARDEN_PROMPT,
  'double-wedding-ring': DOUBLE_WEDDING_RING_PROMPT,
  'pickle-dish': PICKLE_DISH_PROMPT,
  'complex-medallion': COMPLEX_MEDALLION_PROMPT,
};

/**
 * Get pattern-specific prompt or fallback to generic
 */
export function getPatternPrompt(patternId: string): PatternPrompt {
  return PATTERN_PROMPTS[patternId] || GENERIC_PATTERN_PROMPT;
}
