import Image from 'next/image';
import { sproutfund } from '@/content/project';
import { Reveal } from '@/components/motion/Reveal';
import s from './SproutFund.module.css';

export function SproutFundSection() {
  return (
    <section id="sproutfund" className={s.section} aria-labelledby="sproutfund-heading">
      <Reveal>
        <p className="mono">Featured work</p>
        <h2 id="sproutfund-heading" className={s.heading}>
          FEATURED WORK
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <article className={s.card}>
          <div className={s.frame}>
            <div className={s.chrome} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <Image
              src={sproutfund.screenshot}
              alt={`${sproutfund.name} home page — an investment survey with a live market ticker`}
              width={1200}
              height={796}
              className={s.shot}
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>

          <div className={s.cardBody}>
            <h3 className={s.name}>{sproutfund.name}</h3>
            <p className={s.tagline}>{sproutfund.tagline}</p>
            <p className={s.body}>{sproutfund.description}</p>

            <div
              className={s.diagram}
              role="img"
              aria-label="Architecture: a React front end calls a Spring Boot API, which calls the Claude API and reads Supabase Postgres over verified JWTs with row-level security."
            >
              <span className={`mono ${s.node}`}>React 19</span>
              <span className={s.arrow} aria-hidden="true">
                &rarr;
              </span>
              <span className={`mono ${s.node}`}>Spring Boot 3</span>
              <span className={s.arrow} aria-hidden="true">
                &rarr;
              </span>
              <span className={s.nodeGroup}>
                <span className={`mono ${s.node}`}>Claude API</span>
                <span className={`mono ${s.node}`}>Supabase</span>
              </span>
            </div>

            <ul className={s.stack}>
              {sproutfund.stack.map((group) => (
                <li key={group.label}>
                  <p className={`mono ${s.groupLabel}`}>{group.label}</p>
                  <p className={s.groupItems}>{group.items.join(' · ')}</p>
                </li>
              ))}
            </ul>

            <p className={`mono ${s.credit}`}>{sproutfund.credit}</p>

            <a className={s.repo} href={sproutfund.repo} target="_blank" rel="noopener noreferrer">
              View the repository &rarr;
            </a>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
