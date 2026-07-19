import { roles, amazonReturnCount } from '@/content/experience';
import { Reveal } from '@/components/motion/Reveal';
import s from './Return.module.css';

// Roles with a tech stack are the "stints" worth a card here (the three
// Amazon internships + FIFA); INIT/Girls Who Code (stack: []) live in
// Leadership instead. Same filter the old pinned-timeline build used, so the
// set of cards is unchanged by the redesign — only the mechanics are gone.
const TIMELINE = roles.filter((r) => r.stack.length > 0);

// Derived rather than written out, so the summary line stays true if another
// internship is added to content/experience.ts.
const AMAZON_YEARS = roles
  .filter((r) => r.isAmazon)
  .map((r) => r.start.split(' ').at(-1) ?? '')
  .reverse();

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const countWord = NUMBER_WORDS[amazonReturnCount] ?? String(amazonReturnCount);

const yearList =
  AMAZON_YEARS.length > 1
    ? `${AMAZON_YEARS.slice(0, -1).join(', ')}, and ${AMAZON_YEARS.at(-1)}`
    : AMAZON_YEARS[0];

export function Return() {
  return (
    <section id="return" className={s.section} aria-labelledby="return-heading">
      <Reveal>
        <div className={s.head}>
          <p className={`mono ${s.eyebrow}`}>{amazonReturnCount}&times; Amazon</p>
          <h2 id="return-heading" className={s.heading}>
            EXPERIENCE
          </h2>
          {/* One template string, not JSX text around expressions — JSX
              inserts a space between an expression and following punctuation,
              which rendered as "2026 ." */}
          <p className={s.sub}>
            {`${countWord} software engineering internships at Amazon — ${yearList}.`}
          </p>
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
