import { QuiltSizeCatalog } from './quiltSizeCatalog';

/**
 * Handles quilt size resolution and parsing
 */
export class SizeResolver {
  /**
   * Gets display size based on user selection or Claude's estimate
   */
  static getDisplaySize(
    quiltSize?: string,
    claudeSize?: string
  ): string {
    const dimensions = QuiltSizeCatalog.resolveDimensions(quiltSize, claudeSize);
    return QuiltSizeCatalog.formatDisplaySize(dimensions);
  }

  /**
   * Parses size string into width/height dimensions
   */
  static parseDimensions(sizeString: string): { widthIn: number; heightIn: number } {
    return QuiltSizeCatalog.resolveDimensions(sizeString);
  }
}
