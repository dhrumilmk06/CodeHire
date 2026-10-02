/**
 * API Tests – User Routes (ESM-compatible)
 * Tests: GET /api/users/me, PATCH /api/users/role,
 *        GET /api/users/participants/:userId/sessions
 *
 * Maps to the plan's "Auth Routes" section. CodeHire uses Clerk for
 * authentication — these user-profile endpoints are the auth-gated equivalents.
 *
 * Uses jest.unstable_mockModule + dynamic import() for native ESM support.
 */
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ── Mock declarations ──────────────────────────────────────────────────────────

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  session: {
    findMany: jest.fn(),
  },
};

const mockClerkClient = {
  users: {
    getUser: jest.fn(),
    updateUserMetadata: jest.fn().mockResolvedValue({}),
  },
};

jest.unstable_mockModule('../../src/lib/db.js', () => ({
  prisma: mockPrisma,
  connectDB: jest.fn(),
}));

jest.unstable_mockModule('@clerk/express', () => ({
  clerkMiddleware: () => (req, res, next) => next(),
  requireAuth: () => (req, res, next) => next(),
  getAuth: jest.fn(() => ({ userId: 'clerk_test_123' })),
  clerkClient: mockClerkClient,
}));

jest.unstable_mockModule('../../src/lib/stream.js', () => ({
  streamClient: {},
  chatClient: {},
  upsertStreamUser: jest.fn().mockResolvedValue({}),
}));

// ── Dynamic imports ────────────────────────────────────────────────────────────

const { default: request } = await import('supertest');
const { createTestApp } = await import('../helpers/createTestApp.js');
const { prisma } = await import('../../src/lib/db.js');
const { default: userRoutes } = await import('../../src/routes/userRoutes.js');

// ── Fixtures ───────────────────────────────────────────────────────────────────

const FAKE_USER = {
  id: 'user-db-id',
  _id: 'user-db-id',
  clerkId: 'clerk_test_123',
  email: 'test@codehire.dev',
  name: 'Test User',
  role: 'host',
  profileImage: 'https://example.com/avatar.png',
  banned: false,
};

const app = createTestApp(userRoutes, '/api/users', FAKE_USER);

beforeEach(() => jest.clearAllMocks());

// ── GET /api/users/me ───────────────────────────────────────────────────────────

describe('GET /api/users/me', () => {
  test('returns 200 with the current authenticated user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(FAKE_USER);

    const res = await request(app).get('/api/users/me');

    expect(res.statusCode).toBe(200);
    expect(res.body.clerkId).toBe(FAKE_USER.clerkId);
    expect(res.body.email).toBe(FAKE_USER.email);
    expect(res.body.name).toBe(FAKE_USER.name);
  });

  test('queries DB by the authenticated user\'s clerkId', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(FAKE_USER);

    await request(app).get('/api/users/me');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { clerkId: FAKE_USER.clerkId },
    });
  });

  test('returns 404 when user is not found in the database', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/users/me');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('returns 500 when DB query throws', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/users/me');

    expect(res.statusCode).toBe(500);
  });

  test('response includes _id mapped from id', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(FAKE_USER);

    const res = await request(app).get('/api/users/me');

    expect(res.body._id).toBe(FAKE_USER.id);
  });
});

// ── PATCH /api/users/role ───────────────────────────────────────────────────────

describe('PATCH /api/users/role', () => {
  test('returns 200 and updated role for valid "host" role', async () => {
    mockPrisma.user.update.mockResolvedValue({ ...FAKE_USER, role: 'host' });

    const res = await request(app)
      .patch('/api/users/role')
      .send({ role: 'host' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.role).toBe('host');
  });

  test('returns 200 and updated role for valid "participant" role', async () => {
    mockPrisma.user.update.mockResolvedValue({ ...FAKE_USER, role: 'participant' });

    const res = await request(app)
      .patch('/api/users/role')
      .send({ role: 'participant' });

    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('participant');
  });

  test('syncs role to Clerk metadata after DB update', async () => {
    mockPrisma.user.update.mockResolvedValue({ ...FAKE_USER, role: 'host' });

    await request(app).patch('/api/users/role').send({ role: 'host' });

    expect(mockClerkClient.users.updateUserMetadata).toHaveBeenCalledWith(
      FAKE_USER.clerkId,
      { publicMetadata: { role: 'host' } }
    );
  });

  test('returns 400 for "admin" role (not settable via this endpoint)', async () => {
    const res = await request(app)
      .patch('/api/users/role')
      .send({ role: 'admin' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid role/i);
  });

  test('returns 400 for unknown role string', async () => {
    const res = await request(app)
      .patch('/api/users/role')
      .send({ role: 'superuser' });

    expect(res.statusCode).toBe(400);
  });

  test('returns 500 when DB update fails', async () => {
    mockPrisma.user.update.mockRejectedValue(new Error('Unique constraint failed'));

    const res = await request(app)
      .patch('/api/users/role')
      .send({ role: 'host' });

    expect(res.statusCode).toBe(500);
  });
});

// ── GET /api/users/participants/:userId/sessions ──────────────────────────────

describe('GET /api/users/participants/:userId/sessions', () => {
  const PARTICIPANT_CLERK_ID = 'clerk_participant_789';

  const MOCK_SESSION = {
    id: 'session-111',
    _id: 'session-111',
    status: 'completed',
    participantClerkId: PARTICIPANT_CLERK_ID,
    problem: 'Binary Search',
    host: { name: 'Host', email: 'host@codehire.dev', clerkId: 'clerk_host_001' },
    createdAt: new Date().toISOString(),
  };

  test('returns 200 with sessions for the given participant', async () => {
    mockPrisma.session.findMany.mockResolvedValue([MOCK_SESSION]);

    const res = await request(app).get(
      `/api/users/participants/${PARTICIPANT_CLERK_ID}/sessions`
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(MOCK_SESSION.id);
  });

  test('queries only completed sessions for the participant', async () => {
    mockPrisma.session.findMany.mockResolvedValue([]);

    await request(app).get(`/api/users/participants/${PARTICIPANT_CLERK_ID}/sessions`);

    expect(mockPrisma.session.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          participantClerkId: PARTICIPANT_CLERK_ID,
          status: 'completed',
        },
      })
    );
  });

  test('returns empty array when participant has no completed sessions', async () => {
    mockPrisma.session.findMany.mockResolvedValue([]);

    const res = await request(app).get(
      `/api/users/participants/${PARTICIPANT_CLERK_ID}/sessions`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 500 when DB query throws', async () => {
    mockPrisma.session.findMany.mockRejectedValue(new Error('Query failed'));

    const res = await request(app).get(
      `/api/users/participants/${PARTICIPANT_CLERK_ID}/sessions`
    );

    expect(res.statusCode).toBe(500);
  });
});
