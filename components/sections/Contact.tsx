'use client';

import { profile } from '@/content/profile';
import { Magnetic } from '@/components/motion/Magnetic';
import s from './Contact.module.css';

export function Contact() {
  return (
    <footer id="contact" className={s.section} aria-labelledby="contact-heading">
      <h2 id="contact-heading" className={s.heading}>
        Let’s talk.
      </h2>

      <Magnetic strength={0.2}>
        <a className={s.email} href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </Magnetic>

      <nav className={s.links} aria-label="Elsewhere">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </nav>

      <p className={`mono ${s.colophon}`}>
        {profile.location} · Built with Next.js, GSAP, and matter.js · Press ⌘K
      </p>
    </footer>
  );
}
