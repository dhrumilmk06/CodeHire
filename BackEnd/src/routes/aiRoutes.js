import express from 'express'
import { generateCodeHint, generateCodeReview, generateProblem, generateSolution } from '../controllers/aiController.js'
import { protectRoute } from '../middleware/protectRoute.js'
import validate from '../middleware/validate.js'
import { aiHintSchema, aiReviewSchema, aiSolutionSchema } from '../schemas/validationSchemas.js'


const router = express.Router()

router.post('/hint', protectRoute, validate(aiHintSchema), generateCodeHint)
router.post('/review', protectRoute, validate(aiReviewSchema), generateCodeReview)
router.post('/generate-problem', protectRoute, generateProblem)
router.post('/solution', protectRoute, validate(aiSolutionSchema), generateSolution)


export default router

