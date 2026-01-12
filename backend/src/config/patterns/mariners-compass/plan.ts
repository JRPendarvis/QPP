// src/config/patterns/mariners-compass/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const marinersCompassPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'mariners-compass',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 16,
      compassPointsCount: 16,
    });
  },
};
