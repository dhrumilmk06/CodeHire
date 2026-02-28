import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import {
    createSession,
    endSession,
    getActiveSessions,
    getMyReecentSessions,
    getSessionById,
    joinSession,
    getNotes,
    saveNotes,
    setDecision,
    updateTimings,
} from "../controllers/sessionController.js";


const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyReecentSessions);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

router.get("/:id/notes", protectRoute, getNotes);
router.post("/:id/notes", protectRoute, saveNotes);
router.patch("/:id/decision", protectRoute, setDecision);
router.patch("/:id/timings", protectRoute, updateTimings);

export default router;