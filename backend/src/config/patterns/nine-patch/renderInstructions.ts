// src/config/patterns/nine-patch/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type NinePatchParams = {
  finishedBlockIn: number;
  squareFinishedIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: NinePatchParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn, squareFinishedIn } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  const squareCutIn = squareFinishedIn + 0.5;
  const squaresPerBlock = 9;
  const totalSquares = blockCount * squaresPerBlock;

  lines.push(DISCLAIMER);

  lines.push(
    `Nine Patch quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square. Each square: ${squareFinishedIn}" finished (${squareCutIn}" cut).`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    `Cutting: Cut ${totalSquares} total squares at ${squareCutIn}" × ${squareCutIn}". Distribute fabrics in a pleasing arrangement.`
  );

  lines.push(
    'Block construction: Arrange 9 squares in a 3×3 grid. Classic arrangement uses alternating fabrics (checkerboard) or a center square surrounded by contrasting squares.'
  );

  lines.push(
    'Assembly: Sew squares into 3 rows of 3. Press seams in opposite directions for each row (row 1: left, row 2: right, row 3: left). This allows seams to nest when joining rows.'
  );

  lines.push(
    'Tip: Nine Patch is perfect for beginners and scrappy quilts. Vary fabric placement within each block or use consistent placement for different effects.'
  );

  return lines;
}
