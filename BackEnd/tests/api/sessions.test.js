/**
 * API Tests – Session Routes (ESM-compatible)
 * Tests: GET /api/sessions/active, GET /api/sessions/my-recent,
 *        GET /api/sessions/:id, POST /api/sessions/:id/join,
 *        POST /api/sessions (create)
 *
 * Uses jest.unstable_mockModule + dynamic import() for native ESM support.
 */
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ── Mock declarations (must come before any imports in ESM mode) ───────────────

const mockPrisma = {
  session: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  customProblem: { findMany: jest.fn(), findUnique: jest.fn() },
  bugBountyProblem: { findUnique: jest.fn() },
};

const mockStreamClient = {
  video: { call: jest.fn(() => ({ getOrCreate: jest.fn().mockResolvedValue({}) })) },
};

const mockChatClient = {
  channel: jest.fn(() => ({
    create: jest.fn().mockResolvedValue({}),
    addMembers: jest.fn().mockResolvedValue({}),
  })),
};

jest.unstable_mockModule('../../src/lib/db.js', () => ({
  prisma: mockPrisma,
  connectDB: jest.fn(),
}));

jest.unstable_mockModule('../../src/lib/stream.js', () => ({
  streamClient: mockStreamClient,
  chatClient: mockChatClient,
  upsertStreamUser: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule('../../src/lib/inngest.js', () => ({
  inngest: { send: jest.fn() },
  functions: [],
}));

jest.unstable_mockModule('../../src/lib/socket.js', () => ({
  setIO: jest.fn(),
  emitToRoom: jest.fn(),
}));

jest.unstable_mockModule('../../src/lib/scoring.js', () => ({
  runAutoScore: jest.fn(),
}));

jest.unstable_mockModule('../../src/utils/sendDecisionEmail.js', () => ({
  sendDecisionEmail: jest.fn(),
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

jest.unstable_mockModule('express-rate-limit', () => ({
  default: jest.fn(() => (req, res, next) => next()),
}));

// protectRoute is a middleware array — replace with a simple pass-through
jest.unstable_mockModule('../../src/middleware/protectRoute.js', () => ({
  protectRoute: [
    (req, res, next) => {
      req.user = req.user || {
        id: 'test-user-id',
        _id: 'test-user-id',
        clerkId: 'clerk_test_123',
        email: 'host@codehire.dev',
        name: 'Host User',
        role: 'host',
      };
      next();
    },
  ],
}));

// ── Dynamic imports (after mocks are declared) ─────────────────────────────────

const { default: request } = await import('supertest');
const { createTestApp } = await import('../helpers/createTestApp.js');
const { prisma } = await import('../../src/lib/db.js');
const { chatClient } = await import('../../src/lib/stream.js');
const { default: sessionRoutes } = await import('../../src/routes/sessionRoutes.js');

// ── Test app & fixtures ────────────────────────────────────────────────────────

const FAKE_USER = {
  id: 'test-user-id',
  _id: 'test-user-id',
  clerkId: 'clerk_test_123',
  email: 'host@codehire.dev',
  name: 'Host User',
  role: 'host',
};

const PARTICIPANT_USER = {
  id: 'participant-user-id',
  _id: 'participant-user-id',
  clerkId: 'clerk_participant_456',
  email: 'participant@codehire.dev',
  name: 'Participant User',
  role: 'participant',
};

const FAKE_SESSION = {
  id: 'session-abc-123',
  _id: 'session-abc-123',
  problem: 'Two Sum',
  difficulty: 'easy',
  status: 'active',
  session_code: 'ABC123',
  callId: 'session_123_xyz',
  hostId: FAKE_USER.clerkId,
  participantClerkId: null,
  problems: [{ title: 'Two Sum', difficulty: 'easy' }],
  problemCodes: {},
  timings: [],
  sessionType: 'coding',
  host: { name: 'Host User', email: 'host@codehire.dev', clerkId: FAKE_USER.clerkId },
  participant: null,
  createdAt: new Date().toISOString(),
};

const app = createTestApp(sessionRoutes, '/api/sessions', FAKE_USER);

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

// ── GET /api/sessions/active ────────────────────────────────────────────────────

describe('GET /api/sessions/active', () => {
  test('returns 200 with list of active sessions', async () => {
    mockPrisma.session.findMany.mockResolvedValue([FAKE_SESSION]);

    const res = await request(app).get('/api/sessions/active');

    expect(res.statusCode).toBe(200);
    expect(res.body.sessions).toHaveLength(1);
    expect(res.body.sessions[0].id).toBe(FAKE_SESSION.id);
  });

  test('returns empty array when no active sessions exist', async () => {
    mockPrisma.session.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/sessions/active');

    expect(res.statusCode).toBe(200);
    expect(res.body.sessions).toEqual([]);
  });

  test('returns 500 when database throws', async () => {
    mockPrisma.session.findMany.mockRejectedValue(new Error('DB connection failed'));

    const res = await request(app).get('/api/sessions/active');

    expect(res.statusCode).toBe(500);
  });
});

// ── GET /api/sessions/my-recent ─────────────────────────────────────────────────

describe('GET /api/sessions/my-recent', () => {
  test('returns 200 with user\'s recent sessions', async () => {
    mockPrisma.session.findMany.mockResolvedValue([FAKE_SESSION]);

    const res = await request(app).get('/api/sessions/my-recent');

    expect(res.statusCode).toBe(200);
    expect(res.body.sessions).toHaveLength(1);
  });

  test('filters by the authenticated user\'s clerkId', async () => {
    mockPrisma.session.findMany.mockResolvedValue([]);

    await request(app).get('/api/sessions/my-recent');

    const callArgs = mockPrisma.session.findMany.mock.calls[0][0];
    expect(callArgs.where.OR).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ hostId: FAKE_USER.clerkId }),
        expect.objectContaining({ participantClerkId: FAKE_USER.clerkId }),
      ])
    );
  });
});

// ── GET /api/sessions/:id ───────────────────────────────────────────────────────

describe('GET /api/sessions/:id', () => {
  test('returns 200 with session data when session exists', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);

    const res = await request(app).get(`/api/sessions/${FAKE_SESSION.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.session.id).toBe(FAKE_SESSION.id);
    expect(res.body.session.problem).toBe('Two Sum');
  });

  test('returns 404 when session does not exist', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/sessions/non-existent-id');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('queries the DB by the id param', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);

    await request(app).get(`/api/sessions/${FAKE_SESSION.id}`);

    expect(mockPrisma.session.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: FAKE_SESSION.id } })
    );
  });
});

// ── POST /api/sessions/:id/join ─────────────────────────────────────────────────

describe('POST /api/sessions/:id/join', () => {
  test('returns 200 and joins the session successfully', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION);
    mockPrisma.session.update.mockResolvedValue({
      ...FAKE_SESSION,
      participantClerkId: PARTICIPANT_USER.clerkId,
    });

    const participantApp = createTestApp(sessionRoutes, '/api/sessions', PARTICIPANT_USER);
    const res = await request(participantApp).post(`/api/sessions/${FAKE_SESSION.id}/join`);

    expect(res.statusCode).toBe(200);
    expect(res.body.session).toBeDefined();
  });

  test('returns 404 when session does not exist', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(null);

    const participantApp = createTestApp(sessionRoutes, '/api/sessions', PARTICIPANT_USER);
    const res = await request(participantApp).post('/api/sessions/no-such-id/join');

    expect(res.statusCode).toBe(404);
  });

  test('returns 400 when session is already completed', async () => {
    mockPrisma.session.findUnique.mockResolvedValue({ ...FAKE_SESSION, status: 'completed' });

    const participantApp = createTestApp(sessionRoutes, '/api/sessions', PARTICIPANT_USER);
    const res = await request(participantApp).post(`/api/sessions/${FAKE_SESSION.id}/join`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/cannot join completed session/i);
  });

  test('returns 400 when host tries to join their own session', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(FAKE_SESSION); // hostId = FAKE_USER.clerkId

    const res = await request(app).post(`/api/sessions/${FAKE_SESSION.id}/join`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/host cannot join/i);
  });

  test('returns 409 when session is already full', async () => {
    mockPrisma.session.findUnique.mockResolvedValue({
      ...FAKE_SESSION,
      participantClerkId: 'another-participant-id',
    });

    const participantApp = createTestApp(sessionRoutes, '/api/sessions', PARTICIPANT_USER);
    const res = await request(participantApp).post(`/api/sessions/${FAKE_SESSION.id}/join`);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/full/i);
  });
});

// ── POST /api/sessions (create) ─────────────────────────────────────────────────

describe('POST /api/sessions', () => {
  const VALID_PAYLOAD = {
    problems: [{ title: 'Two Sum', difficulty: 'easy' }],
    sessionType: 'coding',
  };

  beforeEach(() => {
    mockPrisma.session.findUnique.mockResolvedValueOnce(null); // unique code check
    mockPrisma.session.create.mockResolvedValue(FAKE_SESSION);
  });

  test('returns 201 with session data on successful creation', async () => {
    const res = await request(app).post('/api/sessions').send(VALID_PAYLOAD);

    expect(res.statusCode).toBe(201);
    expect(res.body.session).toBeDefined();
    expect(res.body.session.session_code).toBeDefined();
  });

  test('creates the session with correct hostId and sessionType', async () => {
    await request(app).post('/api/sessions').send(VALID_PAYLOAD);

    expect(mockPrisma.session.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          hostId: FAKE_USER.clerkId,
          sessionType: 'coding',
        }),
      })
    );
  });

  test('returns 422 when problems array is missing (Zod validation)', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ sessionType: 'coding' });

    expect(res.statusCode).toBe(422);
  });

  test('returns 400 for bug_bounty session without bugBountyProblemId', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ sessionType: 'bug_bounty' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/bug bounty problem must be selected/i);
  });
});
