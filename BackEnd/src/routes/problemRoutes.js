import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMyProblems, createProblem, updateProblem, deleteProblem, getProblemByTitle } from "../controllers/problemController.js";

const router = express.Router();

router.get("/", protectRoute, getMyProblems);
router.get("/find", protectRoute, getProblemByTitle);  // Must be before /:id
router.post("/", protectRoute, createProblem);
router.put("/:id", protectRoute, updateProblem);
router.delete("/:id", protectRoute, deleteProblem);

export default router;
