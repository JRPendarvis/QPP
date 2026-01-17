/**
 * Fabric Yardage Calculator
 * Single Responsibility: Calculates fabric requirements for quilt patterns
 * Depends on FabricRoleFormatter and FabricDistributionManager (Dependency Inversion)
 */

import { FabricRoleFormatter } from './fabricRoleFormatter';
import { FabricDistributionManager } from './fabricDistributionStrategies';
import type { QuiltDimensions, FabricRequirement, FabricInfo } from './types';

export class FabricYardageCalculator {
  private static readonly FABRIC_WIDTH = 42;
  private static readonly QUILT_SIZES: Record<string, QuiltDimensions> = {
    baby: { width: 36, height: 52 },
    lap: { width: 50, height: 65 },
    twin: { width: 66, height: 90 },
    full: { width: 80, height: 90 },
    queen: { width: 90, height: 95 },
    king: { width: 105, height: 95 },
    default: { width: 60, height: 72 }
  };

  /**
   * Calculate fabric requirements for a quilt pattern
   * @param quiltSize - Size identifier (baby, lap, twin, etc.)
   * @param fabricInfo - Array of fabric information (color, type, description)
   * @param patternId - Pattern type identifier
   * @returns Array of fabric requirements with yardage
   */
  static calculateRequirements(
    quiltSize: string = 'default',
    fabricInfo: FabricInfo[],
    patternId?: string
  ): FabricRequirement[] {
    const dimensions = this.QUILT_SIZES[quiltSize] || this.QUILT_SIZES.default;
    
    const fabricRequirements = this.calculateFabricYardage(dimensions, fabricInfo, patternId);
    const supportRequirements = this.calculateSupportMaterials(dimensions);
    
    return [...fabricRequirements, ...supportRequirements];
  }

  /**
   * Calculate yardage for each fabric role
   */
  private static calculateFabricYardage(
    dimensions: QuiltDimensions,
    fabricInfo: FabricInfo[],
    patternId?: string
  ): FabricRequirement[] {
    const totalSquareInches = dimensions.width * dimensions.height;
    const fabricDistribution = FabricDistributionManager.getDistribution(fabricInfo.length, patternId);
    
    return fabricInfo.map((fabric, index) => {
      const percentage = fabricDistribution[index] || 0.25;
      const yards = this.calculateYardageFromSquareInches(totalSquareInches * percentage);
      
      return {
        role: FabricRoleFormatter.formatColorName(fabric.color, fabric.type, index),
        yards: Math.max(yards, 0.5),
        description: fabric.description || FabricRoleFormatter.getTypeDescription(fabric.type)
      };
    });
  }

  /**
   * Calculate support materials (backing, batting, binding)
   */
  private static calculateSupportMaterials(dimensions: QuiltDimensions): FabricRequirement[] {
    const backingYards = this.calculateBacking(dimensions);
    const binding = this.calculateBinding(dimensions);
    
    return [
      {
        role: 'Backing',
        yards: backingYards,
        description: 'For quilt back (includes overhang for quilting)'
      },
      {
        role: 'Batting',
        yards: backingYards, // Same as backing
        description: 'Cotton or cotton-blend batting'
      },
      {
        role: 'Binding',
        yards: binding.yards,
        inches: binding.inches,
        description: `${binding.inches}" total binding needed (cut in 2.5" strips)`
      }
    ];
  }

  /**
   * Convert square inches to yards with seam allowances
   */
  private static calculateYardageFromSquareInches(squareInches: number): number {
    // Add 15% for seam allowances and waste, convert to yards
    const yardsRaw = (squareInches * 1.15) / (this.FABRIC_WIDTH * 36);
    // Round to nearest 1/4 yard
    return Math.ceil(yardsRaw * 4) / 4;
  }

  /**
   * Calculate backing yardage
   */
  private static calculateBacking(dimensions: QuiltDimensions): number {
    const backingWidth = dimensions.width + 8;  // Add 4" on each side
    const backingHeight = dimensions.height + 8;
    
    // If width fits in single fabric width, use vertical seam
    if (backingWidth <= this.FABRIC_WIDTH) {
      const yards = Math.ceil((backingHeight / 36) * 4) / 4;
      return Math.max(yards, 1.75); // Minimum 1.75 yards
    }
    
    // Otherwise, need to piece horizontally (multiply by 2)
    const yards = Math.ceil((backingWidth / 36) * 2 * 4) / 4;
    return Math.max(yards, 3.5); // Minimum 3.5 yards for pieced backing
  }

  /**
   * Calculate binding yardage
   * Binding is cut in 2.5" strips from fabric width, then sewn together
   */
  private static calculateBinding(dimensions: QuiltDimensions): { yards: number; inches: number } {
    const perimeter = (dimensions.width + dimensions.height) * 2;
    const bindingInches = perimeter + 12; // Add 12" for corners and joining
    
    // Calculate how many 2.5" strips needed from 42" wide fabric
    const stripsNeeded = Math.ceil(bindingInches / this.FABRIC_WIDTH);
    const fabricInches = stripsNeeded * 2.5; // Each strip is 2.5" wide
    const yards = Math.ceil((fabricInches / 36) * 4) / 4; // Round to nearest 1/4 yard
    
    return { 
      yards: Math.max(yards, 0.5), // Minimum 1/2 yard
      inches: bindingInches
    };
  }
}
