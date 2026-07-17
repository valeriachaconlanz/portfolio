'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { sproutfund } from '@/content/project';
import { Reveal } from '@/components/motion/Reveal';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './SproutFund.module.css';

const NODES = [
  { id: 'react', label: 'React 19', x: 10, y: 50 },
  { id: 'spring', label: 'Spring Boot 3', x: 40, y: 50 },
  { id: 'claude', label: 'Claude API', x: 75, y: 22 },
  { id: 'supabase', label: 'Supabase', x: 75, y: 78 },
];

const EDGES = [
  { id: 'react-spring', d: 'M 18 50 L 33 50', label: 'JWT' },
  { id: 'spring-claude', d: 'M 48 47 Q 60 30 68 24' },
  { id: 'spring-supabase', d: 'M 48 53 Q 60 70 68 76', label: 'RLS' },
];

export function SproutFundSection() {
  const reduced = useReducedMotion();

  return (
    <section className={s.section} aria-labelledby="sproutfund-heading">
      <Reveal>
        <p className={`mono ${s.eyebrow}`}>Selected work</p>
        <h2 id="sproutfund-heading" className={s.heading}>
          {sproutfund.name}
        </h2>
        <p className={s.tagline}>{sproutfund.tagline}</p>
      </Reveal>

      <Reveal delay={0.1}>
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
            height={794}
            className={s.shot}
            sizes="(max-width: 900px) 100vw, 900px"
          />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className={s.body}>{sproutfund.description}</p>
      </Reveal>

      <svg className={s.diagram} viewBox="0 0 100 100" role="img" aria-label="Architecture: a React front end calls a Spring Boot API, which calls the Claude API and reads Supabase Postgres over verified JWTs with row-level security.">
        {EDGES.map((edge, i) => (
          <motion.path
            key={edge.id}
            d={edge.d}
            className={s.edge}
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease: 'easeInOut' }}
          />
        ))}
        {NODES.map((node, i) => (
          <motion.g
            key={node.id}
            initial={reduced ? false : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.4, delay: i * 0.2 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle cx={node.x} cy={node.y} r="7" className={s.node} />
            <text x={node.x} y={node.y + 13} className={s.nodeLabel} textAnchor="middle">
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>

      <Reveal>
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
          View the repository →
        </a>
      </Reveal>
    </section>
  );
}
