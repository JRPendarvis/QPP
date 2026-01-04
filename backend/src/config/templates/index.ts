/**
 * SVG Templates for Quilt Patterns
 * Each template is a 100x100 unit block that uses COLOR1, COLOR2, etc. placeholders
 * These placeholders are replaced with actual fabric colors during generation
 * 
 * NOTE: This file provides backward compatibility. The primary template source
 * is now PatternDefinition.getTemplate() in each pattern module.
 */

import { SIMPLE_SQUARES } from '../patterns/simple-squares/template';
import { CHECKERBOARD } from '../patterns/checkerboard/template';
import { FOUR_PATCH } from '../patterns/four-patch/template';
import { NINE_PATCH } from '../patterns/nine-patch/template';
import { PINWHEEL } from '../patterns/pinwheel/template';
import { HALF_SQUARE_TRIANGLES } from '../patterns/half-square-triangles/template';
import { FLYING_GEESE } from '../patterns/flying-geese/template';
import { HOURGLASS } from '../patterns/hourglass/template';
import { RAIL_FENCE } from '../patterns/rail-fence/template';
import { STRIP_QUILT } from '../patterns/strip-quilt/template';
import { LOG_CABIN } from '../patterns/log-cabin/template';
import { BOW_TIE } from '../patterns/bow-tie/template';
import { OHIO_STAR } from '../patterns/ohio-star/template';
import { KALEIDOSCOPE_STAR } from '../patterns/kaleidoscope-star/template';
import { SAWTOOTH_STAR } from '../patterns/sawtooth-star/template';
import { CHURN_DASH } from '../patterns/churn-dash/template';
import { LONE_STAR } from '../patterns/lone-star/template';
import { NEW_YORK_BEAUTY } from '../patterns/new-york-beauty/template';
import { MARINERS_COMPASS } from '../patterns/mariners-compass/template';
import { STORM_AT_SEA } from '../patterns/storm-at-sea/template';
import { DOUBLE_WEDDING_RING } from '../patterns/double-wedding-ring/template';
import { DRUNKARDS_PATH } from '../patterns/drunkards-path/template';
import { MOSAIC_STAR } from '../patterns/mosaic-star/template';
import { GRANDMOTHERS_FLOWER_GARDEN } from '../patterns/grandmothers-flower-garden/template';
import { PICKLE_DISH } from '../patterns/pickle-dish/template';
import { COMPLEX_MEDALLION } from '../patterns/complex-medallion/template';

/**
 * Templates indexed by pattern ID (preferred)
 */
export const SVG_TEMPLATES_BY_ID: Record<string, string> = {
  'simple-squares': SIMPLE_SQUARES,
  'checkerboard': CHECKERBOARD,
  'four-patch': FOUR_PATCH,
  'nine-patch': NINE_PATCH,
  'pinwheel': PINWHEEL,
  'half-square-triangles': HALF_SQUARE_TRIANGLES,
  'flying-geese': FLYING_GEESE,
  'hourglass': HOURGLASS,
  'rail-fence': RAIL_FENCE,
  'strip-quilt': STRIP_QUILT,
  'log-cabin': LOG_CABIN,
  'bow-tie': BOW_TIE,
  'ohio-star': OHIO_STAR,
  'kaleidoscope-star': KALEIDOSCOPE_STAR,
  'sawtooth-star': SAWTOOTH_STAR,
  'churn-dash': CHURN_DASH,
  'lone-star': LONE_STAR,
  'new-york-beauty': NEW_YORK_BEAUTY,
  'mariners-compass': MARINERS_COMPASS,
  'storm-at-sea': STORM_AT_SEA,
  'double-wedding-ring': DOUBLE_WEDDING_RING,
  'drunkards-path': DRUNKARDS_PATH,
  'mosaic-star': MOSAIC_STAR,
  'grandmothers-flower-garden': GRANDMOTHERS_FLOWER_GARDEN,
  'pickle-dish': PICKLE_DISH,
  'complex-medallion': COMPLEX_MEDALLION,
};

/**
 * Templates indexed by display name (backward compatibility)
 * @deprecated Use SVG_TEMPLATES_BY_ID or PatternDefinition.getTemplate() instead
 */
export const SVG_TEMPLATES: Record<string, string> = {
  'Simple Squares': SIMPLE_SQUARES,
  'Checkerboard': CHECKERBOARD,
  'Four Patch': FOUR_PATCH,
  'Nine Patch': NINE_PATCH,
  'Pinwheel': PINWHEEL,
  'Half-Square Triangles': HALF_SQUARE_TRIANGLES,
  'Flying Geese': FLYING_GEESE,
  'Hourglass': HOURGLASS,
  'Rail Fence': RAIL_FENCE,
  'Strip Quilt': STRIP_QUILT,
  'Log Cabin': LOG_CABIN,
  'Bow Tie': BOW_TIE,
  'Ohio Star': OHIO_STAR,
  'Kaleidoscope Star': KALEIDOSCOPE_STAR,
  'Sawtooth Star': SAWTOOTH_STAR,
  'Churn Dash': CHURN_DASH,
  'Lone Star': LONE_STAR,
  'New York Beauty': NEW_YORK_BEAUTY,
  "Mariner's Compass": MARINERS_COMPASS,
  'Storm at Sea': STORM_AT_SEA,
  'Double Wedding Ring': DOUBLE_WEDDING_RING,
  "Drunkard's Path": DRUNKARDS_PATH,
  'Mosaic Star': MOSAIC_STAR,
  "Grandmother's Flower Garden": GRANDMOTHERS_FLOWER_GARDEN,
  'Pickle Dish': PICKLE_DISH,
  'Complex Medallion': COMPLEX_MEDALLION,
};

/**
 * Get template by pattern ID or display name
 */
export function getTemplate(patternIdOrName: string): string | undefined {
  return SVG_TEMPLATES_BY_ID[patternIdOrName] || SVG_TEMPLATES[patternIdOrName];
}
