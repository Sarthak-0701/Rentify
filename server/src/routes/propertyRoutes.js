import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyProperties, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js'

const router = Router();
router.use(requireAuth);

router.get('/', getMyProperties);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;