/**
 * Fabric calculation utilities
 * Barrel export for clean imports
 */

export { FabricYardageCalculator } from './fabricYardageCalculator';
export { FabricRoleFormatter } from './fabricRoleFormatter';
export { 
  FabricDistributionManager,
  NinePatchDistribution,
  FourPatchDistribution,
  CheckerboardDistribution,
  DefaultDistribution,
  type IDistributionStrategy
} from './fabricDistributionStrategies';
export type { QuiltDimensions, FabricRequirement, FabricInfo } from './types';
