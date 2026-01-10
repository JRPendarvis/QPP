// src/config/patterns/checkerboard/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const checkerboardPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'checkerboard',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      preferredFinishedBlockIn: [12, 10, 8],
    });
  },
};
