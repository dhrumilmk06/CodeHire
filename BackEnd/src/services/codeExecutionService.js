/**
 * codeExecutionService.js
 *
 * Code execution service for CodeHire — customized for its schema:
 *   - session.problemCodes  → Json { "javascript": "...", "python": "..." }
 *   - session.problem       → String (CustomProblem ID)
 *   - CustomProblem.hiddenTestCases → Json array [{ input, expectedOutput }]
 *   - session.testCasesPassed → String "X/Y"
 *
 * Piston API is expected to run locally on http://localhost:2000
 */

import { prisma } from '../lib/db.js';

const PISTON_ENDPOINT = 'http://localhost:2000/api/v2/execute';
const EXECUTION_TIMEOUT_MS = 3000;

// ---------------------------------------------------------------------------
// Language → Piston runtime mapping
// ---------------------------------------------------------------------------
const LANGUAGE_RUNTIME_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python:     { language: 'python',     version: '3.10.0'  },
  java:       { language: 'java',       version: '15.0.2'  },
  cpp:        { language: 'c++',        version: '10.2.0'  },
  c:          { language: 'c',          version: '10.2.0'  },
  typescript: { language: 'typescript', version: '5.0.3'   },
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Call the Piston API to execute a snippet of code with optional stdin.
 *
 * @param {string} code     - Source code to run
 * @param {string} language - Language key (e.g. "javascript")
 * @param {string} stdin    - Standard input for this run
 * @returns {{ stdout, stderr, exitCode, error }}
 */
async function runOnPiston(code, language, stdin = '') {
  const runtime = LANGUAGE_RUNTIME_MAP[language.toLowerCase()];
  if (!runtime) {
    return {
      stdout: '',
      stderr: `Unsupported language: ${language}`,
      exitCode: 1,
      error: `Unsupported language: ${language}`,
    };
  }

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
        files:    [{ name: 'solution', content: code }],
        stdin,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        stdout:   '',
        stderr:   `Piston HTTP ${response.status}: ${text}`,
        exitCode: 1,
        error:    `Piston returned HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const run  = data.run ?? {};

    return {
      stdout:   run.stdout ?? '',
      stderr:   run.stderr ?? '',
      exitCode: run.code   ?? 0,
      error:    null,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        stdout:   '',
        stderr:   'Execution timed out',
        exitCode: 1,
        error:    'TIMEOUT',
      };
    }
    return {
      stdout:   '',
      stderr:   err.message,
      exitCode: 1,
      error:    err.message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Execute code against an array of test cases and return pass/fail results.
 *
 * @param {string} code       - Source code to execute
 * @param {string} language   - Language key (e.g. "javascript")
 * @param {Array}  testCases  - Array of { input, expectedOutput }
 * @returns {{ status, testCasesPassed, failedTests, executionTime, error }}
 *
 * Return shape:
 *   status          : 'SUCCESS' | 'RUNTIME_ERROR' | 'TIMEOUT' | 'UNSUPPORTED_LANGUAGE' | 'NO_TEST_CASES'
 *   testCasesPassed : "7/10"  (string "X/Y")
 *   failedTests     : [{ index, input, expectedOutput, actualOutput, stderr }]
 *   executionTime   : total ms spent executing (all test cases)
 *   error           : null | string
 */
async function executeCode(code, language, testCases) {
  if (!code || typeof code !== 'string') {
    return {
      status:          'NO_CODE',
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      error:           'No code provided',
    };
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return {
      status:          'NO_TEST_CASES',
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      error:           'No test cases provided',
    };
  }

  const total      = testCases.length;
  let   passed     = 0;
  const failedTests = [];
  const startTime  = Date.now();

  for (let i = 0; i < testCases.length; i++) {
    const tc    = testCases[i];
    const stdin = tc.input ?? '';
    const expected = String(tc.expectedOutput ?? '').trim();

    const result = await runOnPiston(code, language, stdin);

    if (result.error === 'TIMEOUT') {
      return {
        status:          'TIMEOUT',
        testCasesPassed: `${passed}/${total}`,
        failedTests,
        executionTime:   Date.now() - startTime,
        error:           `Test case ${i + 1} timed out after ${EXECUTION_TIMEOUT_MS}ms`,
      };
    }

    if (result.exitCode !== 0 && result.error) {
      // Runtime error on this test case — record and continue
      failedTests.push({
        index:          i + 1,
        input:          stdin,
        expectedOutput: expected,
        actualOutput:   result.stdout.trim(),
        stderr:         result.stderr,
        error:          result.error,
      });
      continue;
    }

    const actual = result.stdout.trim();

    if (actual === expected) {
      passed++;
    } else {
      failedTests.push({
        index:          i + 1,
        input:          stdin,
        expectedOutput: expected,
        actualOutput:   actual,
        stderr:         result.stderr,
        error:          null,
      });
    }
  }

  const executionTime = Date.now() - startTime;

  // Determine overall status
  let status = 'SUCCESS';
  if (failedTests.some(ft => ft.error)) {
    // At least one runtime error occurred
    status = passed === 0 ? 'RUNTIME_ERROR' : 'PARTIAL_RUNTIME_ERROR';
  }

  return {
    status,
    testCasesPassed: `${passed}/${total}`,
    failedTests,
    executionTime,
    error: null,
  };
}

// ---------------------------------------------------------------------------

/**
 * Validate the stored solution in a Session's problemCodes for a given language.
 *
 * Fetches:
 *   1. Session by ID (to get problemCodes and problem ID)
 *   2. CustomProblem by session.problem (to get hiddenTestCases)
 *
 * @param {string} sessionId - Session.id (cuid)
 * @param {string} language  - Language key to validate (e.g. "javascript")
 * @returns {{ status, testCasesPassed, failedTests, executionTime, error }}
 */
async function validateProblemSolution(sessionId, language) {
  // 1. Fetch Session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return {
      status:          'SESSION_NOT_FOUND',
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      error:           `Session ${sessionId} not found`,
    };
  }

  // 2. Extract code for the requested language from problemCodes JSON
  const problemCodes = session.problemCodes ?? {};
  const code         = problemCodes[language];

  if (!code) {
    return {
      status:          'LANGUAGE_NOT_FOUND',
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      error:           `No ${language} code found in session.problemCodes`,
    };
  }

  // 3. Fetch CustomProblem using the stored problem ID string
  const customProblem = await prisma.customProblem.findUnique({
    where: { id: session.problem },
  });

  if (!customProblem) {
    return {
      status:          'PROBLEM_NOT_FOUND',
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      error:           `CustomProblem ${session.problem} not found`,
    };
  }

  const testCases = Array.isArray(customProblem.hiddenTestCases)
    ? customProblem.hiddenTestCases
    : [];

  // 4. Execute and return
  return executeCode(code, language, testCases);
}

// ---------------------------------------------------------------------------

/**
 * Validate an externally-provided hint code snippet against the hidden test
 * cases of the problem associated with a session.
 *
 * Fetches:
 *   1. Session by ID (to get session.problem)
 *   2. CustomProblem by session.problem (to get hiddenTestCases)
 *
 * @param {string} sessionId - Session.id (cuid)
 * @param {string} hintCode  - The hint code to validate (provided externally, e.g. from AI)
 * @param {string} language  - Language the hint is written in
 * @returns {{
 *   isValid       : boolean,
 *   passRate      : number,   // 0–1 float, e.g. 0.7
 *   testCasesPassed: string,  // "7/10"
 *   failedTests   : Array,
 *   executionTime : number,
 *   status        : string,
 *   error         : string|null
 * }}
 */
async function validateCodeHintForSession(sessionId, hintCode, language) {
  // 1. Fetch Session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return {
      isValid:         false,
      passRate:        0,
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      status:          'SESSION_NOT_FOUND',
      error:           `Session ${sessionId} not found`,
    };
  }

  // 2. Fetch CustomProblem using the stored problem ID string
  const customProblem = await prisma.customProblem.findUnique({
    where: { id: session.problem },
  });

  if (!customProblem) {
    return {
      isValid:         false,
      passRate:        0,
      testCasesPassed: '0/0',
      failedTests:     [],
      executionTime:   0,
      status:          'PROBLEM_NOT_FOUND',
      error:           `CustomProblem ${session.problem} not found`,
    };
  }

  const testCases = Array.isArray(customProblem.hiddenTestCases)
    ? customProblem.hiddenTestCases
    : [];

  // 3. Execute the hint code
  const result = await executeCode(hintCode, language, testCases);

  // 4. Derive pass rate and validity
  const [passedStr, totalStr] = result.testCasesPassed.split('/');
  const passedNum = parseInt(passedStr, 10) || 0;
  const totalNum  = parseInt(totalStr,  10) || 0;
  const passRate  = totalNum > 0 ? passedNum / totalNum : 0;

  // Consider valid if all test cases pass
  const isValid = passedNum === totalNum && totalNum > 0 && result.status === 'SUCCESS';

  return {
    isValid,
    passRate,
    testCasesPassed: result.testCasesPassed,
    failedTests:     result.failedTests,
    executionTime:   result.executionTime,
    status:          result.status,
    error:           result.error,
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { executeCode, validateProblemSolution, validateCodeHintForSession };
