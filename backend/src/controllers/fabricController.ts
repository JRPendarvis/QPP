import { Request, Response } from 'express';
import { ResponseHelper } from '../utils/responseHelper';
import { FabricValidator } from '../validators/fabricValidator';
import { FabricInventoryService, FabricServiceError } from '../services/fabric/fabricInventoryService';

const fabricInventoryService = new FabricInventoryService();

function getUserId(req: Request): string | null {
  return req.user?.userId || null;
}

function handleControllerError(res: Response, error: unknown, fallbackMessage: string) {
  if (error instanceof FabricServiceError) {
    return ResponseHelper.error(res, error.statusCode, error.message);
  }

  console.error('[Fabric] controller error:', error);
  return ResponseHelper.serverError(res, fallbackMessage);
}

export async function listFabrics(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const data = await fabricInventoryService.listFabrics(userId);
    ResponseHelper.success(res, 200, 'Fabrics fetched', data);
  } catch (error) {
    handleControllerError(res, error, 'Failed to fetch fabrics');
  }
}

export async function getFabricById(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const fabric = await fabricInventoryService.getFabricById(userId, req.params.fabricId);
    ResponseHelper.success(res, 200, 'Fabric fetched', { fabric });
  } catch (error) {
    handleControllerError(res, error, 'Failed to fetch fabric');
  }
}

export async function createFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const payload = req.body;
    const validationError = FabricValidator.validateCreatePayload(payload);
    if (validationError) {
      ResponseHelper.validationError(res, validationError);
      return;
    }

    const { fabric, limit } = await fabricInventoryService.createFabric(userId, payload);
    ResponseHelper.success(res, 201, 'Fabric saved', { fabric, limit });
  } catch (error) {
    if (error instanceof FabricServiceError && error.statusCode === 403) {
      const userId = getUserId(req) as string;
      const current = await fabricInventoryService.listFabrics(userId);
      res.status(403).json({
        success: false,
        message: error.message,
        data: { limit: current.limit, used: current.used },
      });
      return;
    }

    handleControllerError(res, error, 'Failed to create fabric');
  }
}

export async function updateFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const payload = req.body;
    const validationError = FabricValidator.validateUpdatePayload(payload);
    if (validationError) {
      ResponseHelper.validationError(res, validationError);
      return;
    }

    const fabric = await fabricInventoryService.updateFabric(userId, req.params.fabricId, payload);
    ResponseHelper.success(res, 200, 'Fabric updated', { fabric });
  } catch (error) {
    handleControllerError(res, error, 'Failed to update fabric');
  }
}

export async function getFabricUsage(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const { fabric, usage } = await fabricInventoryService.getFabricUsage(userId, req.params.fabricId);
    ResponseHelper.success(res, 200, 'Fabric usage fetched', { fabric, usage });
  } catch (error) {
    handleControllerError(res, error, 'Failed to check fabric usage');
  }
}

export async function deleteFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const force = req.query.force === 'true';
    const { usage } = await fabricInventoryService.deleteFabric(userId, req.params.fabricId, force);
    ResponseHelper.success(res, 200, 'Fabric deleted', { usage });
  } catch (error) {
    if (error instanceof FabricServiceError && error.statusCode === 409) {
      const userId = getUserId(req) as string;
      const usageData = await fabricInventoryService.getFabricUsage(userId, req.params.fabricId);
      res.status(409).json({
        success: false,
        message: error.message,
        data: { usage: usageData.usage },
      });
      return;
    }

    handleControllerError(res, error, 'Failed to delete fabric');
  }
}

export async function checkQuiltAvailability(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const requirements = FabricValidator.normalizeRequirements((req.body as { requirements?: unknown }).requirements);
    if (requirements.length === 0) {
      ResponseHelper.validationError(res, 'requirements must be a non-empty array');
      return;
    }

    const data = await fabricInventoryService.checkQuiltAvailability(userId, requirements);
    ResponseHelper.success(res, 200, 'Availability checked', data);
  } catch (error) {
    handleControllerError(res, error, 'Failed to check quilt availability');
  }
}

export async function commitQuiltFabric(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req);
    if (!userId) {
      ResponseHelper.unauthorizedError(res, 'Unauthorized');
      return;
    }

    const body = req.body as { requirements?: unknown; mode?: unknown; quiltName?: unknown };
    const mode = body.mode === 'consume' ? 'consume' : 'reserve';
    const requirements = FabricValidator.normalizeRequirements(body.requirements);

    if (requirements.length === 0) {
      ResponseHelper.validationError(res, 'requirements must be a non-empty array');
      return;
    }

    const data = await fabricInventoryService.commitQuiltFabric(
      userId,
      requirements,
      mode,
      typeof body.quiltName === 'string' ? body.quiltName : undefined
    );

    ResponseHelper.success(
      res,
      200,
      mode === 'reserve' ? 'Fabric reserved for quilt' : 'Fabric consumed for quilt',
      data
    );
  } catch (error) {
    handleControllerError(res, error, 'Failed to commit quilt fabric usage');
  }
}
