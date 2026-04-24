import { FabricYardageCalculator } from '../../utils/fabric';
import { BorderFabricCalculator } from '../../utils/borderFabricCalculator';
import { BorderConfiguration } from '../../types/Border';
import { Fabric } from '../../types/ClaudeResponse';
import { FabricRequirement } from '../../types/QuiltPattern';

export interface RequirementsResult {
  fabricRequirements: FabricRequirement[];
  yardageWarnings: string[];
}

/**
 * Calculates fabric and border requirements for patterns
 */
export class RequirementsCalculator {
  /**
   * Calculates fabric requirements including pattern and border fabrics
   */
  static calculateAllRequirements(
    quiltSize: string | undefined,
    patternForSvg: string,
    patternFabrics: Fabric[],
    fabricAnalysis: any[] | undefined,
    borderConfiguration: BorderConfiguration | undefined,
    borderCount: number,
    allFabricImages: string[],
    finalSize: string,
    getBorderFabricName: (index: number, total: number, fabric: any) => string,
    availableYardageByFabric?: Array<number | null>
  ): RequirementsResult {
    // Calculate pattern fabric requirements
    const fabricInfo = patternFabrics.map((fabric, idx) => {
      const analysis = fabricAnalysis?.[idx];
      return {
        color: fabric.color,
        type: fabric.type,
        description: analysis?.description || undefined
      };
    });

    const fabricRequirements = FabricYardageCalculator.calculateRequirements(
      quiltSize || 'default',
      fabricInfo,
      patternForSvg
    );

    // Add border requirements if configured
    if (borderConfiguration?.enabled && borderConfiguration.borders.length > 0 && borderCount > 0) {
      const borderReqs = this.calculateBorderRequirements(
        borderConfiguration,
        borderCount,
        allFabricImages,
        finalSize,
        getBorderFabricName
      );

      borderReqs.forEach(borderReq => {
        fabricRequirements.push({
          role: borderReq.fabricName,
          yards: borderReq.totalYards,
          description: `Border fabric - ${borderReq.cutInstructions}`
        });
      });
    }

    const constrained = this.applyAvailabilityConstraints(
      fabricRequirements,
      availableYardageByFabric,
      patternFabrics.length,
      borderCount
    );

    return {
      fabricRequirements: constrained.fabricRequirements,
      yardageWarnings: constrained.yardageWarnings,
    };
  }

  private static applyAvailabilityConstraints(
    requirements: FabricRequirement[],
    availableYardageByFabric: Array<number | null> | undefined,
    patternFabricCount: number,
    borderCount: number
  ): RequirementsResult {
    if (!availableYardageByFabric || availableYardageByFabric.length === 0) {
      return { fabricRequirements: requirements, yardageWarnings: [] };
    }

    const updated = [...requirements];
    const warnings: string[] = [];

    for (let i = 0; i < patternFabricCount; i++) {
      const available = availableYardageByFabric[i];
      if (available === null || available === undefined) {
        continue;
      }

      const requirement = updated[i];
      if (!requirement || requirement.yards <= available) {
        continue;
      }

      const shortBy = Number((requirement.yards - available).toFixed(2));
      warnings.push(`${requirement.role} exceeds available fabric by ${shortBy} yards. Requirement was limited to ${available} yards.`);
      requirement.description = `${requirement.description} (limited to available ${available} yards)`;
      requirement.yards = Number(available.toFixed(2));
    }

    if (borderCount > 0) {
      const borderStartIdx = updated.length - borderCount;

      for (let i = 0; i < borderCount; i++) {
        const availableIdx = patternFabricCount + i;
        const available = availableYardageByFabric[availableIdx];
        if (available === null || available === undefined) {
          continue;
        }

        const requirement = updated[borderStartIdx + i];
        if (!requirement || requirement.yards <= available) {
          continue;
        }

        const shortBy = Number((requirement.yards - available).toFixed(2));
        warnings.push(`${requirement.role} exceeds available fabric by ${shortBy} yards. Requirement was limited to ${available} yards.`);
        requirement.description = `${requirement.description} (limited to available ${available} yards)`;
        requirement.yards = Number(available.toFixed(2));
      }
    }

    return {
      fabricRequirements: updated,
      yardageWarnings: warnings,
    };
  }

  /**
   * Calculates border-specific requirements
   */
  private static calculateBorderRequirements(
    borderConfiguration: BorderConfiguration,
    borderCount: number,
    allFabricImages: string[],
    finalSize: string,
    getBorderFabricName: (index: number, total: number, fabric: any) => string
  ): Array<{ fabricName: string; totalYards: number; cutInstructions: string }> {
    const quiltSizeObj = this.parseQuiltSize(finalSize);
    const borderFabricImages = allFabricImages.slice(allFabricImages.length - borderCount);
    
    const borderFabrics = borderFabricImages.map((image: string) => ({
      color: '#CCCCCC',
      type: 'printed' as const,
      image: image
    }));

    const borderFabricNames = borderFabrics.map((fabric: any, idx: number) => {
      const border = borderConfiguration.borders[idx];
      return border 
        ? getBorderFabricName(idx, borderConfiguration.borders.length, fabric) 
        : `Border Fabric ${idx + 1}`;
    });

    return BorderFabricCalculator.calculateBorderRequirements(
      borderConfiguration.borders,
      quiltSizeObj.widthIn,
      quiltSizeObj.heightIn,
      borderFabricNames
    );
  }

  /**
   * Parses quilt size string into dimensions
   */
  private static parseQuiltSize(sizeString: string): { widthIn: number; heightIn: number } {
    const match = sizeString.match(/(\d+)[×x](\d+)/);
    if (match) {
      return {
        widthIn: parseInt(match[1], 10),
        heightIn: parseInt(match[2], 10)
      };
    }
    return { widthIn: 60, heightIn: 72 };
  }
}
