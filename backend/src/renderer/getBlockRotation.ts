// renderer/getBlockRotation.ts

import type { PatternDefinition } from '../types/PatternDefinition';

export function getBlockRotation(
  pattern: PatternDefinition,
  row: number,
  col: number
): number {
  if (pattern.allowRotation === false) return 0;

  switch (pattern.rotationStrategy) {
    case 'alternate-180':
      return (row + col) % 2 === 0 ? 0 : 180;

    case 'alternate-90':
      return (row + col) % 2 === 0 ? 0 : 90;

    case 'checkerboard-90': {
      const r = row % 2;
      const c = col % 2;
      if (r === 0 && c === 0) return 0;
      if (r === 0 && c === 1) return 90;
      if (r === 1 && c === 0) return 270;
      return 180;
    }

    case 'none':
    default:
      return 0;
  }
}
