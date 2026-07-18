'use client';

import { profile } from '@/content/profile';
import { IridescentBackground } from '@/components/IridescentBackground';
import { Magnetic } from '@/components/motion/Magnetic';
import s from './Contact.module.css';

// Presentational chrome, not a fact about her — same rationale as Hero's
// DOMAIN_TAGS (see Hero.tsx): no content/*.ts module tracks "when the site
// was last touched," so it's hardcoded here rather than invented a source
// of truth for it.
const LAST_UPDATED = 'July 2026';

interface PixelButtonProps {
  href: string;
  variant: 'accent' | 'paper';
  children: React.ReactNode;
}

function PixelButton({ href, variant, children }: PixelButtonProps) {
  const external = !href.startsWith('mailto:');
  return (
    <a
      className={`${s.button} ${variant === 'accent' ? s.buttonAccent : s.buttonPaper}`}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className={`${s.buttonFrame} pixelCorners`} aria-hidden="true" />
      <span className={`${s.buttonLabel} pixelCorners`}>{children}</span>
    </a>
  );
}

export function Contact() {
  return (
    <footer id="contact" className={s.section} aria-labelledby="contact-heading">
      <IridescentBackground interactive={false} />
      <div className={s.overlay} aria-hidden="true" />

      <div className={s.content}>
        <h2 id="contact-heading" className={s.heading}>
          Let&rsquo;s build together
        </h2>

        <div className={s.buttons}>
          <PixelButton href={`mailto:${profile.email}`} variant="accent">
            Start a project
          </PixelButton>
          <PixelButton href={profile.linkedin} variant="paper">
            Say hi
          </PixelButton>
        </div>

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
            R&eacute;sum&eacute;
          </a>
        </nav>

        {/* Single template-string expression — see the comment on
            Speedup.tsx's eyebrow for why mixed JSX text/expression children
            aren't used here (a real, confirmed-in-browser space-eating bug
            at the expression/entity boundary). */}
        <p className={s.colophon}>
          {`${profile.location} · Built with Next.js, Motion & matter.js · Last updated ${LAST_UPDATED} · Press ⌘K`}
        </p>
      </div>
    </footer>
  );
}
