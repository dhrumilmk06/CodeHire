import { requireAuth, getAuth, clerkClient } from '@clerk/express'
import { prisma } from '../lib/db.js'
import { mapId } from '../lib/utils.js'
import { upsertStreamUser } from '../lib/stream.js'

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const { userId: clerkId } = getAuth(req)

            if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" })

            let user = await prisma.user.findUnique({
                where: { clerkId }
            })

            // Auto-create the user if they exist in Clerk but not yet in our DB
            // (happens after DB wipes, migrations, or if the Inngest webhook was missed)
            if (!user) {
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkId)

                    const email = clerkUser.emailAddresses?.[0]?.emailAddress
                    if (!email) return res.status(400).json({ message: "No email found for user" })

                    const name = [clerkUser.firstName, clerkUser.lastName]
                        .filter(Boolean)
                        .join(' ')
                        .trim() || clerkUser.username || 'User'

                    user = await prisma.user.upsert({
                        where: { clerkId },
                        update: {
                            email,
                            name,
                            profileImage: clerkUser.imageUrl
                        },
                        create: {
                            clerkId,
                            email,
                            name,
                            profileImage: clerkUser.imageUrl
                        }
                    })

                    // Also sync to Stream so video/chat works
                    await upsertStreamUser({
                        id: user.clerkId,
                        name: user.name,
                        image: user.profileImage
                    }).catch(() => {}) // non-fatal

                    console.log(`✅ Auto-created missing user in DB: ${email}`)
                } catch (createErr) {
                    console.error("Failed to auto-create user:", createErr)
                    return res.status(404).json({ message: "User not found and could not be created" })
                }
            }

            req.user = mapId(user)
            next()
        } catch (error) {
            console.error("Error in protected middleware:", error)
            res.status(500).json({ message: "Internal Server error" })
        }
    }
]