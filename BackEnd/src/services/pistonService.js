/**
 * pistonService.js
 *
 * Handles code execution for Bug Bounty auto-tests via the local Piston API.
 * Piston base URL: http://localhost:2000
 */

const PISTON_ENDPOINT = 'http://localhost:2000/api/v2/execute';
const EXECUTION_TIMEOUT_MS = 10000; // 10 seconds per test case

// ---------------------------------------------------------------------------
// Language → Piston runtime mapping
// ---------------------------------------------------------------------------
const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python:     { language: 'python',     version: '3.10.0' },
  java:       { language: 'java',       version: '15.0.2' },
  cpp:        { language: 'c++',        version: '10.2.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
};

// File name map for proper naming inside Piston
// Java is handled dynamically — see getJavaFileName()
const FILE_NAME_MAP = {
  javascript: 'solution.js',
  python:     'solution.py',
  cpp:        'solution.cpp',
  typescript: 'solution.ts',
};

// For Java, Piston compiles then runs `java <ClassName>` — the filename must match.
function getFileName(language, code = '') {
  if (language === 'java') {
    const match = code.match(/(?:public\s+)?class\s+(\w+)/);
    const className = match ? match[1] : 'Main';
    return `${className}.java`;
  }
  return FILE_NAME_MAP[language] || 'solution.txt';
}

// Piston's Java runtime hardcodes `java Main` — rename the user's class to Main.
function normalizeJavaCode(code) {
  const match = code.match(/(?:public\s+)?class\s+(\w+)/);
  if (!match || match[1] === 'Main') return code;
  const originalName = match[1];
  return code.replace(new RegExp(`\\b${originalName}\\b`, 'g'), 'Main');
}

// ---------------------------------------------------------------------------
// Internal: execute one test case against Piston
// ---------------------------------------------------------------------------
async function executeOnPiston(code, runtime, fileName, stdin) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT_MS);

  try {
    const response = await fetch(PISTON_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal:  controller.signal,
      body: JSON.stringify({
        language: runtime.language,
        version:  runtime.version,
        files:    [{ name: fileName, content: code }],
        stdin:    stdin ?? '',
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return { stdout: '', stderr: `Piston HTTP ${response.status}: ${text}`, exitCode: 1, error: null };
    }

    const data = await response.json();
    const run  = data.run ?? {};
    return {
      stdout:   run.stdout  ?? '',
      stderr:   run.stderr  ?? '',
      exitCode: run.code    ?? 0,
      error:    null,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { stdout: '', stderr: 'Execution timed out', exitCode: 1, error: 'TIMEOUT' };
    }
    return { stdout: '', stderr: err.message, exitCode: 1, error: err.message };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// runAutoTests — main export
// ---------------------------------------------------------------------------

/**
 * Runs the fixed bug-bounty code against an array of hidden test cases
 * using the local Piston API.
 *
 * @param {string} fixedCode        - The candidate's fixed code
 * @param {Array}  hiddenTestCases  - Array of { input, expectedOutput }
 * @param {string} language         - Language key (e.g. "javascript")
 * @returns {{ passed, total, score, details, error? }}
 */
export async function runAutoTests(fixedCode, hiddenTestCases, language) {
  const langKey  = (language || 'javascript').toLowerCase();
  const runtime  = LANGUAGE_MAP[langKey];

  if (!runtime) {
    return {
      passed: 0,
      total:  hiddenTestCases.length,
      score:  0,
      details: [],
      error:  `Unsupported language: ${language}`,
    };
  }

  // Piston's Java runtime ALWAYS runs `java Main` — normalize class name
  const normalizedCode = langKey === 'java' ? normalizeJavaCode(fixedCode) : fixedCode;
  const fileName = getFileName(langKey, normalizedCode);
  const total    = hiddenTestCases.length;
  let   passed   = 0;
  const details  = [];

  for (const testCase of hiddenTestCases) {
    const result = await executeOnPiston(normalizedCode, runtime, fileName, testCase.input ?? '');

    // If Piston is unreachable (ECONNREFUSED shows up as a network error with a specific message)
    if (
      result.error &&
      (result.error.includes('ECONNREFUSED') ||
       result.error.includes('ENOTFOUND')    ||
       result.error.includes('fetch failed'))
    ) {
      return {
        passed: 0,
        total,
        score:  0,
        details: [],
        error:  'Execution service unavailable',
      };
    }

    const actualOutput   = result.stdout.trim();
    const expectedOutput = String(testCase.expectedOutput ?? '').trim();
    const testPassed     = result.exitCode === 0 && actualOutput === expectedOutput;

    if (testPassed) passed++;

    const detail = {
      input:          testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput,
      passed:         testPassed,
    };
    // Include stderr if present (runtime error detail)
    if (result.stderr) detail.stderr = result.stderr;

    details.push(detail);
  }

  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return { passed, total, score, details };
}
