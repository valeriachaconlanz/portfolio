'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatClock } from '@/lib/clock';
import { roles } from '@/content/experience';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Speedup.module.css';

const FROM = 1800; // 30 minutes
const TO = 10;     // 10 seconds

const current = roles.find((r) => r.id === 'amazon-2026')!;

export function Speedup() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [seconds, setSeconds] = useState(FROM);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (reduced) {
      setSeconds(TO);
      setLanded(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const proxy = { value: FROM };
      gsap.to(proxy, {
        value: TO,
        ease: 'power4.in',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 65%',
          end: 'bottom 60%',
          scrub: 0.6,
          onUpdate: () => setSeconds(proxy.value),
          onLeave: () => setLanded(true),
          onEnterBack: () => setLanded(false),
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} className={s.section} aria-labelledby="speedup-heading">
      <p className={`mono ${s.eyebrow}`}>Amazon · Connections · {current.start} — Present</p>

      <h2 id="speedup-heading" className={s.heading}>
        Thirty minutes,
        <br />
        <span className={s.accent}>ten seconds.</span>
      </h2>

      <div className={`${s.clock} ${landed ? s.landed : ''}`} aria-hidden="true">
        {formatClock(seconds)}
      </div>
      <p className={s.srOnly}>
        An internal tool that reduces an administrator task from 30 minutes to 10 seconds.
      </p>

      <p className={s.body}>{current.bullets[0]}</p>

      <ul className={s.stack}>
        {current.stack.map((t) => (
          <li key={t} className={`mono ${s.node}`}>
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
