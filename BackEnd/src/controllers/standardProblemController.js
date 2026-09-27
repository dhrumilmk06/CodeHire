import { prisma } from "../lib/db.js";

// @route   GET /api/standard-problems
// @desc    Get standard problems with pagination
// @access  Public
export const getStandardProblems = async (req, res) => {
    try {
        const { limit = 50, offset = 0, lightweight = "false" } = req.query;
        const take = parseInt(limit, 10);
        const skip = parseInt(offset, 10);
        const isLightweight = lightweight === "true";

        let selectFields = {};
        if (isLightweight) {
            selectFields = {
                id: true,
                title: true,
                difficulty: true,
                category: true,
            };
        }

        const problems = await prisma.standardProblem.findMany({
            take,
            skip,
            ...(isLightweight && { select: selectFields }),
        });

        const total = await prisma.standardProblem.count();

        res.status(200).json({ success: true, problems, total });
    } catch (error) {
        console.error("Error fetching standard problems:", error);
        res.status(500).json({ success: false, error: "Failed to fetch standard problems" });
    }
};

// @route   GET /api/standard-problems/:id
// @desc    Get a single standard problem by ID
// @access  Public
export const getStandardProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await prisma.standardProblem.findUnique({
            where: { id },
        });

        if (!problem) {
            return res.status(404).json({ success: false, error: "Problem not found" });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error(`Error fetching standard problem ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: "Failed to fetch problem" });
    }
};
