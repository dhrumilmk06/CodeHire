import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { protectRoute } from '../middleware/protectRoute.js';
import validate from '../middleware/validate.js';
import {
    executeCode,
    validateCodeHintForSession,
} from '../services/codeExecutionService.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Zod validation schemas
// ---------------------------------------------------------------------------

const executeSchema = z.object({
    sessionId: z.string().min(1, 'sessionId is required'),
    language:  z.string().min(1, 'language is required'),
});

const validateProblemSchema = z.object({
    problemId: z.string().min(1, 'problemId is required'),
    language:  z.string().min(1, 'language is required'),
    code:      z.string().min(1, 'code is required'),
});

const validateHintSchema = z.object({
    sessionId: z.string().min(1, 'sessionId is required'),
    hintCode:  z.string().min(1, 'hintCode is required'),
    language:  z.string().min(1, 'language is required'),
});

// ---------------------------------------------------------------------------
// POST /api/code/execute
// ---------------------------------------------------------------------------
// Input  : { sessionId, language }
// Output : { status, passed, total, testCasesPassed, failedTests, executionTime }
// ---------------------------------------------------------------------------
router.post(
    '/execute',
    protectRoute,
    validate(executeSchema),
    async (req, res, next) => {
        try {
            const { sessionId, language } = req.body;

            // 1. Fetch Session
            const session = await prisma.session.findUnique({
                where: { id: sessionId },
            });
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: `Session not found: ${sessionId}`,
                });
            }

            // 2. Extract code for the requested language
            const problemCodes = session.problemCodes ?? {};
            const code = problemCodes[language];
            if (!code) {
                return res.status(400).json({
                    success: false,
                    error: `No ${language} code found in session. Available languages: ${Object.keys(problemCodes).join(', ') || 'none'}`,
                });
            }

            // 3. Fetch CustomProblem using session.problem (String ID)
            const customProblem = await prisma.customProblem.findUnique({
                where: { id: session.problem },
            });
            if (!customProblem) {
                return res.status(400).json({
                    success: false,
                    error: `CustomProblem not found: ${session.problem}`,
                });
            }

            const testCases = Array.isArray(customProblem.hiddenTestCases)
                ? customProblem.hiddenTestCases
                : [];

            if (testCases.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'CustomProblem has no hidden test cases',
                });
            }

            // 4. Execute
            const result = await executeCode(code, language, testCases);

            // 5. Parse "X/Y" → numbers for convenience
            const [passedStr, totalStr] = result.testCasesPassed.split('/');
            const passed = parseInt(passedStr, 10) || 0;
            const total  = parseInt(totalStr,  10) || 0;

            return res.status(200).json({
                success:         true,
                status:          result.status,
                passed,
                total,
                testCasesPassed: result.testCasesPassed,
                failedTests:     result.failedTests,
                executionTime:   result.executionTime,
                error:           result.error,
            });
        } catch (err) {
            next(err);
        }
    }
);

// ---------------------------------------------------------------------------
// POST /api/code/validate-problem
// ---------------------------------------------------------------------------
// Input  : { problemId, language, code }
// Output : { canImport, testCasesPassed, passRate, status, failedTests }
//
// Used for validating a problem's sample solution before bulk-importing it.
// ---------------------------------------------------------------------------
router.post(
    '/validate-problem',
    protectRoute,
    validate(validateProblemSchema),
    async (req, res, next) => {
        try {
            const { problemId, language, code } = req.body;

            // 1. Fetch CustomProblem
            const customProblem = await prisma.customProblem.findUnique({
                where: { id: problemId },
            });
            if (!customProblem) {
                return res.status(400).json({
                    success: false,
                    error: `CustomProblem not found: ${problemId}`,
                });
            }

            const testCases = Array.isArray(customProblem.hiddenTestCases)
                ? customProblem.hiddenTestCases
                : [];

            if (testCases.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'CustomProblem has no hidden test cases to validate against',
                });
            }

            // 2. Execute provided code against test cases
            const result = await executeCode(code, language, testCases);

            // 3. Calculate pass rate
            const [passedStr, totalStr] = result.testCasesPassed.split('/');
            const passed   = parseInt(passedStr, 10) || 0;
            const total    = parseInt(totalStr,  10) || 0;
            const passRate = total > 0 ? passed / total : 0;

            // Consider importable if all test cases pass
            const canImport = passed === total && total > 0 && result.status === 'SUCCESS';

            return res.status(200).json({
                success:         true,
                canImport,
                testCasesPassed: result.testCasesPassed,
                passRate,
                passed,
                total,
                status:          result.status,
                failedTests:     result.failedTests,
                executionTime:   result.executionTime,
                error:           result.error,
            });
        } catch (err) {
            next(err);
        }
    }
);

// ---------------------------------------------------------------------------
// POST /api/code/validate-hint
// ---------------------------------------------------------------------------
// Input  : { sessionId, hintCode, language }
// Output : { isValid, passRate, testCasesPassed, failedTests, status }
//
// Used to validate AI-generated hint code before storing it in the session.
// ---------------------------------------------------------------------------
router.post(
    '/validate-hint',
    protectRoute,
    validate(validateHintSchema),
    async (req, res, next) => {
        try {
            const { sessionId, hintCode, language } = req.body;

            // Delegate to service — it handles session + CustomProblem lookups
            const result = await validateCodeHintForSession(sessionId, hintCode, language);

            // Map service error statuses to HTTP codes
            if (result.status === 'SESSION_NOT_FOUND') {
                return res.status(404).json({ success: false, error: result.error });
            }
            if (result.status === 'PROBLEM_NOT_FOUND') {
                return res.status(400).json({ success: false, error: result.error });
            }

            return res.status(200).json({
                success:         true,
                isValid:         result.isValid,
                passRate:        result.passRate,
                testCasesPassed: result.testCasesPassed,
                failedTests:     result.failedTests,
                executionTime:   result.executionTime,
                status:          result.status,
                error:           result.error,
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;
