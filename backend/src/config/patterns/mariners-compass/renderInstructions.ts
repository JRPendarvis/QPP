// src/config/patterns/mariners-compass/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type MarinersCompassParams = {
  finishedBlockIn: number;
  compassPointsCount: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: MarinersCompassParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn, compassPointsCount } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  lines.push(DISCLAIMER);

  lines.push(
    `Mariner's Compass quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square. Each compass has ${compassPointsCount} points radiating from the center.`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: This challenging pattern features pointed wedges radiating from a central circle, resembling a nautical compass rose. Requires precise templates and careful piecing.'
  );

  lines.push(
    'Cutting: Use accurate templates for the compass points (long narrow wedges) and background pieces. Sharp points require precision cutting.'
  );

  lines.push(
    'Assembly: Piece compass points in pairs or groups, then set into background. Y-seams are common. Consider foundation paper piecing for accuracy.'
  );

  lines.push(
    'Tip: This is an advanced pattern. Start with a smaller compass (8-12 points) to practice technique before attempting 16+ point versions.'
  );

  return lines;
}
