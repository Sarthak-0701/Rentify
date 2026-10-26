import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyReceipts, generateReceipt } from '../controllers/receiptController.js';

const router = Router();
router.use(requireAuth);

router.get('/', getMyReceipts);
router.post('/generate', generateReceipt);

export default router;