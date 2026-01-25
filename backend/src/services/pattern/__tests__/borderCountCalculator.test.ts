import { BorderCountCalculator } from '../borderCountCalculator';
import { BorderConfiguration } from '../../../types/Border';

describe('BorderCountCalculator', () => {
  describe('calculate', () => {
    it('should return 0 when borderConfiguration is undefined', () => {
      expect(BorderCountCalculator.calculate(undefined)).toBe(0);
    });

    it('should return 0 when borders are disabled', () => {
      const config: BorderConfiguration = {
        enabled: false,
        borders: [
          { id: '1', width: 2.5, order: 1, fabricIndex: 0 },
          { id: '2', width: 4, order: 2, fabricIndex: 1 }
        ]
      };

      expect(BorderCountCalculator.calculate(config)).toBe(0);
    });

    it('should return border count when borders are enabled', () => {
      const config: BorderConfiguration = {
        enabled: true,
        borders: [
          { id: '1', width: 2.5, order: 1, fabricIndex: 0 },
          { id: '2', width: 4, order: 2, fabricIndex: 1 }
        ]
      };

      expect(BorderCountCalculator.calculate(config)).toBe(2);
    });

    it('should handle single border', () => {
      const config: BorderConfiguration = {
        enabled: true,
        borders: [{ id: '1', width: 3, order: 1, fabricIndex: 0 }]
      };

      expect(BorderCountCalculator.calculate(config)).toBe(1);
    });

    it('should handle empty borders array', () => {
      const config: BorderConfiguration = {
        enabled: true,
        borders: []
      };

      expect(BorderCountCalculator.calculate(config)).toBe(0);
    });
  });
});
