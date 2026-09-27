import express from 'express';
import { getStandardProblems, getStandardProblemById } from '../controllers/standardProblemController.js';

const router = express.Router();

router.get('/', getStandardProblems);
router.get('/:id', getStandardProblemById);

export default router;
