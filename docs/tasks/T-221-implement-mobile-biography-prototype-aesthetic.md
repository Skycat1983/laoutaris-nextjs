# T-221 Implement Mobile Biography Prototype Aesthetic

Status: Complete

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Adapt only the `/prototype/home` biography section for mobile viewports using
`mobile_designs/biography.png` as the visual guide, while preserving the
existing wider desktop prototype behavior and real biography article data path.

## Context

- `/prototype/home` is an isolated owner-review workshop route, not the live
  homepage.
- The current biography prototype section already uses real biography article
  data and the owner-review fixed story order where matching slugs/titles are
  available.
- `mobile_designs/biography.png` shows a phone-first composition with a large
  editorial heading, a dominant featured story card, a compact thumbnail rail
  for the remaining story entries, pagination dots, and a bottom full-width
  `Read the full story` CTA.
- This task is one slice in a three-section mobile aesthetic pass. Collections
  and shop mobile mockups are handled separately.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/prototypes/homepage-owner-review-packet.md`
6. `src/components/prototypes/home/BiographyPrototypeSection.tsx`
7. `src/components/prototypes/home/prototypeHomeLayout.ts`
8. `mobile_designs/biography.png`

## Scope

In scope:

- Implement a mobile-specific biography layout in
  `src/components/prototypes/home/BiographyPrototypeSection.tsx`.
- Match the mobile mockup's important aesthetic beats:
  warm near-white background, uppercase `Biography` eyebrow, large Cormorant
  heading, oversized featured story card with image above title/subtitle,
  index and short divider over the featured image, compact horizontal thumbnail
  rail for all visible story entries, active thumbnail emphasis, pagination
  dots, and bottom full-width `Read the full story` CTA.
- Keep biography cards backed by `ArticleFrontend[]`; do not hard-code article
  card data except for existing fallback copy.
- Preserve the current ordered biography article logic unless an owner-approved
  content decision is already documented in the existing prototype docs.
- Keep the featured card linked to the featured article and the CTA linked to
  `/biography`.
- Use accessible controls or links for the thumbnail rail. If thumbnail clicks
  change the featured article, expose that state with `aria-current` or an
  equivalent accessible pattern.
- Keep images constrained and object-fitted so portraits/artwork remain visible
  without page-level horizontal overflow.
- Preserve the current desktop/tablet section behavior unless a shared helper
  needs a small compatible adjustment.
- Add or adjust focused tests only if rendering behavior, fallback behavior, or
  control semantics change in a way existing tests should cover.

Out of scope:

- Do not change the live homepage, `src/components/views/Home.tsx`, live
  biography pages, biography loaders, article services, global CSS,
  Tailwind config, root layout, header, footer, or public navigation.
- Do not implement the collections or shop mobile mockups.
- Do not change biography content, canonical dates, article slugs, or
  production ordering policy.
- Do not migrate prototype code into production.
- Do not edit shared trackers while other agents may be working.

## Concurrency

This task owns:

- `src/components/prototypes/home/BiographyPrototypeSection.tsx`
- focused prototype tests if needed
- this task brief handoff section

Avoid shared tracker and index edits during implementation:
`docs/orchestration/state.md`, `docs/tasks/README.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and
`docs/risks/production-readiness.md`.

If tracker updates are needed, list them in this task's handoff notes for the
orchestrator.

## Acceptance Criteria

- At mobile widths, the biography section reads as the supplied mockup: large
  editorial heading, dominant featured story card, compact thumbnail rail,
  dots, and a bottom full-width story CTA.
- The mobile layout does not create page-level horizontal scrolling.
- Text remains readable and does not overlap images, card edges, controls, or
  the fixed prototype control rail.
- The active/featured story state is clear visually and accessible to keyboard
  and assistive technology users.
- Desktop and wider tablet biography behavior remains visually and
  functionally equivalent to the pre-task prototype.
- Existing empty-state behavior remains intact.

## Verification

Run the narrowest checks that prove this slice:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
npm run lint
git diff --check
```

If browser automation is available and already set up, run one targeted visual
check for `/prototype/home` at a phone viewport such as 390x844. Capture only a
small screenshot or concise observations for the biography section; do not
collect traces, videos, full DOM dumps, or broad screenshot sets.

## Agent Prompt

You are working on T-221. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`src/components/prototypes/home/BiographyPrototypeSection.tsx`,
`src/components/prototypes/home/prototypeHomeLayout.ts`, and
`mobile_designs/biography.png`. Implement only the mobile biography prototype
aesthetic for `/prototype/home`: large editorial heading, dominant featured
story card, compact thumbnail rail, dots, and bottom full-width story CTA
matching the mockup's visual direction. Preserve real biography article data,
current article links and ordering logic, desktop/tablet behavior, empty state,
live homepage behavior, global CSS, navigation, and shared trackers. Run the
focused prototype page test, lint, `git diff --check`, and a targeted mobile
visual check if browser automation is available, then update only this task
handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-221-implement-mobile-biography-prototype-aesthetic.md
```

## Handoff Notes

- Prepared on 2026-05-23 as the second one-at-a-time mobile mockup slice for
  `/prototype/home`.
- Completed on 2026-05-23. `BiographyPrototypeSection` now has a mobile-only
  owner-review layout matching `mobile_designs/biography.png`: dominant linked
  featured story card, image overlay index/divider, horizontal thumbnail
  selector, pagination dots, and full-width `Read the full story` CTA.
- The mobile selector is backed by the existing ordered biography articles and
  uses button controls with `aria-pressed` and `aria-current`; desktop/tablet
  biography layout remains on the existing timeline/card composition.
- Verification: `npm test -- --runTestsByPath
  __tests__/unit/pages/PrototypeHomePage.test.tsx` passed; `npm run lint`
  passed; `git diff --check` passed.
- Targeted browser visual check: not completed because the repo does not have
  `playwright` or `@playwright/test` installed. A local dev server on
  `http://localhost:3001/prototype/home` returned `200 OK` after allowing the
  dev server to complete its font fetch/compile path.
- Follow-up adjustment on 2026-05-23 tightened the mobile mockup match: the
  five story thumbnails now fit in one row, the featured image uses full-width
  cover cropping, the featured-card arrow sits at the lower right, and the
  mobile heading-to-card gap is reduced.
- Candidate tracker updates for the orchestrator after completion: mark T-221
  complete in the frontend/testing workstreams and record that the biography
  prototype now has a mobile-specific owner-review composition based on
  `mobile_designs/biography.png`.
