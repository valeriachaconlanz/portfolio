# Redesign — Oil-Slick / Brutalist-Pixel

**Date:** 2026-07-17 (redesign, supersedes the visual layer of the original site)
**Status:** Approved direction, building

## Goal

Re-skin the portfolio into the aesthetic of the user's reference (a Seth-Lukin-style site): a bold brutalist wordmark over a dark, glossy, iridescent oil-slick background that **reacts to the mouse**, a bright white content body with playful pixel-art decorations, scattered "featured work" cards, and an oil-slick footer.

**Keep the content strengths** from the original build — the 3× Amazon return, the 180× speedup, SproutFund, the experience timeline. The reference is a style guide, not a content spec. Nothing factual changes; the content modules (`content/*.ts`) are reused verbatim, so the content-integrity tests still hold.

**This is an original interpretation, not a clone.** No copy of Seth Lukin's layout, and no borrowed pixel avatar.

## User decisions (2026-07-17)

- **Wordmark center:** a pixel-art **"VC"** monogram badge sits between VALERIA and CHACON.
- **Experience heading:** **"CODING SINCE 2019"** (factual — high-school engineering magnet / robotics start), with the skills list below. Never imply years of professional work beyond the three internships.
- **Scope:** full redesign in this style.

## Palette & type (inverts the old dark site)

- **Base:** bright off-white paper `#f4f2ed` body, near-black ink `#0a0b0d` text — brutalist black-on-white.
- **Hero & footer:** the dark iridescent oil-slick (near-black with thin-film blue/purple/magenta/teal sheen + halftone dot texture).
- **Pixel-art accents:** small saturated reds/yellows/greens for flowers/decor only.
- **Display type:** a heavy grotesque (Archivo Black or similar) for the giant wordmark and section headings. **Mono** (JetBrains Mono) for the small-caps labels, tags, and UI chrome.
- No cyan carry-over from the old design; this is a fresh palette.

## Structure (top to bottom)

1. **Top bar** — `HELLO@…` / email left, `LINKEDIN.COM/IN/…` right, in mono small-caps. Centered **"OPEN TO WORK!"** pixel speech bubble.
2. **Hero** — giant `VALERIA` + [VC pixel badge] + `CHACON` wordmark over the mouse-reactive iridescent background. Below: `SOFTWARE ENGINEER · BASED IN MIAMI` left, domain tags right (`BACKEND, APIs, CLOUD, FULL-STACK`). A downward scroll cue.
3. **White rounded body shell** begins — playful outline pixel decorations (clouds, little flowers, trees) scattered as a light layer.
4. **FEATURED WORK** — huge heading, scattered cards. SproutFund (real screenshot) is the anchor; the Amazon/AWS/FIFA roles reframed as cards. Each card links out where a link exists (SproutFund → repo).
5. **Highlight stats** — the **3×** Amazon return and the **180×** speedup kept as bold moments in the new style (can be inline highlights, not necessarily the old animated clock).
6. **CODING SINCE 2019** — the centered skills list (languages, frameworks, cloud, tools) in the reference's stacked style.
7. **Footer** — **"LET'S BUILD TOGETHER"** huge, over the iridescent background again, with `START A PROJECT` (mailto) and `SAY HI` (mailto/LinkedIn) buttons. Location, local time, "last updated" line.

## The centerpiece: iridescent mouse-reactive background

A self-contained WebGL component (`IridescentBackground`) rendering a full-screen fragment shader:

- Domain-warped fbm noise → the flowing marbled oil-slick.
- Thin-film / iridescent color ramp (deep near-black base with blue→purple→magenta→teal sheen).
- A subtle halftone dot overlay to echo the reference's dot-matrix texture.
- A slow `time` animation so it lives on its own; **mouse position** warps the flow field / shifts the highlight so it visibly responds to cursor movement.
- **Raw WebGL, no three.js** — keep the bundle light.

**Fallbacks (hard requirements):**
- `prefers-reduced-motion: reduce` → freeze the animation (no time loop), render a single static frame; mouse response disabled or reduced to none.
- No WebGL context available → a static CSS gradient approximation (conic/radial oil-slick), no canvas.
- Must not jank: cap devicePixelRatio, pause the render loop when the hero is scrolled out of view (IntersectionObserver), and destroy the GL context on unmount.

## Reuse from the original build

- `content/*.ts` (all facts), `components/motion/*` (useReducedMotion, Reveal, Magnetic), `SmoothScroll`, `CommandPalette`.
- Content-integrity unit tests stay green (content unchanged).
- E2E tests (`tests/e2e/site.spec.ts`) will need updating for the new DOM/copy — that is expected and in scope.

## Constraints

- `prefers-reduced-motion` fully honored (shader freezes; reveals already handle it).
- Mobile: wordmark scales, the oil-slick still renders (cheaper), no horizontal scroll, touch doesn't break.
- Semantic HTML, one h1, keyboard reachable, accessible names on the canvas/decorations (decorations are `aria-hidden`).
- Performance: capped DPR, paused offscreen, no layout-property animation.

## Out of scope

The old animated map-timeline pin and the 30:00→0:10 scrub clock as-built may be replaced by simpler styled equivalents; keeping their exact mechanics is not required. Custom domain, blog, CMS.
