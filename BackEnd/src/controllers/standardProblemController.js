import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllStandardProblems = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const offset = parseInt(req.query.offset) || 0;
        const lightweight = req.query.lightweight === "true";

        const selectFields = lightweight ? {
            id: true,
            title: true,
            difficulty: true,
            category: true,
        } : {
            id: true,
            title: true,
            difficulty: true,
            category: true,
            description: true,
            examples: true,
            constraints: true,
            createdAt: true,
            updatedAt: true,
        };

        const [problems, total] = await Promise.all([
            prisma.standardProblem.findMany({
                skip: offset,
                take: limit,
                select: selectFields,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.standardProblem.count()
        ]);

        res.json({ problems, total, limit, offset });
    } catch (error) {
        console.error("Error in getAllStandardProblems:", error);
        res.status(500).json({ error: "Internal server error while fetching problems." });
    }
};

export const getStandardProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const problem = await prisma.standardProblem.findUnique({
            where: { id }
        });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json(problem);
    } catch (error) {
        console.error("Error in getStandardProblemById:", error);
        res.status(500).json({ error: "Internal server error while fetching problem." });
    }
};
