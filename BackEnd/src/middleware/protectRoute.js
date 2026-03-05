import { requireAuth } from '@clerk/express'
import { prisma } from '../lib/db.js'
import { mapId } from '../lib/utils.js'

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId

            if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" })

            const user = await prisma.user.findUnique({
                where: { clerkId }
            })

            if (!user) return res.status(404).json({ message: "user not found" })

            req.user = mapId(user)
            next()
        } catch (error) {
            console.error("Error in protected middleware:", error)
            res.status(500).json({ message: "Internal Server error" })
        }
    }
]