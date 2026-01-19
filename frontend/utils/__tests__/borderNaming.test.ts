import { getBorderName } from '../borderNaming';

describe('borderNaming', () => {
  describe('getBorderName', () => {
    it('should return "Border" for a single border', () => {
      expect(getBorderName(0, 1)).toBe('Border');
    });

    it('should return "Inner Border" and "Outer Border" for two borders', () => {
      expect(getBorderName(0, 2)).toBe('Inner Border');
      expect(getBorderName(1, 2)).toBe('Outer Border');
    });

    it('should return correct names for three borders', () => {
      expect(getBorderName(0, 3)).toBe('Inner Border');
      expect(getBorderName(1, 3)).toBe('Middle Border');
      expect(getBorderName(2, 3)).toBe('Outer Border');
    });

    it('should return numbered borders for more than three borders', () => {
      expect(getBorderName(0, 4)).toBe('Border 1');
      expect(getBorderName(1, 4)).toBe('Border 2');
      expect(getBorderName(2, 4)).toBe('Border 3');
      expect(getBorderName(3, 4)).toBe('Border 4');
    });

    it('should handle edge case of zero borders gracefully', () => {
      expect(getBorderName(0, 0)).toBe('Border 1');
    });

    it('should handle invalid index gracefully', () => {
      expect(getBorderName(-1, 2)).toBe('Border 0');
      expect(getBorderName(5, 2)).toBe('Border 6');
    });
  });
});
