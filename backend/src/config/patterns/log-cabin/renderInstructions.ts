// src/config/patterns/log-cabin/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type LogCabinParams = {
  finishedBlockIn: number;
  centerSquareIn: number;
  stripWidthIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: LogCabinParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn, centerSquareIn, stripWidthIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  lines.push(DISCLAIMER);

  lines.push(
    `Log Cabin quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square. Center square: ${centerSquareIn}" finished. Strip width: ${stripWidthIn}" finished.`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: Start with a center square, then add strips in a "log cabin" sequence around the center. Traditionally, light fabrics are placed on two opposite sides and dark fabrics on the other two sides.'
  );

  lines.push(
    `Cutting: Center squares ${centerSquareIn + 0.5}" unfinished. Strips cut ${stripWidthIn + 0.5}" wide, varying lengths as you build outward.`
  );

  lines.push(
    'Assembly: Add each strip clockwise (or counter-clockwise) around the center. Press seams away from the center after each addition.'
  );

  lines.push(
    'Layout variations: Experiment with block orientation to create secondary patterns like Barn Raising, Straight Furrows, or Courthouse Steps.'
  );

  return lines;
}
