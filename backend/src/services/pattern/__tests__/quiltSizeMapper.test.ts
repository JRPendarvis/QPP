// src/services/pattern/__tests__/quiltSizeMapper.test.ts

import { QuiltSizeMapper } from '../quiltSizeMapper';

describe('QuiltSizeMapper', () => {
  describe('getFormattedSize', () => {
    it('should return baby size for "baby" key', () => {
      const result = QuiltSizeMapper.getFormattedSize('baby');
      expect(result).toBe('36×52 inches baby quilt');
    });

    it('should return lap size for "lap" key', () => {
      const result = QuiltSizeMapper.getFormattedSize('lap');
      expect(result).toBe('50×65 inches lap/throw quilt');
    });

    it('should return twin size for "twin" key', () => {
      const result = QuiltSizeMapper.getFormattedSize('twin');
      expect(result).toBe('66×90 inches twin quilt');
    });

    it('should return full size for "full" key', () => {
      const result = QuiltSizeMapper.getFormattedSize('full');
      expect(result).toBe('80×90 inches full/double quilt');
    });

    it('should return queen size for "queen" key', () => {
      const result = QuiltSizeMapper.getFormattedSize('queen');
      expect(result).toBe('90×95 inches queen quilt');
    });

    it('should return king size for "king" key', () => {
      const result = QuiltSizeMapper.getFormattedSize('king');
      expect(result).toBe('105×95 inches king quilt');
    });

    it('should default to throw size for undefined', () => {
      const result = QuiltSizeMapper.getFormattedSize(undefined);
      expect(result).toBe('60×72 inches throw quilt');
    });

    it('should default to throw size for unknown key', () => {
      const result = QuiltSizeMapper.getFormattedSize('unknown');
      expect(result).toBe('60×72 inches throw quilt');
    });

    it('should default to throw size for empty string', () => {
      const result = QuiltSizeMapper.getFormattedSize('');
      expect(result).toBe('60×72 inches throw quilt');
    });
  });
});

