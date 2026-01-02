// renderer/renderQuiltSvg.ts

import { PatternDefinition } from '../types/PatternDefinition';
import { getBlockRotation } from './getBlockRotation';

interface RenderOptions {
  rows: number;
  cols: number;
  blockSize: number; // should be 100 for Bow Tie
  fabricColors: string[];
}

export function renderQuiltSvg(
  pattern: PatternDefinition,
  options: RenderOptions
): string {
  const { rows, cols, blockSize, fabricColors } = options;

  let svg = `<svg viewBox="0 0 ${cols * blockSize} ${rows * blockSize}" xmlns="http://www.w3.org/2000/svg">`;

  let blockIndex = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * blockSize;
      const y = row * blockSize;

      const colors = pattern.getColors(fabricColors, { blockIndex, row, col });
      let blockSvg = pattern.template;

      colors.forEach((color, i) => {
        blockSvg = blockSvg.replaceAll(`COLOR${i + 1}`, color);
      });

      const rotation = getBlockRotation(pattern, row, col);

      svg += `
        <g transform="translate(${x}, ${y}) rotate(${rotation}, ${blockSize / 2}, ${blockSize / 2})">
          ${blockSvg}
        </g>
      `;

      blockIndex++;
    }
  }

  svg += `</svg>`;
  return svg;
}
