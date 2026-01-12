// src/config/patterns/lone-star/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const loneStarPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'lone-star',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      starDiameterIn: 60,
      diamondFinishedIn: 3,
    });
  },
};
