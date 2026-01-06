export type FabricValue = 'light' | 'medium' | 'dark';
export type PrintScale = 'solid' | 'small' | 'medium' | 'large';
export type FabricRole = 'background' | 'primary' | 'secondary' | 'accent';

export interface FabricAnalysis {
  fabricIndex: number;
  description: string;
  type: 'printed' | 'solid';
  value: FabricValue;
  printScale: PrintScale;
  dominantColor: string;
  recommendedRole: FabricRole;
  roleReason: string;
}

export interface RoleAssignment {
  fabricIndex: number;
  description: string;
}

export interface RoleAssignments {
  background: RoleAssignment | null;
  primary: RoleAssignment | null;
  secondary: RoleAssignment | null;
  accent: RoleAssignment | null;
}

/**
 * Service responsible for validating fabric role assignments
 * and generating warnings for potentially problematic combinations.
 * 
 * Single Responsibility: Role assignment validation and warnings
 */
export class RoleValidationService {
  /**
   * Generate warnings for potentially problematic role assignments
   */
  static generateRoleWarnings(
    fabricAnalysis: FabricAnalysis[],
    roleAssignments: RoleAssignments
  ): string {
    const warnings: string[] = [];

    const backgroundFabric = this.getFabricByRole(fabricAnalysis, roleAssignments.background);
    const primaryFabric = this.getFabricByRole(fabricAnalysis, roleAssignments.primary);

    this.checkValueContrast(backgroundFabric, primaryFabric, warnings);
    this.checkDarkBackground(backgroundFabric, warnings);
    this.checkLargeScaleBackground(backgroundFabric, warnings);

    return this.formatWarnings(warnings);
  }

  /**
   * Get fabric by role assignment
   */
  private static getFabricByRole(
    fabricAnalysis: FabricAnalysis[],
    roleAssignment: RoleAssignment | null
  ): FabricAnalysis | null {
    if (!roleAssignment) return null;
    return fabricAnalysis.find(f => f.fabricIndex === roleAssignment.fabricIndex) ?? null;
  }

  /**
   * Check for value contrast issues between background and primary
   */
  private static checkValueContrast(
    backgroundFabric: FabricAnalysis | null,
    primaryFabric: FabricAnalysis | null,
    warnings: string[]
  ): void {
    if (!backgroundFabric || !primaryFabric) return;

    const valueOrder: FabricValue[] = ['light', 'medium', 'dark'];
    const bgIndex = valueOrder.indexOf(backgroundFabric.value);
    const primaryIndex = valueOrder.indexOf(primaryFabric.value);

    if (Math.abs(bgIndex - primaryIndex) === 0) {
      warnings.push(
        `NOTE: The background (${backgroundFabric.description}) and primary (${primaryFabric.description}) have the SAME value (${backgroundFabric.value}). This may result in low contrast.`
      );
    }
  }

  /**
   * Check if dark fabric is used as background
   */
  private static checkDarkBackground(
    backgroundFabric: FabricAnalysis | null,
    warnings: string[]
  ): void {
    if (!backgroundFabric) return;

    if (backgroundFabric.value === 'dark') {
      warnings.push(
        `NOTE: A dark fabric (${backgroundFabric.description}) is assigned as background. This creates a dramatic, inverted look.`
      );
    }
  }

  /**
   * Check if large-scale print is used as background
   */
  private static checkLargeScaleBackground(
    backgroundFabric: FabricAnalysis | null,
    warnings: string[]
  ): void {
    if (!backgroundFabric) return;

    if (backgroundFabric.printScale === 'large') {
      warnings.push(
        `NOTE: A large-scale print (${backgroundFabric.description}) is assigned as background. Large prints can be busy as backgrounds.`
      );
    }
  }

  /**
   * Format warnings into a prompt string
   */
  private static formatWarnings(warnings: string[]): string {
    if (warnings.length === 0) {
      return '';
    }

    return `**ROLE ASSIGNMENT NOTES:**\n${warnings.join('\n')}\n\nProceed with the user's choices but include relevant warnings in your response.`;
  }
}
