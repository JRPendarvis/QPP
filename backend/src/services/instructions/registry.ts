import type { InstructionPlan } from './types';

// Plans
import { pinwheelPlan } from '../../config/patterns/pinwheel/plan';
import { bowTiePlan } from '../../config/patterns/bow-tie/plan';
import { checkerboardPlan } from '../../config/patterns/checkerboard/plan';
import { churnDashPlan } from '../../config/patterns/churn-dash/plan';
import { drunkardsPathPlan } from '../../config/patterns/drunkards-path/plan';

const plans: Record<string, InstructionPlan<any>> = {
  pinwheel: pinwheelPlan,
  'bow-tie': bowTiePlan,
  checkerboard: checkerboardPlan,
  'churn-dash': churnDashPlan,
  'drunkards-path': drunkardsPathPlan,
};

export function getInstructionPlan(patternId: string): InstructionPlan<any> | undefined {
  return plans[patternId];
}

export function listSupportedInstructionPatternIds(): string[] {
  return Object.keys(plans);
}
