import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyProperties, createProperty } from '../controllers/propertyController.js'

const router = Router();
router.use(requireAuth);

router.get('/', getMyProperties);
router.post('/', createProperty);

export default router;