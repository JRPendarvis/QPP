import { FabricTypeNormalizer } from '../fabricTypeNormalizer';

describe('FabricTypeNormalizer', () => {
  describe('normalize', () => {
    it('should return "printed" for "printed" input', () => {
      expect(FabricTypeNormalizer.normalize('printed')).toBe('printed');
    });

    it('should return "printed" for uppercase "PRINTED"', () => {
      expect(FabricTypeNormalizer.normalize('PRINTED')).toBe('printed');
    });

    it('should return "solid" for "solid" input', () => {
      expect(FabricTypeNormalizer.normalize('solid')).toBe('solid');
    });

    it('should return "solid" for any non-printed value', () => {
      expect(FabricTypeNormalizer.normalize('textured')).toBe('solid');
      expect(FabricTypeNormalizer.normalize('unknown')).toBe('solid');
    });

    it('should return "solid" for undefined', () => {
      expect(FabricTypeNormalizer.normalize(undefined)).toBe('solid');
    });

    it('should return "solid" for empty string', () => {
      expect(FabricTypeNormalizer.normalize('')).toBe('solid');
    });
  });
});
