/**
 * Service for validating and formatting quilt pattern instructions
 */
export class InstructionValidator {
  /** Minimum required number of instruction steps */
  private static readonly MIN_INSTRUCTIONS = 4;

  /** Default fallback instructions if none provided */
  private static readonly DEFAULT_INSTRUCTIONS = [
    'Gather your fabrics and materials',
    'Cut pieces according to pattern requirements', 
    'Arrange blocks in desired layout',
    'Sew blocks together',
    'Add borders and binding'
  ];

  /** Disclaimer added to all instruction sets */
  private static readonly DISCLAIMER = 
    '📋 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';

  /**
   * Validates instructions and adds disclaimer
   * 
   * @param instructions - Optional array of instruction steps
   * @returns Complete instruction array with disclaimer
   * 
   * @example
   * ```typescript
   * const validated = InstructionValidator.validate(['Step 1', 'Step 2']);
   * // Returns: ['📋 IMPORTANT: ...', 'Step 1', 'Step 2']
   * ```
   */
  static validate(instructions?: string[]): string[] {
    const validInstructions = this.ensureMinimumInstructions(instructions);
    return this.addDisclaimer(validInstructions);
  }

  /**
   * Ensures minimum number of instructions, provides fallback if needed
   */
  private static ensureMinimumInstructions(instructions?: string[]): string[] {
    if (!instructions || instructions.length < this.MIN_INSTRUCTIONS) {
      return this.DEFAULT_INSTRUCTIONS;
    }
    return instructions;
  }

  /**
   * Adds disclaimer to beginning of instructions
   */
  private static addDisclaimer(instructions: string[]): string[] {
    return [this.DISCLAIMER, ...instructions];
  }
}
