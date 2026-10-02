import { z } from 'zod';


const sessionSchema = z.object({
    problems: z.array(z.object({
        title: z.string(),
        difficulty: z.string()
    })).optional(),
    problemIds: z.array(z.string()).optional(),
    hostId: z.string().optional(),
    sessionType: z.string().optional(),
    bugBountyProblemId: z.number().optional(),
}).refine(data => data.problems || data.problemIds || data.sessionType === 'bug_bounty', {
    message: "Either problems, problemIds, or a bug bounty problem must be provided",
    path: ["problems"]
});

const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    examples: z.array(z.any()).optional(),
});

const joinSessionSchema = z.object({
    code: z.string().optional(),
    session_code: z.string().optional(),
    link: z.string().optional(),
}).refine(data => data.code || data.session_code || data.link, {
    message: "Session code or link is required",
    path: ["code"]
});

const aiHintSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    problemTitle: z.string().min(1, "Problem title is required"),
    candidateCode: z.string().min(1, "Candidate code is required"),
    problemDescription: z.string().optional(),
});

const aiReviewSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    problemTitle: z.string().min(1, "Problem title is required"),
    problemDescription: z.string().optional(),
    candidateCode: z.string().min(1, "Candidate code is required"),
    score: z.any().optional(),
    timeTaken: z.any().optional(),
    language: z.string().optional(),
});

const aiSolutionSchema = z.object({
    problemTitle: z.string().min(1, "Problem title is required"),
    problemDescription: z.string().min(1, "Problem description is required"),
    difficulty: z.string().optional(),
    language: z.string().optional(),
    context: z.string().optional(),
});

const bugBountyProblemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    buggyCode: z.string().min(1, "Buggy code is required"),
    bugDescription: z.string().min(1, "Bug description is required"),
    bugHints: z.string().optional().nullable(),
    language: z.string().min(1, "Language is required"),
    initialTestCases: z.array(z.any()).optional(),
    hiddenTestCases: z.array(z.any()).optional(),
    difficultyLevel: z.string().optional().nullable(),
    estimatedTimeMinutes: z.number().optional().nullable(),
    bountyPoints: z.number().optional(),
});

const bugBountySubmitSchema = z.object({
    fixedCode: z.string().min(1, "Fixed code is required"),
    sessionId: z.string().optional().nullable(),
    timeTakenSeconds: z.number().optional().nullable(),
});

const bugBountyHintRequestSchema = z.object({
    submissionId: z.union([z.string(), z.number()]).optional().nullable(),
});

const bugBountyRunTestsSchema = z.object({
    fixedCode: z.string().optional(),
    code: z.string().optional()
}).refine(data => data.fixedCode || data.code, { message: "Code is required" });

const bugBountyReviewSchema = z.object({
    manualReviewScore: z.number({ required_error: "Score is required" }),
    manualReviewFeedback: z.string().optional().nullable(),
});

const bulkImportProblemsSchema = z.object({
    problems: z.array(problemSchema).min(1, "At least one problem is required")
});

const saveNotesSchema = z.object({
    notes: z.string().optional().nullable(),
    rating: z.union([z.string(), z.number()]).optional().nullable(),
    tags: z.array(z.string()).optional().nullable(),
    timeTaken: z.union([z.string(), z.number()]).optional().nullable(),
    testCasesPassed: z.string().optional().nullable()
});

const setDecisionSchema = z.object({
    decision: z.enum(["move_forward", "on_hold", "rejected"]).nullable()
});

const sendDecisionEmailSchema = z.object({
    decision: z.enum(["move_forward", "on_hold", "rejected"]),
    candidateEmail: z.string().email("Invalid email format"),
    candidateName: z.string().min(1, "Candidate name is required"),
    jobRole: z.string().min(1, "Job role is required"),
    companyName: z.string().min(1, "Company name is required")
});

const updateTimingsSchema = z.object({
    timings: z.array(z.any())
});

const updateActiveProblemSchema = z.object({
    problemTitle: z.string().min(1, "Problem title is required"),
    difficulty: z.string().min(1, "Difficulty is required"),
    codeToSave: z.string().optional(),
    previousProblemTitle: z.string().optional()
});

const saveProblemCodeSchema = z.object({
    code: z.string()
});

const runCodeSchema = z.object({
    code: z.string().min(1, "Code is required"),
    language: z.string().min(1, "Language is required"),
    sessionId: z.string().min(1, "Session ID is required"),
    problemId: z.string().optional().nullable()
});

const updateSessionScoreSchema = z.object({
    score: z.string().min(1, "Score is required")
});

export {
    sessionSchema,
    problemSchema,
    joinSessionSchema,
    aiHintSchema,
    aiReviewSchema,
    aiSolutionSchema,
    bugBountyProblemSchema,
    bugBountySubmitSchema,
    bugBountyHintRequestSchema,
    bugBountyRunTestsSchema,
    bugBountyReviewSchema,
    bulkImportProblemsSchema,
    saveNotesSchema,
    setDecisionSchema,
    sendDecisionEmailSchema,
    updateTimingsSchema,
    updateActiveProblemSchema,
    saveProblemCodeSchema,
    runCodeSchema,
    updateSessionScoreSchema
};


