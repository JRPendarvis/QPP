// src/config/patterns/storm-at-sea/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type StormAtSeaParams = {
  finishedBlockIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: StormAtSeaParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  lines.push(DISCLAIMER);

  lines.push(
    `Storm at Sea quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(`Finished block size: ${finishedBlockIn}" square.`);

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: This complex optical illusion pattern creates circular "wave" shapes through clever arrangement of squares, rectangles, and triangles. The design appears to have curved lines, but all piecing is straight seams.'
  );

  lines.push(
    'Assembly: Each block contains a center square surrounded by rectangular units and corner square-in-square units. The secondary pattern emerges when blocks are joined.'
  );

  lines.push(
    'Cutting: Requires careful cutting of many small pieces in multiple sizes. Accurate cutting and consistent seam allowances are essential.'
  );

  lines.push(
    'Tip: This is an intermediate to advanced pattern. The illusion of curves is created entirely with straight-line piecing. High contrast between fabrics enhances the wave effect.'
  );

  return lines;
}
