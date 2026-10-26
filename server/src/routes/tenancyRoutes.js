import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createTenancy, claimTenancy } from '../controllers/tenancyController.js';

const router = Router();
router.use(requireAuth);

router.post('/', createTenancy);
router.post('/claim', createTenancy);

export default router;