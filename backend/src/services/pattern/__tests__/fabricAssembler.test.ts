import { FabricAssembler } from '../fabricAssembler';
import { ClaudeResponse, Fabric } from '../../../types/ClaudeResponse';
import { BorderConfiguration } from '../../../types/Border';

describe('FabricAssembler', () => {
  describe('buildPatternFabrics', () => {
    it('should build fabrics from analysis with images', () => {
      const parsedResponse: ClaudeResponse = {
        patternName: 'Test Pattern',
        description: 'Test',
        estimatedSize: '60x72 inches',
        instructions: [],
        fabricLayout: 'Test layout',
        fabricAnalysis: [
          { fabricIndex: 0, dominantColor: '#FF0000', type: 'printed', description: 'Red fabric', value: 'medium', printScale: 'medium' },
          { fabricIndex: 1, dominantColor: '#00FF00', type: 'solid', description: 'Green fabric', value: 'light', printScale: 'solid' }
        ],
        fabricColors: []
      };

      const fabricImages = ['image1', 'image2'];
      const result = FabricAssembler.buildPatternFabrics(parsedResponse, fabricImages);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        color: '#FF0000',
        type: 'printed',
        image: 'image1'
      });
      expect(result[1]).toEqual({
        color: '#00FF00',
        type: 'solid',
        image: 'image2'
      });
    });

    it('should handle uppercase fabric types', () => {
      const parsedResponse: ClaudeResponse = {
        patternName: 'Test',
        description: 'Test',
        estimatedSize: '60x72 inches',
        instructions: [],
        fabricLayout: 'Test',
        fabricAnalysis: [
          { fabricIndex: 0, dominantColor: '#FF0000', type: 'printed', description: 'Test', value: 'medium', printScale: 'medium' }
        ],
        fabricColors: []
      };

      const result = FabricAssembler.buildPatternFabrics(parsedResponse, ['img1']);

      expect(result[0].type).toBe('printed');
    });

    it('should fallback to fabricColors when no analysis', () => {
      const parsedResponse: ClaudeResponse = {
        patternName: 'Test',
        description: 'Test',
        estimatedSize: '60x72 inches',
        instructions: [],
        fabricLayout: 'Test',
        fabricAnalysis: [],
        fabricColors: ['#FF0000', '#00FF00']
      };

      const result = FabricAssembler.buildPatternFabrics(parsedResponse, ['img1', 'img2']);

      expect(result).toHaveLength(2);
      expect(result[0].color).toBe('#FF0000');
      expect(result[0].type).toBe('solid');
    });

    it('should return empty array when no fabrics', () => {
      const parsedResponse: ClaudeResponse = {
        patternName: 'Test',
        description: 'Test',
        estimatedSize: '60x72 inches',
        instructions: [],
        fabricLayout: 'Test',
        fabricAnalysis: [],
        fabricColors: []
      };

      const result = FabricAssembler.buildPatternFabrics(parsedResponse, []);
      expect(result).toEqual([]);
    });
  });

  describe('allocateFabrics', () => {
    it('should allocate all fabrics to pattern when no borders', () => {
      const allFabrics = ['img1', 'img2', 'img3'];
      const result = FabricAssembler.allocateFabrics(allFabrics);

      expect(result.patternImages).toEqual(['img1', 'img2', 'img3']);
      expect(result.borderImages).toEqual([]);
    });

    it('should split fabrics when borders enabled', () => {
      const allFabrics = ['img1', 'img2', 'img3', 'img4'];
      const borderConfig: BorderConfiguration = {
        enabled: true,
        borders: [
          { id: 'b1', width: 2, fabricIndex: 0, order: 1 },
          { id: 'b2', width: 3, fabricIndex: 1, order: 2 }
        ]
      };

      const result = FabricAssembler.allocateFabrics(allFabrics, borderConfig);

      expect(result.patternImages).toEqual(['img1', 'img2']);
      expect(result.borderImages).toEqual(['img3', 'img4']);
    });

    it('should handle single border fabric', () => {
      const allFabrics = ['img1', 'img2', 'img3'];
      const borderConfig: BorderConfiguration = {
        enabled: true,
        borders: [{ id: 'b1', width: 2, fabricIndex: 0, order: 1 }]
      };

      const result = FabricAssembler.allocateFabrics(allFabrics, borderConfig);

      expect(result.patternImages).toEqual(['img1', 'img2']);
      expect(result.borderImages).toEqual(['img3']);
    });
  });

  describe('buildBorderFabrics', () => {
    it('should build border fabrics with default color', () => {
      const borderImages = ['border1', 'border2'];
      const result = FabricAssembler.buildBorderFabrics(borderImages);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        color: '#CCCCCC',
        type: 'printed',
        image: 'border1'
      });
      expect(result[1]).toEqual({
        color: '#CCCCCC',
        type: 'printed',
        image: 'border2'
      });
    });

    it('should handle empty array', () => {
      const result = FabricAssembler.buildBorderFabrics([]);
      expect(result).toEqual([]);
    });
  });

  describe('combineAllFabrics', () => {
    it('should combine pattern and border fabrics', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' },
        { color: '#00FF00', type: 'printed', image: 'img2' }
      ];
      const borderFabrics: Fabric[] = [
        { color: '#CCCCCC', type: 'printed', image: 'border1' }
      ];

      const result = FabricAssembler.combineAllFabrics(patternFabrics, borderFabrics);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(patternFabrics[0]);
      expect(result[1]).toEqual(patternFabrics[1]);
      expect(result[2]).toEqual(borderFabrics[0]);
    });

    it('should handle empty border fabrics', () => {
      const patternFabrics: Fabric[] = [
        { color: '#FF0000', type: 'solid', image: 'img1' }
      ];

      const result = FabricAssembler.combineAllFabrics(patternFabrics, []);
      expect(result).toEqual(patternFabrics);
    });
  });
});
