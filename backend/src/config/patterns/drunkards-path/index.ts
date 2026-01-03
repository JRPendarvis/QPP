import { PatternDefinition } from '../../../types/PatternDefinition';
import { DRUNKARDS_PATH_TEMPLATE } from './template';
import { DRUNKARDS_PATH_PROMPT } from './prompt';

const DrunkardsPath: PatternDefinition = {
  id: 'drunkards-path',
  name: "Drunkard's Path",
  template: DRUNKARDS_PATH_TEMPLATE,
  prompt: DRUNKARDS_PATH_PROMPT,
  minFabrics: 2,
  maxFabrics: 2,
  allowRotation: true,

  /**
   * MVP NOTE:
   * Drunkard's Path looks best with deterministic rotation (not random),
   * otherwise it can appear chaotic/unintentional.
   *
   * Use your deterministic strategy here.
   * If your engine doesn't support this value yet, tell me what values are allowed
   * and I’ll align it.
   */
  rotationStrategy: 'parity-2x2',

  /**
   * Template behavior:
   * - COLOR1 fills the base square (background remainder)
   * - COLOR2 overlays the quarter-circle (dominant curved piece)
   *
   * MVP FIX:
   * Alternate dominance so the "small remainder" is not always the same fabric.
   * This is done by swapping [background, path] on a checkerboard.
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const path = fabricColors[1] || background;

    const row = opts.row ?? 0;
    const col = opts.col ?? 0;

    // Checkerboard inversion for balanced dominance
    const invert = (row + col) % 2 === 1;

    // Return colors in template order: [COLOR1, COLOR2]
    return invert ? [path, background] : [background, path];
  }
};

export default DrunkardsPath;
