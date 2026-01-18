/**
 * Service for wrapping SVG blocks and definitions into complete SVG markup
 */
export class SvgWrapper {
  /**
   * Wraps SVG blocks and definitions into a complete SVG string.
   * 
   * @param blocks - SVG block elements as a string
   * @param extraDefs - Additional SVG definitions (patterns, filters, etc.)
   * @param borderSvg - Optional border SVG elements
   * @param totalWidth - Total width including borders (default: 300)
   * @param totalHeight - Total height including borders (default: 400)
   * @returns Complete SVG markup
   * 
   * @example
   * ```typescript
   * const svg = SvgWrapper.wrap('<g>...</g>', '<pattern>...</pattern>', '<rect>...</rect>');
   * // Returns: '<svg viewBox="0 0 300 400">...</svg>'
   * ```
   */
  static wrap(
    blocks: string, 
    extraDefs: string = '', 
    borderSvg: string = '',
    totalWidth: number = 300,
    totalHeight: number = 400,
    borderWidth: number = 0
  ): string {
    // Use a generous viewBox that accommodates max borders (up to ~10" on each side)
    // Quilt blocks always render at (0,0) - borders extend into negative space
    const maxBorderSpace = 100; // Max 10" borders per side (1" = 10 SVG units)
    const padding = 20;
    
    const viewBoxX = -(maxBorderSpace + padding);
    const viewBoxY = -(maxBorderSpace + padding);
    const viewBoxWidth = totalWidth + (2 * (maxBorderSpace + padding));
    const viewBoxHeight = totalHeight + (2 * (maxBorderSpace + padding));
    
    return `<svg viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${this.getDefaultPatterns()}
    ${extraDefs}
    ${this.getDefaultFilters()}
  </defs>
  <rect x="${viewBoxX}" y="${viewBoxY}" width="${viewBoxWidth}" height="${viewBoxHeight}" fill="#ffffff"/>
  <!-- Borders rendered here (should appear on top of white background) -->
${borderSvg}
  <!-- Quilt blocks with quilting filter -->
  <g filter="url(#quilting)">
${blocks}  </g>
</svg>`;
  }

  /**
   * Returns default fabric texture pattern
   */
  private static getDefaultPatterns(): string {
    return `<pattern id="fabricTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="rgba(255,255,255,0.02)"/>
      <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.03)"/>
    </pattern>`;
  }

  /**
   * Returns default SVG filters for shadow and quilting effects
   */
  private static getDefaultFilters(): string {
    return `<filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/>
      <feOffset dx="0.5" dy="0.5" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.15"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="quilting">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.3"/>
      <feOffset dx="0.2" dy="0.2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`;
  }
}
