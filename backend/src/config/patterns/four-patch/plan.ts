import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

type FourPatchComputedPlan = {
  patternId: 'four-patch';

  // Inputs (inches)
  widthIn: number;
  heightIn: number;

  // Block math
  finishedBlockIn: number; // 4"
  seamAllowanceIn: number; // 0.25"

  blocksAcross: number;
  blocksDown: number;
  blockCount: number;

  computedFinishedTopWidthIn: number;
  computedFinishedTopHeightIn: number;

  // Sub-units
  unitsPerBlock: number; // 4
  finishedUnitIn: number; // 2"
  unitCutSquareIn: number; // 2.5"
};

function computePlan(size?: QuiltSizeIn): FourPatchComputedPlan {
  const finishedBlockIn = 4;
  const seamAllowanceIn = 0.25;

  // Deterministic defaults if missing
  const defaultWidthIn = 60;
  const defaultHeightIn = 72;

  const widthIn = size?.widthIn ?? defaultWidthIn;
  const heightIn = size?.heightIn ?? defaultHeightIn;

  const blocksAcross = Math.floor(widthIn / finishedBlockIn);
  const blocksDown = Math.floor(heightIn / finishedBlockIn);

  const blockCount = blocksAcross * blocksDown;

  const computedFinishedTopWidthIn = blocksAcross * finishedBlockIn;
  const computedFinishedTopHeightIn = blocksDown * finishedBlockIn;

  const finishedUnitIn = finishedBlockIn / 2;
  const unitCutSquareIn = finishedUnitIn + seamAllowanceIn * 2;

  return {
    patternId: 'four-patch',

    widthIn,
    heightIn,

    finishedBlockIn,
    seamAllowanceIn,

    blocksAcross,
    blocksDown,
    blockCount,

    computedFinishedTopWidthIn,
    computedFinishedTopHeightIn,

    unitsPerBlock: 4,
    finishedUnitIn,
    unitCutSquareIn,
  };
}

/**
 * IMPORTANT:
 * InstructionPlan<T> generic is the FABRICS type (known system quirk).
 * This export is intentionally shaped to match the existing InstructionPlan contract in this repo.
 */
export const fourPatchPlan: InstructionPlan<FabricAssignments> = ((size?: QuiltSizeIn) => {
  return computePlan(size);
}) as any;
