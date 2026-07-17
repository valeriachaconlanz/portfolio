'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useIsomorphicLayoutEffect } from './useReducedMotion';

interface CounterProps {
  to: number;
  duration?: number;
  className?: string;
}

export function Counter({ to, duration = 1200, className }: CounterProps) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const frame = useRef(0);

  // `reduced` (and therefore the lazy useState initializer above) is always
  // `false` on the very first render, on both server and client — that's
  // what keeps hydration matching (see useReducedMotion.ts). Under reduced
  // motion the real value only arrives a moment later, once
  // useReducedMotion's own layout effect corrects it. This layout effect is
  // what snaps `value` to `to` in that same pre-paint pass — a plain
  // (post-paint) effect here was the cause of a ~100ms flash of "0" before
  // self-correcting to the target number.
  useIsomorphicLayoutEffect(() => {
    if (reduced) setValue(to);
  }, [reduced, to]);

  useEffect(() => {
    // `started` is a ref so it survives the observer callback's closure, but
    // that means it also survives across effect re-runs. Without resetting
    // it here, a changed `to` (or `duration`/`reduced`) after the count-up
    // already started would make the new observer bail out immediately on
    // `started.current`, freezing the counter at its old value.
    started.current = false;

    // The reduced-motion final value itself is set by the layout effect
    // above (before paint); this effect only owns the animated count-up
    // path, so it just needs to skip that path here.
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutExpo — fast out of the gate, settles precisely on the number
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(Math.round(eased * to));
          if (t < 1) frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    io.observe(el);

    // The rAF loop outlives the observer callback, so it must be cancelled here.
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [to, duration, reduced]);

  return (
    <span ref={ref} className={className} role="status" aria-label={String(to)}>
      {value}
    </span>
  );
}
