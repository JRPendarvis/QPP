// src/config/patterns/hourglass/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const hourglassPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'hourglass',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 8,
    });
  },
};
