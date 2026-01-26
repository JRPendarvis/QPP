import { SizeResolver } from '../sizeResolver';

describe('SizeResolver', () => {
  describe('getDisplaySize', () => {
    it('should return mapped size for valid quilt size keys', () => {
      expect(SizeResolver.getDisplaySize('baby')).toBe('36×52 inches');
      expect(SizeResolver.getDisplaySize('lap')).toBe('50×65 inches');
      expect(SizeResolver.getDisplaySize('twin')).toBe('66×90 inches');
      expect(SizeResolver.getDisplaySize('full')).toBe('80×90 inches');
      expect(SizeResolver.getDisplaySize('queen')).toBe('90×95 inches');
      expect(SizeResolver.getDisplaySize('king')).toBe('105×95 inches');
    });

    it('should use Claude size when quilt size key is invalid', () => {
      expect(SizeResolver.getDisplaySize('invalid', '48×60 inches')).toBe('48×60 inches');
    });

    it('should use default size when no quilt size or Claude size provided', () => {
      expect(SizeResolver.getDisplaySize()).toBe('60×72 inches');
    });

    it('should prioritize quilt size over Claude size', () => {
      expect(SizeResolver.getDisplaySize('queen', '48×60 inches')).toBe('90×95 inches');
    });

    it('should use Claude size when no quilt size provided', () => {
      expect(SizeResolver.getDisplaySize(undefined, '48×60 inches')).toBe('48×60 inches');
    });

    it('should use default when quilt size is undefined and Claude size is empty', () => {
      expect(SizeResolver.getDisplaySize(undefined, '')).toBe('60×72 inches');
    });
  });

  describe('parseDimensions', () => {
    it('should parse dimensions with × symbol', () => {
      const result = SizeResolver.parseDimensions('90×95 inches');
      expect(result).toEqual({ widthIn: 90, heightIn: 95 });
    });

    it('should parse dimensions with x symbol', () => {
      const result = SizeResolver.parseDimensions('66x90 inches');
      expect(result).toEqual({ widthIn: 66, heightIn: 90 });
    });

    it('should parse dimensions without "inches" suffix', () => {
      const result = SizeResolver.parseDimensions('80×90');
      expect(result).toEqual({ widthIn: 80, heightIn: 90 });
    });

    it('should handle dimensions with extra spacing', () => {
      const result = SizeResolver.parseDimensions('  105  ×  95  inches  ');
      expect(result).toEqual({ widthIn: 105, heightIn: 95 });
    });

    it('should return default dimensions for invalid format', () => {
      expect(SizeResolver.parseDimensions('invalid')).toEqual({ widthIn: 60, heightIn: 72 });
      expect(SizeResolver.parseDimensions('')).toEqual({ widthIn: 60, heightIn: 72 });
      expect(SizeResolver.parseDimensions('90 by 95')).toEqual({ widthIn: 60, heightIn: 72 });
    });

    it('should handle single number input', () => {
      expect(SizeResolver.parseDimensions('90')).toEqual({ widthIn: 60, heightIn: 72 });
    });

    it('should parse three-digit dimensions', () => {
      const result = SizeResolver.parseDimensions('100×120 inches');
      expect(result).toEqual({ widthIn: 100, heightIn: 120 });
    });
  });
});
