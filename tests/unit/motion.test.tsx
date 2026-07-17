import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Counter } from '@/components/motion/Counter';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { triggerIntersection } from './setup';

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }));
}

describe('Counter', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders the final value immediately when motion is reduced', () => {
    mockReducedMotion(true);
    render(<Counter to={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('exposes the final value to assistive tech even while animating', () => {
    mockReducedMotion(false);
    render(<Counter to={180} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', '180');
  });

  it('does not start counting before the element intersects', () => {
    mockReducedMotion(false);
    render(<Counter to={50} />);
    // No triggerIntersection() call: the observer never fires, so the
    // count-up must not have started yet.
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  describe('count-up animation (fake timers)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('animates from 0, passes through an intermediate value, and settles on exactly `to`', () => {
      mockReducedMotion(false);
      render(<Counter to={180} duration={200} />);
      const el = screen.getByRole('status');
      expect(el).toHaveTextContent('0');

      act(() => triggerIntersection(el, true));

      // Mid-flight: should have moved off 0 but not yet reached the target.
      // This is what actually exercises the rAF tick + easeOutExpo math —
      // an implementation that jumped straight to `to` on intersection
      // (deleting the tick loop) would already show 180 here, and one that
      // never started would still show 0.
      act(() => {
        vi.advanceTimersByTime(80);
      });
      const mid = Number(el.textContent);
      expect(mid).toBeGreaterThan(0);
      expect(mid).toBeLessThan(180);

      // Past the full duration: t clamps to 1, so the eased value is
      // exactly `to`, not an approximation.
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(el).toHaveTextContent('180');
    });

    it('restarts and settles on a new target when `to` changes after the count-up already started', () => {
      mockReducedMotion(false);
      const { rerender } = render(<Counter to={10} duration={100} />);
      const el = screen.getByRole('status');

      act(() => triggerIntersection(el, true));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(el).toHaveTextContent('10');

      // Change the target after the first count-up has already finished
      // (started.current is still `true` from the first run). Without
      // resetting it on effect re-run, the new observer's callback bails
      // out immediately on `started.current`, and the counter stays frozen
      // at 10 forever.
      rerender(<Counter to={40} duration={100} />);
      act(() => triggerIntersection(el, true));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(el).toHaveTextContent('40');
    });
  });
});

describe('useReducedMotion', () => {
  beforeEach(() => vi.unstubAllGlobals());

  function Probe({ onRender }: { onRender: (value: boolean) => void }) {
    const reduced = useReducedMotion();
    onRender(reduced);
    return null;
  }

  it('starts at false (matching what SSR would render, since there is no document there) and self-corrects to the real preference', () => {
    // The initial render must be identical on the server and on the client's
    // first hydration pass, or React logs a hydration mismatch — verified
    // for real in a browser as part of this fix (see useReducedMotion.ts).
    // The correction happens in a layout effect instead of a plain effect so
    // it lands before the browser's next paint; testing-library flushes
    // both kinds of effects synchronously within render(), so this test
    // can't distinguish "before paint" from "after paint" — that part is
    // covered by the manual browser check, not by this unit test.
    mockReducedMotion(true);

    const renders: boolean[] = [];
    render(<Probe onRender={(v) => renders.push(v)} />);

    expect(renders[0]).toBe(false);
    expect(renders[renders.length - 1]).toBe(true);
  });
});
