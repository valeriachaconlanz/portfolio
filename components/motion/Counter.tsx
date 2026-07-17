'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

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

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
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
