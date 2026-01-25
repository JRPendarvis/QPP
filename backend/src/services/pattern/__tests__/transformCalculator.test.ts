import { TransformCalculator } from '../transformCalculator';

describe('TransformCalculator', () => {
  describe('calculate', () => {
    it('should return simple translate when rotation disabled', () => {
      const result = TransformCalculator.calculate(100, 200, false);
      expect(result).toBe('translate(100,200)');
    });

    it('should include rotation when enabled', () => {
      const result = TransformCalculator.calculate(100, 200, true);
      
      // Should be either plain translate or translate + rotate
      const isValidFormat = 
        result === 'translate(100,200)' ||
        result === 'translate(100,200) rotate(90 50 50)' ||
        result === 'translate(100,200) rotate(180 50 50)' ||
        result === 'translate(100,200) rotate(270 50 50)';
      
      expect(isValidFormat).toBe(true);
    });

    it('should handle zero coordinates', () => {
      const result = TransformCalculator.calculate(0, 0, false);
      expect(result).toBe('translate(0,0)');
    });

    it('should handle negative coordinates', () => {
      const result = TransformCalculator.calculate(-50, -100, false);
      expect(result).toBe('translate(-50,-100)');
    });

    it('should use 50 50 as rotation center', () => {
      // Run multiple times to check if rotation is used
      const results = Array.from({ length: 20 }, () => 
        TransformCalculator.calculate(100, 200, true)
      );

      const withRotation = results.filter(r => r.includes('rotate'));
      
      // All rotations should use '50 50' as center
      withRotation.forEach(result => {
        if (result.includes('rotate')) {
          expect(result).toMatch(/rotate\(\d+ 50 50\)/);
        }
      });
    });

    it('should generate variety of rotations over multiple calls', () => {
      const results = Array.from({ length: 100 }, () => 
        TransformCalculator.calculate(0, 0, true)
      );

      const uniqueResults = new Set(results);
      
      // Should have at least 2 different results (randomness)
      // Could be 0°, 90°, 180°, 270° or no rotation
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    it('should only use valid rotation values', () => {
      const validRotations = ['0', '90', '180', '270'];
      
      for (let i = 0; i < 50; i++) {
        const result = TransformCalculator.calculate(0, 0, true);
        
        if (result.includes('rotate')) {
          const rotationMatch = result.match(/rotate\((\d+)/);
          expect(rotationMatch).not.toBeNull();
          expect(validRotations).toContain(rotationMatch![1]);
        }
      }
    });

    it('should handle decimal coordinates', () => {
      const result = TransformCalculator.calculate(100.5, 200.7, false);
      expect(result).toBe('translate(100.5,200.7)');
    });

    it('should not rotate when 0 is selected', () => {
      // Mock Math.random to return 0 (first rotation option)
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0);

      const result = TransformCalculator.calculate(100, 200, true);
      
      // When rotation[0] = 0, should not include rotate
      expect(result).toBe('translate(100,200)');

      Math.random = originalRandom;
    });

    it('should rotate 90 degrees when selected', () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.25); // Second rotation option

      const result = TransformCalculator.calculate(100, 200, true);
      expect(result).toBe('translate(100,200) rotate(90 50 50)');

      Math.random = originalRandom;
    });

    it('should rotate 180 degrees when selected', () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5); // Third rotation option

      const result = TransformCalculator.calculate(100, 200, true);
      expect(result).toBe('translate(100,200) rotate(180 50 50)');

      Math.random = originalRandom;
    });

    it('should rotate 270 degrees when selected', () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.75); // Fourth rotation option

      const result = TransformCalculator.calculate(100, 200, true);
      expect(result).toBe('translate(100,200) rotate(270 50 50)');

      Math.random = originalRandom;
    });
  });
});
