// src/config/patterns/double-wedding-ring/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const doubleWeddingRingPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'double-wedding-ring',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      ringDiameterIn: 14,
    });
  },
};
