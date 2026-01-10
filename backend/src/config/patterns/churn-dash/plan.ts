import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

/**
 * CHURN DASH — Deterministic instruction plan
 *
 * Block model:
 * - Classic 3×3 unit block.
 * - Subunit finished size = finishedBlockSizeIn / 3.
 *
 * Fabric slots:
 * - COLOR1 = Background
 * - COLOR2 = Feature
 * - COLOR3 = Center Accent
 *
 * Deterministic sizing:
 * - Finished block size is fixed to 9" for this pattern.
 */
export const churnDashPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'churn-dash',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    return renderInstructions(quiltSize, fabrics, {
      finishedBlockIn: 9,
      subunitFinishedIn: 3,
    });
  },
};
