import { prisma } from "../lib/db.js";
import { mapId } from "../lib/utils.js";

/** GET /api/problems/find?title=... — find any custom problem by title (no ownership check, for session participants) */
export const getProblemByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ message: "title query param required" });
        const problem = await prisma.customProblem.findFirst({
            where: { title }
        });
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        res.json({ problem: mapId(problem) });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch problem", error: err.message });
    }
};

/** GET /api/problems — get all custom problems for the current user */
export const getMyProblems = async (req, res) => {
    try {
        const { userId } = req.auth();
        const problems = await prisma.customProblem.findMany({
            where: { ownerClerkId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ problems: mapId(problems) });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch problems", error: err.message });
    }
};

/** POST /api/problems — create a new custom problem */
export const createProblem = async (req, res) => {
    try {
        const { userId } = req.auth();
        const body = req.body;

        // Generate a URL-friendly ID from the title
        const id = body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Sanitize body: remove fields that shouldn't be in the 'data' spread for creation
        const { _id, id: bodyId, ownerClerkId, createdAt, updatedAt, _isCustom, ...sanitizedBody } = body;

        const problem = await prisma.customProblem.create({
            data: {
                ...sanitizedBody,
                id,
                ownerClerkId: userId,
            },
        });

        res.status(201).json({ problem: mapId(problem) });
    } catch (err) {
        res.status(500).json({ message: "Failed to create problem", error: err.message });
    }
};

/** PUT /api/problems/:id — update a custom problem */
export const updateProblem = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        // Verify ownership and check existence
        const problem = await prisma.customProblem.findFirst({
            where: { id, ownerClerkId: userId }
        });
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        // Sanitize body: remove fields that Prisma might reject or that shouldn't be updated directly
        const { _id, id: bodyId, ownerClerkId, createdAt, updatedAt, _isCustom, ...sanitizedBody } = req.body;

        const updatedProblem = await prisma.customProblem.update({
            where: { id },
            data: sanitizedBody
        });

        res.json({ problem: mapId(updatedProblem) });
    } catch (err) {
        res.status(500).json({ message: "Failed to update problem", error: err.message });
    }
};

/** DELETE /api/problems/:id — delete a custom problem */
export const deleteProblem = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        // Verify ownership and check existence
        const problem = await prisma.customProblem.findFirst({
            where: { id, ownerClerkId: userId }
        });
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        await prisma.customProblem.delete({
            where: { id }
        });

        res.json({ message: "Problem deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete problem", error: err.message });
    }
};
