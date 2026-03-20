import express from 'express'
import { generateCodeHint, generateCodeReview } from '../controllers/aiController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/hint', protectRoute, generateCodeHint)
router.post('/review', protectRoute, generateCodeReview)

export default router
