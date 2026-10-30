import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createRoom, getRoomById, updateRoom, deleteRoom } from '../controllers/roomController.js';
const router = Router();
router.use(requireAuth);

router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;