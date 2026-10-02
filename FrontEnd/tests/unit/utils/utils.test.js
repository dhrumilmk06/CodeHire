/**
 * Unit tests for src/lib/utils.js
 *
 * Tests the two exported functions:
 *   - cn(...inputs)                   — class name merger
 *   - getDifficultyBadgeClass(diff)   — difficulty → badge CSS class
 */
import { cn, getDifficultyBadgeClass } from '../../../src/lib/utils.js';

// ─── cn ────────────────────────────────────────────────────────────────────────

describe('cn (class name merger)', () => {
  test('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  test('filters out falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  test('handles conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });

  test('deduplicates conflicting Tailwind classes (tailwind-merge)', () => {
    // tailwind-merge keeps the last of conflicting utilities
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  test('returns empty string when all inputs are falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  test('returns single class unchanged', () => {
    expect(cn('text-xl')).toBe('text-xl');
  });
});

// ─── getDifficultyBadgeClass ───────────────────────────────────────────────────

describe('getDifficultyBadgeClass', () => {
  test('returns badge-success for "easy"', () => {
    expect(getDifficultyBadgeClass('easy')).toBe('badge-success');
  });

  test('returns badge-success for "Easy" (case-insensitive)', () => {
    expect(getDifficultyBadgeClass('Easy')).toBe('badge-success');
  });

  test('returns badge-warning for "medium"', () => {
    expect(getDifficultyBadgeClass('medium')).toBe('badge-warning');
  });

  test('returns badge-warning for "MEDIUM" (case-insensitive)', () => {
    expect(getDifficultyBadgeClass('MEDIUM')).toBe('badge-warning');
  });

  test('returns badge-error for "hard"', () => {
    expect(getDifficultyBadgeClass('hard')).toBe('badge-error');
  });

  test('returns badge-error for "Hard" (case-insensitive)', () => {
    expect(getDifficultyBadgeClass('Hard')).toBe('badge-error');
  });

  test('returns badge-ghost for unknown difficulty', () => {
    expect(getDifficultyBadgeClass('legendary')).toBe('badge-ghost');
  });

  test('returns badge-ghost for undefined', () => {
    expect(getDifficultyBadgeClass(undefined)).toBe('badge-ghost');
  });

  test('returns badge-ghost for empty string', () => {
    expect(getDifficultyBadgeClass('')).toBe('badge-ghost');
  });
});
