import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

import { renderInstructions } from './renderInstructions';

export type GrandmothersFlowerGardenComputedPlan = {
  patternId: 'grandmothers-flower-garden';

  // Inputs (inches)
  widthIn: number;
  heightIn: number;

  // Block math
  finishedBlockIn: number; // 6.5
  seamAllowanceIn: number; // 0.25

  blocksAcross: number;
  blocksDown: number;
  blockCount: number;

  computedFinishedTopWidthIn: number;
  computedFinishedTopHeightIn: number;

  // Modeled piece math (deterministic, plan-based)
  hexagonsPerBlock: number; // 7 (1 center + 6 petals)
  totalHexagons: number;

  // Cutting approximations for deterministic PDFs (inches)
  blockCutSquareIn: number; // finishedBlockIn + 0.5
  finishedHexagonAcrossFlatsIn: number; // finishedBlockIn / 3
  hexagonCutAcrossFlatsIn: number; // finishedHexagonAcrossFlatsIn + 2*seamAllowanceIn

  // Template-driven counts (per block)
  centerHexagonsPerBlock: number; // 1
  innerRingHexagonsPerBlock: number; // 3
  outerRingHexagonsPerBlock: number; // 3

  // Totals across the quilt
  totalCenterHexagons: number;
  totalInnerRingHexagons: number;
  totalOuterRingHexagons: number;
};

/**
 * Deterministic defaults for Grandmother's Flower Garden:
 * - Finished block size is 6.5" square.
 * - Default quilt target is 60" × 72" when size is missing/estimated-only.
 */
const DEFAULT_WIDTH_IN = 60;
const DEFAULT_HEIGHT_IN = 72;

const FINISHED_BLOCK_IN = 6.5;
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

function computePlan(quiltSize: QuiltSizeIn): GrandmothersFlowerGardenComputedPlan {
  // QuiltSizeIn in your system is already "inches-ready" (no prose parsing here).
  // If upstream has missing width/height (estimated-only), we fall back deterministically.
  const widthIn = toNumberOrFallback((quiltSize as any).widthIn, DEFAULT_WIDTH_IN);
  const heightIn = toNumberOrFallback((quiltSize as any).heightIn, DEFAULT_HEIGHT_IN);

  const blocksAcross = clampMin(roundToNearestInt(widthIn / FINISHED_BLOCK_IN), 1);
  const blocksDown = clampMin(roundToNearestInt(heightIn / FINISHED_BLOCK_IN), 1);
  const blockCount = blocksAcross * blocksDown;

  const computedFinishedTopWidthIn = blocksAcross * FINISHED_BLOCK_IN;
  const computedFinishedTopHeightIn = blocksDown * FINISHED_BLOCK_IN;

  const centerHexagonsPerBlock = 1;
  const innerRingHexagonsPerBlock = 3;
  const outerRingHexagonsPerBlock = 3;

  const hexagonsPerBlock = centerHexagonsPerBlock + innerRingHexagonsPerBlock + outerRingHexagonsPerBlock;
  const totalHexagons = blockCount * hexagonsPerBlock;

  // Deterministic cutting math for MVP PDFs (stable + repeatable)
  const blockCutSquareIn = FINISHED_BLOCK_IN + 2 * SEAM_ALLOWANCE_IN; // +0.5"

  // Deterministic model: a "flower block" is treated as ~3 hexagons across (across flats).
  const finishedHexagonAcrossFlatsIn = FINISHED_BLOCK_IN / 3;
  const hexagonCutAcrossFlatsIn = finishedHexagonAcrossFlatsIn + 2 * SEAM_ALLOWANCE_IN;

  const totalCenterHexagons = blockCount * centerHexagonsPerBlock;
  const totalInnerRingHexagons = blockCount * innerRingHexagonsPerBlock;
  const totalOuterRingHexagons = blockCount * outerRingHexagonsPerBlock;

  return {
    patternId: 'grandmothers-flower-garden',

    widthIn,
    heightIn,

    finishedBlockIn: FINISHED_BLOCK_IN,
    seamAllowanceIn: SEAM_ALLOWANCE_IN,

    blocksAcross,
    blocksDown,
    blockCount,

    computedFinishedTopWidthIn,
    computedFinishedTopHeightIn,

    hexagonsPerBlock,
    totalHexagons,

    blockCutSquareIn,
    finishedHexagonAcrossFlatsIn,
    hexagonCutAcrossFlatsIn,

    centerHexagonsPerBlock,
    innerRingHexagonsPerBlock,
    outerRingHexagonsPerBlock,

    totalCenterHexagons,
    totalInnerRingHexagons,
    totalOuterRingHexagons,
  };
}

/**
 * IMPORTANT:
 * InstructionPlan<T> generic is the FABRICS type in your codebase.
 * So we bind it to FabricAssignments (slot-based: namesBySlot).
 */
export const grandmothersFlowerGardenPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'grandmothers-flower-garden',

  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments): string[] => {
    const plan = computePlan(quiltSize);
    return renderInstructions(plan, fabrics);
  },
};
