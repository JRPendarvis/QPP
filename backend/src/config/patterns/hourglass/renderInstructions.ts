// src/config/patterns/hourglass/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type HourglassParams = {
  finishedBlockIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: HourglassParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  const halfBlockIn = finishedBlockIn / 2;
  const squareCutIn = halfBlockIn + 0.875;

  lines.push(DISCLAIMER);

  lines.push(
    `Hourglass quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(`Finished block size: ${finishedBlockIn}" square.`);

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: Each Hourglass block contains 4 HST units arranged to create the hourglass shape - two diagonal seams crossing in the center.'
  );

  lines.push(
    `Make HSTs: Cut squares at ${squareCutIn}" × ${squareCutIn}". Pair fabrics, draw diagonal, sew 1/4" on both sides, cut, press. Trim HSTs to ${halfBlockIn + 0.5}" square.`
  );

  lines.push(
    'Assembly: Arrange 4 HSTs in a 2×2 grid with triangles forming the hourglass pattern (opposite triangles match). Sew into rows, ensuring center seams nest. Press.'
  );

  lines.push(
    'Tip: Precise matching at the center creates a perfect hourglass. Consider color placement - matching opposite corners creates the classic hourglass effect.'
  );

  return lines;
}
