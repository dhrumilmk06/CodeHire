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

export {
    sessionSchema,
    problemSchema,
    joinSessionSchema,
    aiHintSchema,
    aiReviewSchema,
    aiSolutionSchema
};


