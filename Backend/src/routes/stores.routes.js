import {Router} from "express";
import StoreController from "../controllers/stores.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/role.middleware.js";
import { storeValidationRules, validate } from "../middlewares/validate.middleware.js";

const router = Router();

//apply jwt authentication middleware to all routes
router.use(authenticateToken);

//create store route
router.post('/', authorizeRoles('Store Owner'), storeValidationRules(), validate, StoreController.createStore);
router.post('/create-store', authorizeRoles('System Administrator'), storeValidationRules(), validate, StoreController.createStore);

//get all stores route
router.get('/', authorizeRoles('System Administrator', 'Normal User'), StoreController.getStores);
router.get('/all-stores', authorizeRoles('System Administrator','Normal User'), StoreController.getStores);

export default router;