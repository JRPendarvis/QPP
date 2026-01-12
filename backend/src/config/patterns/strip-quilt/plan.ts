// src/config/patterns/strip-quilt/plan.ts

import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

export const stripQuiltPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'strip-quilt',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      stripWidthIn: 2.5,
    });
  },
};
