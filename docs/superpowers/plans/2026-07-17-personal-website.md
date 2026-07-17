# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Valeria Chacon's scroll-driven personal website, organized around the 3× Amazon return and the 180× speedup from her current Connections internship.

**Architecture:** A single Next.js App Router page composed of seven self-contained section components. All résumé content lives in typed data modules under `content/`, so facts are edited in one place and never hardcoded in JSX. Animation is layered: Motion handles component-level reveals, GSAP ScrollTrigger drives scroll sequencing (the horizontal pin, the clock collapse), Lenis smooths the scroll, and matter.js powers the skills pile only. Every animated section reads a single `useReducedMotion` hook and renders a static equivalent when motion is suppressed.

**Tech Stack:** Next.js 16.2.10 (App Router) · React 19.2.7 · TypeScript · CSS Modules · Motion 12.42.2 · GSAP 3.15.0 + ScrollTrigger · Lenis 1.3.25 · matter-js 0.20.0 · Vitest + React Testing Library · Playwright · Vercel

**Spec:** `docs/superpowers/specs/2026-07-17-personal-website-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Content is CS-only.** Meta Specialist and Best Buy are excluded by explicit decision. Never add them.
- **Facts come from `content/` modules only.** No résumé fact is ever hardcoded in a component.
- **SproutFund credit reads "Led a 4-person team."** Never imply solo authorship.
- **Skills are derived from real work.** Never use LinkedIn's endorsement list ("Advertising, Financial Analysis, Analytical Skills").
- **Accent color is light electric cyan-blue.** Never Amazon orange (`#FF9900`), never SproutFund lime (`#ccff00`).
- **`prefers-reduced-motion: reduce` is fully honored.** Every beat has a static equivalent that still communicates. This is a correctness requirement, not a nicety.
- **Animate only `transform` and `opacity`.** Never animate layout properties (`width`, `height`, `top`, `left`, `margin`). A portfolio that janks on a recruiter's laptop defeats its own purpose.
- **Semantic HTML.** Real landmarks (`<header>`, `<main>`, `<section>`, `<footer>`), one `<h1>`, heading levels never skipped, everything keyboard reachable.
- **Mobile works.** The horizontal scroll-jack degrades to vertical below 768px. The physics pile stays touch-draggable.
- **Node 26.3.0, npm 11.16.0.** Exact dependency versions as listed in Tech Stack.

## Verified facts (authoritative)

Conflicts between résumé and LinkedIn were adjudicated by Valeria on 2026-07-17. These resolutions are final:

- AWS was in **San Jose, CA** (not San Francisco)
- Amazon 2025 ran **May – August 2025** (not July)
- INIT had **over 100 active members** (not 45)
- INIT **President from August 2024**; on the e-board since **November 2023**

City coordinates use a normalized equirectangular projection over the continental US (lon −125→−66, lat 50→24), giving geographically real positions without a map outline:

| City | Lat | Lon | x | y |
|---|---|---|---|---|
| Seattle | 47.6 | −122.3 | 0.046 | 0.092 |
| San Jose | 37.3 | −121.9 | 0.053 | 0.488 |
| Miami | 25.8 | −80.2 | 0.759 | 0.931 |

## File Structure

```text
personal website/
├── app/
│   ├── layout.tsx              # Root layout, metadata, fonts, SmoothScroll + CommandPalette mount
│   ├── page.tsx                # Composes the seven sections in order
│   └── globals.css             # Design tokens, reset, base type
├── components/
│   ├── motion/
│   │   ├── useReducedMotion.ts # Single source of truth for motion suppression
│   │   ├── Counter.tsx         # Count-up number, respects reduced motion
│   │   ├── Reveal.tsx          # Scroll-triggered fade/rise wrapper
│   │   └── Magnetic.tsx        # Cursor-attracted wrapper for links/buttons
│   ├── sections/
│   │   ├── Hero.tsx            # Beat 1
│   │   ├── Return.tsx          # Beat 2 — horizontal pin + city constellation
│   │   ├── Speedup.tsx         # Beat 3 — 30:00 → 0:10
│   │   ├── SproutFund.tsx      # Beat 4 — screenshot + self-drawing architecture
│   │   ├── Skills.tsx          # Beat 5 — matter.js pile
│   │   ├── Leadership.tsx      # Beat 6 — INIT, GWC, education, awards
│   │   └── Contact.tsx         # Beat 7
│   ├── CommandPalette.tsx      # ⌘K easter egg
│   └── SmoothScroll.tsx        # Lenis provider
├── content/
│   ├── profile.ts              # Name, headline, links, résumé path
│   ├── experience.ts           # Amazon ×3, FIFA, INIT, GWC + city projection
│   ├── project.ts              # SproutFund
│   ├── skills.ts               # Skill tokens for the pile
│   └── education.ts            # Schools + awards
├── lib/
│   ├── types.ts                # Shared content types
│   └── project.ts              # projectCity() — lat/lon → normalized x/y
├── public/
│   ├── resume.pdf
│   └── sproutfund-home.png
└── tests/
    ├── unit/                   # Vitest
    └── e2e/                    # Playwright
```

**Why this shape:** sections are the unit of work and the unit of review — each owns its own animation, takes typed content as props, and can be built and rejected independently. Motion primitives are shared because three sections need count-up and reveal; duplicating them would guarantee drift. Content is separated from presentation because the résumé swap and the next internship must be one-file edits.

**Testing strategy, stated honestly:** you cannot unit-test whether an animation looks good. So the tests target what *can* break silently — content integrity (no excluded employers, no fabricated facts), pure logic (city projection, clock formatting), and end-to-end behavior (sections render, reduced motion actually suppresses, ⌘K works, no console errors). Visual quality is verified by looking at it with Playwright screenshots in Task 13.

---

### Task 1: Scaffold project and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tests/unit/smoke.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: a running Next dev server on port 3000; `npm test` (Vitest) and `npm run e2e` (Playwright) both green

- [ ] **Step 1: Scaffold Next.js**

```bash
cd "/Users/valeriachacon/Desktop/personal website"
npx --yes create-next-app@16.2.10 . --ts --app --no-tailwind --no-eslint --no-src-dir --import-alias "@/*" --use-npm --yes
```

If it refuses because the directory is non-empty, scaffold into a temp dir and move files in — do not delete `docs/` or `.git/`.

- [ ] **Step 2: Install dependencies at exact versions**

```bash
npm install motion@12.42.2 gsap@3.15.0 lenis@1.3.25 matter-js@0.20.0
npm install -D @types/matter-js@0.20.2 vitest@latest @vitejs/plugin-react@latest \
  @testing-library/react@latest @testing-library/jest-dom@latest jsdom@latest \
  @playwright/test@latest
npx playwright install chromium
```

- [ ] **Step 3: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
  },
  resolve: { alias: { '@': resolve(__dirname, '.') } },
});
```

Create `tests/unit/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Add test scripts**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"e2e": "playwright test"
```

- [ ] **Step 6: Write the smoke test**

Create `tests/unit/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('harness', () => {
  it('runs', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 7: Run it**

Run: `npm test`
Expected: PASS, 1 test.

- [ ] **Step 8: Copy assets into place**

```bash
cp "/Users/valeriachacon/Downloads/Documents/Work & Career/ValeriaChacon_Resume_SDE.pdf" public/resume.pdf
cp "/Users/valeriachacon/Desktop/sproutfund/sproutfund-home.png" public/sproutfund-home.png
ls -la public/resume.pdf public/sproutfund-home.png
```

Expected: both files exist and are non-zero.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest and Playwright"
```

---

### Task 2: Content types and city projection

**Files:**
- Create: `lib/types.ts`, `lib/project.ts`, `tests/unit/project.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `projectCity(lat: number, lon: number): { x: number; y: number }` — normalized 0–1 continental-US projection
  - Types: `City`, `Role`, `Experience`, `Project`, `Skill`, `School`, `Award`, `Profile`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/project.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { projectCity } from '@/lib/project';

describe('projectCity', () => {
  it('places Seattle in the top-left', () => {
    const { x, y } = projectCity(47.6, -122.3);
    expect(x).toBeCloseTo(0.046, 2);
    expect(y).toBeCloseTo(0.092, 2);
  });

  it('places San Jose on the west coast, below Seattle', () => {
    const { x, y } = projectCity(37.3, -121.9);
    expect(x).toBeCloseTo(0.053, 2);
    expect(y).toBeCloseTo(0.488, 2);
  });

  it('places Miami in the bottom-right', () => {
    const { x, y } = projectCity(25.8, -80.2);
    expect(x).toBeCloseTo(0.759, 2);
    expect(y).toBeCloseTo(0.931, 2);
  });

  it('orders the west coast left of Miami', () => {
    expect(projectCity(47.6, -122.3).x).toBeLessThan(projectCity(25.8, -80.2).x);
  });

  it('clamps out-of-range coordinates into the unit square', () => {
    const { x, y } = projectCity(80, -160);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(1);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- project`
Expected: FAIL — cannot resolve `@/lib/project`.

- [ ] **Step 3: Implement the projection**

Create `lib/project.ts`:

```ts
const LON_MIN = -125;
const LON_MAX = -66;
const LAT_MAX = 50;
const LAT_MIN = 24;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Equirectangular projection over the continental US, normalized to 0–1.
 * y is inverted so north maps to the top of the screen.
 */
export function projectCity(lat: number, lon: number): { x: number; y: number } {
  return {
    x: clamp01((lon - LON_MIN) / (LON_MAX - LON_MIN)),
    y: clamp01((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)),
  };
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test -- project`
Expected: PASS, 5 tests.

- [ ] **Step 5: Define shared types**

Create `lib/types.ts`:

```ts
export interface City {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export interface Role {
  id: string;
  org: string;
  title: string;
  city: City;
  start: string;        // "May 2026"
  end: string | null;   // null means current
  bullets: string[];
  stack: string[];
  isAmazon: boolean;
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  repo: string;
  screenshot: string;
  credit: string;
  stack: { label: string; items: string[] }[];
}

export interface Skill {
  label: string;
  group: 'language' | 'framework' | 'cloud' | 'tool';
}

export interface School {
  name: string;
  credential: string;
  detail: string | null;
  start: string;
  end: string;
}

export interface Award {
  label: string;
  detail: string | null;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}
```

- [ ] **Step 6: Commit**

```bash
git add lib tests/unit/project.test.ts
git commit -m "feat: add content types and continental-US city projection"
```

---

### Task 3: Content data modules

**Files:**
- Create: `content/profile.ts`, `content/experience.ts`, `content/project.ts`, `content/skills.ts`, `content/education.ts`, `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: `lib/types.ts` (all types), `lib/project.ts`
- Produces:
  - `profile: Profile`
  - `roles: Role[]` (reverse chronological), `amazonReturnCount: number`
  - `sproutfund: Project`
  - `skills: Skill[]`
  - `schools: School[]`, `awards: Award[]`

This is the task that guards factual integrity. The tests are the guard.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { profile } from '@/content/profile';
import { roles, amazonReturnCount } from '@/content/experience';
import { sproutfund } from '@/content/project';
import { skills } from '@/content/skills';
import { schools, awards } from '@/content/education';

describe('content integrity', () => {
  it('excludes non-CS retail employers', () => {
    const orgs = roles.map((r) => r.org.toLowerCase()).join(' ');
    expect(orgs).not.toContain('meta');
    expect(orgs).not.toContain('best buy');
  });

  it('counts three Amazon internships', () => {
    expect(amazonReturnCount).toBe(3);
    expect(roles.filter((r) => r.isAmazon)).toHaveLength(3);
  });

  it('has exactly one current role, at Amazon', () => {
    const current = roles.filter((r) => r.end === null);
    expect(current).toHaveLength(1);
    expect(current[0].isAmazon).toBe(true);
    expect(current[0].title).toContain('SDE Intern');
  });

  it('places AWS in San Jose, per the adjudicated fact', () => {
    const aws = roles.find((r) => r.org === 'AWS');
    expect(aws?.city.name).toBe('San Jose');
    expect(aws?.city.state).toBe('CA');
  });

  it('ends the 2025 Amazon internship in August, per the adjudicated fact', () => {
    const r = roles.find((r) => r.id === 'amazon-2025');
    expect(r?.end).toBe('August 2025');
  });

  it('states INIT membership as over 100, per the adjudicated fact', () => {
    const init = roles.find((r) => r.id === 'init-president');
    expect(init?.bullets.join(' ')).toContain('100');
    expect(init?.bullets.join(' ')).not.toContain('45');
  });

  it('never claims SproutFund was solo work', () => {
    expect(sproutfund.credit).toContain('4-person');
    expect(sproutfund.credit.toLowerCase()).not.toContain('solo');
  });

  it('lists skills from real work, not LinkedIn endorsements', () => {
    const labels = skills.map((s) => s.label);
    expect(labels).toContain('Java');
    expect(labels).toContain('React');
    expect(labels).toContain('DynamoDB');
    expect(labels).not.toContain('Advertising');
    expect(labels).not.toContain('Financial Analysis');
  });

  it('orders roles newest first', () => {
    expect(roles[0].id).toBe('amazon-2026');
  });

  it('links a résumé, GitHub, and email', () => {
    expect(profile.resume).toBe('/resume.pdf');
    expect(profile.github).toContain('github.com/valeriachaconlanz');
    expect(profile.email).toBe('valeriaachlz04@gmail.com');
  });

  it('graduates FIU in May 2027', () => {
    const fiu = schools.find((s) => s.name.includes('Florida International'));
    expect(fiu?.end).toBe('May 2027');
  });

  it('records the Amazon Future Engineer scholarship amount', () => {
    expect(awards.map((a) => a.detail).join(' ')).toContain('$40,000');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- content`
Expected: FAIL — cannot resolve `@/content/profile`.

- [ ] **Step 3: Write the content modules**

Create `content/profile.ts`:

```ts
import type { Profile } from '@/lib/types';

export const profile: Profile = {
  name: 'Valeria Chacon',
  headline: '3× SDE Intern @ Amazon · CS @ FIU',
  location: 'Miami, Florida',
  email: 'valeriaachlz04@gmail.com',
  github: 'https://github.com/valeriachaconlanz',
  linkedin: 'https://www.linkedin.com/in/valeriachaconlanz',
  resume: '/resume.pdf',
};
```

Create `content/experience.ts`:

```ts
import type { City, Role } from '@/lib/types';

export const SEATTLE: City = { name: 'Seattle', state: 'WA', lat: 47.6, lon: -122.3 };
export const SAN_JOSE: City = { name: 'San Jose', state: 'CA', lat: 37.3, lon: -121.9 };
export const MIAMI: City = { name: 'Miami', state: 'FL', lat: 25.8, lon: -80.2 };

export const roles: Role[] = [
  {
    id: 'amazon-2026',
    org: 'Amazon',
    title: 'SDE Intern · Connections',
    city: SEATTLE,
    start: 'May 2026',
    end: null,
    bullets: [
      'Building an internal tool that cuts an administrator task from 30 minutes to 10 seconds — roughly a 180× speedup.',
      'Designed the data model on DynamoDB and provisioned infrastructure as code with AWS CDK.',
      'Instrumented the service with CloudWatch, and applied AI tooling to the workflow it replaces.',
      'Participates in team code reviews.',
    ],
    stack: ['Java', 'DynamoDB', 'AWS CDK', 'CloudWatch'],
    isAmazon: true,
  },
  {
    id: 'amazon-2025',
    org: 'Amazon',
    title: 'SDE Intern · Annual Compensation (PXT)',
    city: SEATTLE,
    start: 'May 2025',
    end: 'August 2025',
    bullets: [
      'Engineered and deployed RESTful APIs automating Annual Compensation team workflows, cutting manual processing time by up to 40%.',
      'Led 80% of the front-end build in React and Stencil, delivering responsive dashboards that improved task visibility.',
      'Supported backend development in Java, integrating secure services across high-volume data operations.',
      'Worked cross-functionally with Program Managers and System Admins to align the build with business goals.',
    ],
    stack: ['Java', 'React', 'Stencil', 'REST'],
    isAmazon: true,
  },
  {
    id: 'aws-2024',
    org: 'AWS',
    title: 'SDE Intern',
    city: SAN_JOSE,
    start: 'May 2024',
    end: 'August 2024',
    bullets: [
      'Built a customizable API for the Amazon Q tool in Java, letting customers tailor their AI service usage — cutting service-integration time and cost by ~30%.',
      'Designed the API alongside senior engineers, testing with Insomnia and automating deployment through Amazon Pipelines.',
      'Reviewed design proposals with product managers and senior engineers.',
    ],
    stack: ['Java', 'Brazil', 'Insomnia', 'Amazon Pipelines'],
    isAmazon: true,
  },
  {
    id: 'fifa-2024',
    org: 'FIFA World Cup 2026',
    title: 'Venue Technology Intern',
    city: MIAMI,
    start: 'September 2024',
    end: 'November 2024',
    bullets: [
      'Designed and launched a landing page for the 2026 World Cup.',
      'Rebuilt a longstanding stadium data-collection form used across venues.',
      'Coordinated venue technology requirements with stadium staff.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    isAmazon: false,
  },
  {
    id: 'init-president',
    org: 'INIT MDC Kendall',
    title: 'President',
    city: MIAMI,
    start: 'August 2024',
    end: 'May 2025',
    bullets: [
      'Managed $10K in external funding, keeping the chapter financially sustainable.',
      'Built and led web development and GitHub workshops for over 100 active members.',
      'Led marketing for SeedAI Hackathon, one of Miami’s largest.',
      'On the e-board since November 2023.',
    ],
    stack: [],
    isAmazon: false,
  },
  {
    id: 'init-reach',
    org: 'INIT MDC Kendall',
    title: 'Reach Program Manager',
    city: MIAMI,
    start: 'October 2023',
    end: 'July 2024',
    bullets: [
      'Co-taught career and technical workshops, including GitHub and web development sessions.',
      'Mentored students toward engineering careers with individually tailored plans.',
    ],
    stack: [],
    isAmazon: false,
  },
  {
    id: 'gwc-2022',
    org: 'Girls Who Code',
    title: 'Summer Immersion Scholar',
    city: MIAMI,
    start: 'June 2022',
    end: 'June 2022',
    bullets: [
      'Selected for the Raytheon-sponsored immersion program, building software through intensive project work.',
    ],
    stack: [],
    isAmazon: false,
  },
];

export const amazonReturnCount = roles.filter((r) => r.isAmazon).length;
```

Create `content/project.ts`:

```ts
import type { Project } from '@/lib/types';

export const sproutfund: Project = {
  name: 'SproutFund',
  tagline: 'An AI investment advisor for people opening their first brokerage account.',
  description:
    'Users enter a budget, a timeline, and a risk tolerance. Claude generates a personalized strategy — real fund names, allocation percentages, and where to actually open the account. Plans can be saved, renamed, and revisited.',
  repo: 'https://github.com/valeriachaconlanz/SproutFund',
  screenshot: '/sproutfund-home.png',
  credit: 'Led a 4-person team · repo owner · 51 of 76 commits',
  stack: [
    { label: 'Frontend', items: ['React 19', 'Vite', 'React Router 7', 'CSS'] },
    { label: 'Backend', items: ['Java 17', 'Spring Boot 3', 'Maven'] },
    { label: 'AI', items: ['Anthropic Claude API'] },
    { label: 'Data & Auth', items: ['Supabase', 'Postgres', 'JWT', 'Row-level security'] },
  ],
};
```

Create `content/skills.ts`:

```ts
import type { Skill } from '@/lib/types';

export const skills: Skill[] = [
  { label: 'Java', group: 'language' },
  { label: 'Python', group: 'language' },
  { label: 'JavaScript', group: 'language' },
  { label: 'TypeScript', group: 'language' },
  { label: 'C++', group: 'language' },
  { label: 'SQL', group: 'language' },
  { label: 'HTML', group: 'language' },
  { label: 'CSS', group: 'language' },
  { label: 'React', group: 'framework' },
  { label: 'Spring Boot', group: 'framework' },
  { label: 'Stencil', group: 'framework' },
  { label: 'Vite', group: 'framework' },
  { label: 'AWS', group: 'cloud' },
  { label: 'DynamoDB', group: 'cloud' },
  { label: 'AWS CDK', group: 'cloud' },
  { label: 'CloudWatch', group: 'cloud' },
  { label: 'Supabase', group: 'cloud' },
  { label: 'Postgres', group: 'cloud' },
  { label: 'Git', group: 'tool' },
  { label: 'Maven', group: 'tool' },
  { label: 'REST APIs', group: 'tool' },
];
```

Create `content/education.ts`:

```ts
import type { Award, School } from '@/lib/types';

export const schools: School[] = [
  {
    name: 'Florida International University',
    credential: 'BS, Computer Science',
    detail: null,
    start: 'July 2025',
    end: 'May 2027',
  },
  {
    name: 'The Honors College at Miami Dade College',
    credential: 'AA, Computer Science',
    detail: 'Full-ride fellowship',
    start: 'August 2023',
    end: 'May 2025',
  },
  {
    name: 'Florida International University',
    credential: 'Dual Enrollment, Computer Science',
    detail: '4.00 GPA · FLAME program',
    start: 'September 2022',
    end: 'June 2023',
  },
  {
    name: 'Miami Coral Park Senior High',
    credential: 'Engineering Magnet, Computer Science',
    detail: 'Summa Cum Laude · top 10%',
    start: 'August 2019',
    end: 'June 2023',
  },
];

export const awards: Award[] = [
  { label: 'Amazon Future Engineer Scholarship', detail: '$40,000' },
  { label: 'Honors College Fellowship', detail: 'Full ride, two years' },
  { label: 'Academic Excellence Award', detail: 'Technology Faculty' },
  { label: 'Dean’s List', detail: '×2' },
  { label: 'Civic Action Award', detail: 'Bronze' },
];
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test -- content`
Expected: PASS, 12 tests.

- [ ] **Step 5: Commit**

```bash
git add content tests/unit/content.test.ts
git commit -m "feat: add typed content modules with integrity tests"
```

---

### Task 4: Design tokens and base styles

**Files:**
- Create/replace: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: CSS custom properties consumed by every section — `--ink`, `--paper`, `--accent`, `--accent-dim`, `--muted`, `--rule`, plus type scale `--step--1` through `--step-5` and `--mono`/`--sans` font variables

- [ ] **Step 1: Write the tokens**

Replace `app/globals.css`:

```css
:root {
  --ink: #0a0b0d;
  --paper: #f4f2ed;
  --accent: #4cc9f0;
  --accent-dim: #1b7f9e;
  --muted: #8b8d93;
  --rule: rgba(244, 242, 237, 0.12);

  --step--1: clamp(0.78rem, 0.75rem + 0.15vw, 0.86rem);
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.12rem);
  --step-1: clamp(1.3rem, 1.2rem + 0.5vw, 1.6rem);
  --step-2: clamp(1.8rem, 1.5rem + 1.4vw, 2.6rem);
  --step-3: clamp(2.6rem, 2rem + 3vw, 4.4rem);
  --step-4: clamp(3.6rem, 2.2rem + 6vw, 7rem);
  --step-5: clamp(5rem, 2rem + 14vw, 15rem);

  --gutter: clamp(1.25rem, 4vw, 5rem);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  /* Lenis drives scrolling; native smooth scroll would fight it. */
  scroll-behavior: auto;
}

body {
  margin: 0;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--sans), system-ui, sans-serif;
  font-size: var(--step-0);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

h1,
h2,
h3 {
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin: 0;
  text-wrap: balance;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

.mono {
  font-family: var(--mono), ui-monospace, monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: var(--step--1);
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Wire fonts and metadata into the layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { profile } from '@/content/profile';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${profile.name} — Software Engineer`,
  description: `${profile.headline}. Building an internal tool at Amazon that turns a 30-minute task into 10 seconds.`,
  openGraph: {
    title: `${profile.name} — Software Engineer`,
    description: profile.headline,
    type: 'profile',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the dev server renders**

Run: `npm run dev` and open `http://localhost:3000`
Expected: near-black background, off-white text, no console errors.

- [ ] **Step 4: Commit**

```bash
git add app
git commit -m "feat: add design tokens, fonts, and page metadata"
```

---

### Task 5: Motion primitives

**Files:**
- Create: `components/motion/useReducedMotion.ts`, `components/motion/Counter.tsx`, `components/motion/Reveal.tsx`, `components/motion/Magnetic.tsx`, `tests/unit/motion.test.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `useReducedMotion(): boolean` — reactive to the media query
  - `<Counter to={number} duration?={number} className?={string} />` — renders `to` immediately when motion is reduced
  - `<Reveal delay?={number} className?={string}>{children}</Reveal>`
  - `<Magnetic strength?={number}>{children}</Magnetic>` — no-op when motion is reduced

- [ ] **Step 1: Write the failing test**

Create `tests/unit/motion.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Counter } from '@/components/motion/Counter';

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }));
}

describe('Counter', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders the final value immediately when motion is reduced', () => {
    mockReducedMotion(true);
    render(<Counter to={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('exposes the final value to assistive tech even while animating', () => {
    mockReducedMotion(false);
    render(<Counter to={180} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', '180');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- motion`
Expected: FAIL — cannot resolve `@/components/motion/Counter`.

- [ ] **Step 3: Implement the hook**

Create `components/motion/useReducedMotion.ts`:

```ts
'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Implement Counter**

Create `components/motion/Counter.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface CounterProps {
  to: number;
  duration?: number;
  className?: string;
}

export function Counter({ to, duration = 1200, className }: CounterProps) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutExpo — fast out of the gate, settles precisely on the number
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(Math.round(eased * to));
          if (t < 1) frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    io.observe(el);

    // The rAF loop outlives the observer callback, so it must be cancelled here.
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [to, duration, reduced]);

  return (
    <span ref={ref} className={className} role="status" aria-label={String(to)}>
      {value}
    </span>
  );
}
```

- [ ] **Step 5: Implement Reveal**

Create `components/motion/Reveal.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Implement Magnetic**

Create `components/motion/Magnetic.tsx`:

```tsx
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
```

- [ ] **Step 7: Run it to verify it passes**

Run: `npm test -- motion`
Expected: PASS, 2 tests.

- [ ] **Step 8: Commit**

```bash
git add components/motion tests/unit/motion.test.tsx
git commit -m "feat: add reduced-motion-aware Counter, Reveal, and Magnetic primitives"
```

---

### Task 6: Smooth scroll provider

**Files:**
- Create: `components/SmoothScroll.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`
- Produces: `<SmoothScroll>{children}</SmoothScroll>` — mounts Lenis, syncs it to GSAP ScrollTrigger, disables itself entirely under reduced motion

- [ ] **Step 1: Implement the provider**

Create `components/SmoothScroll.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './motion/useReducedMotion';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    // Smoothing hijacks scroll physics — exactly what reduced-motion users opt out of.
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
```

- [ ] **Step 2: Mount it in the layout**

In `app/layout.tsx`, import `SmoothScroll` and wrap the body's children:

```tsx
<body>
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

- [ ] **Step 3: Verify scrolling feels smooth**

Run: `npm run dev`, scroll the page.
Expected: eased scrolling, no console errors. Then enable **System Settings → Accessibility → Display → Reduce motion**, reload, and confirm scrolling returns to native.

- [ ] **Step 4: Commit**

```bash
git add components/SmoothScroll.tsx app/layout.tsx
git commit -m "feat: add Lenis smooth scroll wired to ScrollTrigger"
```

---

### Task 7: Hero

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/Hero.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `amazonReturnCount`, `Counter`, `Magnetic`
- Produces: `<Hero />`

The hard requirement: name, headline, and all three links are visible without scrolling. A recruiter who bounces in 8 seconds still leaves with what they need.

- [ ] **Step 1: Write the section**

Create `components/sections/Hero.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import { profile } from '@/content/profile';
import { amazonReturnCount } from '@/content/experience';
import { Counter } from '@/components/motion/Counter';
import { Magnetic } from '@/components/motion/Magnetic';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Hero.module.css';

const CITIES = ['Seattle', 'San Jose', 'Seattle'];

export function Hero() {
  const reduced = useReducedMotion();
  const letters = profile.name.split('');

  return (
    <header className={s.hero}>
      <p className={`mono ${s.location}`}>{profile.location}</p>

      <h1 className={s.name} aria-label={profile.name}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={s.letter}
            initial={reduced ? false : { opacity: 0, y: 40, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.2 + i * 0.03, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h1>

      <div className={s.return}>
        <span className={s.count}>
          <Counter to={amazonReturnCount} />×
        </span>
        <div className={s.returnBody}>
          <p className={s.returnLead}>SDE Intern at Amazon</p>
          <ul className={s.cities}>
            {CITIES.map((city, i) => (
              <motion.li
                key={i}
                className="mono"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.18, duration: 0.4 }}
              >
                {city}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <p className={s.headline}>{profile.headline}</p>

      <nav className={s.links} aria-label="Primary">
        <Magnetic>
          <a className={s.primary} href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </Magnetic>
        <Magnetic>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </Magnetic>
        <Magnetic>
          <a href={`mailto:${profile.email}`}>Email</a>
        </Magnetic>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Write the styles**

Create `components/sections/Hero.module.css`:

```css
.hero {
  min-height: 100svh;
  padding: var(--gutter);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.location {
  margin: 0;
}

.name {
  font-size: var(--step-5);
  font-weight: 800;
  display: flex;
  flex-wrap: wrap;
}

.letter {
  display: inline-block;
  will-change: transform;
}

.return {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 1.25rem 0;
}

.count {
  font-size: var(--step-4);
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.returnBody {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.returnLead {
  margin: 0;
  font-size: var(--step-1);
}

.cities {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.headline {
  margin: 0;
  color: var(--muted);
  font-size: var(--step-1);
  max-width: 34ch;
}

.links {
  display: flex;
  gap: 1.75rem;
  align-items: center;
  font-size: var(--step-0);
}

.links a {
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 2px;
  transition: border-color 0.3s var(--ease), color 0.3s var(--ease);
}

.links a:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.primary {
  color: var(--accent);
  border-color: var(--accent) !important;
}

@media (max-width: 640px) {
  .return {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }

  .links {
    gap: 1.25rem;
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 3: Mount it**

Replace `app/page.tsx`:

```tsx
import { Hero } from '@/components/sections/Hero';

export default function Page() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: the name assembles letter by letter, `3×` counts up, three cities fade in, and Résumé / GitHub / Email are all visible without scrolling at 1440×900.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/sections/Hero.module.css app/page.tsx
git commit -m "feat: add hero with assembling name and 3x return counter"
```

---

### Task 8: The Return — horizontal timeline

**Files:**
- Create: `components/sections/Return.tsx`, `components/sections/Return.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `roles`, `projectCity`, `useReducedMotion`
- Produces: `<Return />`

The centerpiece. Roles scroll horizontally while the section is pinned; city pins light on the projected constellation as each role arrives. Below 768px, and under reduced motion, it becomes an ordinary vertical list — pinning a section is precisely the kind of scroll hijack that motion-sensitive users opt out of.

- [ ] **Step 1: Write the section**

Create `components/sections/Return.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { roles } from '@/content/experience';
import { projectCity } from '@/lib/project';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Return.module.css';

const PINNED = roles.filter((r) => r.stack.length > 0);

export function Return() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const el = track.current;
      const section = root.current;
      if (!el || !section) return;

      const distance = () => el.scrollWidth - window.innerWidth;

      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.round(self.progress * (PINNED.length - 1)));
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const activeCity = PINNED[active]?.city;

  return (
    <section ref={root} className={s.section} aria-labelledby="return-heading">
      <div className={s.head}>
        <h2 id="return-heading" className={s.heading}>
          The Return
        </h2>
        <p className={s.sub}>Amazon asked three times.</p>
      </div>

      <svg className={s.map} viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
        {PINNED.map((role, i) => {
          const { x, y } = projectCity(role.city.lat, role.city.lon);
          const lit = i <= active;
          return (
            <circle
              key={role.id}
              cx={x * 100}
              cy={y * 100}
              r={lit ? 1.6 : 0.9}
              className={lit ? s.pinLit : s.pin}
            />
          );
        })}
      </svg>

      <p className={`mono ${s.cityLabel}`} aria-live="polite">
        {activeCity ? `${activeCity.name}, ${activeCity.state}` : ''}
      </p>

      <div ref={track} className={s.track}>
        {PINNED.map((role) => (
          <article key={role.id} className={s.card}>
            <p className={`mono ${s.dates}`}>
              {role.start} — {role.end ?? 'Present'}
            </p>
            <h3 className={s.org}>{role.org}</h3>
            <p className={s.title}>{role.title}</p>
            <p className={`mono ${s.city}`}>
              {role.city.name}, {role.city.state}
            </p>
            <ul className={s.bullets}>
              {role.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <ul className={s.stack}>
              {role.stack.map((t) => (
                <li key={t} className="mono">
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write the styles**

Create `components/sections/Return.module.css`:

```css
.section {
  position: relative;
  min-height: 100svh;
  padding: var(--gutter);
  overflow: hidden;
}

.head {
  margin-bottom: 2rem;
}

.heading {
  font-size: var(--step-3);
  font-weight: 800;
}

.sub {
  margin: 0.5rem 0 0;
  color: var(--muted);
}

.map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  pointer-events: none;
}

.pin {
  fill: var(--muted);
  transition: r 0.5s var(--ease), fill 0.5s var(--ease);
}

.pinLit {
  fill: var(--accent);
  filter: drop-shadow(0 0 6px var(--accent));
  transition: r 0.5s var(--ease), fill 0.5s var(--ease);
}

.cityLabel {
  position: absolute;
  top: var(--gutter);
  right: var(--gutter);
  margin: 0;
  color: var(--accent);
}

.track {
  display: flex;
  gap: 3rem;
  align-items: center;
  will-change: transform;
}

.card {
  flex: 0 0 min(46ch, 82vw);
  border-left: 1px solid var(--rule);
  padding-left: 1.5rem;
}

.dates {
  margin: 0 0 0.75rem;
}

.org {
  font-size: var(--step-2);
  font-weight: 800;
}

.title {
  margin: 0.25rem 0 0;
  font-size: var(--step-1);
  color: var(--accent);
}

.city {
  margin: 0.25rem 0 1rem;
}

.bullets {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: var(--paper);
}

.stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.25rem 0 0;
  padding: 0;
}

.stack li {
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
}

/* Below 768px the pin is disabled in JS, so the track must wrap vertically. */
@media (max-width: 767px) {
  .section {
    overflow: visible;
  }

  .track {
    flex-direction: column;
    align-items: stretch;
    gap: 3.5rem;
    transform: none !important;
  }

  .card {
    flex: 1 1 auto;
  }

  .map,
  .cityLabel {
    display: none;
  }
}
```

- [ ] **Step 3: Add the reduced-motion fallback**

Append to `Return.module.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .section {
    overflow: visible;
  }

  .track {
    flex-direction: column;
    align-items: stretch;
    gap: 3.5rem;
    transform: none !important;
  }

  .card {
    flex: 1 1 auto;
  }
}
```

- [ ] **Step 4: Mount it**

In `app/page.tsx`, add `<Return />` after `<Hero />`.

- [ ] **Step 5: Verify in the browser**

Run: `npm run dev`.
Expected at 1440×900: the section pins, cards move horizontally as you scroll, and pins light Seattle → Seattle → San Jose in card order while the city label tracks. At 375px: a plain vertical list, no pin, no horizontal overflow. With reduce-motion on: vertical list.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Return.tsx components/sections/Return.module.css app/page.tsx
git commit -m "feat: add pinned horizontal timeline with lit city constellation"
```

---

### Task 9: The 180× moment

**Files:**
- Create: `components/sections/Speedup.tsx`, `components/sections/Speedup.module.css`, `tests/unit/clock.test.ts`, `lib/clock.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `roles` (the `amazon-2026` entry), `useReducedMotion`
- Produces: `<Speedup />`, `formatClock(seconds: number): string`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/clock.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatClock } from '@/lib/clock';

describe('formatClock', () => {
  it('formats 30 minutes as 30:00', () => {
    expect(formatClock(1800)).toBe('30:00');
  });

  it('formats 10 seconds as 0:10', () => {
    expect(formatClock(10)).toBe('0:10');
  });

  it('pads seconds below ten', () => {
    expect(formatClock(65)).toBe('1:05');
  });

  it('floors fractional seconds', () => {
    expect(formatClock(10.9)).toBe('0:10');
  });

  it('never renders a negative clock', () => {
    expect(formatClock(-5)).toBe('0:00');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- clock`
Expected: FAIL — cannot resolve `@/lib/clock`.

- [ ] **Step 3: Implement it**

Create `lib/clock.ts`:

```ts
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test -- clock`
Expected: PASS, 5 tests.

- [ ] **Step 5: Write the section**

Create `components/sections/Speedup.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatClock } from '@/lib/clock';
import { roles } from '@/content/experience';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import s from './Speedup.module.css';

const FROM = 1800; // 30 minutes
const TO = 10;     // 10 seconds

const current = roles.find((r) => r.id === 'amazon-2026')!;

export function Speedup() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [seconds, setSeconds] = useState(FROM);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (reduced) {
      setSeconds(TO);
      setLanded(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const proxy = { value: FROM };
      gsap.to(proxy, {
        value: TO,
        ease: 'power4.in',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 65%',
          end: 'bottom 60%',
          scrub: 0.6,
          onUpdate: () => setSeconds(proxy.value),
          onLeave: () => setLanded(true),
          onEnterBack: () => setLanded(false),
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} className={s.section} aria-labelledby="speedup-heading">
      <p className={`mono ${s.eyebrow}`}>Amazon · Connections · {current.start} — Present</p>

      <h2 id="speedup-heading" className={s.heading}>
        Thirty minutes,
        <br />
        <span className={s.accent}>ten seconds.</span>
      </h2>

      <div className={`${s.clock} ${landed ? s.landed : ''}`} aria-hidden="true">
        {formatClock(seconds)}
      </div>
      <p className={s.srOnly}>
        An internal tool that reduces an administrator task from 30 minutes to 10 seconds.
      </p>

      <p className={s.body}>{current.bullets[0]}</p>

      <ul className={s.stack}>
        {current.stack.map((t) => (
          <li key={t} className={`mono ${s.node}`}>
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 6: Write the styles**

Create `components/sections/Speedup.module.css`:

```css
.section {
  min-height: 100svh;
  padding: var(--gutter);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.eyebrow {
  margin: 0;
}

.heading {
  font-size: var(--step-3);
  font-weight: 800;
}

.accent {
  color: var(--accent);
}

.clock {
  font-family: var(--mono), monospace;
  font-size: var(--step-5);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -0.04em;
  transition: color 0.4s var(--ease), text-shadow 0.4s var(--ease), transform 0.4s var(--ease);
  will-change: transform;
}

.landed {
  color: var(--accent);
  text-shadow: 0 0 40px color-mix(in srgb, var(--accent) 55%, transparent);
  transform: scale(1.06);
}

.body {
  margin: 0;
  max-width: 52ch;
  color: var(--muted);
}

.stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

.node {
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  color: var(--paper);
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

- [ ] **Step 7: Mount it**

In `app/page.tsx`, add `<Speedup />` after `<Return />`.

- [ ] **Step 8: Verify in the browser**

Run: `npm run dev`.
Expected: scrolling into the section drives the clock from `30:00` down to `0:10`, accelerating hard at the end, then landing in accent with a glow. With reduce-motion on: the clock reads `0:10` immediately, still glowing, and the heading still tells the story.

- [ ] **Step 9: Commit**

```bash
git add lib/clock.ts tests/unit/clock.test.ts components/sections/Speedup.tsx components/sections/Speedup.module.css app/page.tsx
git commit -m "feat: add the 180x speedup beat with scrub-driven clock collapse"
```

---

### Task 10: SproutFund case study

**Files:**
- Create: `components/sections/SproutFund.tsx`, `components/sections/SproutFund.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `sproutfund`, `Reveal`, `useReducedMotion`, `next/image`
- Produces: `<SproutFundSection />`

The architecture diagram is an SVG whose connector paths draw themselves via `stroke-dashoffset` as the section enters. Four nodes: React → Spring Boot → Claude API, and Spring Boot → Supabase.

- [ ] **Step 1: Write the section**

Create `components/sections/SproutFund.tsx`:

```tsx
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
```

- [ ] **Step 2: Write the styles**

Create `components/sections/SproutFund.module.css`:

```css
.section {
  padding: calc(var(--gutter) * 2) var(--gutter);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 0.5rem;
}

.heading {
  font-size: var(--step-3);
  font-weight: 800;
}

.tagline {
  margin: 0.5rem 0 0;
  font-size: var(--step-1);
  color: var(--accent);
  max-width: 40ch;
}

.frame {
  border: 1px solid var(--rule);
  border-radius: 12px;
  overflow: hidden;
  background: #14151a;
}

.chrome {
  display: flex;
  gap: 0.4rem;
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid var(--rule);
}

.chrome span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--rule);
}

.shot {
  display: block;
  width: 100%;
  height: auto;
}

.body {
  margin: 0;
  max-width: 62ch;
  color: var(--muted);
}

.diagram {
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: visible;
}

.edge {
  fill: none;
  stroke: var(--accent);
  stroke-width: 0.6;
  opacity: 0.75;
}

.node {
  fill: var(--ink);
  stroke: var(--accent);
  stroke-width: 0.6;
}

.nodeLabel {
  fill: var(--paper);
  font-size: 3.4px;
  font-family: var(--mono), monospace;
}

.stack {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  border-top: 1px solid var(--rule);
  padding-top: 1.5rem;
}

.groupLabel {
  margin: 0 0 0.3rem;
}

.groupItems {
  margin: 0;
}

.credit {
  margin: 1.5rem 0 0;
  color: var(--accent);
}

.repo {
  align-self: flex-start;
  margin-top: 0.5rem;
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  color: var(--accent);
  padding-bottom: 2px;
}
```

- [ ] **Step 3: Mount it**

In `app/page.tsx`, add `<SproutFundSection />` after `<Speedup />`.

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`.
Expected: the screenshot sits in a browser frame; scrolling in draws the three connector paths in sequence and pops the four nodes; the credit line reads "Led a 4-person team". With reduce-motion on: the diagram is fully drawn, no animation.

- [ ] **Step 5: Commit**

```bash
git add components/sections/SproutFund.tsx components/sections/SproutFund.module.css app/page.tsx
git commit -m "feat: add SproutFund case study with self-drawing architecture diagram"
```

---

### Task 11: Skills physics pile

**Files:**
- Create: `components/sections/Skills.tsx`, `components/sections/Skills.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `skills`, `useReducedMotion`
- Produces: `<Skills />`

matter.js is loaded dynamically so its ~90KB never touches the initial bundle. Under reduced motion — or before the physics boots — the section renders a plain static list of the same tokens, so the content never depends on the animation.

- [ ] **Step 1: Write the section**

Create `components/sections/Skills.tsx`:

```tsx
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
    <section className={s.section} aria-labelledby="skills-heading">
      <div className={s.head}>
        <h2 id="skills-heading" className={s.heading}>
          Skills
        </h2>
        <p className={s.sub}>{reduced ? 'What I build with.' : 'Throw them around.'}</p>
      </div>

      <div ref={scene} className={s.scene} aria-hidden={physics ? 'true' : undefined} />

      <ul className={`${s.fallback} ${physics ? s.hidden : ''}`}>
        {skills.map((skill) => (
          <li key={skill.label} className="mono">
            {skill.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Write the styles**

Create `components/sections/Skills.module.css`:

```css
.section {
  min-height: 100svh;
  padding: var(--gutter);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.head {
  flex: 0 0 auto;
}

.heading {
  font-size: var(--step-3);
  font-weight: 800;
}

.sub {
  margin: 0.5rem 0 0;
  color: var(--muted);
}

.scene {
  position: relative;
  flex: 1 1 auto;
  min-height: 60svh;
  touch-action: none;
}

.scene canvas {
  display: block;
}

.fallback {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0;
  margin: 0;
}

.fallback li {
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  color: var(--paper);
}

.hidden {
  display: none;
}
```

- [ ] **Step 3: Mount it**

In `app/page.tsx`, add `<Skills />` after `<SproutFundSection />`.

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`.
Expected: scrolling into Skills drops the tokens in; they pile up and can be dragged and thrown; labels stay readable and rotate with the bodies; the page still scrolls when the cursor is over the canvas. With reduce-motion on: a static pill list, no canvas.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Skills.tsx components/sections/Skills.module.css app/page.tsx
git commit -m "feat: add draggable matter.js skills pile with static fallback"
```

---

### Task 12: Leadership, education, and contact

**Files:**
- Create: `components/sections/Leadership.tsx`, `components/sections/Leadership.module.css`, `components/sections/Contact.tsx`, `components/sections/Contact.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `roles` (non-Amazon entries), `schools`, `awards`, `profile`, `Reveal`, `Magnetic`
- Produces: `<Leadership />`, `<Contact />`

The site exhales here. No scroll-jacking, no physics — just reveals.

- [ ] **Step 1: Write Leadership**

Create `components/sections/Leadership.tsx`:

```tsx
import { roles } from '@/content/experience';
import { schools, awards } from '@/content/education';
import { Reveal } from '@/components/motion/Reveal';
import s from './Leadership.module.css';

const LEADERSHIP = roles.filter((r) => !r.isAmazon && r.id !== 'fifa-2024');

export function Leadership() {
  return (
    <section className={s.section} aria-labelledby="leadership-heading">
      <Reveal>
        <h2 id="leadership-heading" className={s.heading}>
          Leadership &amp; Education
        </h2>
      </Reveal>

      <div className={s.grid}>
        <div>
          <p className={`mono ${s.label}`}>Leadership</p>
          <ul className={s.list}>
            {LEADERSHIP.map((role) => (
              <li key={role.id}>
                <Reveal>
                  <p className={s.org}>{role.org}</p>
                  <p className={s.role}>{role.title}</p>
                  <p className={`mono ${s.dates}`}>
                    {role.start} — {role.end}
                  </p>
                  <ul className={s.bullets}>
                    {role.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={`mono ${s.label}`}>Education</p>
          <ul className={s.list}>
            {schools.map((school) => (
              <li key={`${school.name}-${school.credential}`}>
                <Reveal>
                  <p className={s.org}>{school.name}</p>
                  <p className={s.role}>{school.credential}</p>
                  <p className={`mono ${s.dates}`}>
                    {school.start} — {school.end}
                    {school.detail ? ` · ${school.detail}` : ''}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className={`mono ${s.label}`}>Awards</p>
          <ul className={s.awards}>
            {awards.map((award) => (
              <li key={award.label}>
                <span>{award.label}</span>
                {award.detail ? <span className={s.detail}> — {award.detail}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write Leadership styles**

Create `components/sections/Leadership.module.css`:

```css
.section {
  padding: calc(var(--gutter) * 2) var(--gutter);
  max-width: 1100px;
  margin: 0 auto;
}

.heading {
  font-size: var(--step-3);
  font-weight: 800;
  margin-bottom: 2.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.label {
  margin: 0 0 1rem;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.5rem;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.org {
  margin: 0;
  font-size: var(--step-1);
  font-weight: 700;
}

.role {
  margin: 0.15rem 0 0;
  color: var(--accent);
}

.dates {
  margin: 0.2rem 0 0;
}

.bullets {
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--muted);
}

.awards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail {
  color: var(--accent);
}
```

- [ ] **Step 3: Write Contact**

Create `components/sections/Contact.tsx`:

```tsx
'use client';

import { profile } from '@/content/profile';
import { Magnetic } from '@/components/motion/Magnetic';
import s from './Contact.module.css';

export function Contact() {
  return (
    <footer className={s.section} aria-labelledby="contact-heading">
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
```

- [ ] **Step 4: Write Contact styles**

Create `components/sections/Contact.module.css`:

```css
.section {
  min-height: 70svh;
  padding: calc(var(--gutter) * 2) var(--gutter);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  border-top: 1px solid var(--rule);
}

.heading {
  font-size: var(--step-4);
  font-weight: 800;
}

.email {
  font-size: var(--step-2);
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 4px;
  word-break: break-all;
}

.links {
  display: flex;
  gap: 1.75rem;
}

.links a {
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 2px;
  transition: border-color 0.3s var(--ease), color 0.3s var(--ease);
}

.links a:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.colophon {
  margin: 2rem 0 0;
}
```

- [ ] **Step 5: Mount both**

`app/page.tsx` final form:

```tsx
import { Hero } from '@/components/sections/Hero';
import { Return } from '@/components/sections/Return';
import { Speedup } from '@/components/sections/Speedup';
import { SproutFundSection } from '@/components/sections/SproutFund';
import { Skills } from '@/components/sections/Skills';
import { Leadership } from '@/components/sections/Leadership';
import { Contact } from '@/components/sections/Contact';

export default function Page() {
  return (
    <>
      <Hero />
      <main>
        <Return />
        <Speedup />
        <SproutFundSection />
        <Skills />
        <Leadership />
      </main>
      <Contact />
    </>
  );
}
```

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`.
Expected: all seven beats render in order; the leadership section shows INIT ×2 and Girls Who Code; education lists four schools; five awards appear.

- [ ] **Step 7: Commit**

```bash
git add components/sections/Leadership.tsx components/sections/Leadership.module.css components/sections/Contact.tsx components/sections/Contact.module.css app/page.tsx
git commit -m "feat: add leadership, education, and contact sections"
```

---

### Task 13: Command palette easter egg

**Files:**
- Create: `components/CommandPalette.tsx`, `components/CommandPalette.module.css`
- Modify: `app/layout.tsx`, section files (add `id` attributes)

**Interfaces:**
- Consumes: `profile`
- Produces: `<CommandPalette />` — opens on ⌘K / Ctrl+K, closes on Escape, filters by typing, jumps on Enter

- [ ] **Step 1: Add section ids**

Add `id` to each section root so the palette can target them: `id="return"` on `Return`, `id="speedup"` on `Speedup`, `id="sproutfund"` on `SproutFund`, `id="skills"` on `Skills`, `id="leadership"` on `Leadership`, `id="contact"` on `Contact`.

- [ ] **Step 2: Write the palette**

Create `components/CommandPalette.tsx`:

```tsx
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
    { label: 'The Return', hint: 'Amazon ×3', run: () => jump('return') },
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
```

- [ ] **Step 3: Write the styles**

Create `components/CommandPalette.module.css`:

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 6, 8, 0.7);
  backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  justify-content: center;
  padding-top: 14vh;
}

.panel {
  width: min(540px, 92vw);
  height: fit-content;
  background: #101116;
  border: 1px solid var(--rule);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.input {
  width: 100%;
  padding: 1rem 1.15rem;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--rule);
  color: var(--paper);
  font-size: var(--step-0);
  font-family: inherit;
}

.input:focus {
  outline: none;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0.4rem;
  max-height: 46vh;
  overflow-y: auto;
}

.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 0.8rem;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--paper);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.active {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
}

.hint {
  color: var(--muted);
}

.empty {
  padding: 0.8rem;
  color: var(--muted);
}
```

- [ ] **Step 4: Mount it**

In `app/layout.tsx`, import and render `<CommandPalette />` inside `<body>`, after `<SmoothScroll>`.

- [ ] **Step 5: Verify in the browser**

Run: `npm run dev`. Press ⌘K.
Expected: the palette opens focused; typing filters; ↑/↓ moves selection; Enter jumps; Escape closes.

- [ ] **Step 6: Commit**

```bash
git add components/CommandPalette.tsx components/CommandPalette.module.css app/layout.tsx components/sections
git commit -m "feat: add command palette easter egg"
```

---

### Task 14: End-to-end verification and polish

**Files:**
- Create: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: the whole site
- Produces: a green Playwright run

- [ ] **Step 1: Write the E2E spec**

Create `tests/e2e/site.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('personal website', () => {
  test('hero shows identity and all three links without scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Valeria Chacon');
    await expect(page.getByRole('link', { name: 'Résumé' }).first()).toBeInViewport();
    await expect(page.getByRole('link', { name: 'GitHub' }).first()).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Email' }).first()).toBeInViewport();
  });

  test('never shows excluded retail employers', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Best Buy/i);
    expect(body).not.toMatch(/Meta Specialist/i);
  });

  test('credits SproutFund as a team effort', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Led a 4-person team/)).toBeVisible();
  });

  test('command palette opens, filters, and closes', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await page.getByLabel('Search commands').fill('sprout');
    await expect(dialog.getByRole('button', { name: /SproutFund/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('reduced motion renders the final clock immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByText('0:10')).toBeVisible();
  });

  test('mobile does not scroll horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2500);
    expect(errors).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the E2E suite**

Run: `npm run e2e`
Expected: 7 passed. Fix any failures before continuing — a red test here means a real defect, not a flaky test.

- [ ] **Step 3: Run the unit suite**

Run: `npm test`
Expected: all green (project, content, motion, clock, smoke).

- [ ] **Step 4: Verify the production build**

Run: `npm run build`
Expected: compiles with no type errors. Check the route summary — first-load JS for `/` should be well under 300KB. If matter.js appears in the initial bundle, the dynamic import in Task 11 has regressed.

- [ ] **Step 5: Look at it**

Run: `npm run dev`, then take Playwright screenshots at 1440×900 and 375×812 of each beat. Actually look at them. Check: is the hero balanced? Does the clock land hard? Do the pins read? Is anything clipped on mobile?

- [ ] **Step 6: Commit**

```bash
git add tests/e2e playwright.config.ts
git commit -m "test: add end-to-end coverage for content integrity and accessibility"
```

---

### Task 15: Deploy

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write the README**

Create `README.md` with exactly this content (the outer fence is four backticks so the
inner code blocks survive — write the file with normal three-backtick fences):

````markdown
# valeriachacon.com

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
````

- [ ] **Step 2: Push to GitHub**

```bash
gh repo create personal-website --public --source=. --remote=origin --push
```

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --yes
```

Confirm the preview URL renders, then promote:

```bash
npx vercel --prod --yes
```

- [ ] **Step 4: Verify the deployment**

Open the production URL. Check the hero, the clock, the palette, and the résumé link. Run Lighthouse; aim for 90+ on Performance and Accessibility.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add README with content-editing guide"
git push
```

---

## Notes for whoever executes this

**The old `Personal-website` repo on GitHub is superseded by this one.** Don't merge into it; it's an unrelated CSS project from 2024.

**If a fact looks wrong, stop and ask.** Four résumé/LinkedIn conflicts were already adjudicated (San Jose, August 2025, 100+ members, e-board since Nov 2023). Anything else that looks off is unresolved — do not guess and do not invent. The tests in Task 3 encode the resolved facts; if you find yourself editing those assertions to make a test pass, that is a signal to stop.

**Reduced motion is not a checkbox.** Each section's fallback must still tell the story. The clock still reads `0:10`. The timeline still lists every role. The skills still list every token. If a fallback loses information, it's wrong.
