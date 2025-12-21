/**
 * SVG Templates for Quilt Patterns
 * Each template is a 100x100 unit block that uses COLOR1, COLOR2, and COLOR3 placeholders
 * These placeholders are replaced with actual fabric colors during generation
 * The templates are repeated in a 4x4 grid to create the final quilt
 */

import { SIMPLE_SQUARES } from './patterns/simple-squares';
import { CHECKERBOARD } from './patterns/checkerboard/template';
import { FOUR_PATCH } from './patterns/four-patch';
import { NINE_PATCH } from './patterns/nine-patch';
import { PINWHEEL } from './patterns/pinwheel';
import { HALF_SQUARE_TRIANGLES } from './patterns/half-square-triangles';
import { FLYING_GEESE } from './patterns/flying-geese';
import { HOURGLASS } from './patterns/hourglass';
import { RAIL_FENCE } from './patterns/rail-fence';
import { STRIP_QUILT } from './patterns/strip-quilt';
import { LOG_CABIN } from './patterns/log-cabin';
import { BOW_TIE } from './patterns/bow-tie/template';
import { OHIO_STAR } from './patterns/ohio-star';
import { SAWTOOTH_STAR } from './patterns/sawtooth-star';
import { CHURN_DASH } from './patterns/churn-dash/template';
import { LONE_STAR } from './patterns/lone-star';
import { NEW_YORK_BEAUTY } from './patterns/new-york-beauty';
import { MARINERS_COMPASS } from './patterns/mariners-compass';
import { STORM_AT_SEA } from './patterns/storm-at-sea';
import { DOUBLE_WEDDING_RING } from './patterns/double-wedding-ring';
import { DRUNKARDS_PATH } from './patterns/drunkards-path';
import { FEATHERED_STAR } from './patterns/feathered-star';
import { GRANDMOTHERS_FLOWER_GARDEN } from './patterns/grandmothers-flower-garden';
import { PICKLE_DISH } from './patterns/pickle-dish';
import { COMPLEX_MEDALLION } from './patterns/complex-medallion';

console.log('🔍 CHURN_DASH import check:', typeof CHURN_DASH, CHURN_DASH ? 'has content' : 'UNDEFINED');

export const SVG_TEMPLATES: Record<string, string> = {
  'Simple Squares': SIMPLE_SQUARES,
  Checkerboard: CHECKERBOARD,
  'Four Patch': FOUR_PATCH,
  'Nine Patch': NINE_PATCH,
  Pinwheel: PINWHEEL,
  'Half-Square Triangles': HALF_SQUARE_TRIANGLES,
  'Flying Geese': FLYING_GEESE,
  Hourglass: HOURGLASS,
  'Rail Fence': RAIL_FENCE,
  'Strip Quilt': STRIP_QUILT,
  'Log Cabin': LOG_CABIN,
  'Bow Tie': BOW_TIE,
  'Ohio Star': OHIO_STAR,
  'Sawtooth Star': SAWTOOTH_STAR,
  'Churn Dash': CHURN_DASH,
  'Lone Star': LONE_STAR,
  'New York Beauty': NEW_YORK_BEAUTY,
  "Mariner's Compass": MARINERS_COMPASS,
  'Storm at Sea': STORM_AT_SEA,
  'Double Wedding Ring': DOUBLE_WEDDING_RING,
  "Drunkard's Path": DRUNKARDS_PATH,
  'Feathered Star': FEATHERED_STAR,
  "Grandmother's Flower Garden": GRANDMOTHERS_FLOWER_GARDEN,
  'Pickle Dish': PICKLE_DISH,
  'Complex Medallion': COMPLEX_MEDALLION,
};
