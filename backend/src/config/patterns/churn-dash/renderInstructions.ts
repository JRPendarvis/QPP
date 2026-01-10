import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

const DISCLAIMER =
  '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

type ChurnDashParams = {
  finishedBlockIn: number;
  subunitFinishedIn: number;
};

function slotName(fabrics: FabricAssignments, slot: string): string {
  const index = parseInt(slot.replace('COLOR', '')) - 1;
  return fabrics.namesBySlot[index] ?? `Fabric ${index + 1}`;
}

function formatIn(value: number): string {
  // Keep simple, deterministic formatting; avoid trailing zeros noise.
  // Examples: 3.5 -> "3.5", 3.875 -> "3.875"
  return `${value}`;
}

function calcLayout(quilt: QuiltSizeIn, finishedBlockIn: number) {
  const cols = Math.max(1, Math.round(quilt.widthIn / finishedBlockIn));
  const rows = Math.max(1, Math.round(quilt.heightIn / finishedBlockIn));
  const blocks = rows * cols;
  const actualW = cols * finishedBlockIn;
  const actualH = rows * finishedBlockIn;
  return { rows, cols, blocks, actualW, actualH };
}

export function renderInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: ChurnDashParams
): string[] {
  const { finishedBlockIn, subunitFinishedIn } = params;
  
  const bg = slotName(fabrics, 'COLOR1');
  const feature = slotName(fabrics, 'COLOR2');
  const center = slotName(fabrics, 'COLOR3'); // If only 2 fabrics were provided, caller may map COLOR3=>COLOR2 elsewhere.

  const { rows, cols, blocks, actualW, actualH } = calcLayout(quiltSize, finishedBlockIn);
  
  // Cut sizes
  const subunitUnfinished = subunitFinishedIn + 0.5; // seam allowance
  const railRectW = (subunitFinishedIn / 2) + 0.5; // 2"
  const railRectH = subunitUnfinished; // 3.5"
  const centerCut = subunitUnfinished; // 3.5"
  const hstCut = subunitFinishedIn + 0.875; // 3.875"

  const lines: string[] = [];

  lines.push(DISCLAIMER);

  lines.push(
    `Quilt size target: ${formatIn(quiltSize.widthIn)}" × ${formatIn(quiltSize.heightIn)}". Computed layout: ${cols} blocks across × ${rows} blocks down = ${blocks} blocks.`
  );
  lines.push(
    `Finished block size: ${formatIn(finishedBlockIn)}" square. Subunit (3×3 grid) finished size: ${formatIn(subunitFinishedIn)}" square.`
  );
  lines.push(
    `Computed finished quilt top (before borders): ${formatIn(actualW)}" × ${formatIn(actualH)}".`
  );

  lines.push(`Fabrics: BACKGROUND = ${bg}, FEATURE = ${feature}, CENTER = ${center}.`);

  lines.push(`Cutting (totals for ${blocks} blocks):`);
  lines.push(`Cut CENTER (${center}) squares: ${blocks} at ${formatIn(centerCut)}" square.`);

  lines.push(`Cut RAIL OUTSIDE rectangles (${bg}): ${4 * blocks} at ${formatIn(railRectW)}" × ${formatIn(railRectH)}".`);
  lines.push(`Cut RAIL INSIDE rectangles (${feature}): ${4 * blocks} at ${formatIn(railRectW)}" × ${formatIn(railRectH)}".`);

  lines.push(
    `Cut HST squares (two-at-a-time method for corner units): ${2 * blocks} ${bg} squares and ${2 * blocks} ${feature} squares, each at ${formatIn(hstCut)}" square (yields ${4 * blocks} HST units).`
  );

  lines.push(`Assembly (per block, deterministic 3×3 placement):`);
  lines.push(`Make 4 corner HST units (finished ${formatIn(subunitFinishedIn)}" square). Press seams consistently.`);
  lines.push(
    `Make 4 rail units by joining 1 ${bg} rectangle + 1 ${feature} rectangle to form a ${formatIn(subunitFinishedIn)}" finished unit.`
  );
  lines.push(
    `Assemble block as a 3×3 grid: [HST] [RAIL] [HST] / [RAIL] [CENTER] [RAIL] / [HST] [RAIL] [HST]. Ensure ${feature} portions align to form the "churn" shape.`
  );
  lines.push(`Join blocks into ${cols} × ${rows} layout.`);
  lines.push(`Adding borders increases the finished quilt size by twice the border width on each side (2× the border width added to both width and height).`);

  return lines;
}
