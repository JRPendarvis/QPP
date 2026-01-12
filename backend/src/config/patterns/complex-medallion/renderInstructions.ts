// src/config/patterns/complex-medallion/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type ComplexMedallionParams = {
  finishedBlockIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: ComplexMedallionParams
): string[] {
  const lines: string[] = [];

  lines.push(DISCLAIMER);

  lines.push(
    `Complex Medallion quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}".`
  );

  lines.push(
    `This intricate pattern features a central medallion (${params.finishedBlockIn}" square) surrounded by multiple borders and decorative elements.`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Assembly: Start with the central medallion. Add successive borders, working from the center outward. Each border can incorporate pieced elements, appliqué, or simple strips.'
  );

  lines.push(
    'Note: Complex Medallion quilts are highly customizable. Consider varying border widths and incorporating different design elements to create your unique heirloom piece.'
  );

  return lines;
}
