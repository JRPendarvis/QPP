import { RequirementsCalculator } from '../requirementsCalculator';
import { Fabric } from '../../../types/ClaudeResponse';
import { BorderConfiguration } from '../../../types/Border';

// Mock dependencies
jest.mock('../../../utils/fabric', () => ({
  FabricYardageCalculator: {
    calculateRequirements: jest.fn((quiltSize, fabricInfo, patternType) => {
      return fabricInfo.map((info: any, idx: number) => ({
        role: `Fabric ${idx + 1}`,
        yards: 2.5,
        description: info.description || `Fabric for ${patternType}`
      }));
    })
  }
}));

jest.mock('../../../utils/borderFabricCalculator', () => ({
  BorderFabricCalculator: {
    calculateBorderRequirements: jest.fn((borders, width, height, names) => {
      return names.map((name: string, idx: number) => ({
        fabricName: name,
        totalYards: 1.5 + idx * 0.5,
        cutInstructions: `Cut ${2 + idx} strips`
      }));
    })
  }
}));

describe('RequirementsCalculator', () => {
  describe('calculateAllRequirements', () => {
    it('should calculate pattern fabric requirements only', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' },
        { color: '#00FF00', type: 'printed', image: 'img2' }
      ];

      const result = RequirementsCalculator.calculateAllRequirements(
        'queen',
        'nine-patch',
        patternFabrics,
        [
          { description: 'Red fabric' },
          { description: 'Green fabric' }
        ],
        undefined,
        0,
        ['img1', 'img2'],
        '90×95 inches',
        () => 'Border'
      );

      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('Fabric 1');
      expect(result[0].yards).toBe(2.5);
    });

    it('should include border requirements when borders enabled', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' }
      ];

      const borderConfig: BorderConfiguration = {
        enabled: true,
        borders: [
          { id: 'b1', width: 2, fabricIndex: 0, order: 1 },
          { id: 'b2', width: 3, fabricIndex: 1, order: 2 }
        ]
      };

      const getBorderName = (idx: number) => idx === 0 ? 'Inner Border' : 'Outer Border';

      const result = RequirementsCalculator.calculateAllRequirements(
        'queen',
        'nine-patch',
        patternFabrics,
        [{ description: 'Red fabric' }],
        borderConfig,
        2,
        ['img1', 'border1', 'border2'],
        '90×95 inches',
        getBorderName
      );

      // Should have pattern fabric + 2 border fabrics
      expect(result.length).toBeGreaterThan(1);
      expect(result.some(r => r.role === 'Inner Border')).toBe(true);
      expect(result.some(r => r.role === 'Outer Border')).toBe(true);
    });

    it('should not add border requirements when borders disabled', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' }
      ];

      const borderConfig: BorderConfiguration = {
        enabled: false,
        borders: []
      };

      const result = RequirementsCalculator.calculateAllRequirements(
        'queen',
        'nine-patch',
        patternFabrics,
        [{ description: 'Red fabric' }],
        borderConfig,
        0,
        ['img1'],
        '90×95 inches',
        () => 'Border'
      );

      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('Fabric 1');
    });

    it('should handle undefined fabric analysis', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' }
      ];

      const result = RequirementsCalculator.calculateAllRequirements(
        'queen',
        'nine-patch',
        patternFabrics,
        undefined,
        undefined,
        0,
        ['img1'],
        '90×95 inches',
        () => 'Border'
      );

      expect(result).toHaveLength(1);
    });

    it('should use default quilt size when not specified', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' }
      ];

      const result = RequirementsCalculator.calculateAllRequirements(
        undefined,
        'nine-patch',
        patternFabrics,
        [],
        undefined,
        0,
        ['img1'],
        '60×72 inches',
        () => 'Border'
      );

      expect(result).toHaveLength(1);
    });

    it('should format border requirements correctly', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' }
      ];

      const borderConfig: BorderConfiguration = {
        enabled: true,
        borders: [{ id: 'b1', width: 2, fabricIndex: 0, order: 1 }]
      };

      const result = RequirementsCalculator.calculateAllRequirements(
        'queen',
        'nine-patch',
        patternFabrics,
        [],
        borderConfig,
        1,
        ['img1', 'border1'],
        '90×95 inches',
        () => 'Border'
      );

      const borderReq = result.find(r => r.role === 'Border');
      expect(borderReq).toBeDefined();
      expect(borderReq?.description).toContain('Border fabric -');
    });
  });
});
