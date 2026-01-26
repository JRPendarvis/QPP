// src/services/pattern/quiltSizeMapper.ts

/**
 * Maps quilt size keys to formatted size strings
 * Single Responsibility: Quilt size string resolution only
 */
export class QuiltSizeMapper {
  /**
   * Get formatted size string for quilt size key
   * @param quiltSize - Optional size key (baby, lap, twin, etc.)
   * @returns Formatted size string
   */
  static getFormattedSize(quiltSize?: string): string {
    const sizeMap: Record<string, string> = {
      'baby': '36×52 inches baby quilt',
      'lap': '50×65 inches lap/throw quilt',
      'twin': '66×90 inches twin quilt',
      'full': '80×90 inches full/double quilt',
      'queen': '90×95 inches queen quilt',
      'king': '105×95 inches king quilt',
    };
    
    return quiltSize && sizeMap[quiltSize] ? sizeMap[quiltSize] : '60×72 inches throw quilt';
  }
}
