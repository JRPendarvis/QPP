// src/config/patterns/nine-patch/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const ninePatchPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'nine-patch',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 9,
      squareFinishedIn: 3,
    });
  },
};
