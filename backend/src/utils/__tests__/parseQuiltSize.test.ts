import { parseQuiltSizeIn, QuiltSizeIn } from '../parseQuiltSize';

describe('parseQuiltSize', () => {
  describe('parseQuiltSizeIn', () => {
    it('should parse size with lowercase "x" separator', () => {
      const result = parseQuiltSizeIn('72x84');
      
      expect(result.width).toBe(72);
      expect(result.height).toBe(84);
    });

    it('should parse size with uppercase "X" separator', () => {
      const result = parseQuiltSizeIn('72X84');
      
      expect(result.width).toBe(72);
      expect(result.height).toBe(84);
    });

    it('should parse size with × (multiplication sign) separator', () => {
      const result = parseQuiltSizeIn('72×84');
      
      expect(result.width).toBe(72);
      expect(result.height).toBe(84);
    });

    it('should parse size with spaces around separator', () => {
      const result1 = parseQuiltSizeIn('72 x 84');
      const result2 = parseQuiltSizeIn('72 × 84');
      const result3 = parseQuiltSizeIn('72  x  84');
      
      expect(result1.width).toBe(72);
      expect(result1.height).toBe(84);
      expect(result2.width).toBe(72);
      expect(result2.height).toBe(84);
      expect(result3.width).toBe(72);
      expect(result3.height).toBe(84);
    });

    it('should parse size with additional text', () => {
      const result1 = parseQuiltSizeIn('72x84 inches lap quilt');
      const result2 = parseQuiltSizeIn('Make a 60x72 quilt');
      const result3 = parseQuiltSizeIn('Size: 90×95 inches');
      
      expect(result1.width).toBe(72);
      expect(result1.height).toBe(84);
      expect(result2.width).toBe(60);
      expect(result2.height).toBe(72);
      expect(result3.width).toBe(90);
      expect(result3.height).toBe(95);
    });

    it('should parse common quilt sizes', () => {
      const babyQuilt = parseQuiltSizeIn('36x52');
      const lapQuilt = parseQuiltSizeIn('50x65');
      const twinQuilt = parseQuiltSizeIn('66x90');
      const queenQuilt = parseQuiltSizeIn('90x95');
      const kingQuilt = parseQuiltSizeIn('105x95');
      
      expect(babyQuilt).toEqual({ width: 36, height: 52 });
      expect(lapQuilt).toEqual({ width: 50, height: 65 });
      expect(twinQuilt).toEqual({ width: 66, height: 90 });
      expect(queenQuilt).toEqual({ width: 90, height: 95 });
      expect(kingQuilt).toEqual({ width: 105, height: 95 });
    });

    it('should throw error for invalid format', () => {
      expect(() => parseQuiltSizeIn('invalid')).toThrow('Unable to parse quilt size from: "invalid"');
      expect(() => parseQuiltSizeIn('just text')).toThrow('Unable to parse quilt size from: "just text"');
      expect(() => parseQuiltSizeIn('')).toThrow('Unable to parse quilt size from: ""');
      expect(() => parseQuiltSizeIn('72')).toThrow('Unable to parse quilt size from: "72"');
    });

    it('should throw error for invalid dimensions', () => {
      expect(() => parseQuiltSizeIn('0x84')).toThrow('Invalid quilt size parsed from: "0x84"');
      expect(() => parseQuiltSizeIn('72x0')).toThrow('Invalid quilt size parsed from: "72x0"');
    });

    it('should handle large dimensions', () => {
      const result = parseQuiltSizeIn('120x150');
      
      expect(result.width).toBe(120);
      expect(result.height).toBe(150);
    });

    it('should handle three-digit dimensions', () => {
      const result = parseQuiltSizeIn('100x200');
      
      expect(result.width).toBe(100);
      expect(result.height).toBe(200);
    });
  });
});
