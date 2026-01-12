// src/config/patterns/pickle-dish/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type PickleDishParams = {
  finishedBlockIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: PickleDishParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  lines.push(DISCLAIMER);

  lines.push(
    `Pickle Dish quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(`Finished block size: ${finishedBlockIn}" square.`);

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: This vintage pattern features curved wedge-shaped "pickle" pieces arranged around a center square, creating a circular design within a square block.'
  );

  lines.push(
    'Cutting: Requires templates for the curved pickle wedges and background pieces. Each block typically uses 4 identical curved units.'
  );

  lines.push(
    'Assembly: Piece curved wedges to background pieces using curved piecing technique. Join the 4 quarters to complete the block.'
  );

  lines.push(
    'Tip: This pattern requires curved piecing skills. Pin carefully and ease curves for smooth seams. The resulting design creates beautiful secondary patterns when blocks are joined.'
  );

  return lines;
}
