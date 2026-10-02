/**
 * Test helper: createTestApp
 *
 * Builds a minimal Express app wired with the real route handlers but with
 * all external dependencies replaced by Jest mocks:
 *
 *   - protectRoute → injects a fake req.user (skips Clerk token validation)
 *   - prisma        → jest.mock'd at the test file level
 *   - stream/clerk  → jest.mock'd at the test file level
 *
 * Usage in test files:
 *   import { createTestApp } from '../helpers/createTestApp.js';
 *   const app = createTestApp(routerToMount, '/api/prefix');
 */

import express from 'express';
import { notFoundHandler } from '../../src/middleware/errorHandler.js';

/**
 * @param {import('express').Router} router  - The Express router to test
 * @param {string}                   prefix  - URL prefix (e.g. '/api/sessions')
 * @param {object}                   fakeUser - The fake user object injected as req.user
 */
export function createTestApp(
  router,
  prefix,
  fakeUser = {
    id: 'test-user-id',
    _id: 'test-user-id',
    clerkId: 'clerk_test_123',
    email: 'test@codehire.dev',
    name: 'Test User',
    role: 'host',
  }
) {
  const app = express();
  app.use(express.json());

  // Inject fake authenticated user — bypasses all Clerk token validation
  app.use((req, _res, next) => {
    req.user = fakeUser;
    next();
  });

  app.use(prefix, router);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (mirrors server.js behaviour)
  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}
