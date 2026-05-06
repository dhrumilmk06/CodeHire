import { prisma } from "../lib/db.js";
import { mapId } from "../lib/utils.js";
import { getAuth } from "@clerk/express";

/** GET /api/problems/find?title=... — find any custom problem by title (no ownership check, for session participants) */
export const getProblemByTitle = async (req, res, next) => {

    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ message: "title query param required" });
        const problem = await prisma.customProblem.findFirst({
            where: { title }
        });
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        res.json({ problem: mapId(problem) });
    } catch (err) {
        next(err);
    }
};


/** GET /api/problems — get all custom problems for the current user */
export const getMyProblems = async (req, res, next) => {

    try {
        const { userId } = getAuth(req);
        const problems = await prisma.customProblem.findMany({
            where: { ownerClerkId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ problems: mapId(problems) });
    } catch (err) {
        next(err);
    }
};


/** POST /api/problems — create a new custom problem */
export const createProblem = async (req, res, next) => {

    try {
        const { userId } = getAuth(req);
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
        next(err);
    }
};


/** PUT /api/problems/:id — update a custom problem */
export const updateProblem = async (req, res, next) => {

    try {
        const { userId } = getAuth(req);
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
        next(err);
    }
};


/** DELETE /api/problems/:id — delete a custom problem */
export const deleteProblem = async (req, res, next) => {

    try {
        const { userId } = getAuth(req);
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
        next(err);
    }
};


// ── Backend helpers ────────────────────────────────────────────────────────

/** Fix 5 (server-side) — Validate a single problem object */
function validateProblemServer(problem, index) {
    const errors = [];
    const label = `Problem ${index + 1}`;

    if (!problem.title || typeof problem.title !== 'string' || problem.title.trim() === '')
        errors.push(`${label}: title is required`);
    else if (problem.title.trim().length > 100)
        errors.push(`${label}: title too long (max 100 chars)`);

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!problem.difficulty || !validDifficulties.includes(problem.difficulty))
        errors.push(`${label}: difficulty must be 'Easy', 'Medium', or 'Hard'`);

    if (!problem.description)
        errors.push(`${label}: description is required`);
    else if (typeof problem.description === 'object') {
        if (!problem.description.text || typeof problem.description.text !== 'string')
            errors.push(`${label}: description.text is required`);
        else if (problem.description.text.length > 10000)
            errors.push(`${label}: description.text too long (max 10,000 chars)`);
    } else if (typeof problem.description === 'string') {
        if (problem.description.trim() === '')
            errors.push(`${label}: description cannot be empty`);
        else if (problem.description.length > 10000)
            errors.push(`${label}: description too long (max 10,000 chars)`);
    }

    if (problem.examples !== undefined && !Array.isArray(problem.examples))
        errors.push(`${label}: examples must be an array`);
    if (problem.hiddenTestCases !== undefined && !Array.isArray(problem.hiddenTestCases))
        errors.push(`${label}: hiddenTestCases must be an array`);
    if (problem.starterCode !== undefined && (typeof problem.starterCode !== 'object' || Array.isArray(problem.starterCode)))
        errors.push(`${label}: starterCode must be an object`);
    if (problem.constraints !== undefined && !Array.isArray(problem.constraints))
        errors.push(`${label}: constraints must be an array`);

    return errors;
}

/** Fix 8 — Check for duplicates both within the batch and in the database */
async function checkDuplicates(problems, ownerClerkId) {
    const incomingTitles = problems.map(p => p.title.trim());

    // Internal duplicates (within the uploaded file)
    const titleCounts = {};
    incomingTitles.forEach(t => { titleCounts[t] = (titleCounts[t] || 0) + 1; });
    const internalDuplicates = Object.entries(titleCounts)
        .filter(([, count]) => count > 1)
        .map(([title]) => title);

    // Database duplicates (already exist for this user)
    const existing = await prisma.customProblem.findMany({
        where: { ownerClerkId, title: { in: incomingTitles } },
        select: { title: true }
    });
    const databaseDuplicates = existing.map(p => p.title);

    const allDuplicates = [...new Set([...databaseDuplicates, ...internalDuplicates])];

    return {
        databaseDuplicates,
        internalDuplicates,
        allDuplicates,
        newProblems: problems.filter(p => !allDuplicates.includes(p.title.trim()))
    };
}

/** POST /api/problems/bulk — bulk import problems */
export const bulkImportProblems = async (req, res, next) => {

    try {
        const { problems } = req.body;

        // Auth guard (belt-and-suspenders; protectRoute already enforces this)
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Basic array check
        if (!problems || !Array.isArray(problems)) {
            return res.status(400).json({ message: "Problems must be an array" });
        }

        // Count limit
        if (problems.length === 0) {
            return res.status(400).json({ message: "No problems provided" });
        }
        if (problems.length > 50) {
            return res.status(400).json({ message: `Maximum 50 problems allowed. Your batch has ${problems.length}` });
        }

        // Validate every problem and split valid vs invalid
        const validationResults = problems.map((p, i) => ({
            problem: p,
            errors: validateProblemServer(p, i)
        }));
        const invalidProblems = validationResults.filter(r => r.errors.length > 0);
        const validProblems   = validationResults.filter(r => r.errors.length === 0).map(r => r.problem);

        if (validProblems.length === 0) {
            return res.status(400).json({
                message: "All problems failed validation",
                details: invalidProblems.map(r => r.errors)
            });
        }

        // Duplicate check (database + internal)
        const { databaseDuplicates, internalDuplicates, allDuplicates, newProblems } =
            await checkDuplicates(validProblems, userId);

        if (newProblems.length === 0) {
            return res.status(400).json({
                message: "All problems already exist in your Problem Bank",
                duplicates: databaseDuplicates
            });
        }

        // Save in a single transaction (all or nothing)
        await prisma.$transaction(async (tx) => {
            const data = newProblems.map(p => {
                const baseId = p.title.trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                const id = `${baseId}-${Math.random().toString(36).substring(2, 7)}`;

                // Normalise description — accept both string and { text, notes } object
                const description = typeof p.description === 'string'
                    ? { text: p.description.trim(), notes: [] }
                    : {
                        text:  (p.description.text  || '').trim(),
                        notes: (p.description.notes || [])
                    };

                return {
                    id,
                    title:           p.title.trim(),
                    difficulty:      p.difficulty,
                    category:        (p.category || '').trim(),
                    description,
                    constraints:     p.constraints     || [],
                    examples:        p.examples        || [],
                    starterCode:     p.starterCode     || {},
                    hiddenTestCases: p.hiddenTestCases || [],
                    ownerClerkId:    userId,
                };
            });

            await tx.customProblem.createMany({ data });
        });

        // Return detailed summary
        return res.status(200).json({
            created:           newProblems.length,
            skipped:           databaseDuplicates.length,
            skippedInvalid:    invalidProblems.length,
            internalDuplicates,
            duplicates:        databaseDuplicates,
            message:           `Successfully imported ${newProblems.length} problem${newProblems.length !== 1 ? 's' : ''}`
        });

    } catch (err) {
        next(err);
    }
};

