import { test, expect } from '@playwright/test';
import { loginViaClerkModal } from './helpers/auth.js';

/**
 * Phase 5.1 – Authentication E2E tests.
 *
 * Tests the authentication lifecycle:
 *   - Landing page branding & CTA presence
 *   - Sign Up modal triggering & registration UI
 *   - Sign In modal triggering & credential inputs
 *   - Form validation & error states on invalid credentials
 *   - Protected route redirection for unauthenticated visitors
 */
test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('landing page loads with branding, navigation, and CTA buttons', async ({ page }) => {
    // Check page title and core headings
    await expect(page).toHaveTitle(/CodeHire/i);
    await expect(page.getByText('Code Together,')).toBeVisible();
    await expect(page.getByText('Learn Together')).toBeVisible();

    // Check navbar navigation links
    await expect(page.getByRole('link', { name: 'Features' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'How it Works' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Testimonials' }).first()).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started →' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Coding Now/i })).toBeVisible();
  });

  test('user can trigger sign up flow', async ({ page }) => {
    // Click "Get Started →" to open the registration modal
    await page.getByRole('button', { name: 'Get Started →' }).click();

    // Verify the Clerk modal backdrop and modal container appear
    const modal = page.locator('.cl-modalBackdrop').first();
    await expect(modal).toBeVisible({ timeout: 10000 });
  });

  test('user can trigger sign in flow', async ({ page }) => {
    // Click "Sign In" in the navbar
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify Clerk sign-in modal appears
    const modal = page.locator('.cl-modalBackdrop').first();
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Verify identifier input field is displayed
    const emailInput = page.locator('.cl-formFieldInput, input[name="identifier"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
  });

  test('invalid credentials show error', async ({ page }) => {
    // Open sign in modal
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Locate the email / identifier input inside the modal
    const emailInput = page.locator('.cl-formFieldInput, input[name="identifier"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // Submit invalid / malformed email format
    await emailInput.fill('invalid-email-address');

    // Click the Clerk primary submit button
    const continueBtn = page.locator('.cl-formButtonPrimary').first();
    await expect(continueBtn).toBeVisible({ timeout: 5000 });
    await continueBtn.click();

    // Verify input validation triggers: HTML5 checkValidity is false & validationMessage is present
    const isInvalid = await emailInput.evaluate((el) => !el.checkValidity());
    const validationMsg = await emailInput.evaluate((el) => el.validationMessage);
    expect(isInvalid).toBe(true);
    expect(validationMsg.length).toBeGreaterThan(0);
  });

  test('unauthenticated user is redirected from protected routes', async ({ page }) => {
    // Attempting to visit /dashboard without auth should redirect to landing page
    await page.goto('/dashboard');
    await page.waitForURL('**/', { timeout: 10000 });
    await expect(page.getByText('Code Together,')).toBeVisible();

    // Attempting to visit /my-interviews without auth should redirect to landing page
    await page.goto('/my-interviews');
    await page.waitForURL('**/', { timeout: 10000 });
    await expect(page.getByText('Code Together,')).toBeVisible();
  });
});
