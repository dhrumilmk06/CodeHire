import express from "express";
import rateLimit from "express-rate-limit";
import { protectRoute } from "../middleware/protectRoute.js";
import validate from "../middleware/validate.js";
import { problemSchema } from "../schemas/validationSchemas.js";

import { 
    getMyProblems, 
    createProblem, 
    updateProblem, 
    deleteProblem, 
    getProblemByTitle,
    bulkImportProblems 
} from "../controllers/problemController.js";

const router = express.Router();

const bulkImportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 5,                      // max 5 bulk imports per hour per user
    standardHeaders: true,       // Return rate limit info in RateLimit-* headers
    legacyHeaders: false,
    // Fix 7 — rate limit per authenticated user, not just by IP
    keyGenerator: (req) => req.user?.id || req.auth?.userId || "anonymous",
    message: { message: "Too many bulk import requests. Please try again after 1 hour" }
});

router.get("/", protectRoute, getMyProblems);
router.get("/find", protectRoute, getProblemByTitle);  // Must be before /:id
router.post("/", protectRoute, validate(problemSchema), createProblem);

router.post("/bulk", protectRoute, bulkImportLimiter, bulkImportProblems);
router.put("/:id", protectRoute, updateProblem);
router.delete("/:id", protectRoute, deleteProblem);

export default router;
