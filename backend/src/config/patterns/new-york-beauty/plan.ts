// src/config/patterns/new-york-beauty/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const newYorkBeautyPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'new-york-beauty',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 12,
      spikesPerArc: 8,
    });
  },
};
