/**
 * Fabric Yardage Calculator
 * Calculates fabric requirements for quilt patterns based on size and fabric roles
 */

interface QuiltDimensions {
  width: number;  // inches
  height: number; // inches
}

interface FabricRequirement {
  role: string;
  yards: number;
  description: string;
  inches?: number; // For binding - total inches needed
}

export interface FabricInfo {
  color: string;
  type: 'printed' | 'solid';
  description?: string;
}

/**
 * Single Responsibility: Handles role formatting and descriptions only
 */
class FabricRoleFormatter {
  private static readonly KNOWN_ROLES = new Set(['background', 'primary', 'secondary', 'accent']);
  
  private static readonly ROLE_DESCRIPTIONS: Record<string, string> = {
    background: 'Main background fabric',
    primary: 'Primary pattern fabric',
    secondary: 'Secondary accent fabric',
    accent: 'Accent or highlight fabric'
  };

  static formatName(role: string, index: number): string {
    return this.KNOWN_ROLES.has(role)
      ? role.charAt(0).toUpperCase() + role.slice(1)
      : `Fabric ${index + 1}`;
  }

  static getDescription(role: string): string {
    return this.ROLE_DESCRIPTIONS[role] || 'Pattern fabric';
  }

  static formatColorName(color: string, type: 'printed' | 'solid', index: number): string {
    // Extract color name from hex or use as-is
    const colorName = this.getColorName(color);
    const typeLabel = type === 'printed' ? 'Print' : 'Solid';
    return `${colorName} ${typeLabel}`;
  }

  static getTypeDescription(type: 'printed' | 'solid'): string {
    return type === 'printed' ? 'Printed pattern fabric' : 'Solid color fabric';
  }

  private static getColorName(color: string): string {
    // If it's a color name, capitalize it
    if (!color.startsWith('#')) {
      return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    }
    // For hex colors, try to approximate the name
    return this.hexToColorName(color);
  }

  private static hexToColorName(hex: string): string {
    // Convert hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'Color';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    // Determine dominant color and approximate name
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Check for grays/whites/blacks
    if (max - min < 30) {
      if (max > 230) return 'White';
      if (max < 50) return 'Black';
      return 'Gray';
    }
    
    // Determine hue
    if (r > g && r > b) {
      if (g > 100) return 'Orange';
      if (b > 100) return 'Pink';
      return 'Red';
    }
    if (g > r && g > b) {
      if (r > 150) return 'Yellow';
      if (b > 100) return 'Teal';
      return 'Green';
    }
    if (b > r && b > g) {
      if (r > 100) return 'Purple';
      if (g > 100) return 'Cyan';
      return 'Blue';
    }
    
    return 'Color';
  }
}

/**
 * Open/Closed Principle: Strategy interface for fabric distributions
 * New patterns can be added without modifying existing code
 */
interface IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null;
}

class NinePatchDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null {
    const distributions: Record<number, number[]> = {
      2: [0.55, 0.45],
      3: [0.40, 0.35, 0.25]
    };
    return distributions[fabricCount] || null;
  }
}

class FourPatchDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null {
    const distributions: Record<number, number[]> = {
      2: [0.50, 0.50],
      3: [0.35, 0.35, 0.30]
    };
    return distributions[fabricCount] || null;
  }
}

class CheckerboardDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null {
    // Checkerboard is always 50/50 for 2 fabrics
    return fabricCount === 2 ? [0.50, 0.50] : null;
  }
}

class DefaultDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] {
    const distributions: Record<number, number[]> = {
      2: [0.60, 0.40],
      3: [0.45, 0.35, 0.20],
      4: [0.40, 0.30, 0.20, 0.10]
    };

    if (distributions[fabricCount]) {
      return distributions[fabricCount];
    }

    const equal = 1 / fabricCount;
    return Array(fabricCount).fill(equal);
  }
}

/**
 * Single Responsibility: Manages pattern distribution strategies
 */
class FabricDistributionManager {
  private static readonly strategies: Record<string, IDistributionStrategy> = {
    'nine-patch': new NinePatchDistribution(),
    'four-patch': new FourPatchDistribution(),
    'checkerboard': new CheckerboardDistribution()
  };

  private static readonly defaultStrategy = new DefaultDistribution();

  static getDistribution(fabricCount: number, patternId?: string): number[] {
    if (patternId && this.strategies[patternId]) {
      const distribution = this.strategies[patternId].getDistribution(fabricCount);
      if (distribution) return distribution;
    }
    return this.defaultStrategy.getDistribution(fabricCount);
  }
}

/**
 * Single Responsibility: Calculates fabric yardage requirements
 * Depends on FabricRoleFormatter and FabricDistributionManager (Dependency Inversion)
 */
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
