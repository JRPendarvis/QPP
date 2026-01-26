/**
 * Service for calculating SVG transform attributes
 */
export class TransformCalculator {
  private static readonly ROTATIONS = [0, 90, 180, 270];

  /**
   * Calculates the transform attribute for a block
   * 
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param canRotate - Whether rotation is allowed
   * @returns SVG transform string
   */
  static calculate(x: number, y: number, canRotate: boolean): string {
    if (canRotate) {
      const rotation = this.ROTATIONS[Math.floor(Math.random() * this.ROTATIONS.length)];
      return rotation > 0
        ? `translate(${x},${y}) rotate(${rotation} 50 50)`
        : `translate(${x},${y})`;
    }
    return `translate(${x},${y})`;
  }
}
