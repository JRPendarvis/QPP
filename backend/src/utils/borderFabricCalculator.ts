/**
 * Border Fabric Calculator
 * Calculates fabric requirements for quilt borders
 */

import { Border, BorderFabricRequirement } from '../types/Border';

export class BorderFabricCalculator {
  /**
   * Calculate fabric requirements for borders
   * Each border adds 2 × width to both dimensions at its level
   */
  static calculateBorderRequirements(
    borders: Border[],
    quiltTopWidth: number,
    quiltTopHeight: number,
    fabricNames: string[]
  ): BorderFabricRequirement[] {
    const requirements: BorderFabricRequirement[] = [];
    
    // Sort borders by order
    const sortedBorders = [...borders].sort((a, b) => a.order - b.order);
    
    let currentWidth = quiltTopWidth;
    let currentHeight = quiltTopHeight;
    
    for (const border of sortedBorders) {
      // Calculate perimeter at this border level
      const perimeter = 2 * (currentWidth + currentHeight);
      
      // Calculate strips needed (assuming 42" usable width of fabric)
      const usableWidth = 42;
      const stripWidth = border.width;
      const totalLength = perimeter;
      const strips = Math.ceil(totalLength / usableWidth);
      
      // Calculate yardage
      const totalInches = strips * stripWidth;
      const totalYards = Number((totalInches / 36).toFixed(2));
      
      // Get fabric name
      const fabricName = fabricNames[border.fabricIndex] || `Fabric ${border.fabricIndex + 1}`;
      
      // Create cut instructions
      const cutInstructions = `Cut ${strips} strips at ${stripWidth}" × WOF (width of fabric)`;
      
      requirements.push({
        borderNumber: border.order,
        width: border.width,
        fabricName,
        strips,
        totalYards,
        cutInstructions
      });
      
      // Update dimensions for next border
      currentWidth += 2 * border.width;
      currentHeight += 2 * border.width;
    }
    
    return requirements;
  }
  
  /**
   * Calculate total border width (sum of all border widths)
   */
  static calculateTotalBorderWidth(borders: Border[]): number {
    return borders.reduce((total, border) => total + border.width, 0);
  }
  
  /**
   * Calculate finished dimensions after borders
   */
  static calculateFinishedDimensions(
    borders: Border[],
    quiltTopWidth: number,
    quiltTopHeight: number
  ): { width: number; height: number } {
    const totalBorderWidth = this.calculateTotalBorderWidth(borders);
    
    return {
      width: quiltTopWidth + (2 * totalBorderWidth),
      height: quiltTopHeight + (2 * totalBorderWidth)
    };
  }
  
  /**
   * Validate border width constraints
   */
  static validateBorderWidth(width: number): { valid: boolean; error?: string } {
    const MIN_WIDTH = 0.5;
    const MAX_WIDTH = 12;
    const STEP = 0.5;
    
    if (width < MIN_WIDTH) {
      return { valid: false, error: `Border width must be at least ${MIN_WIDTH}"` };
    }
    
    if (width > MAX_WIDTH) {
      return { valid: false, error: `Border width cannot exceed ${MAX_WIDTH}"` };
    }
    
    // Check if width is a valid increment
    const remainder = width % STEP;
    if (Math.abs(remainder) > 0.01 && Math.abs(remainder - STEP) > 0.01) {
      return { valid: false, error: `Border width must be in ${STEP}" increments` };
    }
    
    return { valid: true };
  }
}
