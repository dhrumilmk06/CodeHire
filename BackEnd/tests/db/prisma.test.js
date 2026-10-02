/**
 * Phase 4: Database Integration Tests — Prisma Models
 *
 * These tests run against a REAL PostgreSQL database connection.
 * Configure DATABASE_URL in .env.test to point at a dedicated test DB.
 *
 * Run with:  npm run test:db
 *
 * Isolation: each test group uses afterEach cleanup (deleteMany in FK order)
 * so tests are fully independent.
 *
 * Schema facts used in these tests (from prisma/schema.prisma):
 *   User    : id (cuid), clerkId (unique), email (unique), name?, role, banned
 *   Session : id (cuid), hostId → User.clerkId, participantClerkId? → User.clerkId
 *             required: problemCodes (Json), timings (Json), difficulty, problem, problems (Json)
 *   CustomProblem : id (String), title, difficulty, examples/starterCode/hiddenTestCases (Json),
 *                   ownerClerkId, description (Json), constraints (String[])
 *   BugBountyProblem : id (autoincrement), title, language, buggyCode,
 *                      hiddenTestCases/initialTestCases (Json)
 */

import { describe, test, expect, beforeAll, afterEach, afterAll } from '@jest/globals';
import { prisma } from '../../src/lib/db.js';
import { truncateAll, disconnectDb } from './setup.js';

// ── Shared fixtures ───────────────────────────────────────────────────────────

const makeUser = (suffix = '') => {
  const rand = Math.floor(Math.random() * 100000);
  return {
    clerkId: `clerk_test_${suffix}_${Date.now()}_${rand}`,
    email:   `test${suffix}_${Date.now()}_${rand}@codehire-test.dev`,
    name:    `Test User ${suffix}`,
  };
};

/** Minimal valid Session seed (requires a pre-created host User's clerkId) */
const makeSession = (hostClerkId, overrides = {}) => ({
  hostId:       hostClerkId,
  difficulty:   'easy',
  problem:      'Two Sum',
  problems:     [{ title: 'Two Sum', difficulty: 'easy' }],
  problemCodes: {},
  timings:      [],
  ...overrides,
});

/** Minimal valid CustomProblem seed */
const makeCustomProblem = (ownerClerkId, suffix = '') => ({
  id:              `cp-test-${suffix}-${Date.now()}`,
  title:           `Test Problem ${suffix}`,
  difficulty:      'easy',
  ownerClerkId,
  examples:        [],
  starterCode:     { javascript: '// start' },
  hiddenTestCases: [],
  description:     { text: 'A test problem' },
  constraints:     [],
});

// ── Global lifecycle ──────────────────────────────────────────────────────────

beforeAll(async () => {
  // Verify DB connectivity before running any test
  await prisma.$queryRaw`SELECT 1`;
});

afterAll(async () => {
  await disconnectDb();
});

// ── User Model ────────────────────────────────────────────────────────────────

describe('User model', () => {
  afterEach(async () => {
    // Clean in FK-safe order (sessions reference users)
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  test('creates a user with required fields', async () => {
    const data = makeUser('create');
    const user = await prisma.user.create({ data });

    expect(user.id).toBeDefined();
    expect(user.clerkId).toBe(data.clerkId);
    expect(user.email).toBe(data.email);
    expect(user.name).toBe(data.name);
  });

  test('auto-assigns default role of "participant"', async () => {
    const user = await prisma.user.create({ data: makeUser('role') });
    expect(user.role).toBe('participant');
  });

  test('auto-assigns default banned=false', async () => {
    const user = await prisma.user.create({ data: makeUser('banned') });
    expect(user.banned).toBe(false);
  });

  test('sets createdAt and updatedAt timestamps automatically', async () => {
    const user = await prisma.user.create({ data: makeUser('ts') });
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  test('clerkId uniqueness constraint is enforced', async () => {
    const data = makeUser('unique-clerk');
    await prisma.user.create({ data });

    await expect(
      prisma.user.create({ data: { ...data, email: `other_${Date.now()}@example.com` } })
    ).rejects.toThrow();
  });

  test('email uniqueness constraint is enforced', async () => {
    const data = makeUser('unique-email');
    await prisma.user.create({ data });

    await expect(
      prisma.user.create({ data: { ...data, clerkId: `other_clerk_${Date.now()}` } })
    ).rejects.toThrow();
  });

  test('finds a user by clerkId', async () => {
    const created = await prisma.user.create({ data: makeUser('find-by-clerk') });

    const found = await prisma.user.findUnique({ where: { clerkId: created.clerkId } });

    expect(found).not.toBeNull();
    expect(found.id).toBe(created.id);
  });

  test('finds a user by email', async () => {
    const created = await prisma.user.create({ data: makeUser('find-by-email') });

    const found = await prisma.user.findUnique({ where: { email: created.email } });

    expect(found).not.toBeNull();
    expect(found.clerkId).toBe(created.clerkId);
  });

  test('updates user role successfully', async () => {
    const user = await prisma.user.create({ data: makeUser('update-role') });

    const updated = await prisma.user.update({
      where: { clerkId: user.clerkId },
      data:  { role: 'host' },
    });

    expect(updated.role).toBe('host');
  });

  test('updates banned flag successfully', async () => {
    const user = await prisma.user.create({ data: makeUser('ban') });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data:  { banned: true },
    });

    expect(updated.banned).toBe(true);
  });

  test('deletes a user by id', async () => {
    const user = await prisma.user.create({ data: makeUser('delete') });

    await prisma.user.delete({ where: { id: user.id } });

    const found = await prisma.user.findUnique({ where: { id: user.id } });
    expect(found).toBeNull();
  });

  test('upserts user — creates if absent', async () => {
    const data = makeUser('upsert-create');

    const result = await prisma.user.upsert({
      where:  { clerkId: data.clerkId },
      create: data,
      update: { name: 'Updated Name' },
    });

    expect(result.name).toBe(data.name);
  });

  test('upserts user — updates if present', async () => {
    const data = makeUser('upsert-update');
    await prisma.user.create({ data });

    const result = await prisma.user.upsert({
      where:  { clerkId: data.clerkId },
      create: data,
      update: { name: 'Updated Name' },
    });

    expect(result.name).toBe('Updated Name');
  });
});

// ── Session Model ─────────────────────────────────────────────────────────────

describe('Session model', () => {
  let host;
  let participant;

  beforeAll(async () => {
    host        = await prisma.user.create({ data: makeUser('session-host') });
    participant = await prisma.user.create({ data: makeUser('session-participant') });
  });

  afterEach(async () => {
    await prisma.session.deleteMany();
  });

  afterAll(async () => {
    const ids = [host?.id, participant?.id].filter(Boolean);
    if (ids.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
  });

  test('creates a session linked to a host via clerkId', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    expect(session.id).toBeDefined();
    expect(session.hostId).toBe(host.clerkId);
  });

  test('auto-assigns default status of "active"', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    expect(session.status).toBe('active');
  });

  test('auto-assigns default sessionType of "coding"', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    expect(session.sessionType).toBe('coding');
  });

  test('session_code uniqueness constraint is enforced', async () => {
    const code = `TEST${Date.now()}`;
    await prisma.session.create({
      data: makeSession(host.clerkId, { session_code: code }),
    });

    await expect(
      prisma.session.create({
        data: makeSession(host.clerkId, { session_code: code }),
      })
    ).rejects.toThrow();
  });

  test('finds a session by id and includes host relation', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    const found = await prisma.session.findUnique({
      where:   { id: session.id },
      include: { host: true },
    });

    expect(found).not.toBeNull();
    expect(found.host.clerkId).toBe(host.clerkId);
    expect(found.host.email).toBe(host.email);
  });

  test('joins a participant to a session', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    const updated = await prisma.session.update({
      where: { id: session.id },
      data:  { participantClerkId: participant.clerkId },
    });

    expect(updated.participantClerkId).toBe(participant.clerkId);
  });

  test('finds a session with both host and participant relations', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId, { participantClerkId: participant.clerkId }),
    });

    const found = await prisma.session.findUnique({
      where:   { id: session.id },
      include: { host: true, participant: true },
    });

    expect(found.host.clerkId).toBe(host.clerkId);
    expect(found.participant.clerkId).toBe(participant.clerkId);
  });

  test('updates session status to "completed"', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    const updated = await prisma.session.update({
      where: { id: session.id },
      data:  { status: 'completed' },
    });

    expect(updated.status).toBe('completed');
  });

  test('finds active sessions ordered by createdAt desc', async () => {
    await prisma.session.create({ data: makeSession(host.clerkId) });
    await prisma.session.create({ data: makeSession(host.clerkId) });

    const sessions = await prisma.session.findMany({
      where:   { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take:    20,
    });

    expect(sessions.length).toBeGreaterThanOrEqual(2);
    // Verify descending order
    const dates = sessions.map(s => s.createdAt.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  test('queries sessions by hostId (my-recent pattern)', async () => {
    await prisma.session.create({
      data: makeSession(host.clerkId, { status: 'completed' }),
    });

    const sessions = await prisma.session.findMany({
      where: {
        status: 'completed',
        OR: [
          { hostId:             host.clerkId },
          { participantClerkId: host.clerkId },
        ],
      },
    });

    expect(sessions.length).toBeGreaterThanOrEqual(1);
    expect(sessions.every(s => s.hostId === host.clerkId || s.participantClerkId === host.clerkId)).toBe(true);
  });

  test('finds a session by session_code', async () => {
    const code = `CODE${Date.now()}`;
    await prisma.session.create({
      data: makeSession(host.clerkId, { session_code: code }),
    });

    const found = await prisma.session.findUnique({
      where:   { session_code: code },
      include: { host: { select: { id: true, name: true, clerkId: true } } },
    });

    expect(found).not.toBeNull();
    expect(found.session_code).toBe(code);
    expect(found.host.clerkId).toBe(host.clerkId);
  });

  test('stores and retrieves problemCodes JSON field', async () => {
    const codes = { javascript: 'function solution() {}', python: 'def solution(): pass' };
    const session = await prisma.session.create({
      data: makeSession(host.clerkId, { problemCodes: codes }),
    });

    const found = await prisma.session.findUnique({ where: { id: session.id } });

    expect(found.problemCodes).toEqual(codes);
  });

  test('deletes a session by id', async () => {
    const session = await prisma.session.create({
      data: makeSession(host.clerkId),
    });

    await prisma.session.delete({ where: { id: session.id } });

    const found = await prisma.session.findUnique({ where: { id: session.id } });
    expect(found).toBeNull();
  });

  test('returns null for a non-existent session id', async () => {
    const found = await prisma.session.findUnique({ where: { id: 'non-existent-id-xyz' } });
    expect(found).toBeNull();
  });
});

// ── CustomProblem Model ───────────────────────────────────────────────────────

describe('CustomProblem model', () => {
  let owner;

  beforeAll(async () => {
    owner = await prisma.user.create({ data: makeUser('cp-owner') });
  });

  afterEach(async () => {
    await prisma.customProblem.deleteMany();
  });

  afterAll(async () => {
    if (owner?.id) {
      await prisma.user.delete({ where: { id: owner.id } });
    }
  });

  test('creates a CustomProblem with required fields', async () => {
    const data = makeCustomProblem(owner.clerkId, 'create');
    const problem = await prisma.customProblem.create({ data });

    expect(problem.id).toBe(data.id);
    expect(problem.title).toBe(data.title);
    expect(problem.ownerClerkId).toBe(owner.clerkId);
    expect(problem.difficulty).toBe('easy');
  });

  test('retrieves a CustomProblem by id', async () => {
    const data    = makeCustomProblem(owner.clerkId, 'find');
    await prisma.customProblem.create({ data });

    const found = await prisma.customProblem.findUnique({ where: { id: data.id } });

    expect(found).not.toBeNull();
    expect(found.title).toBe(data.title);
  });

  test('returns null for a non-existent CustomProblem id', async () => {
    const found = await prisma.customProblem.findUnique({ where: { id: 'no-such-id' } });
    expect(found).toBeNull();
  });

  test('stores and retrieves hiddenTestCases JSON array', async () => {
    const testCases = [
      { id: 'tc1', inputCode: { javascript: 'console.log(twoSum([2,7],9))' }, expectedOutput: '[0,1]' },
      { id: 'tc2', inputCode: { javascript: 'console.log(twoSum([3,2],6))' }, expectedOutput: '[0,1]' },
    ];

    const data = makeCustomProblem(owner.clerkId, 'tc');
    const problem = await prisma.customProblem.create({
      data: { ...data, hiddenTestCases: testCases },
    });

    const found = await prisma.customProblem.findUnique({ where: { id: problem.id } });
    expect(found.hiddenTestCases).toEqual(testCases);
    expect(Array.isArray(found.hiddenTestCases)).toBe(true);
    expect(found.hiddenTestCases).toHaveLength(2);
  });

  test('finds problems by ownerClerkId', async () => {
    await prisma.customProblem.create({ data: makeCustomProblem(owner.clerkId, 'list-a') });
    await prisma.customProblem.create({ data: makeCustomProblem(owner.clerkId, 'list-b') });

    const problems = await prisma.customProblem.findMany({
      where: { ownerClerkId: owner.clerkId },
    });

    expect(problems.length).toBeGreaterThanOrEqual(2);
    expect(problems.every(p => p.ownerClerkId === owner.clerkId)).toBe(true);
  });

  test('updates hiddenTestCases on an existing problem', async () => {
    const data    = makeCustomProblem(owner.clerkId, 'update');
    const problem = await prisma.customProblem.create({ data });

    const newTestCases = [{ id: 'tc-updated', expectedOutput: '42' }];
    const updated = await prisma.customProblem.update({
      where: { id: problem.id },
      data:  { hiddenTestCases: newTestCases },
    });

    expect(updated.hiddenTestCases).toEqual(newTestCases);
  });

  test('deletes a CustomProblem by id', async () => {
    const data = makeCustomProblem(owner.clerkId, 'del');
    await prisma.customProblem.create({ data });

    await prisma.customProblem.delete({ where: { id: data.id } });

    const found = await prisma.customProblem.findUnique({ where: { id: data.id } });
    expect(found).toBeNull();
  });
});

// ── BugBountyProblem Model ────────────────────────────────────────────────────

describe('BugBountyProblem model', () => {
  afterEach(async () => {
    await prisma.bugBountyProblem.deleteMany();
  });

  const makeBugProblem = (suffix = '') => ({
    title:            `Bug Problem ${suffix} ${Date.now()}`,
    language:         'javascript',
    bugDescription:   'This function has an off-by-one error',
    buggyCode:        'function sum(arr) { let t = 0; for(let i=1;i<arr.length;i++) t+=arr[i]; return t; }',
    hiddenTestCases:  [{ input: '[1,2,3]', expected: '6' }],
    initialTestCases: [{ input: '[1,2]', expected: '3' }],
  });

  test('creates a BugBountyProblem with required fields', async () => {
    const data    = makeBugProblem('create');
    const problem = await prisma.bugBountyProblem.create({ data });

    expect(problem.id).toBeDefined();
    expect(problem.title).toBe(data.title);
    expect(problem.language).toBe('javascript');
    expect(problem.bountyPoints).toBe(100); // default
  });

  test('auto-assigns default bountyPoints of 100', async () => {
    const problem = await prisma.bugBountyProblem.create({ data: makeBugProblem('points') });
    expect(problem.bountyPoints).toBe(100);
  });

  test('retrieves a BugBountyProblem by id', async () => {
    const created = await prisma.bugBountyProblem.create({ data: makeBugProblem('find') });

    const found = await prisma.bugBountyProblem.findUnique({ where: { id: created.id } });

    expect(found).not.toBeNull();
    expect(found.id).toBe(created.id);
    expect(found.title).toBe(created.title);
  });

  test('stores and retrieves hiddenTestCases JSON', async () => {
    const testCases = [
      { input: '[1,2,3]', expected: '6' },
      { input: '[0]',     expected: '0' },
    ];

    const created = await prisma.bugBountyProblem.create({
      data: { ...makeBugProblem('hiddentc'), hiddenTestCases: testCases },
    });

    const found = await prisma.bugBountyProblem.findUnique({ where: { id: created.id } });
    expect(found.hiddenTestCases).toEqual(testCases);
  });

  test('filters by language', async () => {
    await prisma.bugBountyProblem.create({ data: { ...makeBugProblem('js-lang'), language: 'javascript' } });
    await prisma.bugBountyProblem.create({ data: { ...makeBugProblem('py-lang'), language: 'python' } });

    const jsProblems = await prisma.bugBountyProblem.findMany({
      where: { language: 'javascript' },
    });

    expect(jsProblems.length).toBeGreaterThanOrEqual(1);
    expect(jsProblems.every(p => p.language === 'javascript')).toBe(true);
  });

  test('filters by difficultyLevel', async () => {
    await prisma.bugBountyProblem.create({
      data: { ...makeBugProblem('diff-easy'), difficultyLevel: 'easy' },
    });

    const easyProblems = await prisma.bugBountyProblem.findMany({
      where: { difficultyLevel: 'easy' },
    });

    expect(easyProblems.length).toBeGreaterThanOrEqual(1);
    expect(easyProblems.every(p => p.difficultyLevel === 'easy')).toBe(true);
  });

  test('returns null for a non-existent BugBountyProblem id', async () => {
    const found = await prisma.bugBountyProblem.findUnique({ where: { id: 9999999 } });
    expect(found).toBeNull();
  });

  test('deletes a BugBountyProblem by id', async () => {
    const created = await prisma.bugBountyProblem.create({ data: makeBugProblem('del') });

    await prisma.bugBountyProblem.delete({ where: { id: created.id } });

    const found = await prisma.bugBountyProblem.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });
});
