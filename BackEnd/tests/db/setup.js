/**
 * tests/db/setup.js
 *
 * Shared DB lifecycle helpers for Phase 4 integration tests.
 *
 * IMPORTANT: These tests run against a REAL database connection.
 * Set DATABASE_URL in .env.test to point at a dedicated test database
 * (e.g. codehire_test) — never your development or production database.
 *
 * Isolation strategy:
 *   - `truncateAll`  : fast per-test cleanup using TRUNCATE CASCADE
 *   - `disconnectDb` : called in afterAll to close the Prisma connection
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '../../src/lib/db.js';

const execAsync = promisify(exec);

/**
 * Runs Prisma migrations against the test database.
 * Call once in a global setup file or a top-level beforeAll.
 */
export async function setupTestDb() {
  await execAsync('npx prisma migrate deploy', {
    env: { ...process.env }
  });
}

/**
 * Truncates every table in dependency order (child → parent)
 * so foreign key constraints are satisfied without disabling them.
 *
 * Safe to call in afterEach for fast, isolated test runs.
 */
export async function truncateAll() {
  // Order: most-dependent first so FK constraints are satisfied
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "bug_bounty_hints_used",
      "bug_bounty_submissions",
      "WhiteboardSnapshot",
      "Session",
      "User",
      "bug_bounty_problems",
      "CustomProblem",
      "standardproblem"
    RESTART IDENTITY CASCADE
  `);
}

/**
 * Gracefully closes the Prisma connection.
 * Must be called in afterAll to prevent Jest from hanging.
 */
export async function disconnectDb() {
  await prisma.$disconnect();
}
