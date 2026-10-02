import { prisma } from "../lib/db.js";

// @route   GET /api/standard-problems
// @desc    Get standard problems with pagination
// @access  Public
export const getStandardProblems = async (req, res) => {
    try {
        const {
            limit = 30,
            offset = 0,
            search = "",
            difficulty = "All",
            category = "All",
            lightweight = "false",
        } = req.query;

        const take = parseInt(limit, 10);
        const skip = parseInt(offset, 10);
        const isLightweight = lightweight === "true";

        const where = {};

        if (difficulty && difficulty !== "All") {
            where.difficulty = { equals: difficulty, mode: "insensitive" };
        }

        if (category && category !== "All") {
            where.category = { equals: category, mode: "insensitive" };
        }

        if (search && search.trim()) {
            const query = search.trim();
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { category: { contains: query, mode: "insensitive" } },
            ];
        }

        let selectFields = {};
        if (isLightweight) {
            selectFields = {
                id: true,
                title: true,
                difficulty: true,
                category: true,
            };
        }

        const [problems, totalFiltered, difficultyCounts, categoryRows, totalAll] = await Promise.all([
            prisma.standardProblem.findMany({
                where,
                take,
                skip,
                orderBy: { id: "asc" },
                ...(isLightweight && { select: selectFields }),
            }),
            prisma.standardProblem.count({ where }),
            prisma.standardProblem.groupBy({
                by: ["difficulty"],
                _count: { _all: true },
            }),
            prisma.standardProblem.findMany({
                select: { category: true },
                distinct: ["category"],
            }),
            prisma.standardProblem.count(),
        ]);

        const stats = {
            total: totalAll,
            easy: difficultyCounts.find((d) => d.difficulty?.toLowerCase() === "easy")?._count?._all || 0,
            medium: difficultyCounts.find((d) => d.difficulty?.toLowerCase() === "medium")?._count?._all || 0,
            hard: difficultyCounts.find((d) => d.difficulty?.toLowerCase() === "hard")?._count?._all || 0,
        };

        const categories = categoryRows.map((c) => c.category).filter(Boolean);
        const hasMore = skip + problems.length < totalFiltered;

        res.status(200).json({
            success: true,
            problems,
            total: totalFiltered,
            stats,
            categories,
            hasMore,
        });
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
