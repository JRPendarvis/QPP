// src/config/patterns/half-square-triangles/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const halfSquareTrianglesPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'half-square-triangles',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 6,
    });
  },
};
