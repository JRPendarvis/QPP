// src/config/patterns/bow-tie/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderBowTieInstructions } from './renderInstructions';

export const bowTiePlan: InstructionPlan<FabricAssignments> = {
  patternId: 'bow-tie',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderBowTieInstructions(quiltSize, fabrics, {
      finishedBlockIn: 7,
      largeFinishedIn: 3.5,
      knotFinishedIn: 2.5,
    });
  },
};
