import { BorderFabricCalculator } from '../borderFabricCalculator';
import { Border } from '../../types/Border';

describe('BorderFabricCalculator', () => {
  describe('calculateBorderRequirements', () => {
    it('should calculate fabric requirements for a single 2.5" border on a 60x72 quilt', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 }
      ];
      const quiltTopWidth = 60;
      const quiltTopHeight = 72;
      const fabricNames = ['Inner Border'];

      const result = BorderFabricCalculator.calculateBorderRequirements(
        borders,
        quiltTopWidth,
        quiltTopHeight,
        fabricNames
      );

      expect(result).toHaveLength(1);
      expect(result[0].borderNumber).toBe(1);
      expect(result[0].width).toBe(2.5);
      expect(result[0].fabricName).toBe('Inner Border');
      expect(result[0].strips).toBeGreaterThan(0);
      expect(result[0].totalYards).toBeGreaterThan(0);
    });

    it('should calculate fabric requirements for multiple borders', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 }
      ];
      const quiltTopWidth = 60;
      const quiltTopHeight = 72;
      const fabricNames = ['Inner Border', 'Outer Border'];

      const result = BorderFabricCalculator.calculateBorderRequirements(
        borders,
        quiltTopWidth,
        quiltTopHeight,
        fabricNames
      );

      expect(result).toHaveLength(2);
      expect(result[0].fabricName).toBe('Inner Border');
      expect(result[1].fabricName).toBe('Outer Border');
      
      // Outer border should require more fabric (larger perimeter)
      expect(result[1].totalYards).toBeGreaterThan(result[0].totalYards);
    });

    it('should include cut instructions for each border', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 }
      ];
      const result = BorderFabricCalculator.calculateBorderRequirements(
        borders,
        60,
        72,
        ['Test Border']
      );

      expect(result[0].cutInstructions).toContain('Cut');
      expect(result[0].cutInstructions).toContain('strips');
      expect(result[0].cutInstructions).toContain('2.5"');
      expect(result[0].cutInstructions).toContain('WOF');
    });

    it('should handle borders sorted by order', () => {
      const borders: Border[] = [
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 },
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 }
      ];
      
      const result = BorderFabricCalculator.calculateBorderRequirements(
        borders,
        60,
        72,
        ['Border 1', 'Border 2']
      );

      // Should process in order 1, 2 (not 2, 1)
      expect(result[0].borderNumber).toBe(1);
      expect(result[1].borderNumber).toBe(2);
    });
  });

  describe('calculateTotalBorderWidth', () => {
    it('should sum all border widths', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 3.0, fabricIndex: 1 },
        { id: '3', order: 3, width: 1.5, fabricIndex: 2 }
      ];

      const total = BorderFabricCalculator.calculateTotalBorderWidth(borders);
      expect(total).toBe(7.0);
    });

    it('should return 0 for empty borders array', () => {
      const total = BorderFabricCalculator.calculateTotalBorderWidth([]);
      expect(total).toBe(0);
    });
  });

  describe('calculateFinishedDimensions', () => {
    it('should add total border width to both dimensions', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 2.5, fabricIndex: 0 },
        { id: '2', order: 2, width: 2.5, fabricIndex: 1 }
      ];
      const quiltTopWidth = 60;
      const quiltTopHeight = 72;

      const result = BorderFabricCalculator.calculateFinishedDimensions(
        borders,
        quiltTopWidth,
        quiltTopHeight
      );

      // Each border adds 2x its width (one on each side)
      // Total border width = 5"
      // Each dimension should increase by 10" (5" on each side)
      expect(result.width).toBe(70); // 60 + 10
      expect(result.height).toBe(82); // 72 + 10
    });

    it('should handle single border correctly', () => {
      const borders: Border[] = [
        { id: '1', order: 1, width: 3.0, fabricIndex: 0 }
      ];

      const result = BorderFabricCalculator.calculateFinishedDimensions(
        borders,
        60,
        72
      );

      expect(result.width).toBe(66); // 60 + 6
      expect(result.height).toBe(78); // 72 + 6
    });
  });
});
