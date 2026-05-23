import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import validate from "../middleware/validate.js";
import { sessionSchema, joinSessionSchema } from "../schemas/validationSchemas.js";

import {
    createSession,
    endSession,
    getActiveSessions,
    getMyReecentSessions,
    getSessionById,
    joinSession,
    joinSessionByCode,
    joinSessionLimiter,
    getNotes,
    saveNotes,
    setDecision,
    updateTimings,
    updateActiveProblem,
    saveProblemCode,
    getProblemCode,
    runCode,
    updateSessionScore,
    sendDecisionEmailHandler
} from "../controllers/sessionController.js";


const router = express.Router();

router.post("/", protectRoute, validate(sessionSchema), createSession);

router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyReecentSessions);

router.post("/join", protectRoute, joinSessionLimiter, validate(joinSessionSchema), joinSessionByCode);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

router.get("/:id/notes", protectRoute, getNotes);
router.post("/:id/notes", protectRoute, saveNotes);
router.patch("/:id/decision", protectRoute, setDecision);
router.post("/:id/decision", protectRoute, sendDecisionEmailHandler);
router.patch("/:id/timings", protectRoute, updateTimings);
router.patch("/:id/activeProblem", protectRoute, updateActiveProblem);
router.patch("/:id/code/:problemId", protectRoute, saveProblemCode);
router.get("/:id/code/:problemId", protectRoute, getProblemCode);
router.post("/run-code", protectRoute, runCode);
router.patch("/:id/score", protectRoute, updateSessionScore);

export default router;