// src/config/patterns/log-cabin/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const logCabinPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'log-cabin',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 10,
      centerSquareIn: 2.5,
      stripWidthIn: 1.5,
    });
  },
};
