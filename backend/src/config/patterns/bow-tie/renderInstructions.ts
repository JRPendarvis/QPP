// src/config/patterns/bow-tie/renderInstructions.ts

import type { QuiltSizeIn } from '../../../services/instructions/types';
import type { FabricAssignments } from '../../../services/instructions/fabricAssignments';

/**
 * Bow Tie template contract:
 * COLOR1 = Background (3.5" squares)
 * COLOR2 = Bow squares (3.5" squares)
 * COLOR3 = Knot patches (from 2.5" square)
 *
 * Per finished block (7" finished):
 * - Background: 2 squares @ 3.5" finished (cut 4")
 * - Bow:        2 squares @ 3.5" finished (cut 4")
 * - Knot:       1 square  @ 2.5" finished (cut 3"), then cut once diagonally => 2 triangles
 */
type BowTieParams = {
  finishedBlockIn: number;         // 7
  largeFinishedIn: number;         // 3.5
  knotFinishedIn: number;          // 2.5
};

function calcLayout(quilt: QuiltSizeIn, finishedBlockIn: number) {
  const cols = Math.max(1, Math.round(quilt.widthIn / finishedBlockIn));
  const rows = Math.max(1, Math.round(quilt.heightIn / finishedBlockIn));
  const blocks = rows * cols;

  const actualW = cols * finishedBlockIn;
  const actualH = rows * finishedBlockIn;

  return { rows, cols, blocks, actualW, actualH };
}

function addCount(map: Record<string, number>, key: string, delta: number) {
  map[key] = (map[key] ?? 0) + delta;
}

export function renderBowTieInstructions(
  quiltSize: QuiltSizeIn,
  fabrics: FabricAssignments,
  params: BowTieParams
): string[] {
  const { finishedBlockIn, largeFinishedIn, knotFinishedIn } = params;

  const { rows, cols, blocks, actualW, actualH } = calcLayout(quiltSize, finishedBlockIn);

  // Cut sizes (unfinished = finished + 1/2")
  const largeCut = largeFinishedIn + 0.5; // 4"
  const knotCut = knotFinishedIn + 0.5;   // 3"

  // Slots:
  // namesBySlot[0] = Background base fabric (COLOR1)
  // namesBySlot[1..] = feature fabrics pool (used for COLOR2 and COLOR3 by block rotation)
  const bg = fabrics.namesBySlot[0] || 'Background fabric';
  const featurePool = fabrics.namesBySlot.slice(1).filter(Boolean);

  // If user only provided 1 slot somehow, create a pool with a placeholder.
  const features = featurePool.length > 0 ? featurePool : ['Feature fabric'];

  // Counts:
  // Per block: BG large squares = 2, Bow large squares = 2, Knot squares = 1
  const backgroundLargeTotal = blocks * 2;

  // We distribute Bow and Knot across feature fabrics deterministically.
  const bowLargeByFabric: Record<string, number> = {};
  const knotSmallByFabric: Record<string, number> = {};

  for (let i = 0; i < blocks; i++) {
    const bowFabric = features[i % features.length];
    const knotFabric = features.length === 1 ? bowFabric : features[(i + 1) % features.length];

    // Bow uses 2 large squares per block
    addCount(bowLargeByFabric, bowFabric, 2);

    // Knot uses 1 small square per block
    addCount(knotSmallByFabric, knotFabric, 1);
  }

  // Build readable per-fabric lines (stable ordering)
  const orderedFeatures = [...new Set(features)];
  const bowLines = orderedFeatures.map((name) => {
    const c = bowLargeByFabric[name] ?? 0;
    return `Cut FEATURE (${name}) for BOW squares: Cut ${c} squares at ${largeCut}".`;
  });

  const knotLines = orderedFeatures.map((name) => {
    const c = knotSmallByFabric[name] ?? 0;
    return `Cut FEATURE (${name}) for KNOT squares: Cut ${c} squares at ${knotCut}" (then cut diagonally once to yield 2 triangles).`;
  });

  return [
    `📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish — rearrange blocks, change colors, or modify the layout to suit your creative vision!`,
    `Quilt size: ${Math.round(actualW)}" × ${Math.round(actualH)}". Layout: ${cols} × ${rows} blocks (${blocks} total). Finished block size: ${finishedBlockIn}" square.`,
    `Cut sizes: Bow Tie uses 3.5" finished squares (cut ${largeCut}") plus knot patches from 2.5" finished squares (cut ${knotCut}" then cut diagonally once).`,
    `Cut BACKGROUND (${bg}): Cut ${backgroundLargeTotal} squares at ${largeCut}".`,
    ...bowLines,
    ...knotLines,
    `Assemble each block (template match): Place BACKGROUND squares in the top-left and bottom-right. Place BOW squares in the top-right and bottom-left.`,
    `Knot patches: For each block, use (1) ${knotCut}" knot square cut diagonally once to create 2 triangles. Sew one triangle to the bottom-right corner of the top-left BACKGROUND square, and sew the other triangle to the top-left corner of the bottom-right BACKGROUND square (exactly as the SVG shows).`,
    `Sew the 2×2 block: Sew the top row (BACKGROUND+KNOT corner) to BOW square. Sew the bottom row (BOW square) to (BACKGROUND+KNOT corner). Press row seams opposite directions so the center nests, then sew rows together.`,
    `Layout: Tile blocks in a ${cols} × ${rows} grid. Feature fabrics rotate deterministically by block index so BOW and KNOT colors vary across the quilt while BACKGROUND stays consistent.`,
    `Finish: Layer with batting and backing, quilt as desired, and bind.`,
  ];
}
