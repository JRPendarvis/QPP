// src/services/instructions/registry.ts

import type { InstructionPlan } from './types';

// Plans
import { pinwheelPlan } from '../../config/patterns/pinwheel/plan';
import { bowTiePlan } from '../../config/patterns/bow-tie/plan';

const plans: Record<string, InstructionPlan<any>> = {
  pinwheel: pinwheelPlan,
  'bow-tie': bowTiePlan,
};

export function getInstructionPlan(patternId: string): InstructionPlan<any> | undefined {
  return plans[patternId];
}

export function listSupportedInstructionPatternIds(): string[] {
  return Object.keys(plans);
}
