import { FabricFromAnalysisBuilder } from '../fabricFromAnalysisBuilder';

describe('FabricFromAnalysisBuilder', () => {
  describe('build', () => {
    it('should build fabrics with all data from analysis', () => {
      const analysis = [
        { dominantColor: '#FF0000', type: 'printed' },
        { dominantColor: '#00FF00', fabricType: 'solid' }
      ];
      const colors: string[] = [];
      const images = ['img1.jpg', 'img2.jpg'];

      const result = FabricFromAnalysisBuilder.build(analysis, colors, images);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        color: '#FF0000',
        type: 'printed',
        image: 'img1.jpg'
      });
      expect(result[1]).toEqual({
        color: '#00FF00',
        type: 'solid',
        image: 'img2.jpg'
      });
    });

    it('should fallback to fabricColors when dominantColor missing', () => {
      const analysis = [{ type: 'printed' }];
      const colors = ['#AABBCC'];
      const images = ['img1.jpg'];

      const result = FabricFromAnalysisBuilder.build(analysis, colors, images);

      expect(result[0].color).toBe('#AABBCC');
    });

    it('should use default color when both dominantColor and fabricColors missing', () => {
      const analysis = [{ type: 'solid' }];
      const colors: string[] = [];
      const images = ['img1.jpg'];

      const result = FabricFromAnalysisBuilder.build(analysis, colors, images);

      expect(result[0].color).toBe('#CCCCCC');
    });

    it('should handle missing images', () => {
      const analysis = [{ dominantColor: '#FF0000', type: 'printed' }];
      const colors: string[] = [];
      const images: string[] = [];

      const result = FabricFromAnalysisBuilder.build(analysis, colors, images);

      expect(result[0].image).toBe('');
    });

    it('should normalize fabric types using FabricTypeNormalizer', () => {
      const analysis = [
        { type: 'PRINTED' },
        { fabricType: 'unknown' }
      ];
      const colors: string[] = [];
      const images: string[] = [];

      const result = FabricFromAnalysisBuilder.build(analysis, colors, images);

      expect(result[0].type).toBe('printed');
      expect(result[1].type).toBe('solid');
    });
  });
});
