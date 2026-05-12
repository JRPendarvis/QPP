import { FabricDistributionManager } from '../fabric/fabricDistributionStrategies';

describe('FabricDistributionManager', () => {
  it('uses equal distribution for 4 fabrics in default strategy', () => {
    const distribution = FabricDistributionManager.getDistribution(4);

    expect(distribution).toEqual([0.25, 0.25, 0.25, 0.25]);
  });

  it('still keeps known pattern-specific distributions', () => {
    const ninePatch = FabricDistributionManager.getDistribution(2, 'nine-patch');
    expect(ninePatch).toEqual([0.55, 0.45]);
  });
});
