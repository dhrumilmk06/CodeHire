/**
 * Unit tests for src/hooks/useInView.js
 *
 * useInView uses IntersectionObserver to track element visibility.
 * We use `render` (not `renderHook`) with a real component that attaches
 * the returned ref to a DOM element, which causes React to populate
 * `ref.current` BEFORE `useEffect` runs — matching real browser behaviour.
 */
import React, { useState } from 'react';
import { render, act } from '@testing-library/react';
import { useInView } from '../../../src/hooks/useInView.js';

// ── Test component ─────────────────────────────────────────────────────────────

/**
 * Tiny component that uses the hook and exposes its state so we can read it.
 * `onStateChange` is called with the latest `isVisible` value after every render.
 */
function InViewConsumer({ onStateChange, options = {} }) {
  const [ref, isVisible] = useInView(options);
  onStateChange(isVisible);
  return <div ref={ref} data-testid="target" />;
}

// ── Mock IntersectionObserver ──────────────────────────────────────────────────

let capturedCallback;
let mockObserve;
let mockUnobserve;
let mockDisconnect;

beforeEach(() => {
  capturedCallback = null;
  mockObserve = jest.fn();
  mockUnobserve = jest.fn();
  mockDisconnect = jest.fn();

  global.IntersectionObserver = jest.fn((callback, options) => {
    capturedCallback = callback;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  });
});

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useInView', () => {
  test('initial isVisible is false', () => {
    let visible;
    render(<InViewConsumer onStateChange={(v) => { visible = v; }} />);
    expect(visible).toBe(false);
  });

  test('creates an IntersectionObserver when a DOM element is attached', () => {
    render(<InViewConsumer onStateChange={() => {}} />);
    expect(IntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  test('isVisible becomes true when entry is intersecting', () => {
    let visible;
    render(<InViewConsumer onStateChange={(v) => { visible = v; }} />);

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });

    expect(visible).toBe(true);
  });

  test('isVisible stays false when entry is not intersecting', () => {
    let visible;
    render(<InViewConsumer onStateChange={(v) => { visible = v; }} />);

    act(() => {
      capturedCallback([{ isIntersecting: false }]);
    });

    expect(visible).toBe(false);
  });

  test('does not revert to false once it becomes true (animate only once)', () => {
    let visible;
    render(<InViewConsumer onStateChange={(v) => { visible = v; }} />);

    act(() => { capturedCallback([{ isIntersecting: true }]); });
    expect(visible).toBe(true);

    // Firing again with false should NOT change state back
    act(() => { capturedCallback([{ isIntersecting: false }]); });
    expect(visible).toBe(true);
  });

  test('unobserves the element once visible (observe only once)', () => {
    render(<InViewConsumer onStateChange={() => {}} />);

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });

    // unobserve should have been called to stop tracking
    expect(mockUnobserve).toHaveBeenCalledTimes(1);
  });

  test('disconnects observer on unmount', () => {
    const { unmount } = render(<InViewConsumer onStateChange={() => {}} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  test('passes custom threshold option to IntersectionObserver', () => {
    render(<InViewConsumer onStateChange={() => {}} options={{ threshold: 0.5 }} />);
    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });
});
