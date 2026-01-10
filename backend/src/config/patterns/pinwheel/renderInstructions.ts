// patterns/pinwheel/renderInstructions.ts
//
// Deterministic, plan-driven Pinwheel instructions (no LLM).
// Safe for MVP: all numbers come from plan.ts.

import type { PinwheelPlan } from './plan';

export type PinwheelFabricNames = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
};

function fmtQuarterInches(value: number): string {
  const whole = Math.floor(value);
  const frac = Math.round((value - whole) * 4) / 4;

  const fracMap: Record<number, string> = {
    0: '',
    0.25: '1/4',
    0.5: '1/2',
    0.75: '3/4',
  };

  const fracStr = fracMap[frac] ?? '';
  if (!fracStr) return `${whole}"`;
  if (whole === 0) return `${fracStr}"`;
  return `${whole}-${fracStr}"`;
}

export function renderPinwheelInstructions(plan: PinwheelPlan, fabrics: PinwheelFabricNames): string[] {
  const bgCut = plan.cutList.find((c) => c.role === 'BACKGROUND');
  const prCut = plan.cutList.find((c) => c.role === 'PRIMARY');
  const scCut = plan.cutList.find((c) => c.role === 'SECONDARY');
  const acCut = plan.cutList.find((c) => c.role === 'ACCENT');

  if (!bgCut || !prCut || !scCut || !acCut) {
    throw new Error('Pinwheel instructions: missing required cutList items.');
  }

  const [pairPrimary, pairSecondary, pairAccent] = plan.hstPairs;

  return [
    `📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish — rearrange blocks, change colors, or modify the layout to suit your creative vision!`,

    `Quilt size: ${plan.quiltSizeIn.width}" × ${plan.quiltSizeIn.height}". Layout: ${plan.cols} × ${plan.rows} blocks (${plan.blockCount} total). Finished block size: ${plan.blockFinishedIn}" square.`,

    `Half-square triangles (HSTs): Use the ${plan.hstMethod} method. Cut squares at ${fmtQuarterInches(plan.cutSquareIn)} and trim HSTs to ${fmtQuarterInches(plan.hstTrimUnfinishedIn)} unfinished (${fmtQuarterInches(plan.hstFinishedIn)} finished).`,

    `Cut BACKGROUND (${fabrics.background}): ${bgCut.count} squares at ${fmtQuarterInches(bgCut.sizeIn)}.`,
    `Cut PRIMARY (${fabrics.primary}): ${prCut.count} squares at ${fmtQuarterInches(prCut.sizeIn)}.`,
    `Cut SECONDARY (${fabrics.secondary}): ${scCut.count} squares at ${fmtQuarterInches(scCut.sizeIn)}.`,
    `Cut ACCENT (${fabrics.accent}): ${acCut.count} squares at ${fmtQuarterInches(acCut.sizeIn)}.`,

    `Create HSTs (2 at a time): Pair one BACKGROUND square with one blade square. Draw a diagonal line corner-to-corner, sew 1/4" on both sides, cut on the line, press, then trim to ${fmtQuarterInches(plan.hstTrimUnfinishedIn)}.`,

    `HST batch counts: BACKGROUND+PRIMARY: ${pairPrimary.backgroundSquares} pairs → ${pairPrimary.hstYield} HSTs. BACKGROUND+SECONDARY: ${pairSecondary.backgroundSquares} pairs → ${pairSecondary.hstYield} HSTs. BACKGROUND+ACCENT: ${pairAccent.backgroundSquares} pairs → ${pairAccent.hstYield} HSTs.`,

    `Assemble blocks: Each pinwheel block uses 4 HSTs in a 2×2 grid. Arrange the blade triangles so they spin (all clockwise or all counter-clockwise). Sew the top row (2 HSTs) and bottom row (2 HSTs), press row seams in opposite directions so they nest, then sew rows together. Press the final seam open to reduce bulk at the center.`,

    `Layout quilt top: Arrange blocks in a ${plan.cols} × ${plan.rows} grid. Apply rotation strategy "${plan.rotationStrategy}": rotate every other block by 90° using (row + col) parity to create consistent secondary movement.`,

    `Finish: Layer with batting and backing, quilt as desired, and bind. Curved or spiral quilting lines can echo the pinwheel motion.`,
  ];
}
