import express from 'express'
import { generateCodeHint, generateCodeReview, generateProblem, generateSolution } from '../controllers/aiController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/hint', protectRoute, generateCodeHint)
router.post('/review', protectRoute, generateCodeReview)
router.post('/generate-problem', protectRoute, generateProblem)
router.post('/solution', protectRoute, generateSolution)

export default router

