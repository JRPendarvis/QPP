/**
 * Handles quilt size resolution and parsing
 */
export class SizeResolver {
  private static readonly SIZE_MAP: Record<string, string> = {
    'baby': '36×52 inches',
    'lap': '50×65 inches',
    'twin': '66×90 inches',
    'full': '80×90 inches',
    'queen': '90×95 inches',
    'king': '105×95 inches',
  };

  private static readonly DEFAULT_SIZE = '60×72 inches';

  /**
   * Gets display size based on user selection or Claude's estimate
   */
  static getDisplaySize(
    quiltSize?: string,
    claudeSize?: string
  ): string {
    if (quiltSize) {
      return this.SIZE_MAP[quiltSize] || claudeSize || this.DEFAULT_SIZE;
    }
    return claudeSize || this.DEFAULT_SIZE;
  }

  /**
   * Parses size string into width/height dimensions
   */
  static parseDimensions(sizeString: string): { widthIn: number; heightIn: number } {
    // Trim and normalize whitespace first
    const normalized = sizeString.trim().replace(/\s+/g, '');
    const match = normalized.match(/(\d+)[×x](\d+)/);
    
    if (match) {
      return {
        widthIn: parseInt(match[1], 10),
        heightIn: parseInt(match[2], 10)
      };
    }
    
    // Default to throw size
    return { widthIn: 60, heightIn: 72 };
  }
}
