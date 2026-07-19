'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '@/content/profile';
import s from './CommandPalette.module.css';

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const jump = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  }, []);

  const commands: Command[] = [
    { label: 'Experience', hint: 'Amazon ×3', run: () => jump('return') },
    { label: 'The 180× moment', hint: 'Connections', run: () => jump('speedup') },
    { label: 'SproutFund', hint: 'Project', run: () => jump('sproutfund') },
    { label: 'Skills', hint: 'Throw them', run: () => jump('skills') },
    { label: 'Leadership & Education', hint: 'INIT · FIU', run: () => jump('leadership') },
    { label: 'Contact', hint: 'Say hi', run: () => jump('contact') },
    { label: 'Open résumé', hint: 'PDF', run: () => window.open(profile.resume, '_blank') },
    { label: 'Open GitHub', hint: 'External', run: () => window.open(profile.github, '_blank') },
    { label: 'Open LinkedIn', hint: 'External', run: () => window.open(profile.linkedin, '_blank') },
    { label: 'Email Valeria', hint: profile.email, run: () => { window.location.href = `mailto:${profile.email}`; } },
  ];

  const matches = commands.filter((c) =>
    `${c.label} ${c.hint}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery('');
        setIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className={s.backdrop} onClick={() => setOpen(false)}>
      <div
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className={s.input}
          value={query}
          placeholder="Jump to…"
          aria-label="Search commands"
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, matches.length - 1));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              matches[index]?.run();
            }
          }}
        />
        <ul className={s.list}>
          {matches.map((c, i) => (
            <li key={c.label}>
              <button
                className={`${s.item} ${i === index ? s.active : ''}`}
                onClick={c.run}
                onMouseEnter={() => setIndex(i)}
              >
                <span>{c.label}</span>
                <span className={`mono ${s.hint}`}>{c.hint}</span>
              </button>
            </li>
          ))}
          {matches.length === 0 && <li className={s.empty}>No matches.</li>}
        </ul>
      </div>
    </div>
  );
}
