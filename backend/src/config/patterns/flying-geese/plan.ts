import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

import { renderInstructions } from './renderInstructions';

export type FlyingGeeseComputedPlan = {
  patternId: 'flying-geese';

  // Inputs (inches)
  widthIn: number;
  heightIn: number;

  // Block math
  finishedBlockIn: number; // 12
  seamAllowanceIn: number; // 0.25

  blocksAcross: number;
  blocksDown: number;
  blockCount: number;

  computedFinishedTopWidthIn: number;
  computedFinishedTopHeightIn: number;

  unitsPerBlock: number; // 4 geese units per block (2x2)
  unitCount: number;

  // Cutting (Flying Geese unit)
  skySquareIn: number; // 4.25
  gooseRectWidthIn: number; // 7.25
  gooseRectHeightIn: number; // 3.875

  // Deterministic fabric distribution
  gooseRoleCount: number; // 1..4
  gooseRoles: readonly string[]; // ['GOOSE_A'..]
  geesePerRole: ReadonlyArray<{ role: string; quantity: number }>;
};

/**
 * Deterministic defaults for Flying Geese:
 * - Finished block: 12" square
 * - Default quilt target is 60" × 72" (5 × 6 blocks) when size is missing/estimated-only.
 */
const DEFAULT_WIDTH_IN = 60;
const DEFAULT_HEIGHT_IN = 72;

const FINISHED_BLOCK_IN = 12;
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

function computePlan(quiltSize: QuiltSizeIn, fabrics: FabricAssignments): FlyingGeeseComputedPlan {
  // QuiltSizeIn is inches-ready. If upstream has missing width/height (estimated-only),
  // we fall back deterministically (60x72).
  const widthIn = toNumberOrFallback((quiltSize as any).widthIn, DEFAULT_WIDTH_IN);
  const heightIn = toNumberOrFallback((quiltSize as any).heightIn, DEFAULT_HEIGHT_IN);

  const blocksAcross = clampMin(roundToNearestInt(widthIn / FINISHED_BLOCK_IN), 1);
  const blocksDown = clampMin(roundToNearestInt(heightIn / FINISHED_BLOCK_IN), 1);

  const blockCount = blocksAcross * blocksDown;

  const computedFinishedTopWidthIn = blocksAcross * FINISHED_BLOCK_IN;
  const computedFinishedTopHeightIn = blocksDown * FINISHED_BLOCK_IN;

  const unitsPerBlock = 4; // 2x2 geese units per block
  const unitCount = blockCount * unitsPerBlock;

  /**
   * Deterministic cutting math (common flying geese method):
   * - Per geese unit:
   *   - 1 goose rectangle: 7.25" × 3.875"
   *   - 2 sky squares: 4.25" square
   *
   * Totals remain stable for a given quilt size. Fabric count affects
   * only distribution across goose roles.
   */
  const skySquareIn = 4.25;
  const gooseRectWidthIn = 7.25;
  const gooseRectHeightIn = 3.875;

  // Fabric role strategy:
  // - SKY always used (COLOR1 in template)
  // - Up to 4 goose roles map to template geese (COLOR2..COLOR5):
  //   GOOSE_A..GOOSE_D
  // - Extra fabrics (2–8 range) are treated as deterministic alternates:
  //   render/assignment can rotate them by block index, but the template still
  //   only displays 4 distinct goose slots per block.
  //
  // Determine how many goose roles are "active" based on how many goose slots
  // the caller actually provided names for (but clamp to 1..4).
  const candidateGooseRoles = ['GOOSE_A', 'GOOSE_B', 'GOOSE_C', 'GOOSE_D'] as const;

  // Count named goose slots present; if none, fall back to 1.
  // Map role names to slot indices (SKY=0, GOOSE_A=1, GOOSE_B=2, etc.)
  const roleToSlotIndex: Record<string, number> = {
    'GOOSE_A': 1,
    'GOOSE_B': 2,
    'GOOSE_C': 3,
    'GOOSE_D': 4,
  };
  
  const namedGooseCount =
    candidateGooseRoles.filter((r) => Boolean(fabrics?.namesBySlot?.[roleToSlotIndex[r]])).length;

  const gooseRoleCount = clampMin(Math.min(4, namedGooseCount || 1), 1);
  const gooseRoles = candidateGooseRoles.slice(0, gooseRoleCount);

  // Even distribution of goose rectangles across active goose roles.
  const baseQty = Math.floor(unitCount / gooseRoleCount);
  const remainder = unitCount % gooseRoleCount;

  const geesePerRole = gooseRoles.map((role, idx) => ({
    role,
    quantity: baseQty + (idx < remainder ? 1 : 0),
  }));

  return {
    patternId: 'flying-geese',
    widthIn,
    heightIn,

    finishedBlockIn: FINISHED_BLOCK_IN,
    seamAllowanceIn: SEAM_ALLOWANCE_IN,

    blocksAcross,
    blocksDown,
    blockCount,

    computedFinishedTopWidthIn,
    computedFinishedTopHeightIn,

    unitsPerBlock,
    unitCount,

    skySquareIn,
    gooseRectWidthIn,
    gooseRectHeightIn,

    gooseRoleCount,
    gooseRoles,
    geesePerRole,
  };
}

/**
 * IMPORTANT:
 * InstructionPlan<T> generic is the FABRICS type in your codebase.
 * So we bind it to FabricAssignments (slot-based: namesBySlot).
 */
export const flyingGeesePlan: InstructionPlan<FabricAssignments> = {
  patternId: 'flying-geese',

  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments): string[] => {
    const plan = computePlan(quiltSize, fabrics);
    return renderInstructions(plan, fabrics);
  },
};
