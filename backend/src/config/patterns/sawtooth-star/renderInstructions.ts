// src/config/patterns/sawtooth-star/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type SawtoothStarParams = {
  finishedBlockIn: number;
  unitFinishedIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: SawtoothStarParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn, unitFinishedIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  const hstCutIn = unitFinishedIn + 0.875;
  const squareCutIn = unitFinishedIn + 0.5;

  lines.push(DISCLAIMER);

  lines.push(
    `Sawtooth Star quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square (3×3 grid of ${unitFinishedIn}" units).`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: Similar to Ohio Star, but with star points made from flying geese units instead of simple HSTs, creating a "sawtooth" edge.'
  );

  lines.push(
    `Cutting per block: 4 background corner squares (${squareCutIn}"), 1 center square (${squareCutIn}"), plus pieces for 4 flying geese star points.`
  );

  lines.push(
    'Make Flying Geese units: Each star point is a flying geese unit. Use your preferred method (4-at-a-time, traditional, or no-waste) to create precise units.'
  );

  lines.push(
    'Assembly: Arrange in 3×3 grid with flying geese points oriented toward the center. Sew into rows, ensuring points align precisely.'
  );

  lines.push(
    'Tip: The flying geese points give this star more visual interest than a basic star. Accurate piecing ensures sharp, aligned points.'
  );

  return lines;
}
