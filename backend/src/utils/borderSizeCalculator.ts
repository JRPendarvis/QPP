/**
 * Border Size Calculator
 * Utilities for calculating quilt dimensions with borders
 */

import { Border, BorderDimensions } from '../../types/Border';

export class BorderSizeCalculator {
  /**
   * Calculate comprehensive border dimensions
   */
  static calculateBorderDimensions(
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
    
    return dimensions;
  }
  
  /**
   * Calculate difference from target size
   */
  static calculateDifferenceFromTarget(
    finishedWidth: number,
    finishedHeight: number,
    targetWidth: number,
    targetHeight: number
  ): { width: number; height: number } {
    return {
      width: finishedWidth - targetWidth,
      height: finishedHeight - targetHeight
    };
  }
  
  /**
   * Format size for display (e.g., "60\" × 72\"")
   */
  static formatSize(width: number, height: number): string {
    return `${width}" × ${height}"`;
  }
  
  /**
   * Get dimensions at each border level
   * Returns array of {width, height} for each border stage
   */
  static getDimensionsAtEachBorderLevel(
    borders: Border[],
    quiltTopWidth: number,
    quiltTopHeight: number
  ): Array<{ width: number; height: number; borderNumber: number }> {
    const sortedBorders = [...borders].sort((a, b) => a.order - b.order);
    const dimensions = [];
    
    let currentWidth = quiltTopWidth;
    let currentHeight = quiltTopHeight;
    
    for (const border of sortedBorders) {
      currentWidth += 2 * border.width;
      currentHeight += 2 * border.width;
      
      dimensions.push({
        width: currentWidth,
        height: currentHeight,
        borderNumber: border.order
      });
    }
    
    return dimensions;
  }
}
