import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  createBlockDesign,
  deleteBlockDesign,
  getBlockDesignById,
  listBlockDesigns,
  updateBlockDesign,
} from '../controllers/blockDesignController';

const router = Router();

router.use(authenticate);

router.get('/', listBlockDesigns);
router.get('/:designId', getBlockDesignById);
router.post('/', createBlockDesign);
router.put('/:designId', updateBlockDesign);
router.delete('/:designId', deleteBlockDesign);

export default router;
