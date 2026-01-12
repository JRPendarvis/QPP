// src/config/patterns/simple-squares/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type SimpleSquaresParams = {
  finishedSquareIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: SimpleSquaresParams
): string[] {
  const lines: string[] = [];
  const { finishedSquareIn } = params;

  const squaresAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedSquareIn));
  const squaresDown = Math.max(1, Math.round(quiltSize.heightIn / finishedSquareIn));
  const totalSquares = squaresAcross * squaresDown;

  const squareCutIn = finishedSquareIn + 0.5;

  lines.push(DISCLAIMER);

  lines.push(
    `Simple Squares quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${squaresAcross} squares across × ${squaresDown} squares down = ${totalSquares} total squares.`
  );

  lines.push(`Each square: ${finishedSquareIn}" finished (${squareCutIn}" cut).`);

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    `Cutting: Cut ${totalSquares} squares at ${squareCutIn}" × ${squareCutIn}". Distribute fabrics in a pleasing random or organized arrangement.`
  );

  lines.push(
    `Assembly: Arrange squares in ${squaresAcross} rows of ${squaresDown} squares each. Sew squares into rows, pressing seams in alternating directions. Join rows together.`
  );

  lines.push(
    'Tip: Simple Squares is the perfect beginner pattern and ideal for showcasing special fabrics, charm packs, or creating a scrappy look. Consider color gradations or random placement for different effects.'
  );

  return lines;
}
