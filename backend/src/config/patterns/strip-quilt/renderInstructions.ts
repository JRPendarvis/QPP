// src/config/patterns/strip-quilt/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type StripQuiltParams = {
  stripWidthIn: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: StripQuiltParams
): string[] {
  const lines: string[] = [];
  const { stripWidthIn } = params;

  const stripsNeeded = Math.max(1, Math.ceil(quiltSize.widthIn / stripWidthIn));
  const stripCutIn = stripWidthIn + 0.5;
  const stripLengthCutIn = quiltSize.heightIn + 0.5;

  lines.push(DISCLAIMER);

  lines.push(
    `Strip Quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}".`
  );

  lines.push(
    `This simple design features vertical strips running the full length of the quilt. Approximately ${stripsNeeded} strips at ${stripWidthIn}" finished width.`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    `Cutting: Cut strips ${stripCutIn}" wide × ${stripLengthCutIn}" long (full quilt height plus seam allowance). You'll need approximately ${stripsNeeded} strips.`
  );

  lines.push(
    'Assembly: Arrange strips in desired color order. Sew strips together lengthwise, pressing seams to one side or alternating directions.'
  );

  lines.push(
    'Variations: Try horizontal strips instead of vertical, vary strip widths for visual interest, or create a bargello effect by offsetting strip patterns.'
  );

  lines.push(
    'Tip: Strip quilts are extremely beginner-friendly and quick to assemble. Perfect for showcasing bold prints or creating ombré color effects.'
  );

  return lines;
}
