import { FabricFromColorsBuilder } from '../fabricFromColorsBuilder';

describe('FabricFromColorsBuilder', () => {
  describe('build', () => {
    it('should build fabrics from colors with images', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

      const result = FabricFromColorsBuilder.build(colors, images);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        color: '#FF0000',
        type: 'solid',
        image: 'img1.jpg'
      });
      expect(result[1]).toEqual({
        color: '#00FF00',
        type: 'solid',
        image: 'img2.jpg'
      });
      expect(result[2]).toEqual({
        color: '#0000FF',
        type: 'solid',
        image: 'img3.jpg'
      });
    });

    it('should handle missing images', () => {
      const colors = ['#FF0000', '#00FF00'];
      const images = ['img1.jpg'];

      const result = FabricFromColorsBuilder.build(colors, images);

      expect(result).toHaveLength(2);
      expect(result[0].image).toBe('img1.jpg');
      expect(result[1].image).toBe('');
    });

    it('should always use "solid" type', () => {
      const colors = ['#FF0000'];
      const images: string[] = [];

      const result = FabricFromColorsBuilder.build(colors, images);

      expect(result[0].type).toBe('solid');
    });

    it('should handle empty colors array', () => {
      const result = FabricFromColorsBuilder.build([], []);
      expect(result).toEqual([]);
    });
  });
});
