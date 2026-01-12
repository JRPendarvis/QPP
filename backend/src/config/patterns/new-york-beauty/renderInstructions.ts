// src/config/patterns/new-york-beauty/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type NewYorkBeautyParams = {
  finishedBlockIn: number;
  spikesPerArc: number;
};

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: NewYorkBeautyParams
): string[] {
  const lines: string[] = [];
  const { finishedBlockIn, spikesPerArc } = params;

  const blocksAcross = Math.max(1, Math.round(quiltSize.widthIn / finishedBlockIn));
  const blocksDown = Math.max(1, Math.round(quiltSize.heightIn / finishedBlockIn));
  const blockCount = blocksAcross * blocksDown;

  lines.push(DISCLAIMER);

  lines.push(
    `New York Beauty quilt with target size: ${quiltSize.widthIn}" × ${quiltSize.heightIn}". Layout: ${blocksAcross} × ${blocksDown} blocks (${blockCount} total).`
  );

  lines.push(
    `Finished block size: ${finishedBlockIn}" square. Each arc features ${spikesPerArc} pointed spikes.`
  );

  const fabricList = fabrics.namesBySlot.map((name, idx) => `Fabric ${idx + 1}: ${name}`).join(', ');
  lines.push(`Fabrics used: ${fabricList}.`);

  lines.push(
    'Block construction: This dramatic pattern features curved pieced arcs with sharp points (spikes) that radiate from corners. Each block typically has one curved arc set into a background.'
  );

  lines.push(
    'Cutting: Requires templates for accurate curved pieces and spike units. The spikes are foundation-pieced for precision.'
  );

  lines.push(
    'Assembly: Foundation piece the spiked arc, then set it into the curved background piece. This involves both curved piecing and sharp point alignment.'
  );

  lines.push(
    'Tip: This is an advanced pattern. Consider foundation paper piecing for the spikes and practice curved seam technique. Block variations change the arc placement and create different secondary patterns.'
  );

  return lines;
}
