import { PatternDefinition } from '../types';
import { STRIP_QUILT_TEMPLATE } from './template';
import { STRIP_QUILT_PROMPT } from './prompt';


const StripQuilt: PatternDefinition = {
  id: 'strip-quilt',
  name: 'Strip Quilt',
  template: '', // Not used, see getColors and getTemplate
  prompt: STRIP_QUILT_PROMPT,
  minColors: 2,
  maxColors: 8,
 allowRotation: false,
  /**
   * Returns the color sequence for the block (all colors in order)
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    return fabricColors;
  },

  /**
   * Dynamically generates the SVG for a strip quilt block with N strips
   */
  getTemplate: (colors: string[]) => {
    const n = Math.max(2, Math.min(colors.length, 8));
    const stripWidth = 100 / n;
    let svg = '';
    for (let i = 0; i < n; i++) {
      const x = (i * stripWidth).toFixed(2);
      const width = (i === n - 1)
        ? (100 - stripWidth * (n - 1)).toFixed(2) // last strip fills remainder
        : stripWidth.toFixed(2);
      svg += `<rect x="${x}" y="0" width="${width}" height="100" fill="COLOR${i + 1}" stroke="#ccc" stroke-width="0.5"/>\n`;
    }
    return svg;
  }
};

export default StripQuilt;