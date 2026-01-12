import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import type { FlyingGeeseComputedPlan } from './plan';

function fmtIn(n: number): string {
  // Keep stable formatting; avoid unnecessary decimals beyond 3 places.
  const s = n.toFixed(3).replace(/\.?0+$/, '');
  return `${s}"`;
}

export function renderInstructions(plan: FlyingGeeseComputedPlan, fabrics: FabricAssignments): string[] {
  const lines: string[] = [];

  lines.push(
    '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!'
  );

  lines.push(
    `Quilt size target: ${fmtIn(plan.widthIn)} × ${fmtIn(plan.heightIn)}. Computed layout: ${plan.blocksAcross} blocks across × ${plan.blocksDown} blocks down = ${plan.blockCount} blocks.`
  );

  lines.push(
    `Finished block size: ${fmtIn(plan.finishedBlockIn)} square. Each block contains 4 Flying Geese units (2×2).`
  );

  lines.push(
    `Computed finished quilt top (before borders): ${fmtIn(plan.computedFinishedTopWidthIn)} × ${fmtIn(plan.computedFinishedTopHeightIn)}.`
  );

  // Slot mapping per template contract
  // COLOR1 = SKY (index 0), COLOR2..COLOR5 = GOOSE_A..GOOSE_D (indices 1-4)
  const roleToSlotIndex: Record<string, number> = {
    'SKY': 0,
    'GOOSE_A': 1,
    'GOOSE_B': 2,
    'GOOSE_C': 3,
    'GOOSE_D': 4,
  };

  const skyName = fabrics.namesBySlot[0] ?? 'Sky fabric';
  const gooseNames = [
    `GOOSE_A = ${fabrics.namesBySlot[1] ?? 'Goose fabric'}`,
    `GOOSE_B = ${fabrics.namesBySlot[2] ?? fabrics.namesBySlot[1] ?? 'Goose fabric'}`,
    `GOOSE_C = ${fabrics.namesBySlot[3] ?? fabrics.namesBySlot[1] ?? 'Goose fabric'}`,
    `GOOSE_D = ${fabrics.namesBySlot[4] ?? fabrics.namesBySlot[1] ?? 'Goose fabric'}`,
  ];

  lines.push(`Fabrics: SKY = ${skyName}, ${gooseNames.join(', ')}.`);

  lines.push('Cutting (totals):');

  // SKY: 2 squares per unit
  const totalSkySquares = plan.unitCount * 2;
  lines.push(`Cut SKY (${skyName}) squares: ${totalSkySquares} at ${fmtIn(plan.skySquareIn)} square.`);

  // GOOSE: 1 rectangle per unit, distributed across goose roles deterministically
  for (const g of plan.geesePerRole) {
    const slotIndex = roleToSlotIndex[g.role] ?? 1;
    const roleName = fabrics.namesBySlot[slotIndex] ?? 'Goose fabric';
    lines.push(
      `Cut ${g.role} (${roleName}) rectangles: ${g.quantity} at ${fmtIn(plan.gooseRectWidthIn)} × ${fmtIn(plan.gooseRectHeightIn)}.`
    );
  }

  lines.push(
    `Assembly: For each Flying Geese unit, combine 1 goose rectangle (${fmtIn(plan.gooseRectWidthIn)} × ${fmtIn(plan.gooseRectHeightIn)}) with 2 sky squares (${fmtIn(plan.skySquareIn)} square).`
  );

  lines.push(
    'Assemble 4 units into a 2×2 grid to complete each block.'
  );

  lines.push(
    'Deterministic fabric distribution: GOOSE_A..GOOSE_D are used for the 4 geese positions. If you provide more than 4 goose fabrics, treat the extras as alternates and rotate them across blocks by block index to keep distribution even.'
  );

  return lines;
}
