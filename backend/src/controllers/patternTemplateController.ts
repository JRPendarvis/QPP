import { Request, Response } from 'express';
import patterns from '../config/patterns';
import { FabricRole } from '../types/QuiltPattern';

/**
 * Get list of available pattern templates for block design
 */
export const getPatternTemplates = async (req: Request, res: Response) => {
  try {
    const templates = Object.entries(patterns)
      .filter(([_, pattern]) => pattern.status !== 'incomplete')
      .map(([id, pattern]) => ({
        id,
        name: pattern.name,
        blockSize: pattern.blockSize || 9, // Default to 9 for 3x3
        skillLevel: pattern.skillLevels?.[0] || 'beginner',
        minFabrics: pattern.minFabrics,
        maxFabrics: pattern.maxFabrics,
      }))
      .sort((a, b) => a.blockSize - b.blockSize);

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
    const pattern = patterns[patternId];

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: 'Pattern not found',
      });
    }

    if (pattern.status === 'incomplete') {
      return res.status(400).json({
        success: false,
        message: 'This pattern is not yet available',
      });
    }

    // Generate a sample block based on the pattern structure
    const blockSize = pattern.blockSize || 9;
    const gridSize = Math.sqrt(blockSize);

    if (!Number.isInteger(gridSize)) {
      return res.status(400).json({
        success: false,
        message: 'This pattern does not have a square block structure',
      });
    }

    // Create a basic template grid using the pattern's fabric roles
    const gridData: FabricRole[][] = generateTemplateGrid(pattern, gridSize);

    res.json({
      success: true,
      data: {
        patternId,
        patternName: pattern.name,
        blockSize,
        gridSize,
        gridData,
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
 * Generate a template grid based on pattern structure
 */
function generateTemplateGrid(pattern: any, gridSize: number): FabricRole[][] {
  const grid: FabricRole[][] = [];

  // Common pattern structures
  if (pattern.id === 'nine-patch' || gridSize === 3) {
    // Nine Patch: checkerboard pattern
    // background at corners and center, primary at cross
    grid.push(['background', 'primary', 'background']);
    grid.push(['primary', 'background', 'primary']);
    grid.push(['background', 'primary', 'background']);
  } else if (pattern.id === 'four-patch' || gridSize === 2) {
    // Four Patch: diagonal or alternating
    grid.push(['background', 'primary']);
    grid.push(['primary', 'background']);
  } else if (gridSize === 4) {
    // 4x4 grid - create a balanced pattern
    grid.push(['background', 'primary', 'primary', 'background']);
    grid.push(['primary', 'secondary', 'secondary', 'primary']);
    grid.push(['primary', 'secondary', 'secondary', 'primary']);
    grid.push(['background', 'primary', 'primary', 'background']);
  } else if (gridSize === 5) {
    // 5x5 grid - create a star or medallion pattern
    grid.push(['background', 'background', 'primary', 'background', 'background']);
    grid.push(['background', 'primary', 'secondary', 'primary', 'background']);
    grid.push(['primary', 'secondary', 'accent', 'secondary', 'primary']);
    grid.push(['background', 'primary', 'secondary', 'primary', 'background']);
    grid.push(['background', 'background', 'primary', 'background', 'background']);
  } else {
    // Default: simple checkerboard for any size
    for (let row = 0; row < gridSize; row++) {
      const rowData: FabricRole[] = [];
      for (let col = 0; col < gridSize; col++) {
        rowData.push((row + col) % 2 === 0 ? 'background' : 'primary');
      }
      grid.push(rowData);
    }
  }

  return grid;
}
