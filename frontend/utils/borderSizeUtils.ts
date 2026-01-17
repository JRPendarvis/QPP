/**
 * Border Size Utilities
 * Frontend utilities for border size calculations and display
 */

import { Border, BorderDimensions } from '@/types/Border';

export class BorderSizeUtils {
  /**
   * Calculate border dimensions
   */
  static calculateDimensions(
    borders: Border[],
    quiltTopWidth: number,
    quiltTopHeight: number,
    targetWidth?: number,
    targetHeight?: number
  ): BorderDimensions {
    const totalBorderWidth = borders.reduce((sum, b) => sum + b.width, 0);
    
    const finishedWidth = quiltTopWidth + (2 * totalBorderWidth);
    const finishedHeight = quiltTopHeight + (2 * totalBorderWidth);
    
    const dimensions: BorderDimensions = {
      quiltTopWidth,
      quiltTopHeight,
      totalBorderWidth,
      finishedWidth,
      finishedHeight
    };

    if (targetWidth && targetHeight) {
      dimensions.differenceFromTarget = {
        width: finishedWidth - targetWidth,
        height: finishedHeight - targetHeight
      };
    }
    
    return dimensions;
  }

  /**
   * Format size for display
   */
  static formatSize(width: number, height: number): string {
    return `${width}" × ${height}"`;
  }

  /**
   * Format difference with sign
   */
  static formatDifference(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}"`;
  }

  /**
   * Parse quilt size string (e.g., "60×72") into dimensions
   */
  static parseQuiltSize(sizeStr: string): { width: number; height: number } | null {
    // Try formats like "60×72", "60x72", "60 × 72", "60 x 72"
    const match = sizeStr.match(/(\d+)\s*[×x]\s*(\d+)/);
    
    if (match) {
      return {
        width: parseInt(match[1]),
        height: parseInt(match[2])
      };
    }
    
    return null;
  }

  /**
   * Get standard quilt sizes
   */
  static getStandardSizes(): Record<string, { width: number; height: number }> {
    return {
      baby: { width: 36, height: 52 },
      lap: { width: 50, height: 65 },
      twin: { width: 66, height: 90 },
      full: { width: 80, height: 90 },
      queen: { width: 90, height: 95 },
      king: { width: 105, height: 95 },
      default: { width: 60, height: 72 }
    };
  }

  /**
   * Get target size from quilt size parameter
   */
  static getTargetSize(quiltSize?: string): { width: number; height: number } {
    if (!quiltSize) {
      return this.getStandardSizes().default;
    }

    const standardSizes = this.getStandardSizes();
    const normalizedSize = quiltSize.toLowerCase();

    if (normalizedSize in standardSizes) {
      return standardSizes[normalizedSize as keyof typeof standardSizes];
    }

    return standardSizes.default;
  }
}
