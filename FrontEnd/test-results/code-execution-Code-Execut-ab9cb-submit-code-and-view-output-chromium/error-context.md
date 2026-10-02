# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: code-execution.spec.js >> Code Execution & Scoring >> user can submit code and view output
- Location: tests\e2e\code-execution.spec.js:64:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Given an array of integers')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Given an array of integers') with timeout 5000ms
  - waiting for getByText('Given an array of integers')
  - Target page, context or browser has been closed

```

```yaml
- navigation:
  - link "CodeHire Code Together":
    - /url: /
- heading "Two Sum" [level=1]
- paragraph: "Host: Alice • 1/2 participants"
- text: Interviewer Mode
- button "00:02"
- text: Easy
- button "End Session"
- separator
- img "JavaScript"
- combobox:
  - option "JavaScript" [selected]
  - option "Python"
  - option "Java"
  - option "C++"
- button "💡 Send AI Hint"
- button "Run Code"
- code:
  - textbox "Editor content"
- separator
- text: Output
- paragraph: Click "Run Code" to see the output here..
- separator
- paragraph: Connecting to video call...
- button "Notes"
- alert
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { mockClerkAuth } from './helpers/auth.js';
  3   | 
  4   | /**
  5   |  * Phase 5.3 – Code execution E2E tests.
  6   |  *
  7   |  * Covers:
  8   |  *   - Loading problem details in the session room
  9   |  *   - Writing code in the Monaco editor
  10  |  *   - Executing code and viewing stdout/stderr in OutputPanel
  11  |  *   - Auto Score panel showing loading state when code is run
  12  |  */
  13  | test.describe('Code Execution & Scoring', () => {
  14  |   const MOCK_SESSION_ID = 'sess_mock123';
  15  | 
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await mockClerkAuth(page, { role: 'host', userId: 'user_host_1', firstName: 'Alice' });
  18  | 
  19  |     // Mock session API
  20  |     await page.route(`**/api/sessions/${MOCK_SESSION_ID}`, async (route) => {
  21  |       await route.fulfill({
  22  |         status: 200,
  23  |         contentType: 'application/json',
  24  |         body: JSON.stringify({
  25  |           success: true,
  26  |           session: {
  27  |             _id: MOCK_SESSION_ID,
  28  |             session_code: 'CODE99',
  29  |             status: 'active',
  30  |             host: { clerkId: 'user_host_1', name: 'Alice' },
  31  |             problem: 'Two Sum',
  32  |             problems: [{ title: 'Two Sum', difficulty: 'Easy' }],
  33  |           },
  34  |         }),
  35  |       });
  36  |     });
  37  | 
  38  |     // Mock standard problem definition
  39  |     await page.route('**/api/standard-problems/*', async (route) => {
  40  |       await route.fulfill({
  41  |         status: 200,
  42  |         contentType: 'application/json',
  43  |         body: JSON.stringify({
  44  |           title: 'Two Sum',
  45  |           difficulty: 'easy',
  46  |           category: 'Algorithms',
  47  |           description: { text: 'Given an array of integers...', notes: [] },
  48  |           starterCode: { javascript: 'function twoSum(nums, target) {\n\n}' },
  49  |           expectedOutput: 'some output'
  50  |         }),
  51  |       });
  52  |     });
  53  | 
  54  |     // Mock agent status to avoid console errors
  55  |     await page.route(`**/api/agent/status/${MOCK_SESSION_ID}`, async (route) => {
  56  |       await route.fulfill({
  57  |         status: 200,
  58  |         contentType: 'application/json',
  59  |         body: JSON.stringify({ success: true, agentActive: false }),
  60  |       });
  61  |     });
  62  |   });
  63  | 
  64  |   test('user can submit code and view output', async ({ page }) => {
  65  |     // Navigate directly to session room
  66  |     await page.goto(`/session/${MOCK_SESSION_ID}`);
  67  |     
  68  |     // Wait for editor to load
  69  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
  70  |     
  71  |     // Check that problem description is visible
> 72  |     await expect(page.getByText('Given an array of integers')).toBeVisible();
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  73  | 
  74  |     // Fill code (Monaco editor requires specific handling, click and type)
  75  |     await page.locator('.monaco-editor').click();
  76  |     await page.keyboard.press('Control+a');
  77  |     await page.keyboard.press('Backspace');
  78  |     await page.keyboard.insertText('console.log("Hello CodeHire!");');
  79  | 
  80  |     // Mock the code execution backend
  81  |     await page.route('**/api/sessions/run-code', async (route) => {
  82  |       await route.fulfill({
  83  |         status: 200,
  84  |         contentType: 'application/json',
  85  |         body: JSON.stringify({
  86  |           success: true,
  87  |           output: 'Hello CodeHire!\n',
  88  |           error: '',
  89  |           stderr: ''
  90  |         }),
  91  |       });
  92  |     });
  93  | 
  94  |     // Click Run Code
  95  |     const runBtn = page.getByRole('button', { name: /Run Code/i });
  96  |     await expect(runBtn).toBeEnabled();
  97  |     await runBtn.click();
  98  | 
  99  |     // Verify loading state
  100 |     await expect(page.getByText('Running...')).toBeVisible();
  101 | 
  102 |     // Verify output panel updates
  103 |     await expect(page.locator('.text-success').filter({ hasText: 'Hello CodeHire!' })).toBeVisible({ timeout: 5000 });
  104 |   });
  105 | 
  106 |   test('user sees auto score results panel when hidden tests run', async ({ page }) => {
  107 |     await page.goto(`/session/${MOCK_SESSION_ID}`);
  108 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
  109 | 
  110 |     // Mock run-code with a small delay so we can see the loading state
  111 |     await page.route('**/api/sessions/run-code', async (route) => {
  112 |       await new Promise(r => setTimeout(r, 500));
  113 |       await route.fulfill({
  114 |         status: 200,
  115 |         contentType: 'application/json',
  116 |         body: JSON.stringify({ success: true, output: 'Output' }),
  117 |       });
  118 |     });
  119 | 
  120 |     const runBtn = page.getByRole('button', { name: /Run Code/i });
  121 |     await expect(runBtn).toBeEnabled();
  122 |     await runBtn.click();
  123 | 
  124 |     // Check for Auto Score Panel in scoring state
  125 |     await expect(page.getByText(/Running hidden tests/i)).toBeVisible();
  126 |   });
  127 | });
  128 | 
```