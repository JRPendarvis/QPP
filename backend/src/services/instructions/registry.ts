import type { InstructionPlan } from './types';

// Plans
import { pinwheelPlan } from '../../config/patterns/pinwheel/plan';
import { bowTiePlan } from '../../config/patterns/bow-tie/plan';
import { checkerboardPlan } from '../../config/patterns/checkerboard/plan';
import { churnDashPlan } from '../../config/patterns/churn-dash/plan';
import { complexMedallionPlan } from '../../config/patterns/complex-medallion/plan';
import { doubleWeddingRingPlan } from '../../config/patterns/double-wedding-ring/plan';
import { drunkardsPathPlan } from '../../config/patterns/drunkards-path/plan';
import { featheredStarPlan } from '../../config/patterns/feathered-star/plan';
import { flyingGeesePlan } from '../../config/patterns/flying-geese/plan';
import { fourPatchPlan } from '../../config/patterns/four-patch/plan';
import { grandmothersFlowerGardenPlan } from '../../config/patterns/grandmothers-flower-garden/plan';
import { halfSquareTrianglesPlan } from '../../config/patterns/half-square-triangles/plan';
import { hourglassPlan } from '../../config/patterns/hourglass/plan';
import { kaleidoscopeStarPlan } from '../../config/patterns/kaleidoscope-star/plan';
import { logCabinPlan } from '../../config/patterns/log-cabin/plan';
import { loneStarPlan } from '../../config/patterns/lone-star/plan';
import { marinersCompassPlan } from '../../config/patterns/mariners-compass/plan';
import { mosaicStarPlan } from '../../config/patterns/mosaic-star/plan';
import { newYorkBeautyPlan } from '../../config/patterns/new-york-beauty/plan';
import { ninePatchPlan } from '../../config/patterns/nine-patch/plan';
import { ohioStarPlan } from '../../config/patterns/ohio-star/plan';
import { pickleDishPlan } from '../../config/patterns/pickle-dish/plan';
import { railFencePlan } from '../../config/patterns/rail-fence/plan';
import { sawtoothStarPlan } from '../../config/patterns/sawtooth-star/plan';
import { simpleSquaresPlan } from '../../config/patterns/simple-squares/plan';
import { stormAtSeaPlan } from '../../config/patterns/storm-at-sea/plan';
import { stripQuiltPlan } from '../../config/patterns/strip-quilt/plan';


const plans: Record<string, InstructionPlan<any>> = {
  pinwheel: pinwheelPlan,
  'bow-tie': bowTiePlan,
  checkerboard: checkerboardPlan,
  'churn-dash': churnDashPlan,
  'complex-medallion': complexMedallionPlan,
  'double-wedding-ring': doubleWeddingRingPlan,
  'drunkards-path': drunkardsPathPlan,
  'feathered-star': featheredStarPlan,
  'flying-geese': flyingGeesePlan,
  'four-patch': fourPatchPlan,
  'grandmothers-flower-garden': grandmothersFlowerGardenPlan,
  'half-square-triangles': halfSquareTrianglesPlan,
  hourglass: hourglassPlan,
  'kaleidoscope-star': kaleidoscopeStarPlan,
  'log-cabin': logCabinPlan,
  'lone-star': loneStarPlan,
  'mariners-compass': marinersCompassPlan,
  'mosaic-star': mosaicStarPlan,
  'new-york-beauty': newYorkBeautyPlan,
  'nine-patch': ninePatchPlan,
  'ohio-star': ohioStarPlan,
  'pickle-dish': pickleDishPlan,
  'rail-fence': railFencePlan,
  'sawtooth-star': sawtoothStarPlan,
  'simple-squares': simpleSquaresPlan,
  'storm-at-sea': stormAtSeaPlan,
  'strip-quilt': stripQuiltPlan,
};

export function getInstructionPlan(patternId: string): InstructionPlan<any> | undefined {
  return plans[patternId];
}

export function listSupportedInstructionPatternIds(): string[] {
  return Object.keys(plans);
}
