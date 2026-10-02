import { test, expect } from '@playwright/test';
import { mockClerkAuth } from './helpers/auth.js';

/**
 * Phase 5.3 – Code execution E2E tests.
 *
 * Covers:
 *   - Loading problem details in the session room
 *   - Writing code in the Monaco editor
 *   - Executing code and viewing stdout/stderr in OutputPanel
 *   - Auto Score panel showing loading state when code is run
 */
test.describe('Code Execution & Scoring', () => {
  const MOCK_SESSION_ID = 'sess_mock123';

  test.beforeEach(async ({ page }) => {
    await mockClerkAuth(page, { role: 'host', userId: 'user_host_1', firstName: 'Alice' });

    // Mock session API
    await page.route(`**/api/sessions/${MOCK_SESSION_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          session: {
            _id: MOCK_SESSION_ID,
            session_code: 'CODE99',
            status: 'active',
            host: { clerkId: 'user_host_1', name: 'Alice' },
            problem: 'Two Sum',
            problems: [{ title: 'Two Sum', difficulty: 'Easy' }],
          },
        }),
      });
    });

    // Mock standard problem definition
    await page.route('**/api/standard-problems/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          title: 'Two Sum',
          difficulty: 'easy',
          category: 'Algorithms',
          description: { text: 'Given an array of integers...', notes: [] },
          starterCode: { javascript: 'function twoSum(nums, target) {\n\n}' },
          expectedOutput: 'some output'
        }),
      });
    });

    // Mock agent status to avoid console errors
    await page.route(`**/api/agent/status/${MOCK_SESSION_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, agentActive: false }),
      });
    });
  });

  test('user can submit code and view output', async ({ page }) => {
    // Navigate directly to session room
    await page.goto(`/session/${MOCK_SESSION_ID}`);
    
    // Wait for editor to load
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
    
    // Check that problem description is visible
    await expect(page.getByText('Given an array of integers')).toBeVisible();

    // Fill code (Monaco editor requires specific handling, click and type)
    await page.locator('.monaco-editor').click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.insertText('console.log("Hello CodeHire!");');

    // Mock the code execution backend
    await page.route('**/api/sessions/run-code', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          output: 'Hello CodeHire!\n',
          error: '',
          stderr: ''
        }),
      });
    });

    // Click Run Code
    const runBtn = page.getByRole('button', { name: /Run Code/i });
    await expect(runBtn).toBeEnabled();
    await runBtn.click();

    // Verify loading state
    await expect(page.getByText('Running...')).toBeVisible();

    // Verify output panel updates
    await expect(page.locator('.text-success').filter({ hasText: 'Hello CodeHire!' })).toBeVisible({ timeout: 5000 });
  });

  test('user sees auto score results panel when hidden tests run', async ({ page }) => {
    await page.goto(`/session/${MOCK_SESSION_ID}`);
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });

    // Mock run-code with a small delay so we can see the loading state
    await page.route('**/api/sessions/run-code', async (route) => {
      await new Promise(r => setTimeout(r, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, output: 'Output' }),
      });
    });

    const runBtn = page.getByRole('button', { name: /Run Code/i });
    await expect(runBtn).toBeEnabled();
    await runBtn.click();

    // Check for Auto Score Panel in scoring state
    await expect(page.getByText(/Running hidden tests/i)).toBeVisible();
  });
});
