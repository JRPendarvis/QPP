import type { InstructionPlan, QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';
import { renderInstructions } from './renderInstructions';

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

function computePlan(quiltSize: QuiltSizeIn): FourPatchComputedPlan {
  const finishedBlockIn = 4;
  const seamAllowanceIn = 0.25;

  // Deterministic defaults if missing
  const defaultWidthIn = 60;
  const defaultHeightIn = 72;

  const widthIn = quiltSize.widthIn ?? defaultWidthIn;
  const heightIn = quiltSize.heightIn ?? defaultHeightIn;

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

export const fourPatchPlan: InstructionPlan<FabricAssignments> = {
  patternId: 'four-patch',
  render: (quiltSize: QuiltSizeIn, fabrics: FabricAssignments) => {
    const plan = computePlan(quiltSize);
    return renderInstructions(plan, fabrics);
  },
};
