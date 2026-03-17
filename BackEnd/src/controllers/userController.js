import { prisma } from "../lib/db.js";
import { mapId } from "../lib/utils.js";

// PATCH /api/users/role
// Save selected role for first-time user (host or participant only)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const clerkId = req.user.clerkId;

        // Admin role cannot be set via this endpoint
        if (!['host', 'participant'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Choose "host" or "participant".' });
        }

        const user = await prisma.user.update({
            where: { clerkId },
            data: { role }
        });

        return res.json({ success: true, role: user.role });
    } catch (error) {
        console.error("Error in updateUserRole:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// GET /api/users/me
export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: req.user.clerkId }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(mapId(user));
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/participants/:userId/sessions
export const getParticipantSessions = async (req, res) => {
    try {
        const { userId } = req.params; // This matches the participantClerkId in Session model
        const sessions = await prisma.session.findMany({
            where: {
                participantClerkId: userId,
                status: "completed"
            },
            orderBy: { createdAt: 'desc' },
            include: { 
                host: { select: { name: true, email: true } } 
            }
        });
        return res.json(mapId(sessions));
    } catch (error) {
        console.error("Error in getParticipantSessions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
