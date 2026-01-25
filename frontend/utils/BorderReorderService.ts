import { Border } from '@/types/Border';

/**
 * Handles border reordering logic
 */
export class BorderReorderService {
  /**
   * Reorder a border in the specified direction
   * @param borders - Current borders array
   * @param borderId - ID of border to reorder
   * @param direction - Direction to move ('up' or 'down')
   * @returns New borders array with updated order, or original if invalid
   */
  static reorder(
    borders: Border[], 
    borderId: string, 
    direction: 'up' | 'down'
  ): Border[] {
    const sorted = [...borders].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex(b => b.id === borderId);
    
    if (currentIndex === -1) {
      return borders; // Border not found
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sorted.length) {
      return borders; // Out of bounds
    }

    // Swap positions
    const reordered = [...sorted];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];
    
    // Reassign order numbers
    return reordered.map((border, index) => ({
      ...border,
      order: index + 1
    }));
  }

  /**
   * Reorder borders after removal
   * @param borders - Borders array after filtering
   * @returns Borders with sequential order numbers
   */
  static resequence(borders: Border[]): Border[] {
    return borders.map((border, index) => ({
      ...border,
      order: index + 1
    }));
  }
}
