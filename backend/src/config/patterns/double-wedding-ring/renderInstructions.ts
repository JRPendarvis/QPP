// src/config/patterns/double-wedding-ring/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type DoubleWeddingRingParams = {
  ringDiameterIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: DoubleWeddingRingParams
): string[] {
  const lines: string[] = [];

  lines.push(DISCLAIMER);

  lines.push(
    `Double Wedding Ring quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}".`
  );

  lines.push(
    `This classic pattern features interlocking rings (approximately ${params.ringDiameterIn}" diameter) creating a romantic, curved design.`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Cutting: This pattern requires curved piecing. Template patterns are essential for accurate cutting of the arc segments and melon shapes.'
  );

  lines.push(
    'Assembly: Piece individual arcs, then join them to background segments. The rings interlock across the quilt surface. Take care with curved seams - pinning and easing are key.'
  );

  lines.push(
    'Tip: Use a light background fabric to make the interlocking rings stand out. Consider scrappy arc segments for a traditional look.'
  );

  return lines;
}
