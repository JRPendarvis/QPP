/**
 * SVG Templates for Quilt Patterns
 * Each template is a 100x100 unit block that uses COLOR1, COLOR2, and COLOR3 placeholders
 * These placeholders are replaced with actual fabric colors during generation
 * The templates are repeated in a 4x4 grid to create the final quilt
 */

import { SIMPLE_SQUARES } from './patterns/simple-squares/template';
import { CHECKERBOARD } from './patterns/checkerboard/template';
import { FOUR_PATCH } from './patterns/four-patch/template';
import { NINE_PATCH } from './patterns/nine-patch/template';
import { PINWHEEL } from './patterns/pinwheel/template';
import { HALF_SQUARE_TRIANGLES } from './patterns/half-square-triangles/template';
import { FLYING_GEESE } from './patterns/flying-geese/template';
import { HOURGLASS } from './patterns/hourglass/template';
import { RAIL_FENCE } from './patterns/rail-fence/template';
import { STRIP_QUILT } from './patterns/strip-quilt/template';
import { LOG_CABIN } from './patterns/log-cabin/template';
import { BOW_TIE } from './patterns/bow-tie/template';
import { OHIO_STAR } from './patterns/ohio-star/template';
import { SAWTOOTH_STAR } from './patterns/sawtooth-star/template';
import { CHURN_DASH } from './patterns/churn-dash/template';
import { LONE_STAR } from './patterns/lone-star/template';
import { NEW_YORK_BEAUTY } from './patterns/new-york-beauty/template';
import { MARINERS_COMPASS } from './patterns/mariners-compass/template';
import { STORM_AT_SEA } from './patterns/storm-at-sea/template';
import { DOUBLE_WEDDING_RING } from './patterns/double-wedding-ring/template';
import { DRUNKARDS_PATH } from './patterns/drunkards-path/template';
import { FEATHERED_STAR } from './patterns/feathered-star/template';
import { GRANDMOTHERS_FLOWER_GARDEN } from './patterns/grandmothers-flower-garden/template';
import { PICKLE_DISH } from './patterns/pickle-dish/template';
import { COMPLEX_MEDALLION } from './patterns/complex-medallion/template';

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
