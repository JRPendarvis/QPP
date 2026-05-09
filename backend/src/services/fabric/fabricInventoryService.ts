import { Prisma, PrismaClient } from '@prisma/client';
import { FabricRequirement, CreateFabricPayload, UpdateFabricPayload } from '../../validators/fabricValidator';

export type UsageSummary = {
  usedInBlockDesigns: number;
  usedInSavedQuilts: number;
  blockDesignNames: string[];
  quiltNames: string[];
};

export class FabricServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class FabricInventoryService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  private getFabricLimit(subscriptionTier?: string): number {
    return subscriptionTier === 'free' || !subscriptionTier ? 3 : 10;
  }

  private extractLinkedFabricIds(fabricsJson: unknown): string[] {
    if (!Array.isArray(fabricsJson)) return [];

    const ids: string[] = [];
    fabricsJson.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;

      const value = entry as { id?: unknown; libraryFabricId?: unknown };
      if (typeof value.libraryFabricId === 'string') {
        ids.push(value.libraryFabricId);
        return;
      }

      if (typeof value.id === 'string' && value.id.startsWith('c')) {
        ids.push(value.id);
      }
    });

    return ids;
  }

  async listFabrics(userId: string) {
    return this.prisma.fabric.findMany({
      where: { userId, archivedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getFabricById(userId: string, fabricId: string) {
    const fabric = await this.prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
    });

    if (!fabric) {
      throw new FabricServiceError('Fabric not found', 404);
    }

    return fabric;
  }

  async createFabric(userId: string, payload: CreateFabricPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    });

    const limit = this.getFabricLimit(user?.subscriptionTier);

    const existingCount = await this.prisma.fabric.count({
      where: { userId, archivedAt: null },
    });

    if (existingCount >= limit) {
      throw new FabricServiceError(`Fabric limit reached (${limit}). Upgrade to save more fabrics.`, 403);
    }

    const fabric = await this.prisma.fabric.create({
      data: {
        userId,
        name: payload.name!.trim(),
        color: payload.color!,
        imageUrl: typeof payload.imageUrl === 'string' ? payload.imageUrl : null,
        type: typeof payload.type === 'string' ? payload.type : null,
        notes: typeof payload.notes === 'string' ? payload.notes : null,
        tags:
          payload.tags === undefined
            ? undefined
            : payload.tags === null
              ? Prisma.JsonNull
              : (payload.tags as Prisma.InputJsonValue),
        yardageAvailable: Number(payload.yardageAvailable ?? 0),
      },
    });

    return { fabric, limit };
  }

  async updateFabric(userId: string, fabricId: string, payload: UpdateFabricPayload) {
    const existing = await this.prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw new FabricServiceError('Fabric not found', 404);
    }

    const data: Record<string, unknown> = {};

    if (typeof payload.name === 'string') data.name = payload.name.trim();
    if (typeof payload.color === 'string') data.color = payload.color;
    if (typeof payload.imageUrl === 'string' || payload.imageUrl === null) data.imageUrl = payload.imageUrl;
    if (typeof payload.type === 'string' || payload.type === null) data.type = payload.type;
    if (typeof payload.notes === 'string' || payload.notes === null) data.notes = payload.notes;

    if (payload.tags !== undefined) {
      data.tags = payload.tags === null ? Prisma.JsonNull : (payload.tags as Prisma.InputJsonValue);
    }

    if (payload.yardageAvailable !== undefined) {
      data.yardageAvailable = Number(payload.yardageAvailable);
    }

    if (payload.yardageReserved !== undefined) {
      data.yardageReserved = Number(payload.yardageReserved);
    }

    return this.prisma.fabric.update({
      where: { id: fabricId },
      data,
    });
  }

  async buildUsageSummary(userId: string, fabricId: string): Promise<UsageSummary> {
    const [blockDesigns, savedQuilts] = await Promise.all([
      this.prisma.blockDesign.findMany({
        where: { userId },
        select: { name: true, fabrics: true },
      }),
      this.prisma.pattern.findMany({
        where: { userId },
        select: { patternName: true, patternType: true, patternData: true },
        take: 200,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const blockDesignNames = blockDesigns
      .filter((design) => this.extractLinkedFabricIds(design.fabrics).includes(fabricId))
      .map((design) => design.name)
      .slice(0, 10);

    const quiltNames = savedQuilts
      .filter((pattern) => JSON.stringify(pattern.patternData).includes(fabricId))
      .map((pattern) => pattern.patternName || pattern.patternType || 'Untitled Quilt')
      .slice(0, 10);

    return {
      usedInBlockDesigns: blockDesignNames.length,
      usedInSavedQuilts: quiltNames.length,
      blockDesignNames,
      quiltNames,
    };
  }

  async getFabricUsage(userId: string, fabricId: string) {
    const fabric = await this.prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
      select: { id: true, name: true },
    });

    if (!fabric) {
      throw new FabricServiceError('Fabric not found', 404);
    }

    const usage = await this.buildUsageSummary(userId, fabricId);
    return { fabric, usage };
  }

  async deleteFabric(userId: string, fabricId: string, force: boolean) {
    const existing = await this.prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
      select: { id: true, name: true },
    });

    if (!existing) {
      throw new FabricServiceError('Fabric not found', 404);
    }

    const usage = await this.buildUsageSummary(userId, fabricId);
    const totalUsage = usage.usedInBlockDesigns + usage.usedInSavedQuilts;

    if (!force && totalUsage > 0) {
      throw new FabricServiceError('Fabric is used in saved blocks or quilts', 409);
    }

    await this.prisma.fabric.update({
      where: { id: fabricId },
      data: { archivedAt: new Date() },
    });

    return { usage };
  }

  async checkQuiltAvailability(userId: string, requirements: FabricRequirement[]) {
    const fabricIds = requirements.map((item) => item.fabricId);

    const fabrics = await this.prisma.fabric.findMany({
      where: { userId, archivedAt: null, id: { in: fabricIds } },
      select: { id: true, name: true, yardageAvailable: true, yardageReserved: true },
    });

    const byId = new Map(fabrics.map((fabric) => [fabric.id, fabric]));

    const breakdown = requirements.map((item) => {
      const fabric = byId.get(item.fabricId);
      const available = fabric ? Math.max(0, fabric.yardageAvailable - fabric.yardageReserved) : 0;
      const shortage = Math.max(0, item.requiredYardage - available);

      return {
        fabricId: item.fabricId,
        name: fabric?.name || 'Unknown Fabric',
        requiredYardage: item.requiredYardage,
        availableYardage: available,
        shortageYardage: shortage,
      };
    });

    const totalRequired = breakdown.reduce((sum, item) => sum + item.requiredYardage, 0);
    const totalAvailable = breakdown.reduce((sum, item) => sum + item.availableYardage, 0);
    const totalShortage = breakdown.reduce((sum, item) => sum + item.shortageYardage, 0);

    const hasShortage = totalShortage > 0;

    return {
      hasShortage,
      statement: hasShortage
        ? "You don't have enough fabric to make this quilt."
        : 'You have enough fabric to make this quilt.',
      summary: {
        totalRequired,
        totalAvailable,
        totalShortage,
      },
      breakdown,
    };
  }

  async commitQuiltFabric(
    userId: string,
    requirements: FabricRequirement[],
    mode: 'reserve' | 'consume',
    quiltName?: string
  ) {
    const fabricIds = requirements.map((item) => item.fabricId);

    const result = await this.prisma.$transaction(async (tx) => {
      const fabrics = await tx.fabric.findMany({
        where: { userId, archivedAt: null, id: { in: fabricIds } },
      });

      const byId = new Map(fabrics.map((fabric) => [fabric.id, fabric]));

      for (const requirement of requirements) {
        const fabric = byId.get(requirement.fabricId);
        if (!fabric) {
          throw new FabricServiceError(`Fabric not found: ${requirement.fabricId}`, 409);
        }

        const effectiveAvailable = Math.max(0, fabric.yardageAvailable - fabric.yardageReserved);
        if (effectiveAvailable < requirement.requiredYardage) {
          throw new FabricServiceError(`Not enough fabric for ${fabric.name}`, 409);
        }

        if (mode === 'reserve') {
          await tx.fabric.update({
            where: { id: fabric.id },
            data: { yardageReserved: fabric.yardageReserved + requirement.requiredYardage },
          });
          continue;
        }

        await tx.fabric.update({
          where: { id: fabric.id },
          data: { yardageAvailable: fabric.yardageAvailable - requirement.requiredYardage },
        });
      }

      return { updatedCount: requirements.length };
    });

    return {
      mode,
      quiltName: typeof quiltName === 'string' ? quiltName : null,
      updatedCount: result.updatedCount,
    };
  }
}
