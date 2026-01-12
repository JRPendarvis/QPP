// src/config/patterns/rail-fence/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type RailFenceParams = {
  finishedBlockIn: number;
  stripWidthIn: number;
  stripsPerBlock: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: RailFenceParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn, stripWidthIn, stripsPerBlock } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  const stripCutIn = stripWidthIn + 0.5;
  const stripLengthCutIn = finishedBlockIn + 0.5;

  lines.push(DISCLAIMER);

  lines.push(
    `Rail Fence quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square. Each block uses ${stripsPerBlock} strips (${stripWidthIn}" finished width).`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    `Cutting: Cut strips ${stripCutIn}" × ${stripLengthCutIn}". You'll need ${stripsPerBlock} strips per block (${blockCount * stripsPerBlock} total).`
  );

  lines.push(
    `Block construction: Sew ${stripsPerBlock} strips together lengthwise. Press seams in one direction. This creates one ${finishedBlockIn}" square block.`
  );

  lines.push(
    'Assembly: Arrange blocks by rotating them 90° in alternating positions. This creates the characteristic diagonal "rail fence" pattern across the quilt surface.'
  );

  lines.push(
    'Tip: Rail Fence is beginner-friendly and perfect for showcasing fabric collections. Try using 4-5 strips per block for more variation, or vary strip widths for added interest.'
  );

  return lines;
}
