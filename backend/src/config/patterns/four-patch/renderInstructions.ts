import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

export function renderInstructions(plan: any, fabrics: FabricAssignments): string[] {
  const names = fabrics.namesBySlot as unknown as string[];

  const color1 = names[0] ?? 'Fabric 1';
  const color2 = names[1] ?? 'Fabric 2';
  const color3 = names[2] ?? 'Fabric 3';
  const color4 = names[3]; // optional for 3–4 fabric patterns

  const totalUnits = plan.blockCount * plan.unitsPerBlock;

  // Deterministic distribution:
  // - If 4 fabrics: split as evenly as possible across 4 colors.
  // - If 3 fabrics: split as evenly as possible across 3 colors.
  const activeColors = color4 ? 4 : 3;
  const base = Math.floor(totalUnits / activeColors);
  const remainder = totalUnits % activeColors;

  const counts: number[] = Array(activeColors).fill(base);
  for (let i = 0; i < remainder; i += 1) counts[i] += 1;

  const lines: string[] = [
    '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!',

    `Quilt size target: ${plan.widthIn}" × ${plan.heightIn}".`,
    `Computed layout: ${plan.blocksAcross} blocks across × ${plan.blocksDown} blocks down = ${plan.blockCount} blocks.`,
    `Finished block size: ${plan.finishedBlockIn}" square (2 × 2 grid).`,
    `Sub-unit finished size: ${plan.finishedUnitIn}" square.`,
    `Computed finished quilt top (before borders): ${plan.computedFinishedTopWidthIn}" × ${plan.computedFinishedTopHeightIn}".`,

    'Cutting (totals):',
    `Cut ${color1} squares: ${counts[0]} at ${plan.unitCutSquareIn}" square.`,
    `Cut ${color2} squares: ${counts[1]} at ${plan.unitCutSquareIn}" square.`,
    `Cut ${color3} squares: ${counts[2]} at ${plan.unitCutSquareIn}" square.`,
  ];

  if (color4) {
    lines.push(`Cut ${color4} squares: ${counts[3]} at ${plan.unitCutSquareIn}" square.`);
  }

  lines.push(
    'Assembly summary:',
    'Each block consists of four equal squares arranged in a 2 × 2 grid.',
    'Sew two squares together to form rows, then join rows to complete each block.',
    'Rotate blocks as desired to create visual variety across the quilt top.'
  );

  return lines;
}
