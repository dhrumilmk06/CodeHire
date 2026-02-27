import CustomProblem from "../models/CustomProblem.js";

/** GET /api/problems/find?title=... — find any custom problem by title (no ownership check, for session participants) */
export const getProblemByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ message: "title query param required" });
        const problem = await CustomProblem.findOne({ title });
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        res.json({ problem });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch problem", error: err.message });
    }
};


/** GET /api/problems — get all custom problems for the current user */
export const getMyProblems = async (req, res) => {
    try {
        const { userId } = req.auth();
        const problems = await CustomProblem.find({ ownerClerkId: userId }).sort({ createdAt: -1 });
        res.json({ problems });
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

        const problem = await CustomProblem.create({
            ...body,
            id,
            ownerClerkId: userId,
        });

        res.status(201).json({ problem });
    } catch (err) {
        res.status(500).json({ message: "Failed to create problem", error: err.message });
    }
};

/** PUT /api/problems/:id — update a custom problem */
export const updateProblem = async (req, res) => {
    try {
        const { userId } = req.auth();
        const problem = await CustomProblem.findOne({ _id: req.params.id, ownerClerkId: userId });
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        Object.assign(problem, req.body);
        await problem.save();

        res.json({ problem });
    } catch (err) {
        res.status(500).json({ message: "Failed to update problem", error: err.message });
    }
};

/** DELETE /api/problems/:id — delete a custom problem */
export const deleteProblem = async (req, res) => {
    try {
        const { userId } = req.auth();
        const problem = await CustomProblem.findOneAndDelete({ _id: req.params.id, ownerClerkId: userId });
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        res.json({ message: "Problem deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete problem", error: err.message });
    }
};
