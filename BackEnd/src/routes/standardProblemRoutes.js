import express from "express";
import { getAllStandardProblems, getStandardProblemById } from "../controllers/standardProblemController.js";

const router = express.Router();

router.get("/", getAllStandardProblems);
router.get("/:id", getStandardProblemById);

export default router;
