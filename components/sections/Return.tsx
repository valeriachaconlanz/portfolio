'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { roles } from '@/content/experience';
import { projectCity } from '@/lib/project';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Return.module.css';

const PINNED = roles.filter((r) => r.stack.length > 0);

export function Return() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const el = track.current;
      const section = root.current;
      if (!el || !section) return;

      const distance = () => el.scrollWidth - window.innerWidth;

      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.round(self.progress * (PINNED.length - 1)));
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const activeCity = PINNED[active]?.city;

  return (
    <section ref={root} className={s.section} aria-labelledby="return-heading">
      <div className={s.head}>
        <h2 id="return-heading" className={s.heading}>
          The Return
        </h2>
        <p className={s.sub}>Amazon asked three times.</p>
      </div>

      <svg className={s.map} viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
        {PINNED.map((role, i) => {
          const { x, y } = projectCity(role.city.lat, role.city.lon);
          const lit = i <= active;
          return (
            <circle
              key={role.id}
              cx={x * 100}
              cy={y * 100}
              r={lit ? 1.6 : 0.9}
              className={lit ? s.pinLit : s.pin}
            />
          );
        })}
      </svg>

      <p className={`mono ${s.cityLabel}`} aria-live="polite">
        {activeCity ? `${activeCity.name}, ${activeCity.state}` : ''}
      </p>

      <div ref={track} className={s.track}>
        {PINNED.map((role) => (
          <article key={role.id} className={s.card}>
            <p className={`mono ${s.dates}`}>
              {role.start} — {role.end ?? 'Present'}
            </p>
            <h3 className={s.org}>{role.org}</h3>
            <p className={s.title}>{role.title}</p>
            <p className={`mono ${s.city}`}>
              {role.city.name}, {role.city.state}
            </p>
            <ul className={s.bullets}>
              {role.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <ul className={s.stack}>
              {role.stack.map((t) => (
                <li key={t} className="mono">
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
