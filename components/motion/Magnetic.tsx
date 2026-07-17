'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

export function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  if (reduced) return <span>{children}</span>;

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
