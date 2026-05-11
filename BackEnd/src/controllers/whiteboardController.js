import { prisma } from "../lib/db.js";

export const saveSnapshot = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { imageData, excalidrawData, label } = req.body;

        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: "Session not found" });
        }

        const snapshot = await prisma.whiteboardSnapshot.create({
            data: {
                sessionId,
                imageData,
                excalidrawData,
                label
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: snapshot.id,
                sessionId: snapshot.sessionId,
                label: snapshot.label,
                createdAt: snapshot.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getSnapshots = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: "Session not found" });
        }

        const snapshots = await prisma.whiteboardSnapshot.findMany({
            where: { sessionId },
            select: {
                id: true,
                label: true,
                createdAt: true,
                aiScore: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: snapshots
        });
    } catch (error) {
        next(error);
    }
};

export const getSnapshotById = async (req, res, next) => {
    try {
        const { snapshotId } = req.params;

        const snapshot = await prisma.whiteboardSnapshot.findUnique({
            where: { id: snapshotId }
        });

        if (!snapshot) {
            return res.status(404).json({ success: false, error: "Snapshot not found" });
        }

        res.status(200).json({
            success: true,
            data: snapshot
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSnapshot = async (req, res, next) => {
    try {
        const { snapshotId, sessionId } = req.params;
        const clerkId = req.user.clerkId;

        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: "Session not found" });
        }

        // Verify host/admin (simplified to host for now as per usual patterns)
        if (session.hostId !== clerkId) {
            return res.status(403).json({ success: false, error: "Only the host can delete snapshots" });
        }

        await prisma.whiteboardSnapshot.delete({
            where: { id: snapshotId }
        });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(error);
    }
};
