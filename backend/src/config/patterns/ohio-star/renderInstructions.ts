// src/config/patterns/ohio-star/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type OhioStarParams = {
  finishedBlockIn: number;
  unitFinishedIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: OhioStarParams
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
    `Ohio Star quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square (3×3 grid of ${unitFinishedIn}" units).`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push('Block construction: Each block uses 4 HST star points, 4 background corner squares, and 1 center square.');

  lines.push(
    `Cutting per block: For HSTs, cut 4 star fabric squares and 4 background squares at ${hstCutIn}". Cut 4 background corner squares and 1 center square at ${squareCutIn}".`
  );

  lines.push(
    'Make HSTs: Pair each star square with a background square. Draw diagonal, sew 1/4" on both sides, cut on line, press. Trim to ${unitFinishedIn + 0.5}" unfinished.'
  );

  lines.push(
    'Assembly: Arrange in 3×3 grid - corners are background, sides are HSTs (points toward center), center is star fabric. Sew into rows, then join rows.'
  );

  lines.push(
    'Tip: Ohio Star is a classic, versatile pattern. Vary star and background fabrics for scrappy or coordinated looks.'
  );

  return lines;
}
