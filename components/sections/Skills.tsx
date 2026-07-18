'use client';

import { useEffect, useRef, useState } from 'react';
import { skills } from '@/content/skills';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Skills.module.css';

export function Skills() {
  const reduced = useReducedMotion();
  const scene = useRef<HTMLDivElement>(null);
  const [physics, setPhysics] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = scene.current;
    if (!el) return;

    let cleanup = () => {};
    let cancelled = false;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const M = await import('matter-js');
        if (cancelled) return;

        const w = el.clientWidth;
        const h = el.clientHeight;

        const engine = M.Engine.create({ gravity: { x: 0, y: 0.9 } });
        const render = M.Render.create({
          element: el,
          engine,
          options: { width: w, height: h, wireframes: false, background: 'transparent' },
        });

        const WALL = 60;
        const walls = [
          M.Bodies.rectangle(w / 2, h + WALL / 2, w * 2, WALL, { isStatic: true }),
          M.Bodies.rectangle(-WALL / 2, h / 2, WALL, h * 2, { isStatic: true }),
          M.Bodies.rectangle(w + WALL / 2, h / 2, WALL, h * 2, { isStatic: true }),
        ];

        const tokens = skills.map((skill, i) => {
          const width = skill.label.length * 11 + 34;
          return M.Bodies.rectangle(
            40 + Math.random() * Math.max(1, w - 80),
            -100 - i * 70,
            width,
            40,
            {
              chamfer: { radius: 20 },
              restitution: 0.55,
              friction: 0.15,
              render: { fillStyle: '#14151a', strokeStyle: '#4cc9f0', lineWidth: 1 },
            },
          );
        });

        const mouse = M.Mouse.create(render.canvas);
        const mouseConstraint = M.MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, render: { visible: false } },
        });
        // Let the page keep scrolling when the pointer crosses the canvas.
        mouse.element.removeEventListener('wheel', (mouse as any).mousewheel);

        M.Composite.add(engine.world, [...walls, ...tokens, mouseConstraint]);

        const runner = M.Runner.create();
        M.Runner.run(runner, engine);
        M.Render.run(render);

        // Draw labels on top of the bodies each frame.
        M.Events.on(render, 'afterRender', () => {
          const ctx = render.context;
          ctx.save();
          ctx.font = '12px ui-monospace, monospace';
          ctx.fillStyle = '#f4f2ed';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          tokens.forEach((body, i) => {
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            ctx.fillText(skills[i].label, 0, 0);
            ctx.restore();
          });
          ctx.restore();
        });

        setPhysics(true);

        cleanup = () => {
          M.Render.stop(render);
          M.Runner.stop(runner);
          M.Composite.clear(engine.world, false);
          M.Engine.clear(engine);
          render.canvas.remove();
        };
      },
      { threshold: 0.25 },
    );

    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup();
    };
  }, [reduced]);

  return (
    <section id="skills" className={s.section} aria-labelledby="skills-heading">
      <div className={s.head}>
        <h2 id="skills-heading" className={s.heading}>
          Skills
        </h2>
        <p className={s.sub}>{reduced ? 'What I build with.' : 'Throw them around.'}</p>
      </div>

      <div ref={scene} className={s.scene} aria-hidden="true" />

      {/*
        The canvas is invisible to assistive tech, so this list is the only
        accessible source of the skills. Once physics boots it becomes visually
        hidden — never `display: none`, which would drop it from the a11y tree
        and leave screen-reader users with an empty section.
      */}
      <ul className={`${s.fallback} ${physics ? s.visuallyHidden : ''}`}>
        {skills.map((skill) => (
          <li key={skill.label} className="mono">
            {skill.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
