import { clerkClient } from "@clerk/express";
import { prisma } from "../lib/db.js";
import { mapId } from "../lib/utils.js";

// GET /api/admin/users
// Get all users with pagination
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.user.count({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            }
        });

        return res.json({ users: mapId(users), total, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PATCH /api/admin/users/:userId/role
// Admin changes any user's role
export const changeUserRole = async (req, res) => {
    try {
        const { userId } = req.params; // This is the id field (cuid)
        const { role } = req.body;

        if (!['admin', 'host', 'participant'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // 1. Update DB
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role }
        });

        // 2. Sync to Clerk (Clerk uses clerkId, not our cuid id)
        await clerkClient.users.updateUserMetadata(user.clerkId, {
            publicMetadata: {
                role: role
            }
        });

        return res.json({ success: true, user: mapId(user) });
    } catch (error) {
        console.error("Error in changeUserRole:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PATCH /api/admin/users/:userId/ban
// Admin bans or unbans a user
export const toggleBanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { banned } = req.body;

        if (typeof banned !== 'boolean') {
            return res.status(400).json({ error: 'Banned status must be a boolean' });
        }

        // 1. Update DB
        const user = await prisma.user.update({
            where: { id: userId },
            data: { banned }
        });

        // 2. Clear Clerk role/access if banned
        await clerkClient.users.updateUserMetadata(user.clerkId, {
            publicMetadata: {
                banned: banned
            }
        });

        return res.json({ success: true, user: mapId(user) });
    } catch (error) {
        console.error("Error in toggleBanUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE /api/admin/users/:userId
// Admin deletes a user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await prisma.user.delete({
            where: { id: userId }
        });

        return res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/admin/sessions
// Admin sees all sessions across platform
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                host: { select: { name: true, email: true } },
                participant: { select: { name: true, email: true } }
            }
        });
        return res.json(mapId(sessions));
    } catch (error) {
        console.error("Error in getAllSessions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/admin/problems
// Admin sees all custom problems across platform
export const getAllProblems = async (req, res) => {
    try {
        const problems = await prisma.customProblem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json(mapId(problems));
    } catch (error) {
        console.error("Error in getAllProblems:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/admin/analytics
// Platform stats for admin dashboard
export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalHosts = await prisma.user.count({ where: { role: 'host' } });
        const totalParticipants = await prisma.user.count({ where: { role: 'participant' } });
        const totalSessions = await prisma.session.count();
        const totalProblems = await prisma.customProblem.count();

        return res.json({
            totalUsers,
            totalHosts,
            totalParticipants,
            totalSessions,
            totalProblems
        });
    } catch (error) {
        console.error("Error in getAnalytics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
