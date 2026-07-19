# valeriachaconlanz.com

Personal website. Next.js App Router, GSAP ScrollTrigger, Motion, Lenis, matter.js.

## Develop

```bash
npm install
npm run dev
```

## Test

```bash
npm test    # Vitest — content integrity and pure logic
npm run e2e # Playwright — rendering, a11y, reduced motion
```

## Editing content

All résumé facts live in `content/`. Nothing is hardcoded in components.

- `content/profile.ts` — name, links, résumé path
- `content/experience.ts` — roles, newest first
- `content/project.ts` — SproutFund
- `content/skills.ts` — the physics pile
- `content/education.ts` — schools and awards

To swap the résumé, replace `public/resume.pdf`.
