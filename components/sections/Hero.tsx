'use client';

import { motion } from 'motion/react';
import { profile } from '@/content/profile';
import { amazonReturnCount, roles } from '@/content/experience';
import { Counter } from '@/components/motion/Counter';
import { Magnetic } from '@/components/motion/Magnetic';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Hero.module.css';

// Derived, never hardcoded: oldest Amazon stint first, so the cities read
// in the order she actually went. Currently San Jose → Seattle → Seattle.
const CITIES = roles
  .filter((r) => r.isAmazon)
  .map((r) => r.city.name)
  .reverse();

export function Hero() {
  const reduced = useReducedMotion();
  const letters = profile.name.split('');

  return (
    <header className={s.hero}>
      <p className={`mono ${s.location}`}>{profile.location}</p>

      <h1 className={s.name} aria-label={profile.name}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={s.letter}
            initial={reduced ? false : { opacity: 0, y: 40, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.2 + i * 0.03, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h1>

      <div className={s.return}>
        <span className={s.count}>
          <Counter to={amazonReturnCount} />×
        </span>
        <div className={s.returnBody}>
          <p className={s.returnLead}>SDE Intern at Amazon</p>
          <ul className={s.cities}>
            {CITIES.map((city, i) => (
              <motion.li
                key={i}
                className="mono"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.18, duration: 0.4 }}
              >
                {city}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <p className={s.headline}>{profile.headline}</p>

      <nav className={s.links} aria-label="Primary">
        <Magnetic>
          <a className={s.primary} href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </Magnetic>
        <Magnetic>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </Magnetic>
        <Magnetic>
          <a href={`mailto:${profile.email}`}>Email</a>
        </Magnetic>
      </nav>
    </header>
  );
}
