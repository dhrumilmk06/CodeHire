/**
 * Scoring utilities for CodeHire.
 * Used by the interview session to compute a candidate's score
 * based on test-case pass/fail results returned by the executor.
 */

/**
 * Calculates a percentage score from an array of boolean pass/fail results.
 *
 * @param {boolean[]} results - Array where `true` = pass, `false` = fail
 * @returns {number} Score from 0–100, rounded to nearest integer.
 *                   Returns 0 for an empty array.
 *
 * @example
 * calculateScore([true, true, true]);   // 100
 * calculateScore([false, false]);        // 0
 * calculateScore([true, false, true]);   // 67
 */
export function calculateScore(results = []) {
  if (!results.length) return 0;
  const passed = results.filter(Boolean).length;
  return Math.round((passed / results.length) * 100);
}

/**
 * Evaluates code output against expected test-case values.
 *
 * Each test case is `{ expected: any }` and each output is the actual
 * value produced by the code executor (already parsed/trimmed).
 *
 * @param {Array<{expected: any}>} testCases
 * @param {any[]} outputs - Actual outputs (same length as testCases)
 * @returns {{ results: boolean[], score: number, passed: number, total: number }}
 */
export function evaluateTestCases(testCases = [], outputs = []) {
  const results = testCases.map((tc, i) => {
    const actual = outputs[i];
    // Compare as strings so numbers/strings align with executor text output
    return String(actual).trim() === String(tc.expected).trim();
  });

  const score = calculateScore(results);
  const passed = results.filter(Boolean).length;

  return {
    results,
    score,
    passed,
    total: testCases.length,
  };
}
