import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  checkQuiltAvailability,
  commitQuiltFabric,
  createFabric,
  deleteFabric,
  getFabricById,
  getFabricUsage,
  listFabrics,
  updateFabric,
} from '../controllers/fabricController';

const router = Router();

router.use(authenticate);

router.get('/', listFabrics);
router.post('/', createFabric);
router.get('/:fabricId', getFabricById);
router.put('/:fabricId', updateFabric);
router.get('/:fabricId/usage', getFabricUsage);
router.delete('/:fabricId', deleteFabric);

router.post('/check-availability/quilt', checkQuiltAvailability);
router.post('/commit-quilt', commitQuiltFabric);

export default router;
