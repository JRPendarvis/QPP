// src/config/patterns/storm-at-sea/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const stormAtSeaPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'storm-at-sea',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 14,
    });
  },
};
