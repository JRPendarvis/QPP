// src/config/patterns/half-square-triangles/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type HalfSquareTrianglesParams = {
  finishedBlockIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: HalfSquareTrianglesParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  const squareCutIn = finishedBlockIn + 0.875;

  lines.push(DISCLAIMER);

  lines.push(
    `Half-Square Triangles (HST) quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(`Finished block size: ${finishedBlockIn}" square.`);

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    `Block construction: Each HST block is made from two triangles sewn together along the diagonal. Cut squares at ${squareCutIn}" × ${squareCutIn}".`
  );

  lines.push(
    'Make HSTs: Pair two fabric squares right sides together. Draw a diagonal line, sew 1/4" on both sides of the line, cut on the line, press open. Trim to ${finishedBlockIn + 0.5}" square.'
  );

  lines.push(
    'Assembly: Arrange HST blocks in your desired layout. Consider rotating blocks to create secondary patterns (chevrons, diamonds, zigzags). Sew into rows, then join rows.'
  );

  lines.push(
    'Tip: HSTs are versatile building blocks. The diagonal seam creates dynamic movement. Use contrasting fabrics for maximum impact.'
  );

  return lines;
}
