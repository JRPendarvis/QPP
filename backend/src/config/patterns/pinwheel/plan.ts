// patterns/pinwheel/plan.ts
//
// Pinwheel Plan (deterministic, MVP-safe)
//
// Purpose:
// - Compute layout + cutting math from quilt size
// - Match the Pinwheel SVG template + PatternDefinition color contract:
//
//   COLOR1 = Background
//   COLOR2 = Blade Primary (1 quadrant per block)
//   COLOR3 = Blade Secondary (2 quadrants per block)  <-- template uses COLOR3 twice
//   COLOR4 = Blade Accent (1 quadrant per block)
//
// Notes:
// - Rotation is handled by PatternDefinition.rotationStrategy ('alternate-90').
// - This plan intentionally refuses to "guess" borders/sashing. If the size doesn't tile cleanly, it throws.
//

import type { InstructionPlan, QuiltSizeIn as QuiltSizeInImported } from '../../../services/instructions/types';
import { renderPinwheelInstructions, type PinwheelFabricNames } from './renderPinwheelInstructions';

// Local type alias for internal use (uses width/height instead of widthIn/heightIn)
export type QuiltSizeIn = { width: number; height: number };

export type CutRole = 'BACKGROUND' | 'PRIMARY' | 'SECONDARY' | 'ACCENT';

export type CutItem = {
  role: CutRole;
  shape: 'square';
  sizeIn: number; // square size in inches
  count: number;
  notes?: string;
};

export type HstPairPlan = {
  backgroundSquares: number;
  colorRole: Exclude<CutRole, 'BACKGROUND'>;
  colorSquares: number;
  hstYield: number; // number of HST units produced
};

export type PinwheelPlan = {
  patternId: 'pinwheel';
  quiltSizeIn: QuiltSizeIn;

  // Layout
  blockFinishedIn: number;
  cols: number;
  rows: number;
  blockCount: number;

  // HST sizing (trim-to-size method recommended for MVP)
  hstMethod: 'trim-to-size';
  hstFinishedIn: number;
  hstTrimUnfinishedIn: number;
  cutSquareIn: number;

  // Cutting / units
  cutList: CutItem[];
  hstPairs: HstPairPlan[];

  // Tiling behavior (mirrors PatternDefinition)
  rotationStrategy: 'alternate-90';

  // Guardrails for downstream consumers (PDF/LLM)
  invariants: {
    templateBladeDistributionPerBlock: { PRIMARY: 1; SECONDARY: 2; ACCENT: 1 };
    backgroundHstsPerBlock: 4;
  };
};

/**
 * Builds a deterministic plan for a Pinwheel quilt.
 *
 * MVP assumptions:
 * - Quilt dimensions must tile cleanly by the chosen block size.
 * - For 72x84, blockFinishedIn=12 yields cols=6, rows=7 (perfect).
 * - Uses trim-to-size HST method:
 *   - Unfinished HST = finished + 1/2"
 *   - Cut square = unfinished + 3/4" (room to trim)
 */
export function buildPinwheelPlan(quiltSizeIn: QuiltSizeIn): PinwheelPlan {
  const blockFinishedIn = chooseBlockFinishedIn(quiltSizeIn);

  const cols = Math.floor(quiltSizeIn.width / blockFinishedIn);
  const rows = Math.floor(quiltSizeIn.height / blockFinishedIn);

  // Validate clean tiling (no guessing / no silent borders)
  const tiledWidth = cols * blockFinishedIn;
  const tiledHeight = rows * blockFinishedIn;

  if (tiledWidth !== quiltSizeIn.width || tiledHeight !== quiltSizeIn.height) {
    throw new Error(
      `PinwheelPlan: quilt size ${quiltSizeIn.width}x${quiltSizeIn.height} does not tile cleanly with ` +
        `${blockFinishedIn}" blocks (computed ${cols}x${rows} => ${tiledWidth}x${tiledHeight}). ` +
        `Choose a different block size or add explicit border logic (do not guess in PDF).`
    );
  }

  const blockCount = cols * rows;

  // Pinwheel block: 4 HSTs per block, 2 across => HST finished is half block size
  const hstFinishedIn = blockFinishedIn / 2; // 12" block => 6" HST finished
  const hstTrimUnfinishedIn = hstFinishedIn + 0.5; // +1/2" for seams
  const cutSquareIn = roundToQuarter(hstTrimUnfinishedIn + 0.75); // +3/4" for trim-to-size

  // Template distribution per block (based on your PINWHEEL_TEMPLATE):
  // - BG+PRIMARY: 1 quadrant
  // - BG+SECONDARY: 2 quadrants
  // - BG+ACCENT: 1 quadrant
  const primaryHsts = blockCount * 1;
  const secondaryHsts = blockCount * 2;
  const accentHsts = blockCount * 1;

  // 2-at-a-time HST method yields 2 HSTs per (background square + color square) pair.
  const primarySquares = primaryHsts / 2;
  const secondarySquares = secondaryHsts / 2;
  const accentSquares = accentHsts / 2;

  if (!Number.isInteger(primarySquares) || !Number.isInteger(secondarySquares) || !Number.isInteger(accentSquares)) {
    throw new Error(
      `PinwheelPlan: blockCount=${blockCount} produces non-integer square counts for 2-at-a-time HSTs. ` +
        `Ensure blockCount is even. (primary=${primarySquares}, secondary=${secondarySquares}, accent=${accentSquares})`
    );
  }

  const backgroundSquares = primarySquares + secondarySquares + accentSquares;

  const cutList: CutItem[] = [
    {
      role: 'BACKGROUND',
      shape: 'square',
      sizeIn: cutSquareIn,
      count: backgroundSquares,
      notes: 'Pairs with PRIMARY, SECONDARY, and ACCENT to produce all background triangles in every block.',
    },
    {
      role: 'PRIMARY',
      shape: 'square',
      sizeIn: cutSquareIn,
      count: primarySquares,
      notes: 'Pairs with BACKGROUND to produce PRIMARY blade HSTs (1 quadrant per block).',
    },
    {
      role: 'SECONDARY',
      shape: 'square',
      sizeIn: cutSquareIn,
      count: secondarySquares,
      notes: 'Pairs with BACKGROUND to produce SECONDARY blade HSTs (2 quadrants per block).',
    },
    {
      role: 'ACCENT',
      shape: 'square',
      sizeIn: cutSquareIn,
      count: accentSquares,
      notes: 'Pairs with BACKGROUND to produce ACCENT blade HSTs (1 quadrant per block).',
    },
  ];

  const hstPairs: HstPairPlan[] = [
    {
      backgroundSquares: primarySquares,
      colorRole: 'PRIMARY',
      colorSquares: primarySquares,
      hstYield: primaryHsts,
    },
    {
      backgroundSquares: secondarySquares,
      colorRole: 'SECONDARY',
      colorSquares: secondarySquares,
      hstYield: secondaryHsts,
    },
    {
      backgroundSquares: accentSquares,
      colorRole: 'ACCENT',
      colorSquares: accentSquares,
      hstYield: accentHsts,
    },
  ];

  return {
    patternId: 'pinwheel',
    quiltSizeIn,

    blockFinishedIn,
    cols,
    rows,
    blockCount,

    hstMethod: 'trim-to-size',
    hstFinishedIn,
    hstTrimUnfinishedIn,
    cutSquareIn,

    cutList,
    hstPairs,

    rotationStrategy: 'alternate-90',

    invariants: {
      templateBladeDistributionPerBlock: { PRIMARY: 1, SECONDARY: 2, ACCENT: 1 },
      backgroundHstsPerBlock: 4,
    },
  };
}

/**
 * Chooses a finished block size that cleanly tiles the quilt.
 * MVP preference order:
 * - 12" first (common, works for 72x84)
 * - then 9", 8", 6"
 */
function chooseBlockFinishedIn(size: QuiltSizeIn): number {
  const candidates = [12, 9, 8, 6];
  for (const b of candidates) {
    if (size.width % b === 0 && size.height % b === 0) return b;
  }
  // Hard fallback for MVP: still return 12; buildPinwheelPlan will throw if it doesn't tile.
  return 12;
}

/**
 * Rounds to nearest 1/4" to keep cut sizes quilter-friendly.
 */
function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

// default export for convenience
export default buildPinwheelPlan;

// InstructionPlan export for registry
export const pinwheelPlan: InstructionPlan<PinwheelFabricNames> = {
  patternId: 'pinwheel',
  render: (quiltSize: QuiltSizeInImported, fabrics: PinwheelFabricNames) => {
    // Convert from QuiltSizeInImported (widthIn/heightIn) to local QuiltSizeIn (width/height)
    const localQuiltSize: QuiltSizeIn = {
      width: quiltSize.widthIn,
      height: quiltSize.heightIn,
    };
    const plan = buildPinwheelPlan(localQuiltSize);
    return renderPinwheelInstructions(plan, fabrics);
  },
};
