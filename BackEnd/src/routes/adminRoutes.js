import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Admin routes require both generic auth and admin-specific checks
router.use(protectRoute);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/role', adminController.changeUserRole);
router.patch('/users/:userId/ban', adminController.toggleBanUser);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/sessions', adminController.getAllSessions);
router.get('/problems', adminController.getAllProblems);
router.get('/analytics', adminController.getAnalytics);

export default router;
