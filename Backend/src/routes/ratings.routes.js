import { Router } from 'express';
import RatingsController from '../controllers/rating.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { ratingValidationRules, validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authenticateToken);

// Normal User: Submit or edit rating[cite: 1]
router.post(
  '/',
  authorizeRoles('Normal User'),
  ratingValidationRules(),
  validate,
  RatingsController.submitRating
);

// Store Owner Dashboard[cite: 1]
router.get(
  '/owner-dashboard',
  authorizeRoles('Store Owner'),
  RatingsController.getStoreOwnerDashboard
);

// Admin Dashboard Stats[cite: 1]
router.get(
  '/admin-dashboard',
  authorizeRoles('System Administrator'),
  RatingsController.getAdminDashboardMetrics
);

export default router;