import {Router} from 'express';
import UserController from '../controllers/users.controller.js';
import {authenticateToken} from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/role.middleware.js';

import {userValidationRules, validate , updatePasswordValidationRules} from '../middlewares/validate.middleware.js';

const router = Router();

//apply jwt authentication middleware to all routes
router.use(authenticateToken);

//update password route 
router.put('/update-password', updatePasswordValidationRules(), validate, UserController.updatePassword);
router.patch('/update-password', updatePasswordValidationRules(), validate, UserController.updatePassword);

//create user by system administrator route
router.post('/', authorizeRoles('System Administrator'), userValidationRules(), validate, UserController.createuser);
router.post('/create-user', authorizeRoles('System Administrator'), userValidationRules(), validate, UserController.createuser);

//sysytem administrator can get all users
router.get('/', authorizeRoles('System Administrator'), UserController.getUsers);
router.get('/all-users',authorizeRoles('System Administrator'),UserController.getUsers);

//get user by id route
router.get('/:id',authorizeRoles('System Administrator'), UserController.getUserById);

export default router;