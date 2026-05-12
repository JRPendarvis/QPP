import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SaveBlockDesignBody {
  name?: string;
  patternId?: string;
  patternName?: string;
  globalRotation?: number;
  fabrics?: unknown;
  regions?: unknown;
}

function validatePayload(body: SaveBlockDesignBody): string | null {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 1) {
    return 'Design name is required';
  }

  if (!body.patternId || typeof body.patternId !== 'string') {
    return 'Pattern id is required';
  }

  if (!body.patternName || typeof body.patternName !== 'string') {
    return 'Pattern name is required';
  }

  if (!Array.isArray(body.fabrics)) {
    return 'Fabrics must be an array';
  }

  if (!Array.isArray(body.regions)) {
    return 'Regions must be an array';
  }

  return null;
}

export async function listBlockDesigns(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const designs = await prisma.blockDesign.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        patternId: true,
        patternName: true,
        globalRotation: true,
        fabrics: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: { designs } });
  } catch (error) {
    console.error('[BlockDesign] list error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch block designs' });
  }
}

export async function getBlockDesignById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const designId = req.params.designId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const design = await prisma.blockDesign.findFirst({
      where: { id: designId, userId },
    });

    if (!design) {
      res.status(404).json({ success: false, message: 'Block design not found' });
      return;
    }

    res.json({ success: true, data: { design } });
  } catch (error) {
    console.error('[BlockDesign] get by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch block design' });
  }
}

export async function createBlockDesign(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const body = req.body as SaveBlockDesignBody;
    const validation = validatePayload(body);
    if (validation) {
      res.status(400).json({ success: false, message: validation });
      return;
    }

    const design = await prisma.blockDesign.create({
      data: {
        userId,
        name: body.name!.trim(),
        patternId: body.patternId!,
        patternName: body.patternName!,
        globalRotation: body.globalRotation ?? 0,
        fabrics: body.fabrics as object,
        regions: body.regions as object,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Block design saved',
      data: { design },
    });
  } catch (error) {
    console.error('[BlockDesign] create error:', error);
    res.status(500).json({ success: false, message: 'Failed to save block design' });
  }
}

export async function updateBlockDesign(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const designId = req.params.designId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existing = await prisma.blockDesign.findFirst({
      where: { id: designId, userId },
      select: { id: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Block design not found' });
      return;
    }

    const body = req.body as SaveBlockDesignBody;
    const validation = validatePayload(body);
    if (validation) {
      res.status(400).json({ success: false, message: validation });
      return;
    }

    const design = await prisma.blockDesign.update({
      where: { id: designId },
      data: {
        name: body.name!.trim(),
        patternId: body.patternId!,
        patternName: body.patternName!,
        globalRotation: body.globalRotation ?? 0,
        fabrics: body.fabrics as object,
        regions: body.regions as object,
      },
    });

    res.json({
      success: true,
      message: 'Block design updated',
      data: { design },
    });
  } catch (error) {
    console.error('[BlockDesign] update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update block design' });
  }
}

export async function deleteBlockDesign(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const designId = req.params.designId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await prisma.blockDesign.deleteMany({
      where: { id: designId, userId },
    });

    if (result.count === 0) {
      res.status(404).json({ success: false, message: 'Block design not found' });
      return;
    }

    res.json({ success: true, message: 'Block design deleted' });
  } catch (error) {
    console.error('[BlockDesign] delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete block design' });
  }
}
