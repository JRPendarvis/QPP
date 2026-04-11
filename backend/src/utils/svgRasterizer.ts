import sharp from 'sharp';

/**
 * Abstraction over SVG rasterization.
 * Follows Dependency Inversion: callers depend on this interface, not on a
 * specific imaging library.  Swap implementations for different environments
 * or in unit tests without modifying the calling code.
 */
export interface ISvgRasterizer {
  rasterize(svgBuffer: Buffer): Promise<Buffer>;
}

/**
 * Sharp-backed SVG rasterizer (production default).
 */
export class SharpSvgRasterizer implements ISvgRasterizer {
  constructor(private readonly density: number = 144) {}

  async rasterize(svgBuffer: Buffer): Promise<Buffer> {
    return sharp(svgBuffer, { density: this.density }).png().toBuffer();
  }
}
