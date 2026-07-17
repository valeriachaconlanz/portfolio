# Personal Website — Valeria Chacon

**Date:** 2026-07-17
**Status:** Approved design, ready for implementation planning

## Goal

A personal website for Valeria Chacon that makes recruiters stop and pay attention. Animation is the point, not the garnish — but every animation carries an argument about her work rather than decorating it.

Content is computer-science only. Retail roles (Meta Specialist, Best Buy) are excluded by explicit decision.

## Audience

Primary: big-tech new-grad and internship recruiters, many of them non-technical first-pass screeners who skim for under 30 seconds. Secondary: hiring engineers who will open devtools and read the GitHub.

This drives a structural rule: **the hero must deliver school, current role, and the Amazon record without a single scroll**, and the résumé link must be impossible to miss. Everything below the fold rewards the people who stay.

## The organizing idea

Amazon kept asking her back — three times. That is the strongest fact available, and the site is built around it. Secondary pillar: the current internship's 180× speedup (30 minutes → 10 seconds), which is the strongest single number she has.

## Verified content

All facts below are resolved. Where the résumé and LinkedIn conflicted, the user adjudicated on 2026-07-17; resolutions are marked.

### Identity

- **Name:** Valeria Chacon
- **Headline:** 3× SDE Intern @ Amazon · CS @ FIU
- **Location:** Miami, Florida
- **Email:** valeriaachlz04@gmail.com
- **GitHub:** https://github.com/valeriachaconlanz
- **LinkedIn:** https://www.linkedin.com/in/valeriachaconlanz
- **Résumé:** linked as provided (`ValeriaChacon_Resume_SDE.pdf`), to be swapped later. Contains a phone number; user accepted this after being advised it will be scraped.
- **Languages:** English and Spanish, bilingual

### Experience (CS only, reverse chronological)

**Amazon — SDE Intern, Connections team.** Seattle, WA. May 2026 – present.
Building an internal tool that cuts an administrator task from **30 minutes to 10 seconds** (~180×). Stack: DynamoDB, Java, AWS CDK, CloudWatch, AI tooling. Participates in code reviews.
*Note: absent from the current résumé. This site is the first place it appears.*

**Amazon — SDE Intern, Annual Compensation (PXT).** Seattle, WA. May – August 2025. *(Resolved: August, per résumé.)*
- RESTful APIs automating Annual Compensation team workflows; up to 40% less manual processing time
- Led 80% of front-end development in React and Stencil — responsive dashboards improving task visibility
- Backend work in Java, integrating secure services across high-volume data operations
- Partnered with Program Managers and System Admins

*The résumé's "Java and Bootstrap" backend bullet is wrong — Bootstrap is a CSS framework. Use the LinkedIn phrasing.*

**AWS — SDE Intern.** San Jose, CA. May – August 2024. *(Resolved: San Jose, per résumé.)*
- Built a customizable API for the Amazon Q tool in Java and Brazil, letting customers tailor AI service usage; ~30% reduction in service-integration time and cost
- API testing with Insomnia; deployment automation via Amazon Pipelines
- Reviewed design proposals alongside product managers and senior engineers

**FIFA World Cup 2026 — Venue Technology Intern.** Coral Gables, FL. September – November 2024.
- Designed and launched a landing page for the 2026 World Cup
- Rebuilt a longstanding stadium data-collection form
- Coordinated venue technology requirements with stadium staff

**INIT MDC Kendall.** Miami, FL. E-board since November 2023.
- **President**, August 2024 – May 2025: managed $10K in external funding; ran web development and GitHub workshops for **over 100 active members** *(resolved: 100+, per résumé)*; led marketing for SeedAI Hackathon, one of Miami's largest
- **Reach Program Manager**, October 2023 – July 2024: co-taught career and technical workshops, mentored students

**Girls Who Code — Summer Immersion Scholar.** Remote. June 2022. Sponsored by Raytheon.

### Project

**SproutFund** — https://github.com/valeriachaconlanz/SproutFund

AI investment advisor for first-time investors, especially college students. Users enter budget, timeline, and risk tolerance; Claude generates personalized strategies with fund names, allocation percentages, and platform recommendations.

- **Frontend:** React 19, Vite, React Router 7, plain CSS, custom design system, dark mode
- **Backend:** Java 17, Spring Boot 3, Maven
- **AI:** Anthropic Claude API via the Java SDK
- **Data/Auth:** Supabase — Postgres, Auth, row-level security. Backend verifies Supabase-issued JWTs and never touches passwords.
- **API:** 5 endpoints; one public (plan generation), four bearer-token scoped to the owning user

**Credit:** Led a 4-person team. Repo owner; 51 of 76 commits (~67%). The site says "Led a 4-person team" — decided on the merits: it is both accurate and a stronger signal than implying solo work.

Assets: `sproutfund-home.png` and other screenshots exist at `~/Desktop/sproutfund/`.

**Excluded:** StockChecker (a fork), and the older `Personal-website` repo. No other projects.

### Education

- **Florida International University** — BS Computer Science, expected May 2027
- **The Honors College at Miami Dade College** — AA Computer Science, May 2025. Full-ride fellowship.
- **FIU Dual Enrollment** — Computer Science, 2022–2023. GPA 4.00. FLAME program.
- **Miami Coral Park Senior High** — Engineering Magnet, CS, 2019–2023. Summa Cum Laude, top 10%, 3.97 GPA.

High school appears as a single line inside the education timeline, with no bullets and no expansion. It carries little weight next to three Amazon internships, but the Engineering Magnet is a legitimate early-CS signal and costs one line.

### Awards

- Amazon Future Engineer Scholarship — $40,000
- MDC Honors College full-ride fellowship
- Academic Excellence Award, Technology Faculty
- Dean's List (×2)
- Civic Action Award — Bronze

### Skills

Derived from actual work, **not** from LinkedIn's endorsement list (which reads "Advertising, Financial Analysis, Analytical Skills" and mentions no engineering at all).

- **Languages:** Java, Python, JavaScript, C++, HTML, CSS, SQL
- **Frameworks:** React, Spring Boot, Stencil, Vite, React Router
- **Cloud/Infra:** AWS, DynamoDB, CDK, CloudWatch, Supabase, Postgres
- **Tools:** Git, Maven, REST APIs, Insomnia

## Structure

One page, scroll-driven, seven beats.

**1. Hero.** Name assembles from scattered glyphs. A large **3×** counts 0→3 as three city labels stamp in. Subhead: CS @ FIU · Amazon SDE Intern. Résumé, GitHub, and email are all reachable without scrolling.

**2. The Return.** The centerpiece. Horizontal scroll-jack through the timeline as a travel route on a minimal US map: **Miami (home) → San Jose '24 → Seattle '25 → Seattle '26**, pins lighting as each stop arrives. FIFA '24 sits as a Miami detour. Each stop expands into what she built.

**3. The 180× moment.** Full-viewport beat for the Connections tool. A clock reads **30:00**, digits tumble, and it collapses to **0:10** — landing hard. The stack surfaces as orbiting nodes: DynamoDB, Java, CDK, CloudWatch.

**4. SproutFund.** Live screenshot in a floating browser frame. The architecture diagram **draws itself** on scroll — React → Spring Boot → Claude API → Supabase — with the JWT/RLS auth path animating. Repo link. "Led a 4-person team" credit.

**5. Skills.** Draggable matter.js physics pile. Throw the tokens around. The beat where the site shows personality.

**6. Leadership & Education.** INIT presidency, Girls Who Code, FIU, MDC Honors, awards. Deliberately calmer — the site exhales.

**7. Contact.** Email, GitHub, LinkedIn, résumé.

**Easter egg:** ⌘K command palette for jumping between sections. Engineers find it; nobody else needs to.

## Art direction

- **Palette:** near-black ink, warm off-white, one **light electric cyan-blue** accent (user's choice). Lit map pins and the collapsing clock glow in the accent.
- **Deliberately avoided:** Amazon orange (branding yourself in an employer's colors reads as borrowed) and SproutFund's `#ccff00` lime (a project's identity, not a person's).
- **Type:** large confident display type against generous space. The motion carries the energy, so the typography stays composed.

## Constraints

These are requirements, not preferences:

- **`prefers-reduced-motion`** fully honored — every beat has a static or minimal-motion equivalent that still reads.
- **Mobile works.** The horizontal scroll-jack degrades to vertical. Physics pile stays touch-draggable.
- **No jank on a mediocre laptop.** A portfolio that stutters on a recruiter's machine defeats its own purpose. Animate transforms and opacity; keep the main thread free; lazy-load below-fold work.
- **Semantic HTML.** Real headings, real landmarks, keyboard navigable. Accessible and indexable — recruiters Google her name.
- **Content is data.** Experience, skills, and education live in typed data modules, not inline JSX, so the résumé swap and the next internship are edits in one place.

## Architecture

- **Next.js (App Router)** — static export suits the content; chosen for SEO and metadata, since recruiters search her name. Zero-config on Vercel.
- **Motion** — component-level animation and orchestration
- **GSAP + ScrollTrigger** — scroll-driven sequencing, the horizontal pin, the clock collapse
- **Lenis** — smooth scroll
- **matter.js** — the skills pile only, lazy-loaded when the section approaches
- **Vercel** — hosting

Component boundaries follow the seven beats: each section is self-contained, takes typed content as props, owns its own animation, and can be built and reviewed independently. Shared motion primitives (reveal, counter, magnetic cursor) live in one place.

## Out of scope

Blog, CMS, dark/light toggle, i18n, analytics, contact form (a `mailto:` is enough and needs no backend), and any project beyond SproutFund.

## Open items

- Résumé swap when the polished version exists — including the 2026 internship, the "Vemue" typo, and the Bootstrap error
- Custom domain, if wanted
