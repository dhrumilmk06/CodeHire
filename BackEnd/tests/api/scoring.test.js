/**
 * API Tests – Code Execution & Scoring Routes (ESM-compatible)
 * Tests: POST /api/code/execute, POST /api/code/validate-problem,
 *        POST /api/code/validate-hint
 *
 * Maps to plan section 3.3 "Test code execution endpoint".
 * Uses jest.unstable_mockModule + dynamic import() for native ESM support.
 */
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ── Mock declarations ──────────────────────────────────────────────────────────

const mockPrisma = {
  session: { findUnique: jest.fn() },
  customProblem: { findUnique: jest.fn() },
};

const mockExecuteCode = jest.fn();
const mockValidateCodeHintForSession = jest.fn();

jest.unstable_mockModule('../../src/lib/db.js', () => ({
  prisma: mockPrisma,
  connectDB: jest.fn(),
}));

jest.unstable_mockModule('../../src/services/codeExecutionService.js', () => ({
  executeCode: mockExecuteCode,
  validateCodeHintForSession: mockValidateCodeHintForSession,
}));

// protectRoute is a middleware array — replace with a simple pass-through
jest.unstable_mockModule('../../src/middleware/protectRoute.js', () => ({
  protectRoute: [
    (req, res, next) => {
      req.user = { clerkId: 'clerk_test_123', id: 'test-user-id' };
      next();
    },
  ],
}));

jest.unstable_mockModule('@clerk/express', () => ({
  clerkMiddleware: () => (req, res, next) => next(),
  requireAuth: () => (req, res, next) => next(),
  getAuth: jest.fn(() => ({ userId: 'clerk_test_123' })),
  clerkClient: {
    users: {
      getUser: jest.fn(),
      updateUserMetadata: jest.fn().mockResolvedValue({}),
    },
  },
}));

jest.unstable_mockModule('../../src/lib/stream.js', () => ({
  streamClient: {},
  chatClient: {},
  upsertStreamUser: jest.fn(),
}));

// ── Dynamic imports ────────────────────────────────────────────────────────────

const { default: request } = await import('supertest');
const { createTestApp } = await import('../helpers/createTestApp.js');
const { default: codeExecutionRoutes } = await import('../../src/routes/codeExecutionRoutes.js');

// ── Test app ────────────────────────────────────────────────────────────────────

const app = createTestApp(codeExecutionRoutes, '/api/code');

// ── Fixtures ────────────────────────────────────────────────────────────────────

const FAKE_SESSION = {
  id: 'session-exec-001',
  problem: 'Two Sum',
  problemCodes: { javascript: 'function twoSum(nums, target) { return [0,1]; }' },
  callId: 'call-abc',
};

const FAKE_PROBLEM = {
  id: 'problem-001',
  title: 'Two Sum',
  hiddenTestCases: [
    { id: 'tc1', description: 'Basic case', expectedOutput: '[0,1]' },
    { id: 'tc2', description: 'Second case', expectedOutput: '[1,3]' },
  ],
};

const SUCCESS_RESULT = {
  status: 'SUCCESS',
  testCasesPassed: '2/2',
  failedTests: [],
  executionTime: 42,
  error: null,
};

const PARTIAL_RESULT = {
  status: 'PARTIAL',
  testCasesPassed: '1/2',
  failedTests: [{ id: 'tc2', expected: '[1,3]', actual: '[0,1]' }],
  executionTime: 38,
  error: null,
};

beforeEach(() => jest.clearAllMocks());

// ── POST /api/code/execute ──────────────────────────────────────────────────────

describe('POST /api/code/execute', () => {
  test('returns 200 with parsed pass/total counts on success', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);
    mockPrisma.customProblem.findUnique.mockResolvedValue(FAKE_PROBLEM);
    mockExecuteCode.mockResolvedValue(SUCCESS_RESULT);

    const res = await request(app)
      .post('/api/code/execute')
      .send({ sessionId: FAKE_SESSION.id, language: 'javascript' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.passed).toBe(2);
    expect(res.body.total).toBe(2);
    expect(res.body.testCasesPassed).toBe('2/2');
  });

  test('returns partial results when some test cases fail', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);
    mockPrisma.customProblem.findUnique.mockResolvedValue(FAKE_PROBLEM);
    mockExecuteCode.mockResolvedValue(PARTIAL_RESULT);

    const res = await request(app)
      .post('/api/code/execute')
      .send({ sessionId: FAKE_SESSION.id, language: 'javascript' });

    expect(res.statusCode).toBe(200);
    expect(res.body.passed).toBe(1);
    expect(res.body.total).toBe(2);
    expect(res.body.failedTests).toHaveLength(1);
  });

  test('returns 404 when session is not found', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/code/execute')
      .send({ sessionId: 'no-such-session', language: 'javascript' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/session not found/i);
  });

  test('returns 400 when no code exists for the requested language', async () => {
    mockPrisma.session.findUnique.mockResolvedValue({
      ...FAKE_SESSION,
      problemCodes: { python: '# python' }, // no javascript key
    });

    const res = await request(app)
      .post('/api/code/execute')
      .send({ sessionId: FAKE_SESSION.id, language: 'javascript' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/no javascript code found/i);
  });

  test('returns 400 when custom problem is not found', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);
    mockPrisma.customProblem.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/code/execute')
      .send({ sessionId: FAKE_SESSION.id, language: 'javascript' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/customProblem not found/i);
  });

  test('returns 400 when problem has no hidden test cases', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);
    mockPrisma.customProblem.findUnique.mockResolvedValue({
      ...FAKE_PROBLEM,
      hiddenTestCases: [],
    });

    const res = await request(app)
      .post('/api/code/execute')
      .send({ sessionId: FAKE_SESSION.id, language: 'javascript' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/no hidden test cases/i);
  });

  test('returns 422 when sessionId is missing (Zod validation)', async () => {
    const res = await request(app)
      .post('/api/code/execute')
      .send({ language: 'javascript' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error).toMatch(/Validation Error/i);
  });

  test('calls executeCode with correct args', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);
    mockPrisma.customProblem.findUnique.mockResolvedValue(FAKE_PROBLEM);
    mockExecuteCode.mockResolvedValue(SUCCESS_RESULT);

    await request(app)
      .post('/api/code/execute')
      .send({ sessionId: FAKE_SESSION.id, language: 'javascript' });

    expect(mockExecuteCode).toHaveBeenCalledWith(
      FAKE_SESSION.problemCodes.javascript,
      'javascript',
      FAKE_PROBLEM.hiddenTestCases
    );
  });
});

// ── POST /api/code/validate-problem ────────────────────────────────────────────

describe('POST /api/code/validate-problem', () => {
  const VALID_PAYLOAD = {
    problemId: 'problem-001',
    language: 'javascript',
    code: 'function twoSum(nums, target) { return [0,1]; }',
  };

  test('returns 200 with canImport=true when all test cases pass', async () => {
    mockPrisma.customProblem.findUnique.mockResolvedValue(FAKE_PROBLEM);
    mockExecuteCode.mockResolvedValue(SUCCESS_RESULT);

    const res = await request(app)
      .post('/api/code/validate-problem')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(200);
    expect(res.body.canImport).toBe(true);
    expect(res.body.passRate).toBe(1);
  });

  test('returns canImport=false when some test cases fail', async () => {
    mockPrisma.customProblem.findUnique.mockResolvedValue(FAKE_PROBLEM);
    mockExecuteCode.mockResolvedValue(PARTIAL_RESULT);

    const res = await request(app)
      .post('/api/code/validate-problem')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(200);
    expect(res.body.canImport).toBe(false);
    expect(res.body.passRate).toBeLessThan(1);
  });

  test('returns 400 when problem is not found', async () => {
    mockPrisma.customProblem.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/code/validate-problem')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when problem has no hidden test cases', async () => {
    mockPrisma.customProblem.findUnique.mockResolvedValue({
      ...FAKE_PROBLEM,
      hiddenTestCases: [],
    });

    const res = await request(app)
      .post('/api/code/validate-problem')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/no hidden test cases/i);
  });

  test('returns 422 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/code/validate-problem')
      .send({ language: 'javascript' });

    expect(res.statusCode).toBe(422);
  });
});

// ── POST /api/code/validate-hint ───────────────────────────────────────────────

describe('POST /api/code/validate-hint', () => {
  const VALID_PAYLOAD = {
    sessionId: 'session-exec-001',
    hintCode: 'function twoSum(n, t) { return [0,1]; }',
    language: 'javascript',
  };

  test('returns 200 with isValid=true for correct hint code', async () => {
    mockValidateCodeHintForSession.mockResolvedValue({
      status: 'SUCCESS',
      isValid: true,
      passRate: 1,
      testCasesPassed: '2/2',
      failedTests: [],
      executionTime: 25,
      error: null,
    });

    const res = await request(app)
      .post('/api/code/validate-hint')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(200);
    expect(res.body.isValid).toBe(true);
    expect(res.body.passRate).toBe(1);
  });

  test('returns 200 with isValid=false for partial hint', async () => {
    mockValidateCodeHintForSession.mockResolvedValue({
      status: 'PARTIAL',
      isValid: false,
      passRate: 0.5,
      testCasesPassed: '1/2',
      failedTests: [{ id: 'tc2' }],
      executionTime: 22,
      error: null,
    });

    const res = await request(app)
      .post('/api/code/validate-hint')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(200);
    expect(res.body.isValid).toBe(false);
    expect(res.body.passRate).toBe(0.5);
  });

  test('returns 404 when session is not found', async () => {
    mockValidateCodeHintForSession.mockResolvedValue({
      status: 'SESSION_NOT_FOUND',
      error: 'Session not found',
    });

    const res = await request(app)
      .post('/api/code/validate-hint')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(404);
  });

  test('returns 400 when problem is not found', async () => {
    mockValidateCodeHintForSession.mockResolvedValue({
      status: 'PROBLEM_NOT_FOUND',
      error: 'Problem not found',
    });

    const res = await request(app)
      .post('/api/code/validate-hint')
      .send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(400);
  });

  test('returns 422 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/code/validate-hint')
      .send({ language: 'javascript' });

    expect(res.statusCode).toBe(422);
  });

  test('delegates to validateCodeHintForSession with correct args', async () => {
    mockValidateCodeHintForSession.mockResolvedValue({
      status: 'SUCCESS',
      isValid: true,
      passRate: 1,
      testCasesPassed: '2/2',
      failedTests: [],
      executionTime: 10,
      error: null,
    });

    await request(app).post('/api/code/validate-hint').send(VALID_PAYLOAD);

    expect(mockValidateCodeHintForSession).toHaveBeenCalledWith(
      VALID_PAYLOAD.sessionId,
      VALID_PAYLOAD.hintCode,
      VALID_PAYLOAD.language
    );
  });
});
