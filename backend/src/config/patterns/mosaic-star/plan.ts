// src/config/patterns/mosaic-star/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const mosaicStarPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'mosaic-star',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 12,
    });
  },
};
