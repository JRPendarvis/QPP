import { BorderConfiguration } from '../../types/Border';

/**
 * Calculates border count from configuration
 */
export class BorderCountCalculator {
  /**
   * Returns number of borders from configuration
   */
  static calculate(borderConfiguration?: BorderConfiguration): number {
    if (!borderConfiguration?.enabled) {
      return 0;
    }

    return borderConfiguration.borders.length;
  }
}
