// index.ts
import { PatternDefinition } from '../types';
import { STRIP_QUILT_TEMPLATE } from './template';
import { STRIP_QUILT_PROMPT } from './prompt';

const StripQuilt: PatternDefinition = {
  id: 'strip-quilt',
  name: 'Strip Quilt',
  template: STRIP_QUILT_TEMPLATE,
  prompt: STRIP_QUILT_PROMPT,

  // Product offering: 3–8 fabrics
  minFabrics: 3,
  maxFabrics: 8,

  // Current template is vertical-only; keep false until you add a rotated template or transform support
  allowRotation: false,
  rotationStrategy: 'none',

  /**
   * Strip Quilt governance (best-results, 4-strip template):
   *
   * The SVG template renders exactly FOUR vertical strips (COLOR1–COLOR4).
   * We map 3–8 user-selected fabrics into these four roles for consistent,
   * intentional results (especially at higher fabric counts).
   *
   * Roles:
   * - COLOR1: Background (rest/separator)  => fabricColors[0]
   * - COLOR2: Primary (anchor)             => fabricColors[1]
   * - COLOR3: Secondary (anchor)           => fabricColors[2]
   * - COLOR4: Accent (controlled)          => chosen from fabricColors[3+]
   *
   * Behavior by count:
   * - 3 fabrics: Accent falls back to Secondary (clean + bold)
   * - 4 fabrics: Accent = fabricColors[3] (direct mapping)
   * - 5–8 fabrics: Accent rotates deterministically using blockIndex (or row/col)
   *   to showcase extra fabrics without destabilizing the overall rhythm.
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const provided = (fabricColors || []).filter(Boolean);

    const background = provided[0] ?? '#999';
    const primary = provided[1] ?? background;
    const secondary = provided[2] ?? primary;

    const extras = provided.slice(3); // 0..5 extras

    // Default accent:
    // - no extras => secondary
    // - 1 extra  => that extra
    // - 2+ extras => rotate based on a stable seed
    let accent = secondary;

    if (extras.length === 1) {
      accent = extras[0];
    } else if (extras.length > 1) {
      const { blockIndex, row, col } = opts;

      const seed =
        typeof blockIndex === 'number'
          ? blockIndex
          : typeof row === 'number' && typeof col === 'number'
            ? row * 1000 + col
            : 0;

      accent = extras[Math.abs(seed) % extras.length];

      // Guardrail: avoid accent matching primary/secondary if possible
      if ((accent === primary || accent === secondary) && extras.length > 1) {
        accent = extras[(Math.abs(seed) + 1) % extras.length];
      }
    }

    return [background, primary, secondary, accent];
  }
};

export default StripQuilt;
