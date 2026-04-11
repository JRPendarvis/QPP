import { QuiltSizeCatalog } from '../quiltSizeCatalog';

describe('QuiltSizeCatalog', () => {
  describe('resolveDimensions', () => {
    it('resolves preset keys', () => {
      const result = QuiltSizeCatalog.resolveDimensions('queen');
      expect(result).toEqual({ widthIn: 90, heightIn: 95 });
    });

    it('resolves explicit dimension strings', () => {
      const result = QuiltSizeCatalog.resolveDimensions('48x64');
      expect(result).toEqual({ widthIn: 48, heightIn: 64 });
    });

    it('prefers requested size over fallback estimated text', () => {
      const result = QuiltSizeCatalog.resolveDimensions('48×64', '60×72 inches');
      expect(result).toEqual({ widthIn: 48, heightIn: 64 });
    });

    it('falls back to estimated text when requested size missing', () => {
      const result = QuiltSizeCatalog.resolveDimensions(undefined, '50×65 inches');
      expect(result).toEqual({ widthIn: 50, heightIn: 65 });
    });
  });

  describe('formatters', () => {
    it('formats display size consistently', () => {
      expect(QuiltSizeCatalog.formatDisplaySize({ widthIn: 60, heightIn: 72 })).toBe('60×72 inches');
    });

    it('formats prompt size for presets and custom dimensions', () => {
      expect(QuiltSizeCatalog.formatPromptSize('lap')).toBe('50×65 inches lap/throw quilt');
      expect(QuiltSizeCatalog.formatPromptSize('48x64')).toBe('48×64 inches custom quilt');
    });
  });
});