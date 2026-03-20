import express from 'express';
import { generateReport } from '../controllers/reportController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// GET /api/reports/:sessionId/generate
router.get('/:sessionId/generate', protectRoute, generateReport);

export default router;
