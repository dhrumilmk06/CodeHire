import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { reviewWhiteboardDesign } from '../controllers/aiWhiteboardController.js';

const router = express.Router();

// POST /api/ai/whiteboard-review
router.post('/whiteboard-review', protectRoute, reviewWhiteboardDesign);

export default router;
