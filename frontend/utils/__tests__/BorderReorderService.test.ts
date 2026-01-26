import { BorderReorderService } from '../BorderReorderService';
import { Border } from '@/types/Border';

describe('BorderReorderService', () => {
  const createBorder = (id: string, order: number, fabricIndex: number = 0): Border => ({
    id,
    width: 2.5,
    fabricIndex,
    order,
  });

  describe('reorder', () => {
    it('should move border up in the list', () => {
      const borders: Border[] = [
        createBorder('border1', 1),
        createBorder('border2', 2),
        createBorder('border3', 3),
      ];

      const result = BorderReorderService.reorder(borders, 'border2', 'up');

      expect(result[0].id).toBe('border2');
      expect(result[0].order).toBe(1);
      expect(result[1].id).toBe('border1');
      expect(result[1].order).toBe(2);
      expect(result[2].id).toBe('border3');
      expect(result[2].order).toBe(3);
    });

    it('should move border down in the list', () => {
      const borders: Border[] = [
        createBorder('border1', 1),
        createBorder('border2', 2),
        createBorder('border3', 3),
      ];

      const result = BorderReorderService.reorder(borders, 'border2', 'down');

      expect(result[0].id).toBe('border1');
      expect(result[0].order).toBe(1);
      expect(result[1].id).toBe('border3');
      expect(result[1].order).toBe(2);
      expect(result[2].id).toBe('border2');
      expect(result[2].order).toBe(3);
    });

    it('should return original array when moving first border up', () => {
      const borders: Border[] = [
        createBorder('border1', 1),
        createBorder('border2', 2),
      ];

      const result = BorderReorderService.reorder(borders, 'border1', 'up');

      expect(result).toEqual(borders);
    });

    it('should return original array when moving last border down', () => {
      const borders: Border[] = [
        createBorder('border1', 1),
        createBorder('border2', 2),
      ];

      const result = BorderReorderService.reorder(borders, 'border2', 'down');

      expect(result).toEqual(borders);
    });

    it('should return original array when border ID not found', () => {
      const borders: Border[] = [
        createBorder('border1', 1),
        createBorder('border2', 2),
      ];

      const result = BorderReorderService.reorder(borders, 'nonexistent', 'up');

      expect(result).toEqual(borders);
    });

    it('should handle borders with non-sequential order numbers', () => {
      const borders: Border[] = [
        createBorder('border1', 5),
        createBorder('border2', 10),
        createBorder('border3', 15),
      ];

      const result = BorderReorderService.reorder(borders, 'border2', 'up');

      // Should sort first, then reorder, then renumber sequentially
      expect(result[0].id).toBe('border2');
      expect(result[0].order).toBe(1);
      expect(result[1].id).toBe('border1');
      expect(result[1].order).toBe(2);
      expect(result[2].id).toBe('border3');
      expect(result[2].order).toBe(3);
    });

    it('should preserve other border properties', () => {
      const borders: Border[] = [
        createBorder('border1', 1, 0),
        createBorder('border2', 2, 1),
        createBorder('border3', 3, 2),
      ];

      const result = BorderReorderService.reorder(borders, 'border2', 'up');

      expect(result[0].fabricIndex).toBe(1); // border2's fabricIndex
      expect(result[0].width).toBe(2.5);
      expect(result[1].fabricIndex).toBe(0); // border1's fabricIndex
    });

    it('should handle single border array', () => {
      const borders: Border[] = [createBorder('border1', 1)];

      const resultUp = BorderReorderService.reorder(borders, 'border1', 'up');
      const resultDown = BorderReorderService.reorder(borders, 'border1', 'down');

      expect(resultUp).toEqual(borders);
      expect(resultDown).toEqual(borders);
    });
  });

  describe('resequence', () => {
    it('should reassign sequential order numbers starting from 1', () => {
      const borders: Border[] = [
        createBorder('border1', 5),
        createBorder('border2', 10),
        createBorder('border3', 15),
      ];

      const result = BorderReorderService.resequence(borders);

      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(2);
      expect(result[2].order).toBe(3);
    });

    it('should handle empty array', () => {
      const result = BorderReorderService.resequence([]);
      expect(result).toEqual([]);
    });

    it('should handle single border', () => {
      const borders: Border[] = [createBorder('border1', 10)];
      const result = BorderReorderService.resequence(borders);

      expect(result[0].order).toBe(1);
    });

    it('should preserve all border properties except order', () => {
      const borders: Border[] = [
        createBorder('border1', 99, 0),
        createBorder('border2', 88, 1),
      ];

      const result = BorderReorderService.resequence(borders);

      expect(result[0].id).toBe('border1');
      expect(result[0].width).toBe(2.5);
      expect(result[0].fabricIndex).toBe(0);
      expect(result[0].order).toBe(1);

      expect(result[1].id).toBe('border2');
      expect(result[1].fabricIndex).toBe(1);
      expect(result[1].order).toBe(2);
    });

    it('should work correctly after filtering operation', () => {
      // Simulate removing middle border
      const borders: Border[] = [
        createBorder('border1', 1),
        createBorder('border3', 3),
      ];

      const result = BorderReorderService.resequence(borders);

      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(2); // Should be 2, not 3
    });
  });
});
