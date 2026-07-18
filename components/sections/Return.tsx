import { roles, amazonReturnCount } from '@/content/experience';
import { Reveal } from '@/components/motion/Reveal';
import s from './Return.module.css';

// Roles with a tech stack are the "stints" worth a card here (the three
// Amazon internships + FIFA); INIT/Girls Who Code (stack: []) live in
// Leadership instead. Same filter the old pinned-timeline build used, so the
// set of cards is unchanged by the redesign — only the mechanics are gone.
const TIMELINE = roles.filter((r) => r.stack.length > 0);

export function Return() {
  return (
    <section id="return" className={s.section} aria-labelledby="return-heading">
      <Reveal>
        <div className={s.head}>
          <p className={`mono ${s.eyebrow}`}>{amazonReturnCount}&times; Amazon</p>
          <h2 id="return-heading" className={s.heading}>
            THE RETURN
          </h2>
          <p className={s.sub}>Amazon asked three times.</p>
        </div>
      </Reveal>

      <div className={s.grid}>
        {TIMELINE.map((role, i) => (
          <Reveal key={role.id} delay={Math.min(i * 0.08, 0.32)}>
            <article className={s.card}>
              <p className={`mono ${s.dates}`}>
                {role.start} &mdash; {role.end ?? 'Present'}
              </p>
              <h3 className={s.org}>{role.org}</h3>
              <p className={s.title}>{role.title}</p>
              <p className={`mono ${s.city}`}>
                {role.city.name}, {role.city.state}
              </p>
              <ul className={s.bullets}>
                {role.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
