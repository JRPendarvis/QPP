import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import type { GrandmothersFlowerGardenComputedPlan } from './plan';

function fmtIn(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded.toFixed(2)}`;
}

function getName(namesBySlot: Record<string, string> | undefined, key: string): string | undefined {
  const v = namesBySlot?.[key];
  if (!v) return undefined;
  const trimmed = String(v).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function renderInstructions(plan: GrandmothersFlowerGardenComputedPlan, fabrics: FabricAssignments): string[] {
  const namesBySlot = fabrics.namesBySlot as unknown as Record<string, string> | undefined;

  // SVG COLOR slot mapping (template contract):
  // COLOR1 = Background/pathway
  // COLOR2 = Center hexagon
  // COLOR3 = Inner ring petals
  // COLOR4 = Outer ring petals
  // COLOR5..COLOR8 (if present) = Additional petal fabrics (deterministically distributed)
  const color1 = getName(namesBySlot, 'COLOR1') ?? getName(namesBySlot, 'BACKGROUND') ?? 'Fabric 1';
  const color2 = getName(namesBySlot, 'COLOR2') ?? getName(namesBySlot, 'PRIMARY') ?? 'Fabric 2';
  const color3 = getName(namesBySlot, 'COLOR3') ?? getName(namesBySlot, 'SECONDARY') ?? 'Fabric 3';
  const color4 = getName(namesBySlot, 'COLOR4') ?? getName(namesBySlot, 'ACCENT');

  const color5 = getName(namesBySlot, 'COLOR5');
  const color6 = getName(namesBySlot, 'COLOR6');
  const color7 = getName(namesBySlot, 'COLOR7');
  const color8 = getName(namesBySlot, 'COLOR8');

  // Petal palette (deterministic):
  // Always start with COLOR3, then COLOR4 (if present), then COLOR5..COLOR8 (if present)
  const petalPalette: { slot: string; name: string }[] = [{ slot: 'COLOR3', name: color3 }];

  if (color4) petalPalette.push({ slot: 'COLOR4', name: color4 });
  if (color5) petalPalette.push({ slot: 'COLOR5', name: color5 });
  if (color6) petalPalette.push({ slot: 'COLOR6', name: color6 });
  if (color7) petalPalette.push({ slot: 'COLOR7', name: color7 });
  if (color8) petalPalette.push({ slot: 'COLOR8', name: color8 });

  // Total petals across quilt = inner ring + outer ring totals
  const totalPetalHexagons = plan.totalInnerRingHexagons + plan.totalOuterRingHexagons;

  // Round-robin distribution across provided petalPalette
  const petalCountsBySlot = new Map<string, number>();
  for (const p of petalPalette) petalCountsBySlot.set(p.slot, 0);

  for (let i = 0; i < totalPetalHexagons; i++) {
    const p = petalPalette[i % petalPalette.length];
    petalCountsBySlot.set(p.slot, (petalCountsBySlot.get(p.slot) ?? 0) + 1);
  }

  const lines: string[] = [];

  lines.push(
    '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!',
  );

  lines.push(
    `Quilt size target: ${fmtIn(plan.widthIn)}" × ${fmtIn(plan.heightIn)}". Computed layout: ${plan.blocksAcross} blocks across × ${plan.blocksDown} blocks down = ${plan.blockCount} blocks.`,
  );

  lines.push(`Finished block size: ${fmtIn(plan.finishedBlockIn)}" square.`);
  lines.push(
    `Computed finished quilt top (before borders): ${fmtIn(plan.computedFinishedTopWidthIn)}" × ${fmtIn(plan.computedFinishedTopHeightIn)}".`,
  );

  // Fabric summary by slot (names only)
  const fabricSummaryParts: string[] = [];
  fabricSummaryParts.push(`COLOR1 = ${color1}`);
  fabricSummaryParts.push(`COLOR2 = ${color2}`);
  fabricSummaryParts.push(`COLOR3 = ${color3}`);
  if (color4) fabricSummaryParts.push(`COLOR4 = ${color4}`);
  if (color5) fabricSummaryParts.push(`COLOR5 = ${color5}`);
  if (color6) fabricSummaryParts.push(`COLOR6 = ${color6}`);
  if (color7) fabricSummaryParts.push(`COLOR7 = ${color7}`);
  if (color8) fabricSummaryParts.push(`COLOR8 = ${color8}`);
  lines.push(`Fabrics: ${fabricSummaryParts.join(', ')}.`);

  lines.push(
    `Cutting reference: seam allowance ${fmtIn(plan.seamAllowanceIn)}". Each block is modeled as 1 background square plus ${plan.hexagonsPerBlock} hexagons (1 center + 6 petals).`,
  );

  // Cutting totals
  lines.push(`Cut COLOR1 (${color1}) squares: ${plan.blockCount} at ${fmtIn(plan.blockCutSquareIn)}" square.`);

  lines.push(
    `Cut hexagons (across flats): finished ${fmtIn(plan.finishedHexagonAcrossFlatsIn)}", cut ${fmtIn(plan.hexagonCutAcrossFlatsIn)}" (includes seam allowance). Total hexagons: ${plan.totalHexagons}.`,
  );

  lines.push(`Cut COLOR2 (${color2}) center hexagons: ${plan.totalCenterHexagons}.`);

  // Petal totals by slot, stable order
  const petalSlotsInOrder = ['COLOR3', 'COLOR4', 'COLOR5', 'COLOR6', 'COLOR7', 'COLOR8'] as const;
  for (const slot of petalSlotsInOrder) {
    const name = getName(namesBySlot, slot);
    if (!name) continue;

    const count = petalCountsBySlot.get(slot) ?? 0;
    if (count > 0) {
      lines.push(`Cut ${slot} (${name}) petal hexagons: ${count}.`);
    }
  }

  // Assembly
  lines.push(
    `Assembly summary: For each block, piece 1 center hexagon (COLOR2) with 6 surrounding petal hexagons (distributed across COLOR3..COLOR8 if provided). Join blocks into ${plan.blocksAcross} × ${plan.blocksDown}. Press seams consistently for a flat quilt top.`,
  );

  lines.push(
    `Borders: If you want to reach an exact target size, adding a border increases the quilt top size by twice the border width (for example, a 2" border adds 4" to both the width and height).`,
  );

  return lines;
}
