import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBlockDTO {
  userId: string;
  name: string;
  description?: string;
  blockSize: number;
  gridData: any[][];
  thumbnail?: string;
}

export interface UpdateBlockDTO {
  name?: string;
  description?: string;
  gridData?: any[][];
  thumbnail?: string;
  isPublic?: boolean;
}

export class CustomBlockService {
  /**
   * Create a new custom block design
   */
  async createBlock(data: CreateBlockDTO) {
    const block = await prisma.customBlock.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        blockSize: data.blockSize,
        gridData: data.gridData,
        thumbnail: data.thumbnail,
      },
    });

    return block;
  }

  /**
   * Get all blocks for a user
   */
  async getUserBlocks(userId: string) {
    const blocks = await prisma.customBlock.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return blocks;
  }

  /**
   * Get a specific block by ID
   */
  async getBlockById(blockId: string, userId: string) {
    const block = await prisma.customBlock.findFirst({
      where: {
        id: blockId,
        userId, // Ensure user owns the block
      },
    });

    if (!block) {
      throw new Error('Block not found or access denied');
    }

    return block;
  }

  /**
   * Update a block design
   */
  async updateBlock(blockId: string, userId: string, updates: UpdateBlockDTO) {
    // Verify ownership
    await this.getBlockById(blockId, userId);

    const updatedBlock = await prisma.customBlock.update({
      where: { id: blockId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    return updatedBlock;
  }

  /**
   * Delete a block
   */
  async deleteBlock(blockId: string, userId: string) {
    // Verify ownership
    await this.getBlockById(blockId, userId);

    await prisma.customBlock.delete({
      where: { id: blockId },
    });

    return { success: true };
  }

  /**
   * Get count of blocks for a user (for limits)
   */
  async getBlockCount(userId: string): Promise<number> {
    const count = await prisma.customBlock.count({
      where: { userId },
    });

    return count;
  }

  /**
   * Check if user can create more blocks (based on subscription tier)
   */
  async canCreateBlock(userId: string): Promise<{ allowed: boolean; reason?: string; currentCount: number; limit: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentCount = await this.getBlockCount(userId);

    // Block limits per tier
    const limits: Record<string, number> = {
      free: 5,
      basic: 10,
      intermediate: 25,
      advanced: 100,
      staff: Infinity,
    };

    const limit = limits[user.subscriptionTier] || limits.free;

    if (currentCount >= limit) {
      return {
        allowed: false,
        reason: `You have reached the maximum of ${limit} custom blocks for your ${user.subscriptionTier} plan. Upgrade to create more blocks.`,
        currentCount,
        limit,
      };
    }

    return {
      allowed: true,
      currentCount,
      limit,
    };
  }
}
