'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Reading document.documentElement's data-motion attribute (set by
// app/layout.tsx's blocking pre-hydration script) directly in a useState
// lazy initializer was tried first and rejected: it makes the client's
// FIRST hydration render diverge from the server-rendered HTML (SSR always
// computes `false`, since there is no `document` there), which is exactly a
// React hydration mismatch — confirmed empirically in a real browser
// (`npm run dev`), where it produced "Hydration failed because the server
// rendered text didn't match the client" for Counter's text content, plus
// React discarding and regenerating the tree client-side.
//
// The fix that avoids the mismatch while still avoiding a *visible* flash:
// keep the initial state identical on both server and client (`false`), and
// correct it in useLayoutEffect instead of useEffect. useLayoutEffect fires
// synchronously after the DOM commit but before the browser paints, so the
// correction happens in the same frame as hydration — the user never sees a
// painted frame with the wrong branch, and the initial hydration render
// matches SSR exactly, so there's nothing to warn about. useLayoutEffect
// itself warns when it runs during SSR ("does nothing on the server"), so we
// fall back to useEffect there via the standard isomorphic-layout-effect
// pattern (same trick used by Redux, MUI, Framer Motion, etc.) — it's a
// no-op either way during SSR, this just silences that specific warning.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
