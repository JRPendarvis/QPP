import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CustomBlockPatternRequest {
  userId: string;
  blockId: string;
  quiltWidth: number; // Number of blocks wide
  quiltHeight: number; // Number of blocks tall
  fabricAssignments: {
    background?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface BlockPlacement {
  row: number;
  col: number;
  rotation: number; // 0, 90, 180, 270
}

export class CustomBlockPatternService {
  /**
   * Generate a quilt pattern from a custom block
   */
  async generatePattern(request: CustomBlockPatternRequest) {
    // Get the custom block
    const block = await prisma.customBlock.findFirst({
      where: {
        id: request.blockId,
        userId: request.userId,
      },
    });

    if (!block) {
      throw new Error('Block not found or access denied');
    }

    const gridSize = Math.sqrt(block.blockSize);
    const gridData = block.gridData as any[][];

    // Build the quilt layout
    const quiltLayout = this.buildQuiltLayout(
      gridData,
      request.quiltWidth,
      request.quiltHeight
    );

    // Generate pattern instructions
    const instructions = this.generateInstructions(
      block.name,
      gridData,
      request.quiltWidth,
      request.quiltHeight,
      request.fabricAssignments
    );

    // Create pattern data structure
    const patternData = {
      type: 'custom_block',
      blockName: block.name,
      blockId: block.id,
      blockSize: `${gridSize}x${gridSize}`,
      quiltSize: {
        blocksWide: request.quiltWidth,
        blocksHigh: request.quiltHeight,
        totalBlocks: request.quiltWidth * request.quiltHeight,
      },
      gridData: block.gridData,
      quiltLayout,
      fabricAssignments: request.fabricAssignments,
      instructions,
      createdAt: new Date().toISOString(),
    };

    // Save the pattern
    const pattern = await prisma.pattern.create({
      data: {
        userId: request.userId,
        patternType: 'custom_block',
        patternName: `${block.name} Quilt`,
        patternData: patternData as any,
        fabricColors: request.fabricAssignments as any,
      },
    });

    return {
      pattern,
      patternData,
    };
  }

  /**
   * Build the quilt layout by repeating the block
   */
  private buildQuiltLayout(
    blockGrid: any[][],
    blocksWide: number,
    blocksHigh: number
  ): any[][] {
    const gridSize = blockGrid.length;
    const totalRows = blocksHigh * gridSize;
    const totalCols = blocksWide * gridSize;

    const quiltLayout: any[][] = [];

    for (let row = 0; row < totalRows; row++) {
      const quiltRow: any[] = [];
      for (let col = 0; col < totalCols; col++) {
        // Determine which block and which cell within that block
        const blockRow = Math.floor(row / gridSize);
        const blockCol = Math.floor(col / gridSize);
        const cellRow = row % gridSize;
        const cellCol = col % gridSize;

        // Get the fabric role from the original block
        const fabricRole = blockGrid[cellRow][cellCol];
        quiltRow.push(fabricRole);
      }
      quiltLayout.push(quiltRow);
    }

    return quiltLayout;
  }

  /**
   * Generate cutting and assembly instructions
   */
  private generateInstructions(
    blockName: string,
    gridData: any[][],
    blocksWide: number,
    blocksHigh: number,
    fabricAssignments: any
  ): any {
    const gridSize = gridData.length;
    const totalBlocks = blocksWide * blocksHigh;

    // Count fabric pieces needed
    const fabricCounts: Record<string, number> = {};
    for (const row of gridData) {
      for (const cell of row) {
        if (cell) {
          fabricCounts[cell] = (fabricCounts[cell] || 0) + 1;
        }
      }
    }

    // Calculate total pieces needed for entire quilt
    const totalPieces: Record<string, number> = {};
    for (const [role, count] of Object.entries(fabricCounts)) {
      totalPieces[role] = count * totalBlocks;
    }

    // Assume 2.5" finished squares (common quilt block size)
    const squareSize = 2.5;
    const blockFinishedSize = squareSize * gridSize;

    return {
      blockName,
      blockSize: `${blockFinishedSize}" x ${blockFinishedSize}" (finished)`,
      gridSize: `${gridSize}x${gridSize}`,
      blocksToMake: totalBlocks,
      quiltDimensions: {
        width: `${blockFinishedSize * blocksWide}"`,
        height: `${blockFinishedSize * blocksHigh}"`,
      },
      cutting: Object.entries(totalPieces).map(([role, count]) => ({
        fabric: fabricAssignments[role] || role,
        role,
        squares: `${count} squares at ${squareSize + 0.5}" x ${squareSize + 0.5}" (includes seam allowance)`,
      })),
      assembly: [
        `1. Cut all fabric pieces as listed above`,
        `2. For each ${blockName} block:`,
        `   - Arrange pieces in ${gridSize}x${gridSize} grid following the block pattern`,
        `   - Sew pieces into rows`,
        `   - Press seams`,
        `   - Sew rows together`,
        `3. Repeat to make ${totalBlocks} total blocks`,
        `4. Arrange blocks in ${blocksHigh} rows of ${blocksWide} blocks each`,
        `5. Sew blocks into rows`,
        `6. Sew rows together to complete quilt top`,
        `7. Layer, quilt, and bind as desired`,
      ],
    };
  }

  /**
   * Get available custom blocks for pattern generation
   */
  async getUserBlocksForPatternGeneration(userId: string) {
    const blocks = await prisma.customBlock.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        blockSize: true,
        thumbnail: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return blocks;
  }
}
