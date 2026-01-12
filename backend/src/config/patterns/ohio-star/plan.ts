// src/config/patterns/ohio-star/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const ohioStarPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'ohio-star',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 12,
      unitFinishedIn: 4,
    });
  },
};
