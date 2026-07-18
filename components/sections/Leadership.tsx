import { roles } from '@/content/experience';
import { schools, awards } from '@/content/education';
import { Reveal } from '@/components/motion/Reveal';
import s from './Leadership.module.css';

const LEADERSHIP = roles.filter((r) => !r.isAmazon && r.id !== 'fifa-2024');

export function Leadership() {
  return (
    <section id="leadership" className={s.section} aria-labelledby="leadership-heading">
      <Reveal>
        <h2 id="leadership-heading" className={s.heading}>
          Leadership &amp; Education
        </h2>
      </Reveal>

      <div className={s.grid}>
        <div>
          <p className={`mono ${s.label}`}>Leadership</p>
          <ul className={s.list}>
            {LEADERSHIP.map((role) => (
              <li key={role.id} className={s.item}>
                <Reveal>
                  <p className={s.org}>{role.org}</p>
                  <p className={s.role}>{role.title}</p>
                  <p className={`mono ${s.dates}`}>
                    {role.start} — {role.end}
                  </p>
                  <ul className={s.bullets}>
                    {role.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={`mono ${s.label}`}>Education</p>
          <ul className={s.list}>
            {schools.map((school) => (
              <li key={`${school.name}-${school.credential}`} className={s.item}>
                <Reveal>
                  <p className={s.org}>{school.name}</p>
                  <p className={s.role}>{school.credential}</p>
                  <p className={`mono ${s.dates}`}>
                    {school.start} — {school.end}
                    {school.detail ? ` · ${school.detail}` : ''}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className={`mono ${s.label}`}>Awards</p>
          <ul className={s.awards}>
            {awards.map((award) => (
              <li key={award.label}>
                <span>{award.label}</span>
                {award.detail ? <span className={s.detail}> — {award.detail}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
