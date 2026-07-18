import { formatClock } from '@/lib/clock';
import { roles } from '@/content/experience';
import { Reveal } from '@/components/motion/Reveal';
import s from './Speedup.module.css';

const FROM = 1800; // 30 minutes
const TO = 10; // 10 seconds

const current = roles.find((r) => r.id === 'amazon-2026')!;

export function Speedup() {
  return (
    <section id="speedup" className={s.section} aria-labelledby="speedup-heading">
      <Reveal>
        {/* A single template-string expression, not mixed JSX text/expression
            children — JSX's line-boundary whitespace trimming silently ate
            the space between {current.start} and the following entity when
            this was written as literal text (confirmed via a real browser:
            textContent came back "...2026— Present", missing space). */}
        <p className={`mono ${s.eyebrow}`}>
          {`Amazon · Connections · ${current.start} — Present`}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 id="speedup-heading" className={s.heading}>
          <span className={s.clock}>{formatClock(FROM)}</span>
          <span className={s.arrow} aria-hidden="true">
            &rarr;
          </span>
          <span className={`${s.clock} ${s.accent}`}>{formatClock(TO)}</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className={s.multiplier}>
          180<span aria-hidden="true">&times;</span>
          <span className={s.srOnly}>times faster</span>
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className={s.body}>{current.bullets[0]}</p>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className={s.stack}>
          {current.stack.map((t) => (
            <li key={t} className={`mono ${s.node}`}>
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
