/**
 * Pattern name formatting and metadata utilities
 */
export class PatternFormatter {
  private static readonly PATTERN_NAMES: Record<string, string> = {
    'simple-squares': 'Simple Squares',
    'strip-quilt': 'Strip Quilt',
    'checkerboard': 'Checkerboard',
    'rail-fence': 'Rail Fence',
    'four-patch': 'Four Patch',
    'nine-patch': 'Nine Patch',
    'half-square-triangles': 'Half-Square Triangles',
    'hourglass': 'Hourglass',
    'bow-tie': 'Bow Tie',
    'flying-geese': 'Flying Geese',
    'pinwheel': 'Pinwheel',
    'log-cabin': 'Log Cabin',
    'sawtooth-star': 'Sawtooth Star',
    'ohio-star': 'Ohio Star',
    'churn-dash': 'Churn Dash',
    'lone-star': 'Lone Star',
    'mariners-compass': "Mariner's Compass",
    'new-york-beauty': 'New York Beauty',
    'storm-at-sea': 'Storm at Sea',
    'drunkards-path': "Drunkard's Path",
    'mosaic-star': 'Mosaic Star',
    'grandmothers-flower-garden': "Grandmother's Flower Garden",
    'double-wedding-ring': 'Double Wedding Ring',
    'pickle-dish': 'Pickle Dish',
    'complex-medallion': 'Complex Medallion',
  };

  private static readonly PATTERN_DESCRIPTIONS: Record<string, string> = {
    'Churn Dash': '- A 9-patch style block with a center square, 4 rectangles on the sides, and 4 half-square triangle units in the corners\n- The corners feature diagonal splits creating a "churning" motion effect\n- NOT a Shoo Fly pattern (which has solid squares in corners)',
    'Shoo Fly': '- A 9-patch block with solid squares in all four corners\n- A center square\n- Four half-square triangles on the sides forming an X pattern',
    'Ohio Star': '- 8-pointed star in the center formed by quarter-square triangles\n- Four corner squares\n- The star points extend from center to the midpoints of each side',
    'Sawtooth Star': '- Similar to Ohio Star but with half-square triangles creating sawtooth edges\n- Large center square\n- Four corner squares with triangular star points between them',
    'Pinwheel': '- Four triangular sections spiraling from center\n- Creates a spinning windmill effect\n- Triangles all point in the same rotational direction',
    'Flying Geese': '- Large triangles pointing in one direction (the "geese")\n- Smaller background triangles on the sides\n- Creates a directional, flowing pattern',
    'Four Patch': '- Simple 2x2 grid of squares\n- Alternating two colors in checkerboard pattern',
    'Nine Patch': '- 3x3 grid of equal-sized squares\n- Often alternates two colors in a checkerboard arrangement',
    'Log Cabin': '- Center square with strips of fabric added around it\n- Strips get progressively longer as you move outward\n- Creates a spiral or concentric square effect',
  };

  /**
   * Format pattern ID to display name
   */
  static formatPatternName(patternId: string): string {
    return this.PATTERN_NAMES[patternId] || 
           patternId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Get pattern description for AI context
   */
  static getPatternDescription(patternName: string): string {
    return this.PATTERN_DESCRIPTIONS[patternName] || 
           `- Traditional ${patternName} quilt block pattern`;
  }

  /**
   * Extract creative name from Claude's response
   */
  static extractDisplayName(claudeName: string, patternType: string): string {
    if (!claudeName) {
      return patternType;
    }

    // Pattern name format from Claude: "Creative Name - Pattern Type"
    const nameParts = claudeName.split(' - ');
    if (nameParts.length > 1 && nameParts[0]) {
      return `${nameParts[0]} - ${patternType}`;
    }

    return patternType;
  }
}
