import { PrismaClient } from '@prisma/client';

/**
 * Repository for user usage reset database operations
 */
export class UserUsageRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Find users who need usage reset based on cutoff date
   */
  async findUsersNeedingReset(cutoffDate: Date) {
    return this.prisma.user.findMany({
      where: {
        lastResetDate: {
          lte: cutoffDate,
        },
      },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        generationsThisMonth: true,
        downloadsThisMonth: true,
      },
    });
  }

  /**
   * Update user with reset data
   */
  async updateUserUsage(
    userId: string,
    resetData: {
      generationsThisMonth: number;
      downloadsThisMonth?: number;
      lastResetDate: Date;
    }
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: resetData,
    });
  }

  /**
   * Count users needing reset based on cutoff date
   */
  async countUsersNeedingReset(cutoffDate: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        lastResetDate: {
          lte: cutoffDate,
        },
      },
    });
  }

  /**
   * Find the next user who will need a reset
   */
  async findNextUserToReset(afterDate: Date) {
    return this.prisma.user.findFirst({
      where: {
        lastResetDate: {
          gt: afterDate,
        },
      },
      orderBy: {
        lastResetDate: 'asc',
      },
      select: {
        lastResetDate: true,
      },
    });
  }
}
