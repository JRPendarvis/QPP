import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UsageSummary = {
  usedInBlockDesigns: number;
  usedInSavedQuilts: number;
  blockDesignNames: string[];
  quiltNames: string[];
};

type FabricRequirement = {
  fabricId: string;
  requiredYardage: number;
};

function getFabricLimit(subscriptionTier?: string): number {
  return subscriptionTier === 'free' || !subscriptionTier ? 3 : 10;
}

function normalizeRequirements(input: unknown): FabricRequirement[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const data = item as { fabricId?: unknown; requiredYardage?: unknown };
      if (typeof data.fabricId !== 'string') return null;
      const requiredYardage = Number(data.requiredYardage);
      if (!Number.isFinite(requiredYardage) || requiredYardage < 0) return null;
      return {
        fabricId: data.fabricId,
        requiredYardage,
      };
    })
    .filter((item): item is FabricRequirement => Boolean(item));
}

function extractLinkedFabricIds(fabricsJson: unknown): string[] {
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
      // Likely a persisted cuid; this keeps backward compatibility if id is reused.
      ids.push(value.id);
    }
  });

  return ids;
}

async function buildUsageSummary(userId: string, fabricId: string): Promise<UsageSummary> {
  const [blockDesigns, savedQuilts] = await Promise.all([
    prisma.blockDesign.findMany({
      where: { userId },
      select: { name: true, fabrics: true },
    }),
    prisma.pattern.findMany({
      where: { userId },
      select: { patternName: true, patternType: true, patternData: true },
      take: 200,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const blockDesignNames = blockDesigns
    .filter((design) => extractLinkedFabricIds(design.fabrics).includes(fabricId))
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

export async function listFabrics(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const fabrics = await prisma.fabric.findMany({
      where: { userId, archivedAt: null },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: { fabrics } });
  } catch (error) {
    console.error('[Fabric] list error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fabrics' });
  }
}

export async function getFabricById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const fabricId = req.params.fabricId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const fabric = await prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
    });

    if (!fabric) {
      res.status(404).json({ success: false, message: 'Fabric not found' });
      return;
    }

    res.json({ success: true, data: { fabric } });
  } catch (error) {
    console.error('[Fabric] get by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fabric' });
  }
}

export async function createFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    });

    const limit = getFabricLimit(user?.subscriptionTier);

    const existingCount = await prisma.fabric.count({
      where: { userId, archivedAt: null },
    });

    if (existingCount >= limit) {
      res.status(403).json({
        success: false,
        message: `Fabric limit reached (${limit}). Upgrade to save more fabrics.`,
        data: { limit, used: existingCount },
      });
      return;
    }

    const body = req.body as {
      name?: string;
      color?: string;
      imageUrl?: string;
      type?: string;
      notes?: string;
      tags?: unknown;
      yardageAvailable?: number;
    };

    if (!body.name || typeof body.name !== 'string') {
      res.status(400).json({ success: false, message: 'Fabric name is required' });
      return;
    }

    if (!body.color || typeof body.color !== 'string') {
      res.status(400).json({ success: false, message: 'Fabric color is required' });
      return;
    }

    const yardageAvailable = Number(body.yardageAvailable ?? 0);
    if (!Number.isFinite(yardageAvailable) || yardageAvailable < 0) {
      res.status(400).json({ success: false, message: 'Yardage must be a non-negative number' });
      return;
    }

    const fabric = await prisma.fabric.create({
      data: {
        userId,
        name: body.name.trim(),
        color: body.color,
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : null,
        type: typeof body.type === 'string' ? body.type : null,
        notes: typeof body.notes === 'string' ? body.notes : null,
        tags:
          body.tags === undefined
            ? undefined
            : body.tags === null
              ? Prisma.JsonNull
              : (body.tags as Prisma.InputJsonValue),
        yardageAvailable,
      },
    });

    res.status(201).json({ success: true, message: 'Fabric saved', data: { fabric, limit } });
  } catch (error) {
    console.error('[Fabric] create error:', error);
    res.status(500).json({ success: false, message: 'Failed to create fabric' });
  }
}

export async function updateFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const fabricId = req.params.fabricId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existing = await prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
      select: { id: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Fabric not found' });
      return;
    }

    const body = req.body as {
      name?: string;
      color?: string;
      imageUrl?: string | null;
      type?: string | null;
      notes?: string | null;
      tags?: unknown;
      yardageAvailable?: number;
      yardageReserved?: number;
    };

    const data: Record<string, unknown> = {};

    if (typeof body.name === 'string') data.name = body.name.trim();
    if (typeof body.color === 'string') data.color = body.color;
    if (typeof body.imageUrl === 'string' || body.imageUrl === null) data.imageUrl = body.imageUrl;
    if (typeof body.type === 'string' || body.type === null) data.type = body.type;
    if (typeof body.notes === 'string' || body.notes === null) data.notes = body.notes;
    if (body.tags !== undefined) {
      data.tags = body.tags === null ? Prisma.JsonNull : (body.tags as Prisma.InputJsonValue);
    }

    if (body.yardageAvailable !== undefined) {
      const value = Number(body.yardageAvailable);
      if (!Number.isFinite(value) || value < 0) {
        res.status(400).json({ success: false, message: 'Yardage must be a non-negative number' });
        return;
      }
      data.yardageAvailable = value;
    }

    if (body.yardageReserved !== undefined) {
      const value = Number(body.yardageReserved);
      if (!Number.isFinite(value) || value < 0) {
        res.status(400).json({ success: false, message: 'Reserved yardage must be a non-negative number' });
        return;
      }
      data.yardageReserved = value;
    }

    const fabric = await prisma.fabric.update({
      where: { id: fabricId },
      data,
    });

    res.json({ success: true, message: 'Fabric updated', data: { fabric } });
  } catch (error) {
    console.error('[Fabric] update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update fabric' });
  }
}

export async function getFabricUsage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const fabricId = req.params.fabricId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const fabric = await prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
      select: { id: true, name: true },
    });

    if (!fabric) {
      res.status(404).json({ success: false, message: 'Fabric not found' });
      return;
    }

    const usage = await buildUsageSummary(userId, fabricId);

    res.json({ success: true, data: { fabric, usage } });
  } catch (error) {
    console.error('[Fabric] usage error:', error);
    res.status(500).json({ success: false, message: 'Failed to check fabric usage' });
  }
}

export async function deleteFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const fabricId = req.params.fabricId;
    const force = req.query.force === 'true';

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existing = await prisma.fabric.findFirst({
      where: { id: fabricId, userId, archivedAt: null },
      select: { id: true, name: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Fabric not found' });
      return;
    }

    const usage = await buildUsageSummary(userId, fabricId);
    const totalUsage = usage.usedInBlockDesigns + usage.usedInSavedQuilts;

    if (!force && totalUsage > 0) {
      res.status(409).json({
        success: false,
        message: 'Fabric is used in saved blocks or quilts',
        data: { usage },
      });
      return;
    }

    await prisma.fabric.update({
      where: { id: fabricId },
      data: { archivedAt: new Date() },
    });

    res.json({ success: true, message: 'Fabric deleted', data: { usage } });
  } catch (error) {
    console.error('[Fabric] delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete fabric' });
  }
}

export async function checkQuiltAvailability(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const requirements = normalizeRequirements((req.body as { requirements?: unknown }).requirements);
    if (requirements.length === 0) {
      res.status(400).json({ success: false, message: 'requirements must be a non-empty array' });
      return;
    }

    const fabricIds = requirements.map((item) => item.fabricId);
    const fabrics = await prisma.fabric.findMany({
      where: { userId, archivedAt: null, id: { in: fabricIds } },
      select: { id: true, name: true, yardageAvailable: true, yardageReserved: true },
    });

    const byId = new Map(fabrics.map((f) => [f.id, f]));

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

    res.json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    console.error('[Fabric] availability error:', error);
    res.status(500).json({ success: false, message: 'Failed to check quilt availability' });
  }
}

export async function commitQuiltFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const body = req.body as { requirements?: unknown; mode?: unknown; quiltName?: unknown };
    const mode = body.mode === 'consume' ? 'consume' : 'reserve';
    const requirements = normalizeRequirements(body.requirements);

    if (requirements.length === 0) {
      res.status(400).json({ success: false, message: 'requirements must be a non-empty array' });
      return;
    }

    const fabricIds = requirements.map((item) => item.fabricId);

    const result = await prisma.$transaction(async (tx) => {
      const fabrics = await tx.fabric.findMany({
        where: { userId, archivedAt: null, id: { in: fabricIds } },
      });

      const byId = new Map(fabrics.map((f) => [f.id, f]));

      for (const requirement of requirements) {
        const fabric = byId.get(requirement.fabricId);
        if (!fabric) {
          throw new Error(`Fabric not found: ${requirement.fabricId}`);
        }

        const effectiveAvailable = Math.max(0, fabric.yardageAvailable - fabric.yardageReserved);
        if (effectiveAvailable < requirement.requiredYardage) {
          throw new Error(`Not enough fabric for ${fabric.name}`);
        }

        if (mode === 'reserve') {
          await tx.fabric.update({
            where: { id: fabric.id },
            data: { yardageReserved: fabric.yardageReserved + requirement.requiredYardage },
          });
        } else {
          await tx.fabric.update({
            where: { id: fabric.id },
            data: { yardageAvailable: fabric.yardageAvailable - requirement.requiredYardage },
          });
        }
      }

      return { updatedCount: requirements.length };
    });

    res.json({
      success: true,
      message: mode === 'reserve' ? 'Fabric reserved for quilt' : 'Fabric consumed for quilt',
      data: {
        mode,
        quiltName: typeof body.quiltName === 'string' ? body.quiltName : null,
        updatedCount: result.updatedCount,
      },
    });
  } catch (error) {
    console.error('[Fabric] commit error:', error);
    res.status(409).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to commit quilt fabric',
    });
  }
}
