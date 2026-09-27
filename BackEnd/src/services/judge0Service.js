/**
 * judge0Service.js
 *
 * Handles code execution via the Judge0 CE public API (https://ce.judge0.com).
 * Used when process.env.CODE_EXECUTOR === 'judge0'.
 *
 * Base URL is read from process.env.JUDGE0_BASE_URL.
 * No auth token is required — the public instance is open.
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Language → Judge0 numeric language ID map
// ---------------------------------------------------------------------------
const JUDGE0_LANGUAGE_IDS = {
  javascript: 63, // Node.js 12.14.0
  python:     71, // Python 3.8.1
  java:       62, // Java 13.0.1
  cpp:        54, // C++ (GCC 9.2.0)
  c:          50, // C (GCC 9.2.0)
  typescript: 74, // TypeScript 3.7.4
};

// ---------------------------------------------------------------------------
// Judge0 status codes
// ---------------------------------------------------------------------------
// status.id === 3  → Accepted (success)
// status.id === 6  → Compilation Error
// status.id >= 7   → Runtime Error / TLE / Memory Limit Exceeded

// ---------------------------------------------------------------------------
// runCode — main export
// ---------------------------------------------------------------------------

/**
 * Execute a code snippet against Judge0 CE public API.
 *
 * @param {Object} params
 * @param {string} params.language  - Language key (e.g. "javascript")
 * @param {string} params.code      - Source code to execute
 * @param {string} [params.stdin]   - Standard input for the program (default: "")
 *
 * @returns {Promise<{
 *   stdout:       string,
 *   stderr:       string|null,
 *   success:      boolean,
 *   errorMessage: string|null
 * }>}
 */
async function runCode({ language, code, stdin = '' }) {
  // 1. Resolve language ID — fail fast for unsupported languages
  const langKey = (language || '').toLowerCase();
  const languageId = JUDGE0_LANGUAGE_IDS[langKey];

  if (languageId === undefined) {
    return {
      stdout:       '',
      stderr:       null,
      success:      false,
      errorMessage: `Unsupported language: ${language}`,
    };
  }

  // 2. Build base URL from env
  const baseUrl = (process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com').replace(/\/$/, '');

  try {
    // 3. Submit to Judge0 with wait=true (synchronous — no polling needed)
    const response = await axios.post(
      `${baseUrl}/submissions?base64_encoded=false&wait=true`,
      {
        language_id: languageId,
        source_code: code,
        stdin:       stdin ?? '',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000, // 15s — public instance can be slow
      }
    );

    const data = response.data;
    const status = data.status ?? {};

    // 4. Trim trailing newline Judge0 always appends
    const rawStdout = data.stdout ?? '';
    const stdout    = rawStdout.trimEnd();
    const stderr    = data.stderr || data.compile_output || null;

    // 5. Map status codes → success/error
    if (status.id === 3) {
      // Accepted
      return { stdout, stderr, success: true, errorMessage: null };
    }

    if (status.id === 6) {
      // Compilation Error
      return {
        stdout:       '',
        stderr:       stderr,
        success:      false,
        errorMessage: `Compilation Error: ${stderr || status.description}`,
      };
    }

    if (status.id >= 7) {
      // Runtime Error / TLE / MLE / etc.
      return {
        stdout:       stdout,
        stderr:       stderr,
        success:      false,
        errorMessage: `${status.description}: ${stderr || ''}`.trim(),
      };
    }

    // Any other status (e.g. In Queue, Processing — shouldn't happen with wait=true)
    return {
      stdout:       stdout,
      stderr:       stderr,
      success:      false,
      errorMessage: `Unexpected Judge0 status: ${status.description} (id=${status.id})`,
    };
  } catch (err) {
    // 6. Network / HTTP errors — never crash Express
    const message =
      err?.response?.data?.message ||
      err?.response?.statusText       ||
      err?.message                    ||
      'Unknown Judge0 network error';

    return {
      stdout:       '',
      stderr:       null,
      success:      false,
      errorMessage: `Judge0 request failed: ${message}`,
    };
  }
}

export { runCode };
