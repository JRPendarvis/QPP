'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import BlockDesignerCanvas, { BlockRegion, FabricOption } from '@/components/block-designer/BlockDesignerCanvas';
import { useBlockDesignerPageModel } from '@/hooks/useBlockDesignerPageModel';
// PATTERN_OPTIONS: all block patterns grouped by skill level
const PATTERN_OPTIONS: Record<string, { id: string; name: string; minFabrics: number; maxFabrics: number }[]> = {
  beginner: [
    { id: 'simple-squares',       name: 'Simple Squares',        minFabrics: 2, maxFabrics: 2 },
    { id: 'strip-quilt',          name: 'Strip Quilt',           minFabrics: 3, maxFabrics: 3 },
    { id: 'checkerboard',         name: 'Checkerboard',          minFabrics: 2, maxFabrics: 2 },
    { id: 'rail-fence',           name: 'Rail Fence',            minFabrics: 3, maxFabrics: 3 },
  ],
  advanced_beginner: [
    { id: 'four-patch',           name: 'Four Patch',            minFabrics: 2, maxFabrics: 3 },
    { id: 'nine-patch',           name: 'Nine Patch',            minFabrics: 3, maxFabrics: 3 },
    { id: 'half-square-triangles',name: 'Half-Square Triangles', minFabrics: 2, maxFabrics: 2 },
    { id: 'hourglass',            name: 'Hourglass',             minFabrics: 2, maxFabrics: 2 },
    { id: 'bow-tie',              name: 'Bow Tie',               minFabrics: 2, maxFabrics: 2 },
  ],
  intermediate: [
    { id: 'flying-geese',         name: 'Flying Geese',          minFabrics: 2, maxFabrics: 2 },
    { id: 'pinwheel',             name: 'Pinwheel',              minFabrics: 2, maxFabrics: 2 },
    { id: 'log-cabin',            name: 'Log Cabin',             minFabrics: 3, maxFabrics: 5 },
    { id: 'sawtooth-star',        name: 'Sawtooth Star',         minFabrics: 3, maxFabrics: 3 },
    { id: 'ohio-star',            name: 'Ohio Star',             minFabrics: 3, maxFabrics: 3 },
    { id: 'churn-dash',           name: 'Churn Dash',            minFabrics: 2, maxFabrics: 2 },
    { id: 'mosaic-star',          name: 'Mosaic Star',           minFabrics: 4, maxFabrics: 4 },
  ],
  advanced: [
    { id: 'lone-star',            name: 'Lone Star',             minFabrics: 3, maxFabrics: 3 },
    { id: 'kaleidoscope-star',    name: 'Kaleidoscope Star',     minFabrics: 3, maxFabrics: 3 },
    { id: 'new-york-beauty',      name: 'New York Beauty',       minFabrics: 4, maxFabrics: 4 },
    { id: 'drunkards-path',       name: "Drunkard's Path",       minFabrics: 2, maxFabrics: 2 },
  ],
  expert: [
    { id: 'grandmothers-flower-garden', name: "Grandmother's Flower Garden", minFabrics: 2, maxFabrics: 2 },
    { id: 'pickle-dish',          name: 'Pickle Dish',           minFabrics: 3, maxFabrics: 3 },
  ],
};

interface PatternMeta {
  id: string;
  name: string;
  minFabrics: number;
  maxFabrics: number;
}

interface AssemblyInstructions {
  blockSize: string;
  seam: string;
  steps: string[];
  tips?: string[];
}

const ASSEMBLY_INSTRUCTIONS: Record<string, AssemblyInstructions> = {
  'simple-squares': {
    blockSize: '6" or 12" finished',
    seam: '¼"',
    steps: [
      'Cut two squares each from Fabric 1 and Fabric 2 at the same size (e.g. 6½" for a 6" finished block).',
      'Arrange the four squares in a 2×2 grid, alternating fabrics in a checkerboard pattern.',
      'Sew the top two squares right sides together along the right edge. Press seam toward the darker fabric.',
      'Repeat for the bottom two squares.',
      'Sew the two rows together, nesting the center seams. Press seam to one side.',
    ],
    tips: ['Chain-piece your pairs to save time.'],
  },
  'strip-quilt': {
    blockSize: 'Any size',
    seam: '¼"',
    steps: [
      'Cut three strips of equal width from your three fabrics (e.g. 2½" × WOF for a strip set).',
      'Sew the three strips together along their long edges, right sides together. Press all seams in one direction.',
      'Sub-cut the strip set to your desired block size.',
    ],
    tips: ['Pressing all seams the same direction makes nesting easy when joining blocks.'],
  },
  'checkerboard': {
    blockSize: '8" or 12" finished',
    seam: '¼"',
    steps: [
      'Cut strips from Fabric 1 and Fabric 2, each the same width (e.g. 2½").',
      'Sew strips together alternating fabrics to make a strip set. Press seams.',
      'Sub-cut the strip set into segments the same width as the strips.',
      'Rotate every other segment 180° and sew segments together, offsetting to create a checkerboard.',
    ],
  },
  'rail-fence': {
    blockSize: '6" finished',
    seam: '¼"',
    steps: [
      'Cut three strips 2½" wide (or ⅓ of your finished block size + ½") from each fabric.',
      'Sew the three strips together along their long edges in order: Fabric 1, 2, 3. Press all seams in one direction.',
      'Sub-cut the strip set into squares the same dimension as the total finished width.',
      'Rotate every other block 90° before sewing blocks together for a woven look.',
    ],
  },
  'four-patch': {
    blockSize: '4" or 8" finished',
    seam: '¼"',
    steps: [
      'Cut two squares from Fabric 1 and one each from Fabrics 2 and 3 (e.g. 2½" for a 4" finished block).',
      'Sew Fabric 1 + Fabric 2 right sides together. Sew Fabric 3 + Fabric 1 right sides together. Press seams outward.',
      'Join the two pairs to form the four-patch, nesting center seams. Press.',
    ],
    tips: ['Use chain piecing to make multiples quickly.'],
  },
  'nine-patch': {
    blockSize: '6" or 9" finished',
    seam: '¼"',
    steps: [
      'Cut nine squares: five from Fabric 1 (corners + center) and four from Fabric 2.',
      'Arrange in a 3×3 grid, alternating fabrics.',
      'Sew the three squares of each row together. Press rows 1 and 3 seams right; row 2 seams left.',
      'Join the three rows, nesting seam intersections. Press.',
    ],
  },
  'half-square-triangles': {
    blockSize: 'Any size',
    seam: '¼"',
    steps: [
      'Cut squares 7⁄8" larger than your desired finished HST (e.g. 3⅞" for a 3" finished HST).',
      'Draw a diagonal line on the wrong side of the lighter square.',
      'Place the two squares right sides together. Sew ¼" on each side of the drawn line.',
      'Cut along the drawn line to yield two HST units. Press open and trim to size.',
    ],
    tips: ['Use the two-at-a-time method to make HSTs faster.'],
  },
  'hourglass': {
    blockSize: 'Any size',
    seam: '¼"',
    steps: [
      'Make four HST units (see Half-Square Triangles method).',
      'Arrange two HSTs into a pair so the diagonal seams oppose. Sew together and press. Repeat for the second pair.',
      'Sew the two pairs together, rotating 180°, to form the hourglass. Nest center seams and press.',
      'Trim to your desired finished size + ½".',
    ],
  },
  'bow-tie': {
    blockSize: '6" finished',
    seam: '¼"',
    steps: [
      'Cut two large squares 3½" from Fabric 1 (bow-tie body) and two small squares 2" from Fabric 2 (knot).',
      'Fold each small square in half diagonally to make a triangle. Place one on a corner of each large square.',
      'Stitch across the fold line, trim seam to ¼", and press the triangle open.',
      'Arrange four units in a 2×2 grid with the triangles meeting in the center. Sew and press.',
    ],
    tips: ['The folded-corner (connector square) method avoids cutting on the bias.'],
  },
  'flying-geese': {
    blockSize: '3"×6" per unit',
    seam: '¼"',
    steps: [
      'Cut one rectangle 3½"×6½" (goose) and two squares 3½" (sky).',
      'Draw a diagonal on the wrong side of each small square.',
      'Place one square on the left end of the rectangle, right sides together, diagonal pointing to center. Sew on the line, trim, press open.',
      'Repeat on the right end with the second square to complete the flying goose unit.',
    ],
    tips: ['The no-waste method lets you make four geese at once from one large square and four small squares.'],
  },
  'pinwheel': {
    blockSize: '6" finished',
    seam: '¼"',
    steps: [
      'Make four HST units in two fabric combos (2 of each).',
      'Arrange the four HSTs so the triangles appear to spin: each unit rotated 90° from the last.',
      'Sew the top two HSTs together, then the bottom two. Press seams in opposite directions.',
      'Join the two rows, nesting the center seam. Press.',
    ],
  },
  'log-cabin': {
    blockSize: '8"–12" finished',
    seam: '¼"',
    steps: [
      'Start with a center square (traditionally red, representing the hearth).',
      'Sew the first "log" to one side of the center. Trim even and press away from center.',
      'Rotate the block 90°, sew the next log to the new side. Continue working around the block.',
      'Keep the light logs on two adjacent sides and dark logs on the other two to create the light/dark split.',
    ],
    tips: ['Press each log away from the center as you go. Chain piecing successive logs speeds up the process.'],
  },
  'sawtooth-star': {
    blockSize: '8" or 12" finished',
    seam: '¼"',
    steps: [
      'Cut: 1 center square, 4 corner squares (all same size), and 4 rectangles twice as long as the squares for the star points.',
      'Make four flying goose units using the rectangles + 8 small squares (see Flying Geese instructions).',
      'Arrange in a 3×3 grid: corners → flying geese → center.',
      'Sew into three rows, then join rows, pressing seams toward the goose units.',
    ],
  },
  'ohio-star': {
    blockSize: '9" or 12" finished',
    seam: '¼"',
    steps: [
      'Cut: 1 center, 4 corner squares, 4 quarter-square triangle units for the star points.',
      'Make QST units by drawing an X on one square, layering with a second, sewing ¼" on each side of both lines, cutting apart, and trimming.',
      'Arrange in a 3×3 grid with the QST points facing inward.',
      'Sew into rows and join rows. Press seams away from the QST units.',
    ],
  },
  'churn-dash': {
    blockSize: '9" finished',
    seam: '¼"',
    steps: [
      'Cut: 1 center square (1 color), 4 HST units, and 4 rectangle pairs.',
      'Make the four HST units (see HST instructions).',
      'Sew each rectangle pair right sides together along the long edge. Press.',
      'Arrange in a 3×3 grid: corner HSTs, side rectangles, center square.',
      'Sew into three rows, then join rows, nesting seams.',
    ],
  },
  'mosaic-star': {
    blockSize: '12" finished',
    seam: '¼"',
    steps: [
      'This star uses 8 narrow diamond points with background triangles and corner squares.',
      'Trace and cut the diamond template from star fabric. Cut background triangles and corners.',
      'Set-in seam method: sew two diamonds together in pairs, then join pairs into halves.',
      'Set in the background triangles using Y-seams at each inside corner.',
      'Join the two halves to complete the star.',
    ],
    tips: ['Y-seams require stopping exactly at the ¼" mark and pivoting—mark all dots before sewing.'],
  },
  'lone-star': {
    blockSize: '12"–24" finished',
    seam: '¼"',
    steps: [
      'Cut eight identical diamond shapes from your fabrics.',
      'Sew the diamonds into four pairs (two diamonds each). Press seams open.',
      'Join pairs into two sets of four. Press seams open.',
      'Join the two halves, matching center seams precisely. Press.',
      'Set in the background squares and triangles using Y-seams at each corner.',
    ],
    tips: ['Cutting all diamonds from the same grain line prevents stretching. Starch heavily before cutting.'],
  },
  'kaleidoscope-star': {
    blockSize: '12" finished',
    seam: '¼"',
    steps: [
      'Cut 8 wedge shapes from your fabrics (use a specialty wedge ruler).',
      'Sew wedges together in pairs, right sides together along one straight edge. Press seams open.',
      'Join pairs into quarters, then halves, then the full circle/star.',
      'Add corner triangles or squares to square up the block.',
    ],
    tips: ['For true kaleidoscope effects, cut all wedges from the same position on a printed fabric.'],
  },
  'new-york-beauty': {
    blockSize: '12" finished',
    seam: '¼"',
    steps: [
      'Cut a large background square, a curved arc unit, and small spike triangles for the fan.',
      'Make the arc by alternating spike triangles with background pieces, sewing point to base.',
      'Baste or pin the convex arc to the concave background quarter-circle, clipping curves as needed.',
      'Stitch the curves slowly, easing the fabric without stretching.',
      'Join four completed units to form the full block.',
    ],
    tips: ['Spray starch makes curved seams more manageable. A stiletto helps ease curves under the presser foot.'],
  },
  'drunkards-path': {
    blockSize: '8"–12" finished',
    seam: '¼"',
    steps: [
      'Cut equal numbers of concave and convex curved pieces using matching templates.',
      'For each pair, clip the concave (inside curve) at ¼" intervals to ease the curve.',
      'Pin the convex piece to the concave, matching centers and ends first.',
      'Sew slowly along the curve with the concave piece on top, easing as you go.',
      'Arrange completed units in rows, rotating direction to create the curved path.',
    ],
    tips: ['Use a scant ¼" seam on curves. Pressing curved seams open reduces bulk.'],
  },
  'grandmothers-flower-garden': {
    blockSize: '12"+ finished (works best as an allover layout)',
    seam: '¼"',
    steps: [
      'Cut hexagons using a template. English Paper Piecing (EPP) is the traditional method.',
      'Baste each fabric hexagon over a paper template hexagon, folding and tacking the edges.',
      'Whip stitch the center hexagon to each of the 6 inner ring hexagons, wrong sides together.',
      'Continue adding outer ring hexagons, pressing as you join.',
      'Remove paper templates once all neighbors are stitched.',
    ],
    tips: ['Pre-cut paper hexagon templates are available at most quilt shops. Pre-wound bobbins speed up the basting step.'],
  },
  'pickle-dish': {
    blockSize: '12" finished',
    seam: '¼"',
    steps: [
      'Cut curved arc shapes (the "dish") and inner fill pieces using templates.',
      'Sew the outer arc pieces together point to point to form the curved ring.',
      'Set in the inner curved fill pieces using Y-seams.',
      'Join four completed units, rotating them to create the interlocking ring design.',
    ],
    tips: ['This block is easiest in sections: make 4 quarter-units first, then join.'],
  },
};

function getAssemblyInstructions(patternId: string): AssemblyInstructions | null {
  return ASSEMBLY_INSTRUCTIONS[patternId] ?? null;
}

function isPersistablePreviewUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.length === 0) return false;
  // Blob URLs are session-scoped and become invalid after reload.
  return url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://');
}

function sanitizeLoadedFabrics(input: FabricOption[]): FabricOption[] {
  return input.map((fabric) => {
    if (!isPersistablePreviewUrl(fabric.previewUrl)) {
      const { previewUrl: _ignored, ...rest } = fabric;
      return rest;
    }
    return fabric;
  });
}

const ROTATIONS: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];

const DEFAULT_FABRICS: FabricOption[] = [
  { id: 'fabric-1', name: 'Fabric 1', color: '#d97706' },
  { id: 'fabric-2', name: 'Fabric 2', color: '#0f766e' },
  { id: 'fabric-3', name: 'Fabric 3', color: '#b91c1c' },
  { id: 'fabric-4', name: 'Fabric 4', color: '#1d4ed8' },
  { id: 'fabric-5', name: 'Fabric 5', color: '#7c3aed' },
  { id: 'fabric-6', name: 'Fabric 6', color: '#334155' },
  { id: 'fabric-7', name: 'Fabric 7', color: '#ca8a04' },
  { id: 'fabric-8', name: 'Fabric 8', color: '#0e7490' },
  { id: 'fabric-9', name: 'Fabric 9', color: '#6b7280' },
];

function getAllPatterns(): PatternMeta[] {
  const map = new Map<string, PatternMeta>();

  Object.values(PATTERN_OPTIONS).forEach((patterns) => {
    patterns.forEach((pattern) => {
      map.set(pattern.id, pattern);
    });
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function getBaseRegions(patternId: string): BlockRegion[] {
  const motifs: Record<string, BlockRegion[]> = {

    // ─── BEGINNER ──────────────────────────────────────────────────────────────

    // 2×2 equal squares in alternating fabrics
    'simple-squares': [
      { id: 'A', name: 'Top Left',     shape: 'rect', x: 0,  y: 0,  width: 50, height: 50, fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Top Right',    shape: 'rect', x: 50, y: 0,  width: 50, height: 50, fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Bottom Left',  shape: 'rect', x: 0,  y: 50, width: 50, height: 50, fabricIndex: 1, rotation: 0 },
      { id: 'D', name: 'Bottom Right', shape: 'rect', x: 50, y: 50, width: 50, height: 50, fabricIndex: 0, rotation: 0 },
    ],

    // 3 equal vertical strips
    'strip-quilt': [
      { id: 'A', name: 'Strip 1', shape: 'rect', x: 0,                 y: 0, width: 100/3, height: 100, fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Strip 2', shape: 'rect', x: 100/3,             y: 0, width: 100/3, height: 100, fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Strip 3', shape: 'rect', x: (100/3)*2,         y: 0, width: 100/3, height: 100, fabricIndex: 2, rotation: 0 },
    ],

    // 4×4 checkerboard
    'checkerboard': (() => {
      const cells: BlockRegion[] = [];
      const s = 25;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          cells.push({ id: `${r}${c}`, name: `Cell ${r*4+c+1}`, shape: 'rect', x: c*s, y: r*s, width: s, height: s, fabricIndex: (r+c)%2, rotation: 0 });
        }
      }
      return cells;
    })(),

    // 3 horizontal strips (classic rail fence block)
    'rail-fence': [
      { id: 'A', name: 'Top Rail',    shape: 'rect', x: 0, y: 0,                 width: 100, height: 100/3, fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Middle Rail', shape: 'rect', x: 0, y: 100/3,             width: 100, height: 100/3, fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Bottom Rail', shape: 'rect', x: 0, y: (100/3)*2,         width: 100, height: 100/3, fabricIndex: 2, rotation: 0 },
    ],

    // ─── ADVANCED BEGINNER ─────────────────────────────────────────────────────

    // 2×2 four-patch: 4 equal squares
    'four-patch': [
      { id: 'A', name: 'Top Left',     shape: 'rect', x: 0,  y: 0,  width: 50, height: 50, fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Top Right',    shape: 'rect', x: 50, y: 0,  width: 50, height: 50, fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Bottom Left',  shape: 'rect', x: 0,  y: 50, width: 50, height: 50, fabricIndex: 2, rotation: 0 },
      { id: 'D', name: 'Bottom Right', shape: 'rect', x: 50, y: 50, width: 50, height: 50, fabricIndex: 0, rotation: 0 },
    ],

    // 3×3 nine-patch
    'nine-patch': (() => {
      const cells: BlockRegion[] = [];
      const s = 100/3;
      const names = ['TL','TC','TR','ML','MC','MR','BL','BC','BR'];
      const fabrics = [0,1,0, 1,2,1, 0,1,0];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const i = r*3+c;
          cells.push({ id: names[i], name: names[i], shape: 'rect', x: c*s, y: r*s, width: s, height: s, fabricIndex: fabrics[i], rotation: 0 });
        }
      }
      return cells;
    })(),

    // 2 right-triangles that together make a square — rendered as diagonal HST pair
    'half-square-triangles': [
      { id: 'A', name: 'Lower-Left Triangle', shape: 'polygon', points: '0,0 100,100 0,100', fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Upper-Right Triangle', shape: 'polygon', points: '0,0 100,0 100,100',  fabricIndex: 1, rotation: 0 },
    ],

    // Hourglass: 4 right triangles meeting at centre — two pairs of fabrics
    'hourglass': [
      { id: 'A', name: 'Top Triangle',    shape: 'polygon', points: '0,0 100,0 50,50',    fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Right Triangle',  shape: 'polygon', points: '100,0 100,100 50,50', fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Bottom Triangle', shape: 'polygon', points: '100,100 0,100 50,50', fabricIndex: 0, rotation: 0 },
      { id: 'D', name: 'Left Triangle',   shape: 'polygon', points: '0,100 0,0 50,50',     fabricIndex: 1, rotation: 0 },
    ],

    // Bow Tie: two opposite squares + two small corner triangles per square
    // Simplified as 2 large squares + 2 small corner triangles
    'bow-tie': [
      { id: 'A', name: 'Left Square',           shape: 'rect',    x: 0,  y: 0,  width: 50, height: 50, fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Right Square',          shape: 'rect',    x: 50, y: 50, width: 50, height: 50, fabricIndex: 0, rotation: 0 },
      { id: 'C', name: 'Top-Right Background',  shape: 'rect',    x: 50, y: 0,  width: 50, height: 50, fabricIndex: 1, rotation: 0 },
      { id: 'D', name: 'Bottom-Left Background',shape: 'rect',    x: 0,  y: 50, width: 50, height: 50, fabricIndex: 1, rotation: 0 },
      { id: 'E', name: 'Neck Left',             shape: 'polygon', points: '0,50 50,50 50,100',  fabricIndex: 0, rotation: 0 },
      { id: 'F', name: 'Neck Right',            shape: 'polygon', points: '50,0 100,0 50,50',   fabricIndex: 0, rotation: 0 },
    ],

    // ─── INTERMEDIATE ──────────────────────────────────────────────────────────

    // Flying Geese: 1 large centre triangle (goose) + 2 small corner triangles (sky)
    'flying-geese': [
      { id: 'A', name: 'Goose',      shape: 'polygon', points: '0,100 100,100 50,0', fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Sky Left',   shape: 'polygon', points: '0,0 50,0 0,100',     fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Sky Right',  shape: 'polygon', points: '50,0 100,0 100,100', fabricIndex: 1, rotation: 0 },
    ],

    // Pinwheel: 8 right-triangles radiating from centre
    'pinwheel': [
      { id: 'A', name: 'Triangle NE-outer', shape: 'polygon', points: '50,50 50,0 100,0',   fabricIndex: 0, rotation: 0 },
      { id: 'B', name: 'Triangle NE-inner', shape: 'polygon', points: '50,50 100,0 100,50', fabricIndex: 1, rotation: 0 },
      { id: 'C', name: 'Triangle SE-outer', shape: 'polygon', points: '50,50 100,50 100,100', fabricIndex: 0, rotation: 0 },
      { id: 'D', name: 'Triangle SE-inner', shape: 'polygon', points: '50,50 100,100 50,100', fabricIndex: 1, rotation: 0 },
      { id: 'E', name: 'Triangle SW-outer', shape: 'polygon', points: '50,50 50,100 0,100',   fabricIndex: 0, rotation: 0 },
      { id: 'F', name: 'Triangle SW-inner', shape: 'polygon', points: '50,50 0,100 0,50',     fabricIndex: 1, rotation: 0 },
      { id: 'G', name: 'Triangle NW-outer', shape: 'polygon', points: '50,50 0,50 0,0',       fabricIndex: 0, rotation: 0 },
      { id: 'H', name: 'Triangle NW-inner', shape: 'polygon', points: '50,50 0,0 50,0',       fabricIndex: 1, rotation: 0 },
    ],

    // Log Cabin: concentric strips around a small centre square
    // Grid: 7 columns × 7 rows, each strip = 1/7 ≈ 14.3 units
    'log-cabin': (() => {
      // Place strips using exact pixel coords on 0-100 grid
      // Centre at 43-57 (14 wide), strips 14 wide
      const s = 100/7;
      return [
        { id: 'A', name: 'Centre',      shape: 'rect' as const, x: s*3, y: s*3, width: s,   height: s,   fabricIndex: 0, rotation: 0 },
        // Round 1: light (fabric 1)
        { id: 'B', name: 'R1 Top',      shape: 'rect' as const, x: s*3, y: s*2, width: s,   height: s,   fabricIndex: 1, rotation: 0 },
        { id: 'C', name: 'R1 Right',    shape: 'rect' as const, x: s*4, y: s*2, width: s,   height: s*2, fabricIndex: 1, rotation: 0 },
        // Round 1: dark (fabric 2)
        { id: 'D', name: 'R1 Bottom',   shape: 'rect' as const, x: s*2, y: s*4, width: s*3, height: s,   fabricIndex: 2, rotation: 0 },
        { id: 'E', name: 'R1 Left',     shape: 'rect' as const, x: s*2, y: s*2, width: s,   height: s*2, fabricIndex: 2, rotation: 0 },
        // Round 2: light (fabric 1)
        { id: 'F', name: 'R2 Top',      shape: 'rect' as const, x: s*2, y: s*1, width: s*3, height: s,   fabricIndex: 1, rotation: 0 },
        { id: 'G', name: 'R2 Right',    shape: 'rect' as const, x: s*5, y: s*1, width: s,   height: s*4, fabricIndex: 1, rotation: 0 },
        // Round 2: dark (fabric 2)
        { id: 'H', name: 'R2 Bottom',   shape: 'rect' as const, x: s*1, y: s*5, width: s*5, height: s,   fabricIndex: 2, rotation: 0 },
        { id: 'I', name: 'R2 Left',     shape: 'rect' as const, x: s*1, y: s*1, width: s,   height: s*4, fabricIndex: 2, rotation: 0 },
        // Round 3: light (fabric 3)
        { id: 'J', name: 'R3 Top',      shape: 'rect' as const, x: s*1, y: 0,   width: s*5, height: s,   fabricIndex: 3, rotation: 0 },
        { id: 'K', name: 'R3 Right',    shape: 'rect' as const, x: s*6, y: 0,   width: s,   height: s*6, fabricIndex: 3, rotation: 0 },
        // Round 3: dark (fabric 4 or 2)
        { id: 'L', name: 'R3 Bottom',   shape: 'rect' as const, x: 0,   y: s*6, width: s*7, height: s,   fabricIndex: 4, rotation: 0 },
        { id: 'M', name: 'R3 Left',     shape: 'rect' as const, x: 0,   y: 0,   width: s,   height: s*6, fabricIndex: 4, rotation: 0 },
      ];
    })(),

    // Sawtooth Star: 3×3 grid; corners=background, centre square, and 4 inward-pointing flying-geese units
    'sawtooth-star': (() => {
      const s = 100/3;
      const regions: BlockRegion[] = [
        // Corner squares (background)
        { id: 'TL', name: 'Corner TL',      shape: 'rect', x: 0,   y: 0,   width: s, height: s, fabricIndex: 2, rotation: 0 },
        { id: 'TR', name: 'Corner TR',      shape: 'rect', x: s*2, y: 0,   width: s, height: s, fabricIndex: 2, rotation: 0 },
        { id: 'BL', name: 'Corner BL',      shape: 'rect', x: 0,   y: s*2, width: s, height: s, fabricIndex: 2, rotation: 0 },
        { id: 'BR', name: 'Corner BR',      shape: 'rect', x: s*2, y: s*2, width: s, height: s, fabricIndex: 2, rotation: 0 },
        // Centre square
        { id: 'CC', name: 'Centre',         shape: 'rect', x: s,   y: s,   width: s, height: s, fabricIndex: 1, rotation: 0 },
        // Top flying goose (points inward/down)
        { id: 'TG',  name: 'Top Goose',      shape: 'polygon', points: `${s},0 ${s*2},0 ${s*1.5},${s}`,      fabricIndex: 0, rotation: 0 },
        { id: 'TBG1',name: 'Top BG Left',    shape: 'polygon', points: `${s},0 ${s*1.5},${s} ${s},${s}`,      fabricIndex: 2, rotation: 0 },
        { id: 'TBG2',name: 'Top BG Right',   shape: 'polygon', points: `${s*2},0 ${s*2},${s} ${s*1.5},${s}`,  fabricIndex: 2, rotation: 0 },

        // Bottom flying goose (points inward/up)
        { id: 'BG',  name: 'Bottom Goose',   shape: 'polygon', points: `${s},${s*3} ${s*2},${s*3} ${s*1.5},${s*2}`, fabricIndex: 0, rotation: 0 },
        { id: 'BBG1',name: 'Bottom BG Left', shape: 'polygon', points: `${s},${s*2} ${s},${s*3} ${s*1.5},${s*2}`,    fabricIndex: 2, rotation: 0 },
        { id: 'BBG2',name: 'Bottom BG Right',shape: 'polygon', points: `${s*2},${s*2} ${s*1.5},${s*2} ${s*2},${s*3}`,fabricIndex: 2, rotation: 0 },

        // Left flying goose (points inward/right)
        { id: 'LG',  name: 'Left Goose',     shape: 'polygon', points: `0,${s} 0,${s*2} ${s},${s*1.5}`,       fabricIndex: 0, rotation: 0 },
        { id: 'LBG1',name: 'Left BG Top',    shape: 'polygon', points: `0,${s} ${s},${s} ${s},${s*1.5}`,       fabricIndex: 2, rotation: 0 },
        { id: 'LBG2',name: 'Left BG Bottom', shape: 'polygon', points: `0,${s*2} ${s},${s*1.5} ${s},${s*2}`,   fabricIndex: 2, rotation: 0 },

        // Right flying goose (points inward/left)
        { id: 'RG',  name: 'Right Goose',    shape: 'polygon', points: `${s*3},${s} ${s*3},${s*2} ${s*2},${s*1.5}`,  fabricIndex: 0, rotation: 0 },
        { id: 'RBG1',name: 'Right BG Top',   shape: 'polygon', points: `${s*2},${s} ${s*3},${s} ${s*2},${s*1.5}`,    fabricIndex: 2, rotation: 0 },
        { id: 'RBG2',name: 'Right BG Bottom',shape: 'polygon', points: `${s*2},${s*1.5} ${s*3},${s*2} ${s*2},${s*2}`,fabricIndex: 2, rotation: 0 },
      ];
      return regions;
    })(),

    // Ohio Star: like Sawtooth Star but side triangles are simple half-squares
    'ohio-star': (() => {
      const s = 100/3;
      return [
        // Corners
        { id: 'TL', name: 'Corner TL', shape: 'rect' as const, x: 0,   y: 0,   width: s, height: s, fabricIndex: 2, rotation: 0 },
        { id: 'TR', name: 'Corner TR', shape: 'rect' as const, x: s*2, y: 0,   width: s, height: s, fabricIndex: 2, rotation: 0 },
        { id: 'BL', name: 'Corner BL', shape: 'rect' as const, x: 0,   y: s*2, width: s, height: s, fabricIndex: 2, rotation: 0 },
        { id: 'BR', name: 'Corner BR', shape: 'rect' as const, x: s*2, y: s*2, width: s, height: s, fabricIndex: 2, rotation: 0 },
        // Centre
        { id: 'CC', name: 'Centre', shape: 'rect' as const, x: s, y: s, width: s, height: s, fabricIndex: 2, rotation: 0 },
        // Top square — 2 HSTs
        { id: 'TA', name: 'Top Star Half A', shape: 'polygon' as const, points: `${s},0 ${s*2},0 ${s*2},${s}`,   fabricIndex: 0, rotation: 0 },
        { id: 'TB', name: 'Top Star Half B', shape: 'polygon' as const, points: `${s},0 ${s*2},${s} ${s},${s}`,  fabricIndex: 1, rotation: 0 },
        // Bottom square
        { id: 'BA', name: 'Bot Star Half A', shape: 'polygon' as const, points: `${s},${s*2} ${s*2},${s*2} ${s},${s*3}`,   fabricIndex: 0, rotation: 0 },
        { id: 'BB', name: 'Bot Star Half B', shape: 'polygon' as const, points: `${s*2},${s*2} ${s*2},${s*3} ${s},${s*3}`, fabricIndex: 1, rotation: 0 },
        // Left square
        { id: 'LA', name: 'Left Star Half A', shape: 'polygon' as const, points: `0,${s} ${s},${s} 0,${s*2}`,     fabricIndex: 0, rotation: 0 },
        { id: 'LB', name: 'Left Star Half B', shape: 'polygon' as const, points: `${s},${s} ${s},${s*2} 0,${s*2}`, fabricIndex: 1, rotation: 0 },
        // Right square
        { id: 'RA', name: 'Right Star Half A', shape: 'polygon' as const, points: `${s*2},${s} ${s*3},${s} ${s*3},${s*2}`,   fabricIndex: 0, rotation: 0 },
        { id: 'RB', name: 'Right Star Half B', shape: 'polygon' as const, points: `${s*2},${s} ${s*3},${s*2} ${s*2},${s*2}`, fabricIndex: 1, rotation: 0 },
      ];
    })(),

    // Churn Dash: 3×3 with: bg corners, HST sides, centre accent
    'churn-dash': (() => {
      const s = 100/3;
      return [
        // Corners
        { id: 'TL', name: 'Corner TL', shape: 'rect' as const, x: 0,   y: 0,   width: s, height: s, fabricIndex: 1, rotation: 0 },
        { id: 'TR', name: 'Corner TR', shape: 'rect' as const, x: s*2, y: 0,   width: s, height: s, fabricIndex: 1, rotation: 0 },
        { id: 'BL', name: 'Corner BL', shape: 'rect' as const, x: 0,   y: s*2, width: s, height: s, fabricIndex: 1, rotation: 0 },
        { id: 'BR', name: 'Corner BR', shape: 'rect' as const, x: s*2, y: s*2, width: s, height: s, fabricIndex: 1, rotation: 0 },
        // Centre
        { id: 'CC', name: 'Centre', shape: 'rect' as const, x: s, y: s, width: s, height: s, fabricIndex: 0, rotation: 0 },
        // Top side: vertical strip pair
        { id: 'TA', name: 'Top Left Strip',  shape: 'rect' as const, x: s,       y: 0, width: s/2, height: s, fabricIndex: 0, rotation: 0 },
        { id: 'TB', name: 'Top Right Strip', shape: 'rect' as const, x: s+s/2,   y: 0, width: s/2, height: s, fabricIndex: 1, rotation: 0 },
        // Bottom side
        { id: 'BA', name: 'Bot Left Strip',  shape: 'rect' as const, x: s,       y: s*2, width: s/2, height: s, fabricIndex: 1, rotation: 0 },
        { id: 'BB', name: 'Bot Right Strip', shape: 'rect' as const, x: s+s/2,   y: s*2, width: s/2, height: s, fabricIndex: 0, rotation: 0 },
        // Left side
        { id: 'LA', name: 'Left Top Strip',  shape: 'rect' as const, x: 0, y: s,       width: s, height: s/2, fabricIndex: 0, rotation: 0 },
        { id: 'LB', name: 'Left Bot Strip',  shape: 'rect' as const, x: 0, y: s+s/2,   width: s, height: s/2, fabricIndex: 1, rotation: 0 },
        // Right side
        { id: 'RA', name: 'Right Top Strip', shape: 'rect' as const, x: s*2, y: s,       width: s, height: s/2, fabricIndex: 1, rotation: 0 },
        { id: 'RB', name: 'Right Bot Strip', shape: 'rect' as const, x: s*2, y: s+s/2,   width: s, height: s/2, fabricIndex: 0, rotation: 0 },
      ];
    })(),

    // Mosaic Star: 8-pointed star via 45° diagonal cuts — approximated with 8 star points + background triangles
    'mosaic-star': (() => {
      // Use an 8-pointed star approach: centre octagon + 8 points
      const cx = 50, cy = 50, R = 38, r = 22;
      const pts = (n: number, radius: number, offset = 0) =>
        Array.from({ length: n }, (_, i) => {
          const a = (Math.PI * 2 * i) / n + offset;
          return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
        });
      const outer = pts(8, R, -Math.PI/2);
      const inner = pts(8, r, -Math.PI/2 + Math.PI/8);
      const star = Array.from({ length: 8 }, (_, i) => {
        const o = outer[i];
        const i1 = inner[i];
        const i2 = inner[(i+1) % 8];
        const o2 = outer[(i+1) % 8];
        return {
          id: `P${i}`, name: `Star Point ${i+1}`,
          shape: 'polygon' as const,
          points: `${o[0].toFixed(1)},${o[1].toFixed(1)} ${i1[0].toFixed(1)},${i1[1].toFixed(1)} ${cx},${cy} ${i2[0].toFixed(1)},${i2[1].toFixed(1)}`,
          fabricIndex: i % 2 === 0 ? 0 : 1,
          rotation: 0 as const,
        };
      });
      // Background corners (8 triangles between points and square edges)
      const bg = Array.from({ length: 8 }, (_, i) => {
        const i1 = inner[i];
        const i2 = inner[(i+1) % 8];
        const o = outer[(i+1) % 8];
        return {
          id: `BG${i}`, name: `Background ${i+1}`,
          shape: 'polygon' as const,
          points: `${o[0].toFixed(1)},${o[1].toFixed(1)} ${i1[0].toFixed(1)},${i1[1].toFixed(1)} ${i2[0].toFixed(1)},${i2[1].toFixed(1)}`,
          fabricIndex: 2,
          rotation: 0 as const,
        };
      });
      // Centre
      const centre = {
        id: 'C', name: 'Centre',
        shape: 'polygon' as const,
        points: inner.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '),
        fabricIndex: 3,
        rotation: 0 as const,
      };
      return [...star, ...bg, centre];
    })(),

    // ─── ADVANCED ──────────────────────────────────────────────────────────────

    // Lone Star: 8 large diamond points meeting at centre
    'lone-star': (() => {
      const cx = 50, cy = 50, R = 48, r = 20;
      const pts = (n: number, radius: number, offset = 0) =>
        Array.from({ length: n }, (_, i) => {
          const a = (Math.PI * 2 * i) / n + offset;
          return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
        });
      const outer = pts(8, R, -Math.PI/2);
      const inner = pts(8, r, -Math.PI/2 + Math.PI/8);
      return Array.from({ length: 8 }, (_, i) => ({
        id: `P${i}`, name: `Diamond ${i+1}`,
        shape: 'polygon' as const,
        points: `${cx},${cy} ${inner[i][0].toFixed(1)},${inner[i][1].toFixed(1)} ${outer[i][0].toFixed(1)},${outer[i][1].toFixed(1)} ${inner[(i+1)%8][0].toFixed(1)},${inner[(i+1)%8][1].toFixed(1)}`,
        fabricIndex: i % 3,
        rotation: 0 as const,
      }));
    })(),

    // Kaleidoscope Star: 8 wedge-shaped kite pieces radiating from centre
    'kaleidoscope-star': (() => {
      const cx = 50, cy = 50;
      return Array.from({ length: 8 }, (_, i) => {
        const a1 = (Math.PI * 2 * i) / 8 - Math.PI/2;
        const a2 = (Math.PI * 2 * (i+1)) / 8 - Math.PI/2;
        const r1 = 48;
        const x1 = cx + r1 * Math.cos(a1), y1 = cy + r1 * Math.sin(a1);
        const x2 = cx + r1 * Math.cos(a2), y2 = cy + r1 * Math.sin(a2);
        return {
          id: `W${i}`, name: `Wedge ${i+1}`,
          shape: 'polygon' as const,
          points: `${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
          fabricIndex: i % 3,
          rotation: 0 as const,
        };
      });
    })(),

    // New York Beauty: centre arc fan + background corner + flying-geese arc spikes
    // Simplified: background square + centre circle + 8 arc spike triangles
    'new-york-beauty': (() => {
      const cx = 50, cy = 50;
      const spikes: BlockRegion[] = Array.from({ length: 8 }, (_, i) => {
        const a1 = (Math.PI * 2 * i) / 8 - Math.PI/2;
        const a2 = (Math.PI * 2 * (i+1)) / 8 - Math.PI/2;
        const R = 46;
        const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
        return {
          id: `S${i}`, name: `Arc Spike ${i+1}`,
          shape: 'polygon' as const,
          points: `${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
          fabricIndex: i % 2 === 0 ? 0 : 1,
          rotation: 0 as const,
        };
      });
      return [
        { id: 'BG', name: 'Background', shape: 'rect' as const, x: 0, y: 0, width: 100, height: 100, fabricIndex: 2, rotation: 0 },
        ...spikes,
        { id: 'C', name: 'Centre Circle', shape: 'polygon' as const,
          points: Array.from({length: 16}, (_, i) => {
            const a = (Math.PI*2*i)/16; const r = 18;
            return `${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
          }).join(' '),
          fabricIndex: 3, rotation: 0 },
      ];
    })(),

    // Drunkard's Path: 2×2 grid of curved units — approximated as quarter-circles via polygon
    "drunkards-path": (() => {
      const arc = (cx: number, cy: number, r: number, startDeg: number) => {
        const pts: string[] = [];
        for (let d = startDeg; d <= startDeg + 90; d += 10) {
          const a = (d * Math.PI) / 180;
          pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
        }
        return pts.join(' ');
      };
      // 4 cells, each 50×50, with a quarter circle in alternating corners
      return [
        // Cell TL: bg square + circle arc in bottom-right corner
        { id: 'TL_BG', name: 'TL Background', shape: 'rect' as const, x: 0,  y: 0,  width: 50, height: 50, fabricIndex: 1, rotation: 0 },
        { id: 'TL_C',  name: 'TL Curve',      shape: 'polygon' as const, points: `50,50 ${arc(50,50,36,180)} 50,50`, fabricIndex: 0, rotation: 0 },
        // Cell TR: bg + arc in bottom-left
        { id: 'TR_BG', name: 'TR Background', shape: 'rect' as const, x: 50, y: 0,  width: 50, height: 50, fabricIndex: 0, rotation: 0 },
        { id: 'TR_C',  name: 'TR Curve',      shape: 'polygon' as const, points: `50,50 ${arc(50,50,36,270)} 50,50`, fabricIndex: 1, rotation: 0 },
        // Cell BL: bg + arc in top-right
        { id: 'BL_BG', name: 'BL Background', shape: 'rect' as const, x: 0,  y: 50, width: 50, height: 50, fabricIndex: 0, rotation: 0 },
        { id: 'BL_C',  name: 'BL Curve',      shape: 'polygon' as const, points: `50,50 ${arc(50,50,36,0)} 50,50`,   fabricIndex: 1, rotation: 0 },
        // Cell BR: bg + arc in top-left
        { id: 'BR_BG', name: 'BR Background', shape: 'rect' as const, x: 50, y: 50, width: 50, height: 50, fabricIndex: 1, rotation: 0 },
        { id: 'BR_C',  name: 'BR Curve',      shape: 'polygon' as const, points: `100,50 ${arc(100,50,36,90)} 100,50`, fabricIndex: 0, rotation: 0 },
      ];
    })(),

    // ─── EXPERT ────────────────────────────────────────────────────────────────

    // Grandmother's Flower Garden: 1 centre hex + 6 ring-1 hexagons + 12 ring-2 hexagons
    "grandmothers-flower-garden": (() => {
      const hexPts = (cx: number, cy: number, r: number) =>
        Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
        }).join(' ');

      const R = 17; // radius of each hex
      const d = R * Math.sqrt(3); // center-to-center distance

      const center: BlockRegion = { id: 'C0', name: 'Centre', shape: 'polygon', points: hexPts(50, 50, R), fabricIndex: 0, rotation: 0 };

      const ring1 = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const cx = 50 + d * Math.cos(a), cy = 50 + d * Math.sin(a);
        return { id: `R1_${i}`, name: `Ring 1 Hex ${i+1}`, shape: 'polygon' as const, points: hexPts(cx, cy, R), fabricIndex: 1, rotation: 0 as const };
      });

      return [center, ...ring1];
    })(),

    // Pickle Dish: 4 curved wedge units arranged in 2×2 — like a folded arc
    'pickle-dish': (() => {
      const arc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
        const pts: string[] = [];
        for (let d = startDeg; d <= endDeg; d += 9) {
          const a = (d * Math.PI) / 180;
          pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
        }
        return pts;
      };
      // Each quadrant: outer arc + inner arc reversed + close
      const quadrants: BlockRegion[] = [];
      const offsets = [[-1,-1],[1,-1],[1,1],[-1,1]];
      const startAngles = [0, 90, 180, 270];
      for (let q = 0; q < 4; q++) {
        const [ox, oy] = offsets[q];
        const cx = 50 + ox * 50, cy = 50 + oy * 50;
        const sa = startAngles[q];
        const outer = arc(cx, cy, 50, sa, sa + 90);
        const inner = arc(cx, cy, 28, sa, sa + 90).reverse();
        const outerCurve = outer.join(' ');
        const innerCurve = inner.join(' ');
        // Outer spine
        quadrants.push({
          id: `Q${q}_outer`, name: `Quadrant ${q+1} Outer`,
          shape: 'polygon', points: `${outerCurve} ${innerCurve}`,
          fabricIndex: q % 2, rotation: 0,
        });
        // Inner fill
        const inner2 = arc(cx, cy, 28, sa, sa + 90);
        quadrants.push({
          id: `Q${q}_inner`, name: `Quadrant ${q+1} Inner`,
          shape: 'polygon', points: `${cx},${cy} ${inner2.join(' ')}`,
          fabricIndex: 2 + q % 2, rotation: 0,
        });
      }
      return quadrants;
    })(),
  };

  if (motifs[patternId]) {
    return motifs[patternId].map((region) => ({ ...region }));
  }

  // Fallback for any unknown pattern: 2×2 four-square
  return [
    { id: 'A', name: 'Top Left',     shape: 'rect', x: 0,  y: 0,  width: 50, height: 50, fabricIndex: 0, rotation: 0 },
    { id: 'B', name: 'Top Right',    shape: 'rect', x: 50, y: 0,  width: 50, height: 50, fabricIndex: 1, rotation: 0 },
    { id: 'C', name: 'Bottom Left',  shape: 'rect', x: 0,  y: 50, width: 50, height: 50, fabricIndex: 1, rotation: 0 },
    { id: 'D', name: 'Bottom Right', shape: 'rect', x: 50, y: 50, width: 50, height: 50, fabricIndex: 0, rotation: 0 },
  ];
}

function BlockDesignerPageContent() {
  const router = useRouter();
  const patterns = useMemo(() => getAllPatterns(), []);
  const {
    currentDesignId,
    isSaving,
    isInstructionsOpen,
    selectedPatternId,
    selectedPattern,
    fabricPreviews,
    libraryFabrics,
    globalRotation,
    regions,
    fileInputRefs,
    activeFabrics,
    setGlobalRotation,
    setIsInstructionsOpen,
    handleSaveDesign,
    handleLoadDesign,
    handleDuplicateDesign,
    resetForPattern,
    handleFabricPhotoUpload,
    handleFabricPhotoClear,
    handleApplyLibraryFabric,
    handleFabricChange,
    handleRegionFabricChange,
    handleRegionRotationChange,
  } = useBlockDesignerPageModel({
    patterns,
    defaultPatternId: 'simple-squares',
    defaultFabrics: DEFAULT_FABRICS,
    getBaseRegions,
    sanitizeLoadedFabrics,
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 45%, #FFFBEB 100%)' }} suppressHydrationWarning>
      <Navigation />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <p className="text-red-700 font-semibold text-sm tracking-wide uppercase">Standalone Tool</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Block Designer</h1>
                <p className="text-gray-600 mt-2 max-w-3xl">
                  Design any block style with your own fabric assignments and rotation controls before generating a full quilt.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                    <select
                      value={selectedPatternId}
                      onChange={(event) => resetForPattern(event.target.value)}
                      className="w-full min-w-[280px] border border-gray-300 rounded-md px-3 py-2"
                    >
                      {patterns.map((pattern) => (
                        <option key={pattern.id} value={pattern.id}>
                          {pattern.name} ({pattern.minFabrics}-{pattern.maxFabrics} fabrics)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block Rotation</label>
                    <div className="flex gap-1">
                      {ROTATIONS.map((rotation) => (
                        <button
                          key={`global-rotation-${rotation}`}
                          type="button"
                          onClick={() => setGlobalRotation(rotation)}
                          className={`px-3 py-2 rounded-md text-sm border ${
                            globalRotation === rotation
                              ? 'bg-red-700 text-white border-red-700'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {rotation}°
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {isSaving ? 'Saving...' : currentDesignId ? 'Update Design' : 'Save Design'}
                  </button>
                  <button
                    onClick={handleLoadDesign}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    My Designs
                  </button>
                  {currentDesignId && (
                    <button
                      onClick={handleDuplicateDesign}
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                    >
                      Duplicate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Assembly Instructions */}
            {(() => {
              const instructions = getAssemblyInstructions(selectedPatternId);
              if (!instructions) return null;
              return (
                <div className="mb-8 border border-amber-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setIsInstructionsOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-amber-50 hover:bg-amber-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📐</span>
                      <span className="font-semibold text-gray-900">Assembly Instructions</span>
                      <span className="text-sm text-gray-500">— {selectedPattern?.name}</span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isInstructionsOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isInstructionsOpen && (
                    <div className="px-5 py-4 bg-white space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span><strong>Block size:</strong> {instructions.blockSize}</span>
                        <span><strong>Seam allowance:</strong> {instructions.seam}</span>
                      </div>

                      <ol className="space-y-2">
                        {instructions.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-700">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center justify-center text-xs">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {instructions.tips && instructions.tips.length > 0 && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3">
                          <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide mb-1">Quilter&apos;s Tip{instructions.tips.length > 1 ? 's' : ''}</p>
                          <ul className="space-y-1">
                            {instructions.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-yellow-900">• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Fabric Palette</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeFabrics.map((fabric, index) => (
                  <div key={fabric.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/80">
                    <label className="block text-sm text-gray-700 mb-2">Fabric {index + 1}</label>

                    {libraryFabrics.length > 0 && (
                      <div className="mb-2 flex gap-2 items-center">
                        <select
                          value={fabric.libraryFabricId || ''}
                          onChange={(event) => handleApplyLibraryFabric(index, event.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          <option value="">Select from library</option>
                          {libraryFabrics.map((savedFabric) => (
                            <option key={savedFabric.id} value={savedFabric.id}>
                              {savedFabric.name} ({savedFabric.yardageAvailable.toFixed(2)} yd)
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => router.push('/fabrics')}
                          className="text-xs text-indigo-700 hover:text-indigo-900"
                        >
                          Manage
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 items-start">
                      {/* Photo thumbnail or color picker */}
                      <div className="relative shrink-0">
                        {fabricPreviews[index] || fabric.imageUrl ? (
                          <div className="relative w-14 h-10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={fabricPreviews[index] || fabric.imageUrl}
                              alt={`Fabric ${index + 1} photo`}
                              className="w-14 h-10 object-cover rounded border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleFabricPhotoClear(index)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center leading-none"
                              aria-label={`Remove photo for fabric ${index + 1}`}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <input
                            type="color"
                            value={fabric.color}
                            onChange={(event) => handleFabricChange(index, 'color', event.target.value)}
                            className="h-10 w-14 border border-gray-300 rounded cursor-pointer bg-white"
                            aria-label={`Color for fabric ${index + 1}`}
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <input
                          type="text"
                          value={fabric.name}
                          onChange={(event) => handleFabricChange(index, 'name', event.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder={`Fabric ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className="text-xs text-indigo-600 hover:text-indigo-800 text-left truncate"
                        >
                          {fabricPreviews[index] ? '↑ Replace photo' : '+ Upload photo'}
                        </button>
                        <input
                          ref={(el) => { fileInputRefs.current[index] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          aria-label={`Upload photo for fabric ${index + 1}`}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleFabricPhotoUpload(index, file);
                            event.target.value = '';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <BlockDesignerCanvas
              patternName={selectedPattern?.name || 'Pattern'}
              fabrics={activeFabrics}
              regions={regions}
              globalRotation={globalRotation}
              onRegionFabricChange={handleRegionFabricChange}
              onRegionRotationChange={handleRegionRotationChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BlockDesignerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BlockDesignerPageContent />
    </Suspense>
  );
}
