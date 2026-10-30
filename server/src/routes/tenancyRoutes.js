import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  requestTenancyLink,
  getTenantActiveRequests,
  cancelTenantRequest,
  getOwnerPendingRequests,
  acceptTenancyRequest,
  declineTenancyRequest,
  getTenantActiveRentals,
} from '../controllers/tenancyController.js';

const router = express.Router();
router.use(requireAuth);

// Tenant routes
router.post('/request-link', requestTenancyLink);
router.get('/my-requests', getTenantActiveRequests);
router.delete('/cancel-request/:id', cancelTenantRequest);
router.get('/my-rentals', getTenantActiveRentals);

// Owner routes
router.get('/pending-requests', getOwnerPendingRequests);
router.post('/:id/accept', acceptTenancyRequest);
router.post('/:id/decline', declineTenancyRequest);

export default router;