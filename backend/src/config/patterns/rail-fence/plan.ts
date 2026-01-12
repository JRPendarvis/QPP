// src/config/patterns/rail-fence/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const railFencePlan: InstructionPlan<FabricAssignments> = {
  patternId: 'rail-fence',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 9,
      stripWidthIn: 3,
      stripsPerBlock: 3,
    });
  },
};
