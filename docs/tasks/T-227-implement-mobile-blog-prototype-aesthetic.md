# T-227 Implement Mobile Blog Prototype Aesthetic

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Adapt only the `/prototype/home` blog section for mobile viewports using
`mobile_designs/blog.png` as the visual guide, while preserving the existing
wider desktop prototype behavior and real blog data path.

## Context

- `/prototype/home` is an isolated owner-review workshop route, not the live
  homepage.
- The current blog prototype section already uses real blog entry data and a
  desktop lead-story plus grid composition.
- `mobile_designs/blog.png` shows a phone-first journal composition with a
  warm off-white background, uppercase `Journal` eyebrow, large editorial
  heading, short intro copy, featured memorial/story block, archive rows with
  thumbnails, titles, excerpts, dates, arrow affordances, and a bottom bordered
  `Browse all journal entries` CTA.
- Other agents may be working in this repo at the same time. Keep edits tightly
  scoped and do not overwrite unrelated dirty files.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/workstreams/testing-and-quality.md`
6. `docs/prototypes/homepage-owner-review-packet.md`
7. `src/components/prototypes/home/BlogPrototypeSection.tsx`
8. `src/components/prototypes/home/prototypeHomeLayout.ts`
9. `__tests__/unit/pages/PrototypeHomePage.test.tsx`
10. `mobile_designs/blog.png`

## Scope

In scope:

- Implement a mobile-specific blog layout in
  `src/components/prototypes/home/BlogPrototypeSection.tsx`.
- Match the mobile mockup's important aesthetic beats:
  - warm editorial section background
  - uppercase `Journal` eyebrow
  - large Cormorant heading such as `Notes from the Studio`
  - short intro copy
  - thin horizontal dividers
  - featured story with image, title, excerpt/date copy, and read link
  - journal archive rows with thumbnail, title, summary/excerpt, date when
    available, and arrow affordance
  - bottom full-width bordered `Browse all journal entries` CTA
- Keep the section backed by `BlogEntryFrontend[]`; do not hard-code blog
  titles except safe fallback copy.
- Use existing blog links (`/blog` and `/blog/[slug]`).
- Preserve the existing desktop/tablet blog behavior unless a shared helper
  needs a small compatible adjustment.
- Keep images constrained and object-fitted so artwork/blog imagery remains
  visible without page-level horizontal overflow.
- Preserve empty/fallback behavior.
- Add or adjust focused tests only if rendering behavior, fallback behavior, or
  link/control semantics change.

Out of scope:

- Do not change the live homepage, `src/components/views/Home.tsx`, live blog
  pages, blog loaders, blog services, global CSS, Tailwind config, root layout,
  header, footer, or public navigation.
- Do not implement the biography, collections, project, or shop mobile mockups.
- Do not add a fake hamburger/menu control just because it appears in the
  mockup. If a top-right icon is included, it must have real section-local
  behavior and an accessible label; otherwise omit it.
- Do not migrate prototype code into production.
- Do not change blog ordering policy beyond the current data order.
- Do not edit shared trackers while other agents may be working.

## Concurrency

This task owns:

- `src/components/prototypes/home/BlogPrototypeSection.tsx`
- focused blog prototype tests if needed
- this task brief handoff section

Avoid:

- `src/components/prototypes/home/CollectionPrototypeSection.tsx`
- `src/components/prototypes/home/HomePrototype.tsx` unless absolutely needed
- project, biography, shop prototype section files
- `docs/orchestration/state.md`, `docs/tasks/README.md`,
  `docs/workstreams/*`, shared trackers, risks, and audit registers

If `__tests__/unit/pages/PrototypeHomePage.test.tsx` already has unrelated
dirty changes, preserve them and add only the minimum blog-specific assertions.

## Acceptance Criteria

- At mobile widths, the blog section reads as the supplied mockup: editorial
  journal intro, featured story, stacked archive rows, dividers, and bottom
  browse CTA.
- The mobile layout does not create page-level horizontal scrolling.
- Text remains readable and does not overlap images, row edges, arrows, or the
  fixed prototype control rail on larger screens.
- Featured and archive blog links remain keyboard-accessible with clear focus
  states.
- Desktop and wider tablet blog behavior remains visually and functionally
  equivalent to the pre-task prototype.
- Existing empty-state behavior remains intact.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
npm run lint
git diff --check
```

If practical, run a narrow phone-viewport check for `/prototype/home` focused
only on the blog section. Capture concise observations, not traces, videos,
full DOM dumps, broad logs, or large screenshot sets.

## Agent Prompt

You are working on T-227. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`src/components/prototypes/home/BlogPrototypeSection.tsx`,
`src/components/prototypes/home/prototypeHomeLayout.ts`,
`__tests__/unit/pages/PrototypeHomePage.test.tsx`, and
`mobile_designs/blog.png`.

Implement only the mobile blog prototype aesthetic for `/prototype/home`: a
warm journal-style mobile section with uppercase eyebrow, large editorial
heading, intro copy, featured story, stacked archive rows with thumbnails,
dates/arrows where data allows, and a bottom `Browse all journal entries` CTA.
Preserve real blog data, current blog links, desktop/tablet behavior, empty
state, live homepage behavior, global CSS, navigation, and shared trackers. Do
not add a nonfunctional hamburger/menu. Other agents may be editing nearby
prototype files, so keep changes scoped and preserve unrelated dirty work. Run
the focused prototype page test, lint, `git diff --check`, and a targeted
mobile visual check if available, then update only this task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-227-implement-mobile-blog-prototype-aesthetic.md
```

## Handoff Notes

- Prepared on 2026-05-23 as a one-at-a-time mobile mockup slice for the
  `/prototype/home` blog section using `mobile_designs/blog.png`.
- Completed on 2026-05-23. `BlogPrototypeSection` now renders a phone-specific
  journal layout with the `Journal` eyebrow, `Notes from the Studio` heading,
  intro copy, featured story, dated archive rows, thumbnail imagery, arrow
  affordances, and bottom `Browse all journal entries` CTA while preserving the
  existing desktop/tablet branch.
- Updated the focused prototype page test to cover the mobile blog journal
  branch and to scope desktop blog assertions now that both responsive branches
  exist in the DOM.
- Verification run: `npm test -- --runTestsByPath
  __tests__/unit/pages/PrototypeHomePage.test.tsx`, `npm run lint`, and
  `git diff --check` all passed. The focused Jest run emitted the existing
  `punycode` deprecation warning.
- Targeted local route check: `npm run dev` served `/prototype/home` on
  `http://localhost:3001` after port 3000 was already occupied, and a local
  fetch returned `200` with the mobile journal heading/CTA/test IDs present.
  A true phone-viewport screenshot was not captured because Playwright,
  Chromium, and Chrome are not installed in this repo/environment. During the
  route request, the dev server logged existing MongoDB buffering fallback
  errors for prototype loaders because local data services were unavailable.
