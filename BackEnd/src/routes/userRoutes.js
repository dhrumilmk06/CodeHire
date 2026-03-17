import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication via protectRoute
router.use(protectRoute);

router.patch('/role', userController.updateUserRole);
router.get('/me', userController.getCurrentUser);
router.get('/participants/:userId/sessions', userController.getParticipantSessions);

export default router;
