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

/** POST /api/problems/bulk — bulk import problems */
export const bulkImportProblems = async (req, res) => {
    try {
        const { problems } = req.body;
        const { userId } = req.auth();

        if (!problems || !Array.isArray(problems)) {
            return res.status(400).json({ message: "Problems must be an array" });
        }

        // 1. Count limit
        if (problems.length > 50) {
            return res.status(400).json({ message: "Maximum 50 problems allowed" });
        }

        // 2. Check for duplicates in this user's collection
        const existingTitles = await prisma.customProblem.findMany({
            where: {
                ownerClerkId: userId,
                title: { in: problems.map(p => p.title) }
            },
            select: { title: true }
        });

        const duplicates = existingTitles.map(p => p.title);
        const newProblems = problems.filter(p => !duplicates.includes(p.title));

        if (newProblems.length === 0) {
            return res.json({
                created: 0,
                skipped: duplicates.length,
                duplicates,
                message: `No new problems were imported. ${duplicates.length} duplicates skipped.`
            });
        }

        // 3. Save all in a single transaction
        await prisma.$transaction(async (tx) => {
            const data = newProblems.map(p => {
                // Generate a unique-ish ID from the title
                const baseId = p.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                
                // Add a random suffix to avoid global collisions
                const id = `${baseId}-${Math.random().toString(36).substring(2, 7)}`;

                return {
                    id,
                    title: p.title,
                    difficulty: p.difficulty,
                    category: p.category || "",
                    description: p.description,
                    examples: p.examples || [],
                    starterCode: p.starterCode || {},
                    hiddenTestCases: p.hiddenTestCases || [],
                    ownerClerkId: userId,
                };
            });

            await tx.customProblem.createMany({
                data: data
            });
        });

        // 4. Return summary
        return res.json({
            created: newProblems.length,
            skipped: duplicates.length,
            duplicates: duplicates,
            message: `Successfully imported ${newProblems.length} problems`
        });
    } catch (err) {
        console.error("Bulk import error:", err);
        res.status(500).json({ message: "Failed to import problems", error: err.message });
    }
};
