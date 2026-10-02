/**
 * Unit tests for src/utils/scoring.js
 *
 * Tests the two exported functions:
 *   - calculateScore(results)
 *   - evaluateTestCases(testCases, outputs)
 */
import { calculateScore, evaluateTestCases } from '../../../src/utils/scoring.js';

// ─── calculateScore ────────────────────────────────────────────────────────────

describe('calculateScore', () => {
  test('returns 100 for all passing tests', () => {
    expect(calculateScore([true, true, true])).toBe(100);
  });

  test('returns 0 for all failing tests', () => {
    expect(calculateScore([false, false, false])).toBe(0);
  });

  test('handles partial pass – 2 of 3', () => {
    // 2/3 = 66.67 → rounds to 67
    expect(calculateScore([true, false, true])).toBe(67);
  });

  test('handles partial pass – 1 of 4', () => {
    // 1/4 = 25
    expect(calculateScore([true, false, false, false])).toBe(25);
  });

  test('returns 0 for an empty array', () => {
    expect(calculateScore([])).toBe(0);
  });

  test('returns 0 when called with no arguments', () => {
    expect(calculateScore()).toBe(0);
  });

  test('handles a single passing test', () => {
    expect(calculateScore([true])).toBe(100);
  });

  test('handles a single failing test', () => {
    expect(calculateScore([false])).toBe(0);
  });

  test('score is always between 0 and 100', () => {
    const score = calculateScore([true, false, true, false, true]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ─── evaluateTestCases ─────────────────────────────────────────────────────────

describe('evaluateTestCases', () => {
  const testCases = [
    { expected: '3' },
    { expected: '8' },
    { expected: '0' },
  ];

  test('marks all outputs correct when they match expected', () => {
    const { results, score, passed } = evaluateTestCases(testCases, ['3', '8', '0']);
    expect(results).toEqual([true, true, true]);
    expect(score).toBe(100);
    expect(passed).toBe(3);
  });

  test('marks outputs incorrect when they do not match', () => {
    const { results, score } = evaluateTestCases(testCases, ['99', '99', '99']);
    expect(results).toEqual([false, false, false]);
    expect(score).toBe(0);
  });

  test('handles partial matches correctly', () => {
    const { results, score, passed, total } = evaluateTestCases(testCases, ['3', '99', '0']);
    expect(results).toEqual([true, false, true]);
    expect(passed).toBe(2);
    expect(total).toBe(3);
    expect(score).toBe(67);
  });

  test('compares values as strings (trims whitespace)', () => {
    const cases = [{ expected: '42' }];
    // Executor often returns output with trailing newlines
    const { results } = evaluateTestCases(cases, ['42\n']);
    expect(results[0]).toBe(true);
  });

  test('returns empty results and 0 score for empty inputs', () => {
    const { results, score, passed, total } = evaluateTestCases([], []);
    expect(results).toEqual([]);
    expect(score).toBe(0);
    expect(passed).toBe(0);
    expect(total).toBe(0);
  });
});
