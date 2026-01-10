import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

import { renderInstructions } from './renderInstructions';

export type DrunkardsPathComputedPlan = {
  patternId: 'drunkards-path';

  // Inputs (inches)
  widthIn: number;
  heightIn: number;

  // Block math
  finishedUnitIn: number; // 7
  finishedBlockIn: number; // 14 (2x2 units)
  seamAllowanceIn: number; // 0.25

  blocksAcross: number;
  blocksDown: number;
  blockCount: number;

  computedFinishedTopWidthIn: number;
  computedFinishedTopHeightIn: number;

  unitsPerBlock: number; // 4
  unitCount: number;

  // Cutting
  unitCutSquareIn: number; // 7.5
};

/**
 * Deterministic defaults for Drunkard's Path:
 * - A "finished block" is 14" square (2×2 of 7" finished units).
 * - Default quilt target is 70" × 84" (5 × 6 blocks) when size is missing/estimated-only.
 */
const DEFAULT_WIDTH_IN = 70;
const DEFAULT_HEIGHT_IN = 84;

const FINISHED_UNIT_IN = 7;
const FINISHED_BLOCK_IN = 14;
const SEAM_ALLOWANCE_IN = 0.25;

function toNumberOrFallback(n: unknown, fallback: number): number {
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function roundToNearestInt(n: number): number {
  return Math.round(n);
}

function clampMin(n: number, min: number): number {
  return Math.max(min, n);
}

function computePlan(quiltSize: QuiltSizeIn): DrunkardsPathComputedPlan {
  // QuiltSizeIn in your system is already "inches-ready" (no prose parsing here).
  // If upstream has missing width/height (estimated-only), we fall back deterministically.
  const widthIn = toNumberOrFallback((quiltSize as any).widthIn, DEFAULT_WIDTH_IN);
  const heightIn = toNumberOrFallback((quiltSize as any).heightIn, DEFAULT_HEIGHT_IN);

  const blocksAcross = clampMin(roundToNearestInt(widthIn / FINISHED_BLOCK_IN), 1);
  const blocksDown = clampMin(roundToNearestInt(heightIn / FINISHED_BLOCK_IN), 1);

  const blockCount = blocksAcross * blocksDown;

  const computedFinishedTopWidthIn = blocksAcross * FINISHED_BLOCK_IN;
  const computedFinishedTopHeightIn = blocksDown * FINISHED_BLOCK_IN;

  const unitsPerBlock = 4;
  const unitCount = blockCount * unitsPerBlock;

  const unitCutSquareIn = FINISHED_UNIT_IN + 2 * SEAM_ALLOWANCE_IN; // 7 + 0.5 = 7.5

  return {
    patternId: 'drunkards-path',
    widthIn,
    heightIn,
    finishedUnitIn: FINISHED_UNIT_IN,
    finishedBlockIn: FINISHED_BLOCK_IN,
    seamAllowanceIn: SEAM_ALLOWANCE_IN,
    blocksAcross,
    blocksDown,
    blockCount,
    computedFinishedTopWidthIn,
    computedFinishedTopHeightIn,
    unitsPerBlock,
    unitCount,
    unitCutSquareIn,
  };
}

/**
 * IMPORTANT:
 * InstructionPlan<T> generic is the FABRICS type in your codebase.
 * So we bind it to FabricAssignments (slot-based: namesBySlot).
 */
export const drunkardsPathPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'drunkards-path',

  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments): string[] => {
    const plan = computePlan(quiltSize);
    return renderInstructions(plan, fabrics);
  },
};
