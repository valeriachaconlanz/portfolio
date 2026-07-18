'use client';

import { motion } from 'motion/react';
import { profile } from '@/content/profile';
import { IridescentBackground } from '@/components/IridescentBackground';
import { PixelVC } from '@/components/PixelVC';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Hero.module.css';

// Design-spec copy (see docs/superpowers/specs/2026-07-17-redesign-oil-slick.md)
// for the domain tag row — presentational chrome, not a fact about her, so
// it isn't sourced from content/profile.ts.
const DOMAIN_TAGS = ['BACKEND', 'APIs', 'CLOUD', 'FULL-STACK'];

// profile.location is "Miami, Florida" — the hero only needs the city.
function cityFromLocation(location: string): string {
  return location.split(',')[0].trim();
}

export function Hero() {
  const reduced = useReducedMotion();
  const [firstName, lastName] = profile.name.split(' ');
  const city = cityFromLocation(profile.location);

  const wordmarkChildren = (
    <>
      <span className={s.word} aria-hidden="true">
        {firstName}
      </span>
      <PixelVC className={s.monogram} />
      <span className={s.word} aria-hidden="true">
        {lastName}
      </span>
    </>
  );

  return (
    <header className={s.hero}>
      <IridescentBackground />
      <div className={s.overlay} aria-hidden="true" />

      <div className={s.content}>
        <div className={s.topBar}>
          <a className={s.topLink} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className={s.topLink} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>

        <div className={s.bubbleWrap}>
          <div className={s.bubble}>
            <div className={s.bubbleFrame} aria-hidden="true" />
            <p className={s.bubbleText}>Open to work!</p>
          </div>
          <div className={s.bubbleTail} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={s.wordmarkWrap}>
          {/* Element-swap under reduced motion, mirroring Reveal.tsx: Motion
              reads `initial` once at mount and ignores later prop changes,
              so toggling `initial` alone would let the entrance animation
              play once and then just look "wrong" rather than actually
              being skipped. Swapping the element type forces a remount
              instead, which happens inside useReducedMotion's pre-paint
              layout-effect correction, so the browser never paints the
              animated version when motion is reduced. */}
          {reduced ? (
            <h1 className={s.wordmark} aria-label={profile.name}>
              {wordmarkChildren}
            </h1>
          ) : (
            <motion.h1
              className={s.wordmark}
              aria-label={profile.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {wordmarkChildren}
            </motion.h1>
          )}
        </div>

        <div className={s.bottomRow}>
          <div className={s.bottomLeft}>
            <p>Software engineer</p>
            <p>Based in {city}</p>
          </div>
          <div className={s.scrollCue} aria-hidden="true">
            ▼
          </div>
          <ul className={s.tags}>
            {DOMAIN_TAGS.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
