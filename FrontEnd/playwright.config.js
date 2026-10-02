import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration for CodeHire FrontEnd.
 * Tests live in ./tests/e2e/ and run against the Vite dev server.
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Use one worker on CI, default (number of CPUs) locally
  workers: process.env.CI ? 1 : undefined,

  // Shared settings for every test
  use: {
    baseURL: 'http://localhost:5173',
    // Collect trace on first retry for easier debugging
    trace: 'on-first-retry',
    // Take a screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Spin up the Vite dev server before running tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
