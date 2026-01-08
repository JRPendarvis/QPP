// utils/parseQuiltSize.ts
//
// Strict quilt size parser.
// Expected examples:
// - "72x84 inches lap quilt"
// - "72 x 84"
// - "72×84"

export type QuiltSizeIn = { width: number; height: number };

export function parseQuiltSizeIn(text: string): QuiltSizeIn {
  const match = text.match(/(\d+)\s*(x|×)\s*(\d+)/i);
  if (!match) {
    throw new Error(`Unable to parse quilt size from: "${text}"`);
  }

  const width = parseInt(match[1], 10);
  const height = parseInt(match[3], 10);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(`Invalid quilt size parsed from: "${text}"`);
  }

  return { width, height };
}
