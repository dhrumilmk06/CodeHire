import express from 'express'
import { generateCodeHint } from '../controllers/aiController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/hint', protectRoute, generateCodeHint)

export default router
