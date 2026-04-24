// src/services/pattern/yardageFeasibilityService.ts

import { FabricDistributionManager } from '../../utils/fabric/fabricDistributionStrategies';
import { QuiltSizeCatalog } from './quiltSizeCatalog';

export interface FeasibilityResult {
  /** Size key to pass as quiltSize downstream (e.g. 'lap', 'baby', '24×36') */
  feasibleSize: string;
  wasReduced: boolean;
  /** The user's original requested size, only set when wasReduced is true */
  originalSize?: string;
  /** Human-readable explanation of why and how much the size was reduced */
  reason?: string;
}

const FABRIC_WIDTH_IN = 42;
const SEAM_ALLOWANCE = 1.15;

/**
 * Quilt size presets ordered smallest → largest.
 * The key must be resolvable by QuiltSizeCatalog (named presets or WxH strings).
 */
const SIZE_PRESETS: ReadonlyArray<{ key: string; widthIn: number; heightIn: number; label: string }> = [
  { key: '24×36',   widthIn: 24,  heightIn: 36,  label: 'wall hanging (24×36 inches)'  },
  { key: 'baby',    widthIn: 36,  heightIn: 52,  label: 'baby quilt (36×52 inches)'    },
  { key: 'lap',     widthIn: 50,  heightIn: 65,  label: 'lap quilt (50×65 inches)'     },
  { key: 'default', widthIn: 60,  heightIn: 72,  label: 'throw quilt (60×72 inches)'  },
  { key: 'twin',    widthIn: 66,  heightIn: 90,  label: 'twin quilt (66×90 inches)'    },
  { key: 'full',    widthIn: 80,  heightIn: 90,  label: 'full quilt (80×90 inches)'    },
  { key: 'queen',   widthIn: 90,  heightIn: 95,  label: 'queen quilt (90×95 inches)'   },
  { key: 'king',    widthIn: 105, heightIn: 95,  label: 'king quilt (105×95 inches)'   },
];

/**
 * Determines the largest standard quilt size that can be produced from the
 * available fabric yardage.
 *
 * **Strategy:** For each constrained fabric, assume it gets the *smallest*
 * distribution share available for the pattern (best-case role assignment).
 * This avoids over-shrinking while still catching real shortfalls.
 * The minimum max-area across all constrained fabrics determines the
 * feasible quilt area.
 */
export class YardageFeasibilityService {
  static checkFeasibility(
    requestedSize: string | undefined,
    patternId: string | undefined,
    fabricCount: number,
    availableYardageByFabric: Array<number | null> | undefined
  ): FeasibilityResult {
    const noConstraints =
      !availableYardageByFabric ||
      availableYardageByFabric.every(y => y === null || y === undefined);

    if (noConstraints || fabricCount === 0) {
      return { feasibleSize: requestedSize || 'default', wasReduced: false };
    }

    const distribution = FabricDistributionManager.getDistribution(fabricCount, patternId);
    // Use the smallest share (best-case assignment for any single constrained fabric)
    const minShare = Math.min(...distribution);

    let maxFeasibleSqIn = Infinity;
    let limitingIndex = -1;
    let limitingYards = 0;

    for (let i = 0; i < Math.min(fabricCount, availableYardageByFabric.length); i++) {
      const available = availableYardageByFabric[i];
      if (available === null || available === undefined || available <= 0) continue;

      // Total square inches this fabric can provide
      const fabricSqIn = available * FABRIC_WIDTH_IN * 36;
      // Maximum total quilt area where this fabric covers its minimum share
      const maxArea = fabricSqIn / (minShare * SEAM_ALLOWANCE);

      if (maxArea < maxFeasibleSqIn) {
        maxFeasibleSqIn = maxArea;
        limitingIndex = i;
        limitingYards = available;
      }
    }

    if (maxFeasibleSqIn === Infinity) {
      return { feasibleSize: requestedSize || 'default', wasReduced: false };
    }

    // Find the largest preset whose area fits within the feasible area
    let bestPreset = SIZE_PRESETS[0];
    for (const preset of SIZE_PRESETS) {
      if (preset.widthIn * preset.heightIn <= maxFeasibleSqIn) {
        bestPreset = preset;
      }
    }

    // Compare against the requested size
    const requestedDims = QuiltSizeCatalog.resolveDimensions(requestedSize);
    const requestedArea = requestedDims.widthIn * requestedDims.heightIn;
    const feasibleArea = bestPreset.widthIn * bestPreset.heightIn;

    // Small epsilon (1%) avoids floating-point false positives
    if (feasibleArea >= requestedArea * 0.99) {
      return { feasibleSize: requestedSize || 'default', wasReduced: false };
    }

    console.log(
      `[YardageFeasibility] Reducing quilt size: ${requestedSize || 'default'} → ${bestPreset.key} ` +
      `(Fabric ${limitingIndex + 1}: ${limitingYards} yds limits area to ${Math.round(maxFeasibleSqIn)} sq in)`
    );

    return {
      feasibleSize: bestPreset.key,
      wasReduced: true,
      originalSize: requestedSize || 'default',
      reason:
        `Fabric ${limitingIndex + 1} has only ${limitingYards} yard${limitingYards === 1 ? '' : 's'} available. ` +
        `The largest quilt size that can be made with this amount of fabric is a ${bestPreset.label}.`,
    };
  }
}
