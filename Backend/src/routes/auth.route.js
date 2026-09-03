import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { userValidationRules, validate } from '../middlewares/validate.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Signup Route (Normal User)[cite: 1]
router.post(
  '/signup',
  userValidationRules(),
  validate,
  AuthController.signup
);

// Login Route[cite: 1]
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  AuthController.login
);

export default router;