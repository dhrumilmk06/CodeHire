/**
 * bugBounty.js — Router
 *
 * All Bug Bounty endpoints mounted at /api/bug-bounty.
 * Clerk auth middleware (protectRoute) is applied to every route.
 *
 * Endpoints:
 *   POST   /problems                   — Host creates a problem
 *   GET    /problems                   — List all problems (paginated, filtered)
 *   GET    /problems/:id               — Get single problem detail
 *   POST   /problems/:id/submit        — Candidate submits fixed code
 *   POST   /problems/:id/hints         — Request a hint
 *   GET    /submissions/:id            — Get single submission
 *   PUT    /submissions/:id/review     — Host adds manual review
 *   GET    /leaderboard                — Top users by total final score
 */

import express from 'express';
import { prisma } from '../lib/db.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { runAutoTests } from '../services/pistonService.js';
import { reviewBugFix, explainBugFix } from '../services/geminiReviewService.js';

const router = express.Router();

// Apply protectRoute to ALL routes in this router
router.use(protectRoute);

// ---------------------------------------------------------------------------
// Helper: Calculate final score as average of all available scores
// ---------------------------------------------------------------------------
function calculateFinalScore(autoTestScore, aiReviewScore, manualReviewScore) {
  const scores = [];
  if (autoTestScore !== null && autoTestScore !== undefined) scores.push(autoTestScore);
  if (aiReviewScore !== null && aiReviewScore !== undefined) scores.push(aiReviewScore);
  if (manualReviewScore !== null && manualReviewScore !== undefined) scores.push(manualReviewScore);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ---------------------------------------------------------------------------
// Helper: Check if the requesting user is a host/admin
// ---------------------------------------------------------------------------
function isHost(user) {
  return user?.role === 'host' || user?.role === 'admin';
}

// ===========================================================================
// POST /api/bug-bounty/problems
// Host creates a new bug bounty problem.
// ===========================================================================
router.post('/problems', async (req, res) => {
  try {
    if (!isHost(req.user)) {
      return res.status(403).json({ success: false, error: 'Only hosts can create bug bounty problems.' });
    }

    const {
      title,
      buggyCode,
      bugDescription,
      bugHints,
      language,
      initialTestCases,
      hiddenTestCases,
      difficultyLevel,
      estimatedTimeMinutes,
      bountyPoints,
    } = req.body;

    if (!title || !buggyCode || !bugDescription || !language) {
      return res.status(400).json({
        success: false,
        error: 'title, buggyCode, bugDescription, and language are required.',
      });
    }

    const problem = await prisma.bugBountyProblem.create({
      data: {
        title,
        buggyCode,
        bugDescription,
        bugHints:             bugHints             ?? null,
        language:             language.toLowerCase(),
        initialTestCases:     initialTestCases     ?? [],
        hiddenTestCases:      hiddenTestCases      ?? [],
        difficultyLevel:      difficultyLevel      ?? null,
        estimatedTimeMinutes: estimatedTimeMinutes ?? null,
        bountyPoints:         bountyPoints         ?? 100,
        createdBy:            req.user.clerkId,
      },
    });

    return res.status(201).json({ success: true, problem });
  } catch (err) {
    console.error('[BugBounty] POST /problems error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// GET /api/bug-bounty/problems
// List all bug bounty problems (paginated, filterable).
// Does NOT return hiddenTestCases.
// ===========================================================================
router.get('/problems', async (req, res) => {
  try {
    const { language, difficulty, page = 1, limit = 20 } = req.query;

    const where = {};
    if (language)   where.language       = language.toLowerCase();
    if (difficulty) where.difficultyLevel = difficulty.toLowerCase();

    const skip  = (Number(page) - 1) * Number(limit);
    const take  = Number(limit);

    const [problems, total] = await Promise.all([
      prisma.bugBountyProblem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id:                   true,
          title:                true,
          language:             true,
          difficultyLevel:      true,
          bountyPoints:         true,
          estimatedTimeMinutes: true,
          createdAt:            true,
          _count: {
            select: { submissions: true },
          },
        },
      }),
      prisma.bugBountyProblem.count({ where }),
    ]);

    return res.json({ success: true, problems, total, page: Number(page) });
  } catch (err) {
    console.error('[BugBounty] GET /problems error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// GET /api/bug-bounty/problems/for-session
// Returns lightweight list of problems for session picker
// ===========================================================================
router.get('/problems/for-session', async (req, res) => {
  try {
    const problems = await prisma.bugBountyProblem.findMany({
      select: {
        id: true,
        title: true,
        language: true,
        difficultyLevel: true,
        bountyPoints: true,
        estimatedTimeMinutes: true,
        bugDescription: true,
      },
      orderBy: [
        { difficultyLevel: 'asc' },
        { title: 'asc' },
      ],
    });

    res.json({ success: true, problems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===========================================================================
// GET /api/bug-bounty/problems/:id
// Get full detail of a single problem.
// Does NOT return hiddenTestCases or bugHints.
// ===========================================================================
router.get('/problems/:id', async (req, res) => {
  try {
    const problemId = Number(req.params.id);

    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: problemId },
      select: {
        id:                   true,
        title:                true,
        buggyCode:            true,
        bugDescription:       true,
        language:             true,
        initialTestCases:     true,
        difficultyLevel:      true,
        estimatedTimeMinutes: true,
        bountyPoints:         true,
        createdAt:            true,
        // hiddenTestCases and bugHints intentionally excluded
      },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found.' });
    }

    return res.json({ success: true, problem });
  } catch (err) {
    console.error('[BugBounty] GET /problems/:id error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// POST /api/bug-bounty/problems/:id/submit
// Candidate submits their fixed code.
// ===========================================================================
router.post('/problems/:id/submit', async (req, res) => {
  try {
    const problemId = Number(req.params.id);
    const { fixedCode, sessionId, timeTakenSeconds } = req.body;

    if (!fixedCode) {
      return res.status(400).json({ success: false, error: 'fixedCode is required.' });
    }

    // 1. Validate problem exists
    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: problemId },
    });
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found.' });
    }

    // 2. Create submission record with status: "submitted"
    let submission = await prisma.bugBountySubmission.create({
      data: {
        problemId,
        userId:          req.user.clerkId,
        sessionId:       sessionId ?? null,
        fixedCode,
        timeTakenSeconds: timeTakenSeconds ?? null,
        status:          'submitted',
      },
    });

    // 3. Run auto-tests via Piston
    const hiddenTestCases = Array.isArray(problem.hiddenTestCases) ? problem.hiddenTestCases : [];
    const autoTestResult  = await runAutoTests(fixedCode, hiddenTestCases, problem.language);

    // 4. Update submission with autoTestResult, set status: "auto_tested"
    submission = await prisma.bugBountySubmission.update({
      where: { id: submission.id },
      data: {
        autoTestResult,
        status: 'auto_tested',
      },
    });

    // 5. Trigger Gemini AI review
    const aiReview = await reviewBugFix(
      problem.buggyCode,
      fixedCode,
      problem.language,
      problem.bugDescription
    );

    // 6. Update submission with AI review results, set status: "ai_reviewed"
    const aiReviewScore    = aiReview.error ? null : aiReview.avgScore;
    const aiReviewFeedback = aiReview.feedback ?? null;

    submission = await prisma.bugBountySubmission.update({
      where: { id: submission.id },
      data: {
        aiReviewFeedback,
        aiReviewScore,
        status: 'ai_reviewed',
      },
    });

    // 7. Calculate finalScore (auto + AI, no manual yet)
    const finalScore = calculateFinalScore(autoTestResult.score, aiReviewScore, null);

    submission = await prisma.bugBountySubmission.update({
      where: { id: submission.id },
      data: { finalScore },
    });

    // 8. Return full submission
    return res.json({
      success: true,
      submission: {
        id:              submission.id,
        status:          submission.status,
        autoTestResult,
        aiReviewScore,
        aiReviewFeedback,
        finalScore,
      },
    });
  } catch (err) {
    console.error('[BugBounty] POST /problems/:id/submit error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// POST /api/bug-bounty/problems/:id/hints
// Candidate requests a hint. Reveals bugHints and logs the request.
// ===========================================================================
router.post('/problems/:id/hints', async (req, res) => {
  try {
    const problemId    = Number(req.params.id);
    const { submissionId } = req.body;

    // submissionId is now optional

    // 1. Fetch the problem and its bugHints
    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: problemId },
      select: { id: true, bugHints: true },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found.' });
    }

    if (!problem.bugHints) {
      return res.json({ success: true, hint: 'No hints available for this problem.' });
    }

    // 2. Log hint usage in BugBountyHintUsed if we have a submissionId
    if (submissionId) {
      await prisma.bugBountyHintUsed.create({
        data: { submissionId: Number(submissionId) },
      });
    }

    // 3. Return the hint text
    return res.json({ success: true, hint: problem.bugHints });
  } catch (err) {
    console.error('[BugBounty] POST /problems/:id/hints error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// GET /api/bug-bounty/leaderboard
// Returns top users ranked by total finalScore across approved submissions.
// ===========================================================================
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    // Aggregate approved submissions grouped by userId
    const grouped = await prisma.bugBountySubmission.groupBy({
      by: ['userId'],
      where: { status: 'approved' },
      _sum:   { finalScore: true },
      _count: { id: true },
      _avg:   { finalScore: true },
      orderBy: { _sum: { finalScore: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) {
      return res.json({ success: true, leaderboard: [] });
    }

    // Fetch User records for the top userId list
    const userIds = grouped.map((g) => g.userId);
    const users   = await prisma.user.findMany({
      where: { clerkId: { in: userIds } },
      select: { clerkId: true, name: true, email: true, profileImage: true },
    });

    const userMap = Object.fromEntries(users.map((u) => [u.clerkId, u]));

    const leaderboard = grouped.map((g, index) => {
      const user = userMap[g.userId] ?? {};
      return {
        rank:           index + 1,
        userId:         g.userId,
        name:           user.name  ?? user.email ?? 'Unknown',
        email:          user.email ?? null,
        profileImage:   user.profileImage ?? null,
        totalScore:     g._sum.finalScore  ?? 0,
        problemsSolved: g._count.id        ?? 0,
        avgScore:       Math.round(g._avg.finalScore ?? 0),
      };
    });

    return res.json({ success: true, leaderboard });
  } catch (err) {
    console.error('[BugBounty] GET /leaderboard error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// POST /api/bug-bounty/problems/:id/run-tests
// Run fixed code against the public initialTestCases only (no submission created).
// ===========================================================================
router.post('/problems/:id/run-tests', async (req, res) => {
  try {
    const problemId = Number(req.params.id);
    const { fixedCode } = req.body;

    if (!fixedCode) {
      return res.status(400).json({ success: false, error: 'fixedCode is required.' });
    }

    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: problemId },
      select: { initialTestCases: true, language: true },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found.' });
    }

    const testCases = Array.isArray(problem.initialTestCases) ? problem.initialTestCases : [];
    const results   = await runAutoTests(fixedCode, testCases, problem.language);

    return res.json({ success: true, results });
  } catch (err) {
    console.error('[BugBounty] POST /problems/:id/run-tests error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// GET /api/bug-bounty/submissions  — Host: list all submissions (with filter)
// NOTE: Registered BEFORE /submissions/:id to prevent Express route conflict
// ===========================================================================
router.get('/submissions', async (req, res) => {
  try {
    if (!isHost(req.user)) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [submissions, total] = await Promise.all([
      prisma.bugBountySubmission.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          problem: { select: { id: true, title: true, language: true, difficultyLevel: true } },
        },
      }),
      prisma.bugBountySubmission.count({ where }),
    ]);

    // Enrich with user names from our DB
    const userIds = [...new Set(submissions.map((s) => s.userId))];
    const users   = userIds.length > 0
      ? await prisma.user.findMany({
          where: { clerkId: { in: userIds } },
          select: { clerkId: true, name: true, email: true },
        })
      : [];
    const userMap = Object.fromEntries(users.map((u) => [u.clerkId, u]));

    const enriched = submissions.map((s) => ({
      ...s,
      candidateName: userMap[s.userId]?.name || userMap[s.userId]?.email || s.userId,
    }));

    return res.json({ success: true, submissions: enriched, total, page: Number(page) });
  } catch (err) {
    console.error('[BugBounty] GET /submissions error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// GET /api/bug-bounty/submissions/:id
// Get full details of a single submission.
// Auth: Only the submitting user OR the host can view.
// ===========================================================================
router.get('/submissions/:id', async (req, res) => {
  try {
    const submissionId = Number(req.params.id);

    const submission = await prisma.bugBountySubmission.findUnique({
      where: { id: submissionId },
      include: {
        problem: {
          select: {
            id: true, title: true, language: true, difficultyLevel: true, bountyPoints: true,
            buggyCode: true, bugDescription: true,
          },
        },
        hintsUsed: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    // Access control: only the submitting user or a host/admin may view
    const isOwner = submission.userId === req.user.clerkId;
    if (!isOwner && !isHost(req.user)) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    return res.json({ success: true, submission });
  } catch (err) {
    console.error('[BugBounty] GET /submissions/:id error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// PUT /api/bug-bounty/submissions/:id/review
// Host adds manual review score and feedback, recalculates finalScore.
// ===========================================================================
router.put('/submissions/:id/review', async (req, res) => {
  try {
    if (!isHost(req.user)) {
      return res.status(403).json({ success: false, error: 'Only hosts can add manual reviews.' });
    }

    const submissionId = Number(req.params.id);
    const { manualReviewScore, manualReviewFeedback } = req.body;

    if (manualReviewScore === undefined || manualReviewScore === null) {
      return res.status(400).json({ success: false, error: 'manualReviewScore is required.' });
    }

    // Fetch existing submission to get current scores
    const existing = await prisma.bugBountySubmission.findUnique({
      where: { id: submissionId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    // Recalculate finalScore with all three scores
    const autoTestScore = existing.autoTestResult?.score ?? null;
    const finalScore    = calculateFinalScore(autoTestScore, existing.aiReviewScore, Number(manualReviewScore));

    const submission = await prisma.bugBountySubmission.update({
      where: { id: submissionId },
      data: {
        manualReviewScore:    Number(manualReviewScore),
        manualReviewFeedback: manualReviewFeedback ?? null,
        finalScore,
        status: 'approved',
      },
    });

    return res.json({
      success: true,
      submission: {
        id:                   submission.id,
        status:               submission.status,
        manualReviewScore:    submission.manualReviewScore,
        manualReviewFeedback: submission.manualReviewFeedback,
        finalScore:           submission.finalScore,
      },
    });
  } catch (err) {
    console.error('[BugBounty] PUT /submissions/:id/review error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ===========================================================================
// GET /api/bug-bounty/problems/:id/solution
// Get correct solution for a problem
// ===========================================================================
router.get('/problems/:id/solution', async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: parseInt(id) },
      select: {
        correctSolution: true,
        title: true,
        language: true
      }
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    res.json({
      success: true,
      solution: problem.correctSolution,
      title: problem.title,
      language: problem.language
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===========================================================================
// POST /api/bug-bounty/problems/:id/explain
// AI explains the fix (Gemini - called only on demand)
// ===========================================================================
router.post('/problems/:id/explain', async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: parseInt(id) },
      select: {
        buggyCode: true,
        correctSolution: true,
        bugDescription: true,
        language: true,
        title: true
      }
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    // Call Gemini for explanation
    const explanation = await explainBugFix(
      problem.buggyCode,
      problem.correctSolution,
      problem.language,
      problem.bugDescription
    );

    res.json({
      success: true,
      explanation
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===========================================================================
// GET /api/bug-bounty/session/:sessionId/problem
// Returns full problem for an active bug bounty session
// ===========================================================================
router.get('/session/:sessionId/problem', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        sessionType: true,
        problems: true,
        status: true,
      },
    });

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    if (session.sessionType !== 'bug_bounty') {
      return res.status(400).json({ success: false, error: 'This session is not a bug bounty session' });
    }

    const problemId = session.problems?.bugBountyProblemId;

    if (!problemId) {
      return res.status(404).json({ success: false, error: 'No bug bounty problem assigned to this session' });
    }

    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: problemId },
      select: {
        id: true,
        title: true,
        buggyCode: true,
        bugDescription: true,
        language: true,
        initialTestCases: true,
        difficultyLevel: true,
        bountyPoints: true,
        estimatedTimeMinutes: true,
        bugHints: true,
      },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Bug bounty problem not found' });
    }

    res.json({ success: true, problem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===========================================================================
// POST /api/bug-bounty/problems/:id/run-public-tests
// Run against public test cases only using Piston
// ===========================================================================
router.post('/problems/:id/run-public-tests', async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'No code provided' });
    }

    const problem = await prisma.bugBountyProblem.findUnique({
      where: { id: parseInt(id) },
      select: { initialTestCases: true, language: true },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    // Run against public test cases only using Piston
    const result = await runAutoTests(code, problem.initialTestCases, problem.language);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
