/**
 * Fabric Distribution Strategies
 * Open/Closed Principle: Strategy pattern for fabric distributions
 * New patterns can be added without modifying existing code
 */

/**
 * Strategy interface for fabric distributions
 */
export interface IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null;
}

/**
 * Nine-Patch pattern distribution
 * Typically uses more of the first fabric in corners and center
 */
export class NinePatchDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null {
    const distributions: Record<number, number[]> = {
      2: [0.55, 0.45],
      3: [0.40, 0.35, 0.25]
    };
    return distributions[fabricCount] || null;
  }
}

/**
 * Four-Patch pattern distribution
 * Equal distribution between fabrics
 */
export class FourPatchDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null {
    const distributions: Record<number, number[]> = {
      2: [0.50, 0.50],
      3: [0.35, 0.35, 0.30]
    };
    return distributions[fabricCount] || null;
  }
}

/**
 * Checkerboard pattern distribution
 * Always 50/50 for 2 fabrics
 */
export class CheckerboardDistribution implements IDistributionStrategy {
  getDistribution(fabricCount: number): number[] | null {
    // Checkerboard is always 50/50 for 2 fabrics
    return fabricCount === 2 ? [0.50, 0.50] : null;
  }
}

/**
 * Default distribution strategy
 * Used when no specific pattern distribution is defined
 */
export class DefaultDistribution implements IDistributionStrategy {
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
 * Fabric Distribution Manager
 * Single Responsibility: Manages pattern distribution strategies
 */
export class FabricDistributionManager {
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
