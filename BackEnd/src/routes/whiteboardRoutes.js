import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
    saveSnapshot,
    getSnapshots,
    getSnapshotById,
    deleteSnapshot
} from '../controllers/whiteboardController.js';

const router = express.Router();

// POST /api/whiteboard/:sessionId/snapshot
// Body: { imageData: string (base64 PNG), excalidrawData?: string (JSON), label?: string }
router.post('/:sessionId/snapshot', protectRoute, saveSnapshot);

// GET /api/whiteboard/:sessionId/snapshots
// Returns array without imageData (performance)
router.get('/:sessionId/snapshots', protectRoute, getSnapshots);

// GET /api/whiteboard/:sessionId/snapshot/:snapshotId
// Returns full snapshot including imageData and aiFeedback
router.get('/:sessionId/snapshot/:snapshotId', protectRoute, getSnapshotById);

// DELETE /api/whiteboard/:sessionId/snapshot/:snapshotId
// Host/admin only
router.delete('/:sessionId/snapshot/:snapshotId', protectRoute, deleteSnapshot);

export default router;
