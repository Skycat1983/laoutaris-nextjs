# T-220 Implement Mobile Collections Prototype Aesthetic

Status: Ready

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Adapt only the `/prototype/home` collections section for mobile viewports using
`mobile_designs/collections.png` as the visual guide, while preserving the
existing wider desktop prototype behavior and real collection data path.

## Context

- `/prototype/home` is an isolated owner-review workshop route, not the live
  homepage.
- The current collections prototype section already uses real collection data
  and a desktop accordion-style composition.
- `mobile_designs/collections.png` shows a phone-first composition with a warm
  gallery background, large editorial heading, centered featured collection
  card, peeking side cards, pagination dots, and a bottom text-arrow CTA.
- This task is one slice in a three-section mobile aesthetic pass. Biography
  and shop mobile mockups should be handled in separate tasks.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/prototypes/homepage-owner-review-packet.md`
6. `src/components/prototypes/home/CollectionPrototypeSection.tsx`
7. `src/components/prototypes/home/prototypeHomeLayout.ts`
8. `mobile_designs/collections.png`

## Scope

In scope:

- Implement a mobile-specific collections layout in
  `src/components/prototypes/home/CollectionPrototypeSection.tsx`.
- Match the mobile mockup's important aesthetic beats:
  warm off-white section background, wide top spacing, uppercase eyebrow,
  divider with center diamond, large Cormorant heading, body copy, featured
  active card, visible side-card peeks, rounded cards, white overlay text,
  pagination dots, and bottom full-width `Explore the collections` CTA.
- Keep collection cards backed by `CollectionFrontend[]`; do not hard-code
  collection titles except for existing fallback copy.
- Keep the first collection selected by default and preserve accessible
  selection controls for switching the active card.
- Use existing links from `getCollectionHref()` and `/collections`.
- Keep images constrained and object-fitted so artwork remains visible without
  page-level horizontal overflow.
- Preserve the current desktop/tablet section behavior unless a shared helper
  needs a small compatible adjustment.
- Add or adjust focused tests only if rendering behavior, fallback behavior, or
  control semantics change in a way existing tests should cover.

Out of scope:

- Do not change the live homepage, `src/components/views/Home.tsx`, live
  collection pages, collection loaders, collection services, global CSS,
  Tailwind config, root layout, header, footer, or public navigation.
- Do not implement the biography or shop mobile mockups.
- Do not add a fake hamburger/menu control just because it appears in the
  mockup. If a top-right icon is included, it must have real section-local
  behavior and an accessible label; otherwise omit it.
- Do not migrate prototype code into production.
- Do not change collection ordering policy beyond the current data order.
- Do not edit shared trackers while other agents may be working.

## Concurrency

This task owns:

- `src/components/prototypes/home/CollectionPrototypeSection.tsx`
- focused prototype tests if needed
- this task brief handoff section

Avoid shared tracker and index edits during implementation:
`docs/orchestration/state.md`, `docs/tasks/README.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and
`docs/risks/production-readiness.md`.

If tracker updates are needed, list them in this task's handoff notes for the
orchestrator.

## Acceptance Criteria

- At mobile widths, the collections section reads as the supplied mockup: large
  editorial intro above a carousel-like active room card with side-card peeks,
  dots, and a bottom CTA.
- The mobile layout does not create page-level horizontal scrolling.
- Text remains readable and does not overlap images, card edges, controls, or
  the fixed prototype control rail.
- Active and inactive collection cards are keyboard-accessible and have clear
  focus states.
- Desktop and wider tablet collection behavior remains visually and
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
small screenshot or concise observations for the collections section; do not
collect traces, videos, full DOM dumps, or broad screenshot sets.

## Agent Prompt

You are working on T-220. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`src/components/prototypes/home/CollectionPrototypeSection.tsx`,
`src/components/prototypes/home/prototypeHomeLayout.ts`, and
`mobile_designs/collections.png`. Implement only the mobile collections
prototype aesthetic for `/prototype/home`: warm editorial intro, centered
featured room card, side-card peeks, dots, and bottom CTA matching the mockup's
visual direction. Preserve real collection data, current collection links,
desktop/tablet behavior, empty state, live homepage behavior, global CSS,
navigation, and shared trackers. Do not add a nonfunctional hamburger/menu.
Run the focused prototype page test, lint, `git diff --check`, and a targeted
mobile visual check if browser automation is available, then update only this
task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md
```

## Handoff Notes

- Prepared on 2026-05-23 as the first one-at-a-time mobile mockup slice for
  `/prototype/home`.
- Completed on 2026-05-23. `CollectionPrototypeSection` now renders a
  mobile-only collections deck with the mockup's warm editorial intro,
  centered active room card, side-card peeks, pagination dots, and bottom
  archive CTA while preserving the existing `lg` and wider accordion layout.
- Mobile cards remain backed by `CollectionFrontend[]`, use the existing
  collection href helper, keep the first item active by default, and expose
  keyboard-accessible card and dot selection controls.
- Focused test coverage was updated for the mobile deck selection controls,
  active-card href, fallback deck copy, and `/collections` CTA links.
- Follow-up owner-review adjustment: the prototype control dock is hidden on
  mobile viewports, the mobile collections intro-to-deck spacing is tighter,
  and the mobile deck now supports horizontal swipe plus left/right arrow-key
  navigation in addition to dots and peeking-card selection.
- Verification: `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  passed; `npm run lint` passed; `git diff --check` passed.
- Targeted browser visual check was attempted against the local dev server on
  `http://localhost:3001/prototype/home` at a 390px viewport, but could not run
  because `playwright` is not installed in this repo (`Cannot find module
  'playwright'`). The temporary dev server started for that attempt was stopped.
- Candidate tracker updates for the orchestrator after completion: mark T-220
  complete in the frontend/testing workstreams and record that the collections
  prototype now has a mobile-specific owner-review composition based on
  `mobile_designs/collections.png`.
