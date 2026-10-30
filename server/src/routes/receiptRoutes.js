import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
  getMyReceipts, 
  generateReceipt, 
  updateReceiptStatus,
  updateReceipt,
  deleteReceipt 
} from '../controllers/receiptController.js';

const router = Router();
router.use(requireAuth);

router.get('/', getMyReceipts);
router.post('/generate', generateReceipt);
router.patch('/:id/status', updateReceiptStatus);
router.put('/:id', updateReceipt);
router.delete('/:id', deleteReceipt);

export default router;