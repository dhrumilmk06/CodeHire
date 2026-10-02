import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import validate from "../middleware/validate.js";
import { 
    sessionSchema, 
    joinSessionSchema,
    saveNotesSchema,
    setDecisionSchema,
    sendDecisionEmailSchema,
    updateTimingsSchema,
    updateActiveProblemSchema,
    saveProblemCodeSchema,
    runCodeSchema,
    updateSessionScoreSchema
} from "../schemas/validationSchemas.js";

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
router.post("/:id/notes", protectRoute, validate(saveNotesSchema), saveNotes);
router.patch("/:id/decision", protectRoute, validate(setDecisionSchema), setDecision);
router.post("/:id/decision", protectRoute, validate(sendDecisionEmailSchema), sendDecisionEmailHandler);
router.patch("/:id/timings", protectRoute, validate(updateTimingsSchema), updateTimings);
router.patch("/:id/activeProblem", protectRoute, validate(updateActiveProblemSchema), updateActiveProblem);
router.patch("/:id/code/:problemId", protectRoute, validate(saveProblemCodeSchema), saveProblemCode);
router.get("/:id/code/:problemId", protectRoute, getProblemCode);
router.post("/run-code", protectRoute, validate(runCodeSchema), runCode);
router.patch("/:id/score", protectRoute, validate(updateSessionScoreSchema), updateSessionScore);

export default router;