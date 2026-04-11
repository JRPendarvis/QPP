// src/services/pattern/quiltSizeMapper.ts

import { QuiltSizeCatalog } from './quiltSizeCatalog';

/**
 * Maps quilt size keys to formatted size strings
 * Single Responsibility: Quilt size string resolution only
 */
export class QuiltSizeMapper {
  /**
   * Get formatted size string for quilt size key
   * @param quiltSize - Optional size key (baby, lap, twin, etc.)
   * @returns Formatted size string
   */
  static getFormattedSize(quiltSize?: string): string {
    return QuiltSizeCatalog.formatPromptSize(quiltSize);
  }
}
