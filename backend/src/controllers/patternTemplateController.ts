import { Request, Response } from 'express';
import { getAllPatterns, getPattern, PatternDefinition } from '../config/patterns';

type FabricRole = string;

/**
 * Get list of available pattern templates for block design
 */
export const getPatternTemplates = async (req: Request, res: Response) => {
  try {
    const allPatterns = getAllPatterns();
    
    // Filter out patterns that aren't suitable for block design
    const excludeFromBlockDesign = ['checkerboard', 'simple-squares', 'strip-quilt'];
    
    const templates = allPatterns
      .filter((pattern: PatternDefinition) => !excludeFromBlockDesign.includes(pattern.id))
      .map((pattern: PatternDefinition) => ({
        id: pattern.id,
        name: pattern.name,
        blockSize: 9, // Default to 9 for 3x3
        minFabrics: pattern.minFabrics,
        maxFabrics: pattern.maxFabrics,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Get pattern templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pattern templates',
    });
  }
};

/**
 * Get block template for a specific pattern
 * Converts the pattern's block structure to a grid compatible with BlockDesigner
 */
export const getPatternBlockTemplate = async (req: Request, res: Response) => {
  try {
    const { patternId } = req.params;
    const pattern = getPattern(patternId);

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: 'Pattern not found',
      });
    }

    // Parse the template to extract grid structure
    const { gridSize, gridData } = parseTemplateToGrid(pattern);

    res.json({
      success: true,
      data: {
        patternId,
        patternName: pattern.name,
        blockSize: gridSize * gridSize,
        gridSize,
        gridData,
        svgTemplate: pattern.template, // Include the actual SVG template
        description: `Template based on ${pattern.name} pattern`,
      },
    });
  } catch (error) {
    console.error('Get pattern block template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate block template',
    });
  }
};

/**
 * Parse pattern template SVG to extract grid structure
 * Analyzes the SVG to determine grid size and color assignments
 */
function parseTemplateToGrid(pattern: PatternDefinition): { gridSize: number; gridData: FabricRole[][] } {
  const template = pattern.template || '';
  
  // Handle specific patterns with known structures
  if (pattern.id === 'four-patch') {
    return {
      gridSize: 2,
      gridData: [
        ['background', 'primary'],
        ['secondary', 'accent']
      ]
    };
  }
  
  if (pattern.id === 'checkerboard') {
    // Checkerboard: 2x2 alternating pattern
    // COLOR1 (background) at top-left and bottom-right
    // COLOR2 (primary) at top-right and bottom-left
    return {
      gridSize: 2,
      gridData: [
        ['background', 'primary'],
        ['primary', 'background']
      ]
    };
  }
  
  if (pattern.id === 'bow-tie') {
    // Bow Tie: Use 8x8 grid to show the triangular "knot" pieces accurately
    // Based on template.ts structure:
    // - Top-left (0-3, 0-3): Background with Secondary diagonal in corner
    // - Top-right (0-3, 4-7): Primary (bow)
    // - Bottom-left (4-7, 0-3): Primary (bow)
    // - Bottom-right (4-7, 4-7): Background with Secondary diagonal in corner
    return {
      gridSize: 8,
      gridData: [
        // Rows 0-3: Top half
        ['background', 'background', 'background', 'secondary', 'primary', 'primary', 'primary', 'primary'],
        ['background', 'background', 'background', 'secondary', 'primary', 'primary', 'primary', 'primary'],
        ['background', 'background', 'background', 'secondary', 'primary', 'primary', 'primary', 'primary'],
        ['background', 'background', 'background', 'secondary', 'primary', 'primary', 'primary', 'primary'],
        // Rows 4-7: Bottom half
        ['primary', 'primary', 'primary', 'primary', 'secondary', 'background', 'background', 'background'],
        ['primary', 'primary', 'primary', 'primary', 'secondary', 'background', 'background', 'background'],
        ['primary', 'primary', 'primary', 'primary', 'secondary', 'background', 'background', 'background'],
        ['primary', 'primary', 'primary', 'primary', 'secondary', 'background', 'background', 'background']
      ]
    };
  }
  
  if (pattern.id === 'nine-patch') {
    // Nine Patch: classic checkerboard with background at corners+center, primary at edges
    return {
      gridSize: 3,
      gridData: [
        ['background', 'primary', 'background'],
        ['primary', 'background', 'primary'],
        ['background', 'primary', 'background']
      ]
    };
  }
  
  // For other patterns, analyze the template
  const colorMatches = template.match(/COLOR\d+/g) || [];
  const uniqueColors = new Set(colorMatches);
  const colorCount = uniqueColors.size;

  // Determine grid size based on complexity
  let gridSize = 3; // Default to 3x3
  
  if (colorCount <= 4) {
    gridSize = 2; // Simple patterns use 2x2
  } else if (colorCount <= 9) {
    gridSize = 3; // Medium patterns use 3x3
  } else {
    gridSize = 4; // Complex patterns use 4x4
  }

  // Fallback to default pattern
  return generateDefaultGrid(gridSize);
}

/**
 * Generate default grid when template parsing fails
 */
function generateDefaultGrid(gridSize: number): { gridSize: number; gridData: FabricRole[][] } {
  const gridData: FabricRole[][] = [];
  const roles: FabricRole[] = ['background', 'primary', 'secondary', 'accent'];
  
  for (let row = 0; row < gridSize; row++) {
    gridData[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const index = (row + col) % roles.length;
      gridData[row][col] = roles[index];
    }
  }
  
  return { gridSize, gridData };
}
