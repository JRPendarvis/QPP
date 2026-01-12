// src/config/patterns/complex-medallion/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const complexMedallionPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'complex-medallion',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 48, // Large medallion center
    });
  },
};
