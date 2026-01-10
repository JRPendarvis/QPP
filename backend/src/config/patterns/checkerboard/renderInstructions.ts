// src/config/patterns/checkerboard/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

type CheckerboardParams = {
  // Preferred finished square sizes to attempt first.
  preferredFinishedBlockIn?: number[];
};

function pickFinishedBlockSize(quilt: QuiltSizeIn, candidates: number[]): number {
  // Prefer sizes that divide both dimensions cleanly; otherwise choose the lowest remainder.
  let best = candidates[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const b of candidates) {
    const remW = quilt.widthIn % b;
    const remH = quilt.heightIn % b;
    const score = remW + remH;

    if (score < bestScore) {
      bestScore = score;
      best = b;
    }
    if (bestScore === 0) break;
  }

  return best;
}

function calcLayout(quilt: QuiltSizeIn, finishedBlockIn: number) {
  const cols = Math.max(1, Math.round(quilt.widthIn / finishedBlockIn));
  const rows = Math.max(1, Math.round(quilt.heightIn / finishedBlockIn));
  const blocks = rows * cols;

  return { rows, cols, blocks };
}

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: CheckerboardParams = {}
): string[] {
  const candidates = params.preferredFinishedBlockIn ?? [12, 10, 8];
  const finishedSquareIn = pickFinishedBlockSize(quiltSize, candidates);
  const { rows, cols, blocks } = calcLayout(quiltSize, finishedSquareIn);

  // Squares: finished + 1/2" (standard piecing)
  const cutSquareIn = finishedSquareIn + 0.5;

  const fabricA = fabrics.namesBySlot[0] || 'Fabric A';
  const fabricB = fabrics.namesBySlot[1] || 'Fabric B';

  // In a checkerboard, counts are nearly equal.
  const countA = Math.ceil(blocks / 2);
  const countB = Math.floor(blocks / 2);

  return [
    `📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish — rearrange blocks, change colors, or modify the layout to suit your creative vision!`,
    `Quilt size target: ${Math.round(quiltSize.widthIn)}" × ${Math.round(quiltSize.heightIn)}".`,
    `Computed layout: ${cols} × ${rows} squares (${blocks} total). Finished square size: ${finishedSquareIn}" (cut ${cutSquareIn}").`,
    `Fabric assignment (2-fabric checkerboard):`,
    `- Fabric A: ${fabricA}`,
    `- Fabric B: ${fabricB}`,
    `Cut Fabric A (${fabricA}): Cut ${countA} squares at ${cutSquareIn}".`,
    `Cut Fabric B (${fabricB}): Cut ${countB} squares at ${cutSquareIn}".`,
    `Layout the quilt top: Arrange squares in a ${cols} × ${rows} grid. Place Fabric A where (row + col) is even, and Fabric B where (row + col) is odd to create the checkerboard.`,
    `Sewing: Piece squares into rows with 1/4" seams. Press seams in alternating directions per row to help nest. Join rows, nesting seams for clean intersections.`,
    `Finish: Layer with batting and backing, quilt as desired, and bind.`,
  ];
}
