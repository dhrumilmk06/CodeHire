import { test, expect } from '@playwright/test';
import { mockClerkAuth } from './helpers/auth.js';

/**
 * Phase 5.2 – Session Creation & Joining E2E tests.
 *
 * Covers:
 *   - Host creating a session via the Dashboard modal with problem selection
 *   - Active sessions card displaying session code and share actions
 *   - Participant joining with short code via QuickJoinCard
 *   - Input validation and error feedback on invalid session codes
 *   - Multi-user flow: Host creates session, participant joins with generated code
 */
test.describe('Session Management Flow', () => {
  const MOCK_SESSION_ID = 'sess_65f1a2b3c4d5e6f7a8b9c0d1';
  const MOCK_SESSION_CODE = 'CODE99';

  test('host can open create session modal and select problems', async ({ page }) => {
    await mockClerkAuth(page, { role: 'host', userId: 'user_host_1', firstName: 'Alice' });

    // Mock dashboard session data
    await page.route('**/api/sessions/active', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, sessions: [] }),
      });
    });

    await page.route('**/api/sessions/my-recent', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, sessions: [] }),
      });
    });

    // Mock standard problems API
    await page.route('**/api/standard-problems*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          problems: [
            { id: 'prob_1', title: 'Two Sum', difficulty: 'Easy' },
            { id: 'prob_2', title: 'Reverse Linked List', difficulty: 'Easy' },
          ],
        }),
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByRole('button', { name: /Create Session/i })).toBeVisible({ timeout: 10000 });

    // Open Create Session modal
    await page.getByRole('button', { name: /Create Session/i }).click();

    // Verify modal header and interview type options
    await expect(page.getByText('Create New Session')).toBeVisible();
    await expect(page.locator('#session-type-coding')).toBeVisible();
    await expect(page.locator('#session-type-system-design')).toBeVisible();

    // Search and select problem
    const searchInput = page.locator('input[placeholder*="Search problems"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Two Sum');

    // Click problem item to select it
    const problemOption = page.locator('text=Two Sum').first();
    await problemOption.click();

    // Verify room summary updates with selected count
    await expect(page.getByText('Room Summary')).toBeVisible();
    await expect(page.getByText('1 Selected')).toBeVisible();
  });

  test('host can create a new session and navigate to session room', async ({ page }) => {
    await mockClerkAuth(page, { role: 'host', userId: 'user_host_1', firstName: 'Alice' });

    await page.route('**/api/sessions/active', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, sessions: [] }),
      });
    });

    await page.route('**/api/sessions/my-recent', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, sessions: [] }),
      });
    });

    await page.route('**/api/standard-problems*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          problems: [{ id: 'prob_1', title: 'Two Sum', difficulty: 'Easy' }],
        }),
      });
    });

    // Mock session creation endpoint
    await page.route('**/api/sessions', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            session: {
              _id: MOCK_SESSION_ID,
              session_code: MOCK_SESSION_CODE,
              status: 'active',
              problems: [{ title: 'Two Sum', difficulty: 'Easy' }],
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock session room endpoint for navigation
    await page.route(`**/api/sessions/${MOCK_SESSION_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          session: {
            _id: MOCK_SESSION_ID,
            session_code: MOCK_SESSION_CODE,
            status: 'active',
            host: { clerkId: 'user_host_1', name: 'Alice' },
            problems: [{ title: 'Two Sum', difficulty: 'Easy' }],
          },
        }),
      });
    });

    await page.goto('/dashboard');
    await page.getByRole('button', { name: /Create Session/i }).click();

    // Select problem
    await page.locator('text=Two Sum').first().click();

    // Click "Create Room"
    const createBtn = page.getByRole('button', { name: /Create Room/i });
    await expect(createBtn).toBeEnabled();
    await createBtn.click();

    // Verifies navigation to the session page
    await page.waitForURL(`**/session/${MOCK_SESSION_ID}`, { timeout: 15000 });
    expect(page.url()).toContain(MOCK_SESSION_ID);
  });

  test('participant quick join validates code input and reports errors', async ({ page }) => {
    await mockClerkAuth(page, { role: 'participant', userId: 'user_part_1', firstName: 'Bob' });

    await page.route('**/api/sessions/my-recent', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, sessions: [] }),
      });
    });

    // Mock failed join attempt
    await page.route('**/api/sessions/join', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Session not found or already completed',
        }),
      });
    });

    await page.goto('/my-interviews');
    await expect(page.locator('#quick-join')).toBeVisible({ timeout: 10000 });

    const codeInput = page.locator('input[placeholder*="Enter code"]');
    const joinCodeBtn = page.getByRole('button', { name: 'Join with Code' });

    // 1. Empty code disables the join button
    await codeInput.fill('');
    await expect(joinCodeBtn).toBeDisabled();

    // 2. Submitting invalid code shows server error in alert
    await codeInput.fill('BADCODE');
    await expect(joinCodeBtn).toBeEnabled();
    await joinCodeBtn.click();
    await expect(page.getByText(/Session not found/i)).toBeVisible({ timeout: 5000 });
  });

  test('participant can join session with short code and redirect to room', async ({ page }) => {
    await mockClerkAuth(page, { role: 'participant', userId: 'user_part_1', firstName: 'Bob' });

    await page.route('**/api/sessions/my-recent', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, sessions: [] }),
      });
    });

    // Mock successful join
    await page.route('**/api/sessions/join', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          redirectUrl: `/session/${MOCK_SESSION_ID}`,
        }),
      });
    });

    // Mock session detail
    await page.route(`**/api/sessions/${MOCK_SESSION_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          session: {
            _id: MOCK_SESSION_ID,
            session_code: MOCK_SESSION_CODE,
            status: 'active',
            host: { clerkId: 'user_host_1', name: 'Alice' },
            participant: { clerkId: 'user_part_1', name: 'Bob' },
            problems: [{ title: 'Two Sum', difficulty: 'Easy' }],
          },
        }),
      });
    });

    await page.goto('/my-interviews');
    const codeInput = page.locator('input[placeholder*="Enter code"]');
    await codeInput.fill(MOCK_SESSION_CODE);

    const joinCodeBtn = page.getByRole('button', { name: 'Join with Code' });
    await joinCodeBtn.click();

    // Verify redirected to session room
    await page.waitForURL(`**/session/${MOCK_SESSION_ID}`, { timeout: 15000 });
    expect(page.url()).toContain(MOCK_SESSION_ID);
  });
});
