// src/config/patterns/lone-star/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type LoneStarParams = {
  starDiameterIn: number;
  diamondFinishedIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: LoneStarParams
): string[] {
  const lines: string[] = [];
  const { starDiameterIn, diamondFinishedIn } = params;

  lines.push(DISCLAIMER);

  lines.push(
    `Lone Star (Star of Bethlehem) quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}".`
  );

  lines.push(
    `This dramatic pattern features a single large star (approximately ${starDiameterIn}" diameter) composed of small diamond pieces (${diamondFinishedIn}" finished).`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: The star consists of 8 points, each made from rows of diamond shapes. The diamonds are sewn into strips, then the strips are sewn together to form each point.'
  );

  lines.push(
    `Cutting: Use a 45-degree diamond template (${diamondFinishedIn}" finished size). You\'ll need many diamonds in graduated colors to create the starburst effect.`
  );

  lines.push(
    'Assembly: Construct the 8 star points, then join them together at the center. Add background squares and triangles to fill in around the star. Set-in seams (Y-seams) are required.'
  );

  lines.push(
    'Tip: Fabric placement creates the visual impact. Arrange fabrics from light to dark radiating from the center, or create color rings for maximum drama.'
  );

  return lines;
}
