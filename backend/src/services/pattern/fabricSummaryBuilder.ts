// src/services/pattern/fabricSummaryBuilder.ts

import { FabricAnalysis, RoleAssignments } from './promptFormatter';

/**
 * Builds fabric summaries for role swap prompts
 * Single Responsibility: Fabric and role summary text formatting only
 */
export class FabricSummaryBuilder {
  /**
   * Build concise fabric summary for role swap prompts
   * @param fabricAnalysis - Array of fabric analysis results
   * @returns Formatted fabric summary text
   */
  static buildFabricSummary(fabricAnalysis: FabricAnalysis[]): string {
    return fabricAnalysis
      .map((f) => `- Fabric ${f.fabricIndex}: ${f.description} (${f.value} value, ${f.printScale} print)`)
      .join('\n');
  }

  /**
   * Build user's custom role assignments summary
   * @param roleAssignments - User's selected role assignments
   * @returns Formatted roles summary text
   */
  static buildRolesSummary(roleAssignments: RoleAssignments): string {
    return Object.entries(roleAssignments)
      .filter(([_, assignment]) => assignment !== null)
      .map(([role, assignment]) => 
        `- ${role.toUpperCase()}: Fabric ${assignment!.fabricIndex} (${assignment!.description})`
      )
      .join('\n');
  }
}
