import {  requireAuth } from '@clerk/express'
import User from '../models/User.js'


export const protectRoute = [
    requireAuth(),// it method for use protected route in clerk
    async (req, res, next) => {
        try {
            //userid is now as clerkid and under the req.auth() we have user which is coming from clerk  
            const clerkId = req.auth().userId

            if(!clerkId) return res.status(401).json({message: "Unauthorized - invalid token"})

            //finding user from db by clerkid
            const user =  await User.findOne({clerkId})

            if(!user) return res.status(404).json({message: "user not found"})

            //attach user to req 
            req.user = user

            next()
        } catch (error) {
            console.error("Error in protected middleware:", error)
            res.status(500).json({message:"Internal Server error"})
        }
    }
]