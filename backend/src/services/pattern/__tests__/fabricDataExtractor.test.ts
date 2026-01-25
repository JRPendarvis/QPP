import { FabricDataExtractor } from '../fabricDataExtractor';
import { ClaudeResponse } from '../../../types/ClaudeResponse';

describe('FabricDataExtractor', () => {
  describe('extract', () => {
    it('should extract fabricAnalysis and fabricColors', () => {
      const response: ClaudeResponse = {
        patternName: 'Test',
        description: 'Test',
        estimatedSize: '60x72',
        instructions: [],
        fabricLayout: 'Test',
        fabricAnalysis: [
          { fabricIndex: 0, dominantColor: '#FF0000', type: 'printed', description: 'Red', value: 'medium', printScale: 'medium' }
        ],
        fabricColors: ['#FF0000', '#00FF00']
      };

      const result = FabricDataExtractor.extract(response);

      expect(result.fabricAnalysis).toEqual(response.fabricAnalysis);
      expect(result.fabricColors).toEqual(response.fabricColors);
    });

    it('should return empty arrays when data is undefined', () => {
      const response: ClaudeResponse = {
        patternName: 'Test',
        description: 'Test',
        estimatedSize: '60x72',
        instructions: [],
        fabricLayout: 'Test'
      };

      const result = FabricDataExtractor.extract(response);

      expect(result.fabricAnalysis).toEqual([]);
      expect(result.fabricColors).toEqual([]);
    });

    it('should handle null fabricAnalysis', () => {
      const response: ClaudeResponse = {
        patternName: 'Test',
        description: 'Test',
        estimatedSize: '60x72',
        instructions: [],
        fabricLayout: 'Test',
        fabricAnalysis: null as any,
        fabricColors: null as any
      };

      const result = FabricDataExtractor.extract(response);

      expect(result.fabricAnalysis).toEqual([]);
      expect(result.fabricColors).toEqual([]);
    });
  });
});
