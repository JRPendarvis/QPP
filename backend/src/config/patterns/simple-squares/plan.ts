// src/config/patterns/simple-squares/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const simpleSquaresPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'simple-squares',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedSquareIn: 5,
    });
  },
};
