// src/config/patterns/feathered-star/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type FeatheredStarParams = {
  finishedBlockIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: FeatheredStarParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  lines.push(DISCLAIMER);

  lines.push(
    `Feathered Star quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(`Finished block size: ${finishedBlockIn}" square.`);

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: Each Feathered Star features a central star with "feathered" points created from many small triangles. Typically uses 3-4 fabrics per block (background, star, and feather fabrics).'
  );

  lines.push(
    'Assembly: Construct the feathered points using small HST units. Assemble the star points and center, then join with background corner squares and side triangles.'
  );

  lines.push(
    'Tip: Accuracy is crucial with this pattern due to the many small pieces. Consider using foundation paper piecing for the feathered points.'
  );

  return lines;
}
