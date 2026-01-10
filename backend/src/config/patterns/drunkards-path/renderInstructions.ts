import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import type { DrunkardsPathComputedPlan } from './plan';

function fmtIn(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${rounded}"`;
}

function fmtSquare(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${rounded}" square`;
}

/**
 * Your FabricAssignments.namesBySlot appears to be typed as string[] in this codebase,
 * but some patterns may treat it like a record.
 *
 * This helper supports BOTH:
 * - Array form: namesBySlot[0] => COLOR1, namesBySlot[1] => COLOR2, ...
 * - Record form: namesBySlot["COLOR1"] => ...
 */
function getSlotName(fabrics: FabricAssignments, slot: 'COLOR1' | 'COLOR2'): string {
  const anyF = fabrics as unknown as { namesBySlot?: unknown };

  const slotIndex = slot === 'COLOR1' ? 0 : 1;

  const namesBySlot = anyF.namesBySlot;

  if (Array.isArray(namesBySlot)) {
    const v = namesBySlot[slotIndex];
    return typeof v === 'string' && v.trim().length > 0 ? v : slot;
  }

  if (namesBySlot && typeof namesBySlot === 'object') {
    const record = namesBySlot as Record<string, unknown>;
    const v = record[slot];
    return typeof v === 'string' && v.trim().length > 0 ? v : slot;
  }

  return slot;
}

export function renderInstructions(
  plan: DrunkardsPathComputedPlan,
  fabrics: FabricAssignments
): string[] {
  // Slot contract for this pattern:
  // - COLOR1 = base square (background remainder)
  // - COLOR2 = quarter-circle overlay (curve piece)
  const color1Name = getSlotName(fabrics, 'COLOR1');
  const color2Name = getSlotName(fabrics, 'COLOR2');

  const lines: string[] = [];

  lines.push(
    '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!'
  );

  lines.push(
    `Quilt size target: ${fmtIn(plan.widthIn)} × ${fmtIn(plan.heightIn)}. Computed layout: ${plan.blocksAcross} blocks across × ${plan.blocksDown} blocks down = ${plan.blockCount} blocks.`
  );

  lines.push(`Finished block size: ${fmtIn(plan.finishedBlockIn)} square.`);
  lines.push(
    `Unit (Drunkard’s Path) finished size: ${fmtIn(plan.finishedUnitIn)} square (2 × 2 units per block).`
  );

  lines.push(
    `Computed finished quilt top (before borders): ${fmtIn(plan.computedFinishedTopWidthIn)} × ${fmtIn(plan.computedFinishedTopHeightIn)}.`
  );

  lines.push(`Fabrics: COLOR1 = ${color1Name}, COLOR2 = ${color2Name}.`);

  lines.push(`Cutting (totals for ${plan.blockCount} blocks = ${plan.unitCount} units):`);
  lines.push(
    `Cut COLOR1 squares (${color1Name}): ${plan.unitCount} at ${fmtSquare(plan.unitCutSquareIn)}.`
  );
  lines.push(
    `Cut COLOR2 squares (${color2Name}): ${plan.unitCount} at ${fmtSquare(plan.unitCutSquareIn)}.`
  );

  lines.push('Assembly overview (deterministic):');
  lines.push(
    `For each unit: pair 1 COLOR1 square with 1 COLOR2 square, cut with a Drunkard’s Path template, then sew the curve with a 1/4" seam. Press seams consistently.`
  );
  lines.push(
    `For each block: join 4 units (2 × 2) to make one ${fmtIn(plan.finishedBlockIn)} finished block.`
  );
  lines.push(
    `Layout: arrange blocks in a ${plan.blocksAcross} × ${plan.blocksDown} grid. Rotation/dominance is deterministic via the pattern’s rotation strategy and checkerboard color swapping.`
  );

  lines.push(
    'Borders: adding a border increases the quilt size by twice the border width (once on each side).'
  );

  return lines;
}
