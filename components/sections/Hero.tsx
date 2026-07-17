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

// Words, not individual characters, are what may legally break onto a new
// line — breaking mid-word (e.g. "ValeriaCha" / "con") reads as broken, not
// intentional. Each word keeps its own non-wrapping run of per-letter
// motion.span children (for the assembling animation); wrapping only ever
// happens at the outer flex container's word boundaries. `wordOffsets` keeps
// the original global per-letter stagger index (delay = 0.2 + i * 0.03)
// continuous across words, matching the original single-array timing.
const WORDS = profile.name.split(' ');
const WORD_OFFSETS = WORDS.reduce<number[]>((acc, _word, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + WORDS[i - 1].length);
  return acc;
}, []);

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <header className={s.hero}>
      <p className={`mono ${s.location}`}>{profile.location}</p>

      <h1 className={s.name} aria-label={profile.name}>
        {WORDS.map((word, wi) => (
          <span key={wi} aria-hidden="true" className={s.word}>
            {word.split('').map((ch, i) => {
              const globalIndex = WORD_OFFSETS[wi] + i;
              // Element-swap, mirroring Reveal: under reduced motion, render
              // the plain final-state element instead of only toggling
              // `initial` on a motion.span. Motion reads `initial` once at
              // mount and ignores later changes to it, so toggling the prop
              // alone lets the entrance animation play regardless once
              // `reduced` has already mounted `false` (the SSR-safe start
              // value) and corrects a moment later. Swapping the element
              // type instead forces a remount, which happens inside
              // useReducedMotion's pre-paint layout effect correction — so
              // the browser never paints the animated version.
              if (reduced) {
                return (
                  <span key={globalIndex} className={s.letter}>
                    {ch}
                  </span>
                );
              }
              return (
                <motion.span
                  key={globalIndex}
                  className={s.letter}
                  initial={{ opacity: 0, y: 40, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.2 + globalIndex * 0.03, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>

      <div className={s.return}>
        <span className={s.count}>
          <Counter to={amazonReturnCount} />×
        </span>
        <div className={s.returnBody}>
          <p className={s.returnLead}>SDE Intern at Amazon</p>
          <ul className={s.cities}>
            {CITIES.map((city, i) =>
              reduced ? (
                <li key={i} className="mono">
                  {city}
                </li>
              ) : (
                <motion.li
                  key={i}
                  className="mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + i * 0.18, duration: 0.4 }}
                >
                  {city}
                </motion.li>
              ),
            )}
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
