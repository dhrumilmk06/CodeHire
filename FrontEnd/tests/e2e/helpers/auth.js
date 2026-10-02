/**
 * tests/e2e/helpers/auth.js
 *
 * Shared Playwright helpers for E2E tests.
 *
 * Because CodeHire uses Clerk for authentication (modal-based flows),
 * we provide both:
 *   1. `loginViaClerkModal`: walks through Clerk's live sign-in modal
 *      (used when CLERK_TEST_EMAIL and CLERK_TEST_PASSWORD are provided)
 *   2. `mockClerkAuth`: intercepts Clerk client and backend user endpoints
 *      so E2E tests can run reliably and deterministically offline / in CI
 *      without third-party rate limits or external dependencies.
 */

/**
 * Mocks Clerk frontend client and backend user profile for a given role.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ role?: 'host' | 'participant' | 'admin', userId?: string, firstName?: string, lastName?: string, email?: string }} options
 */
export async function mockClerkAuth(page, {
  role = 'host',
  userId = 'user_test_host',
  firstName = 'Test',
  lastName = 'User',
  email = 'test@codehire.dev',
} = {}) {
  await page.addInitScript(({ role, userId, firstName, lastName, email }) => {
    window.__E2E_USER__ = {
      id: userId,
      firstName,
      lastName,
      role,
      publicMetadata: { role },
      emailAddresses: [{ emailAddress: email }],
      reload: async () => {},
    };
  }, { role, userId, firstName, lastName, email });

  // Intercept backend /api/users/me auto-sync
  await page.route('**/api/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          clerkId: userId,
          email,
          name: `${firstName} ${lastName}`,
          role,
        },
      }),
    });
  });
}

/**
 * Logs in via the Clerk sign-in modal triggered from the Landing page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ email?: string, password?: string }} options
 */
export async function loginViaClerkModal(page, {
  email    = process.env.CLERK_TEST_EMAIL    || 'test-host@codehire-e2e.dev',
  password = process.env.CLERK_TEST_PASSWORD || 'TestPass123!',
} = {}) {
  await page.goto('/');

  // Click "Sign In" in the Landing navbar
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Clerk renders its modal inside an iframe or cl-card
  const clerkFrame = page.frameLocator('iframe[title*="Sign in"], iframe[src*="clerk"]').first();
  const hasIframe = await clerkFrame.locator('body').isVisible({ timeout: 3000 }).catch(() => false);

  if (hasIframe) {
    await clerkFrame.getByLabel(/email address/i).fill(email);
    await clerkFrame.getByRole('button', { name: /continue/i }).click();
    await clerkFrame.getByLabel(/password/i).fill(password);
    await clerkFrame.getByRole('button', { name: /sign in/i }).click();
  } else {
    // Direct modal DOM
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
    await emailInput.fill(email);
    const continueBtn = page.getByRole('button', { name: /continue/i }).first();
    await continueBtn.click();
    const passInput = page.locator('input[name="password"], input[type="password"]').first();
    if (await passInput.isVisible({ timeout: 3000 })) {
      await passInput.fill(password);
      await page.getByRole('button', { name: /sign in/i }).first().click();
    }
  }
}

/**
 * Waits for the app to finish redirecting to the host dashboard after login.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForDashboard(page) {
  await page.waitForURL('**/dashboard', { timeout: 15_000 });
}

/**
 * Waits for the app to redirect to the participant interviews page after login.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForParticipantPage(page) {
  await page.waitForURL('**/my-interviews', { timeout: 15_000 });
}
