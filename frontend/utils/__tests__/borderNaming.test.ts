import { getBorderName } from '../borderNaming';

describe('borderNaming', () => {
  describe('getBorderName', () => {
    it('should return "Border" for a single border', () => {
      expect(getBorderName(1, 1)).toBe('Border');
    });

    it('should return "Inner Border" and "Outer Border" for two borders', () => {
      expect(getBorderName(1, 2)).toBe('Inner Border');
      expect(getBorderName(2, 2)).toBe('Outer Border');
    });

    it('should return correct names for three borders', () => {
      expect(getBorderName(1, 3)).toBe('Inner Border');
      expect(getBorderName(2, 3)).toBe('Middle Border');
      expect(getBorderName(3, 3)).toBe('Outer Border');
    });

    it('should return correct names for four borders', () => {
      expect(getBorderName(1, 4)).toBe('Inner Border');
      expect(getBorderName(2, 4)).toBe('Inner Middle Border');
      expect(getBorderName(3, 4)).toBe('Outer Middle Border');
      expect(getBorderName(4, 4)).toBe('Outer Border');
    });

    it('should return numbered border as fallback', () => {
      expect(getBorderName(1, 5)).toBe('Border 1');
      expect(getBorderName(3, 5)).toBe('Border 3');
    });
  });
});
