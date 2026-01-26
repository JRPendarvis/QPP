import { FabricSelector } from '../fabricSelector';
import { Fabric } from '../../../types/Fabric';

describe('FabricSelector', () => {
  const mockFabrics: Fabric[] = [
    { color: '#FF0000', type: 'solid' },
    { color: '#00FF00', type: 'solid' },
    { color: '#0000FF', type: 'solid' },
    { color: '#FFFF00', type: 'solid' },
  ];

  describe('selectForBlock', () => {
    it('should use pattern-specific getColors when available', () => {
      const mockPatternDef = {
        getColors: jest.fn().mockReturnValue(['#FF0000', '#00FF00', '#0000FF']),
      };

      const result = FabricSelector.selectForBlock(
        mockFabrics,
        mockPatternDef as any,
        0,
        0,
        0
      );

      expect(mockPatternDef.getColors).toHaveBeenCalledWith(
        ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
        { blockIndex: 0, row: 0, col: 0 }
      );
      expect(result).toEqual([
        mockFabrics[0],
        mockFabrics[1],
        mockFabrics[2],
      ]);
    });

    it('should handle getColors returning colors not in fabrics array', () => {
      const mockPatternDef = {
        getColors: jest.fn().mockReturnValue(['#UNKNOWN', '#FF0000']),
      };

      const result = FabricSelector.selectForBlock(
        mockFabrics,
        mockPatternDef as any,
        0,
        0,
        0
      );

      // Unknown color should fallback to first fabric
      expect(result).toEqual([
        mockFabrics[0], // fallback for #UNKNOWN
        mockFabrics[0], // #FF0000
      ]);
    });

    it('should use default selection when no pattern definition', () => {
      const result = FabricSelector.selectForBlock(
        mockFabrics,
        undefined,
        0,
        0,
        0
      );

      expect(result.length).toBe(8);
      expect(result[0]).toEqual(mockFabrics[0]);
      expect(result[1]).toEqual(mockFabrics[1]);
      expect(result[2]).toEqual(mockFabrics[2]);
      expect(result[3]).toEqual(mockFabrics[3]);
    });

    it('should use default selection when pattern has no getColors', () => {
      const mockPatternDef = {
        someOtherProperty: 'value',
      };

      const result = FabricSelector.selectForBlock(
        mockFabrics,
        mockPatternDef as any,
        0,
        0,
        0
      );

      expect(result.length).toBe(8);
    });

    it('should repeat fabrics cyclically when fewer than 8', () => {
      const twoFabrics = mockFabrics.slice(0, 2);

      const result = FabricSelector.selectForBlock(
        twoFabrics,
        undefined,
        0,
        0,
        0
      );

      expect(result.length).toBe(8);
      expect(result[0]).toEqual(twoFabrics[0]);
      expect(result[1]).toEqual(twoFabrics[1]);
      expect(result[2]).toEqual(twoFabrics[0]); // cyclic repeat
      expect(result[3]).toEqual(twoFabrics[1]);
    });

    it('should handle single fabric', () => {
      const oneFabric = mockFabrics.slice(0, 1);

      const result = FabricSelector.selectForBlock(
        oneFabric,
        undefined,
        0,
        0,
        0
      );

      expect(result.length).toBe(8);
      expect(result.every(f => f.color === '#FF0000')).toBe(true);
    });

    it('should pass correct block coordinates to getColors', () => {
      const mockPatternDef = {
        getColors: jest.fn().mockReturnValue(['#FF0000']),
      };

      FabricSelector.selectForBlock(
        mockFabrics,
        mockPatternDef as any,
        7,
        2,
        1
      );

      expect(mockPatternDef.getColors).toHaveBeenCalledWith(
        expect.any(Array),
        { blockIndex: 7, row: 2, col: 1 }
      );
    });

    it('should handle empty fabrics array gracefully', () => {
      const emptyFabrics: Fabric[] = [];

      const result = FabricSelector.selectForBlock(
        emptyFabrics,
        undefined,
        0,
        0,
        0
      );

      // Should still create 8-length array but all undefined
      expect(result.length).toBe(8);
    });
  });
});
