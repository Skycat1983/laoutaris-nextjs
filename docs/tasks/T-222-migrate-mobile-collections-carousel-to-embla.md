# T-222 Migrate Mobile Collections Carousel To Embla

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace the custom swipe handling in the `/prototype/home` mobile collections
deck with an Embla-powered mobile carousel that feels smooth, has discoverable
controls, and keeps the current prototype isolated from live homepage behavior.

This is the first implementation step after
[T-221](T-221-assess-carousel-performance-foundation.md). It should prove the
approach in the prototype before any shared carousel primitive is promoted.

## Context

- T-220 added a mobile-only staged collections deck.
- Owner review found the swipe interaction very janky.
- T-221 assessed the issue in
  [docs/prototypes/carousel-performance-assessment.md](../prototypes/carousel-performance-assessment.md).
- The assessment recommends using `embla-carousel-react`, already installed in
  the app, with visible previous/next controls and dots.
- The current live hero carousel wrapper is Embla-based but has hero-specific
  sizing. Do not refactor or reuse it directly unless a very small compatible
  import is already safe; this task should keep the proof local to the
  prototype collections section.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/workstreams/testing-and-quality.md`
6. `docs/prototypes/homepage-owner-review-packet.md`
7. `docs/prototypes/carousel-performance-assessment.md`
8. `docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`
9. `src/components/prototypes/home/CollectionPrototypeSection.tsx`
10. `src/components/prototypes/home/HomePrototype.tsx`
11. `src/components/modules/hero/carousel.tsx`
12. `src/components/modules/hero/Hero.tsx`
13. `package.json`

## Scope

In scope:

- Replace `MobileCollectionDeck`'s custom touch-start/touch-end swipe logic with
  Embla-powered mobile carousel behavior.
- Keep the first collection selected by default.
- Keep collection cards backed by `CollectionFrontend[]`; do not hard-code
  collection titles except existing fallback copy.
- Preserve `getCollectionHref()` links and the `/collections` section CTA.
- Preserve the desktop/tablet accordion behavior at `lg` and wider.
- Preserve the empty state.
- Add visible mobile previous/next icon buttons near the deck.
- Keep dots as selected-slide controls.
- Keep keyboard left/right support and an `aria-live` current-slide
  announcement.
- Keep mobile card movement compositor-friendly:
  - stable card dimensions
  - no animation of `width`, `height`, `top`, `left`, margin, flex, or other
    layout-affecting properties
  - use `transform` and `opacity` only for active/adjacent visual treatment
- Keep side-card peeks and the warm editorial mobile composition, but it is
  acceptable to simplify the exact overlap so the interaction becomes smooth.
- Add focused tests for Embla controls and source-level layout-animation
  guardrails if practical.

Out of scope:

- Do not change the live homepage, `src/components/views/Home.tsx`, live
  collection pages, collection loaders, collection services, global CSS,
  Tailwind config, root layout, header, footer, or public navigation.
- Do not change `src/components/modules/hero/carousel.tsx` or
  `src/components/modules/hero/Hero.tsx`.
- Do not add, remove, or upgrade dependencies.
- Do not create a shared carousel primitive in this task unless the
  implementation cannot stay reasonably local; if that happens, record the
  reason in handoff.
- Do not implement biography or shop carousel behavior.
- Do not edit shared trackers while other agents may be working.

## Owned Files

This task may edit:

- `src/components/prototypes/home/CollectionPrototypeSection.tsx`
- Optional prototype-local helper under `src/components/prototypes/home/` if
  needed to keep the section file readable
- `__tests__/unit/pages/PrototypeHomePage.test.tsx`
- this task brief handoff section

Avoid:

- `src/components/modules/hero/carousel.tsx`
- `src/components/modules/hero/Hero.tsx`
- `package.json`
- `package-lock.json`
- `docs/tasks/README.md`
- `docs/workstreams/*`
- `docs/orchestration/state.md`
- shared trackers, risks, and audit registers

## Implementation Instructions

Use `embla-carousel-react` directly in the prototype mobile deck or in a
prototype-local helper. Do not route this through the existing hero carousel
wrapper if doing so would inherit hero item heights or require editing hero
carousel files.

The mobile carousel should:

- initialize with loop enabled if it helps preserve peeking-card continuity
- track the selected snap from Embla's `select` and `reInit` events
- expose previous and next button callbacks from the Embla API
- expose dot buttons that call `scrollTo(index)`
- render only mobile carousel controls inside the `lg:hidden` mobile deck
- avoid card class transitions that include `width`, `height`, `top`, `left`,
  margin, or flex
- keep inactive or off-screen links/buttons out of the tab order where needed
- respect `motion-reduce` by disabling decorative transitions

Keep current copy unless a label needs to become more accessible. If adding
icons, use `lucide-react` icons already available in the project.

## Acceptance Criteria

- At mobile widths, collection navigation can be performed with next button,
  previous button, dots, keyboard left/right, and swipe/drag.
- The active card and dots stay in sync after every interaction.
- The mobile deck no longer uses custom `touchStart`/`touchEnd` swipe state.
- Mobile card movement does not animate layout-affecting CSS properties.
- Desktop and wider tablet collection accordion behavior remains equivalent to
  the current prototype.
- Existing collection empty-state behavior remains intact.
- No page-level horizontal overflow is introduced.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
npm run lint
git diff --check
```

If practical, also run:

```bash
npm run build
```

If browser automation or a local browser check is available, inspect only
`/prototype/home` at a phone viewport such as `390x844` and record concise
observations:

- next and previous buttons move smoothly
- swipe/drag feels smooth enough for owner review
- dots remain synced
- no page-level horizontal overflow
- no text/control overlap with card imagery or section CTA

Do not collect traces, videos, full DOM dumps, broad console logs, or large
screenshot sets unless the orchestrator explicitly requests deeper performance
evidence.

## Agent Prompt

You are working on T-222. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`docs/prototypes/carousel-performance-assessment.md`,
`docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`,
`src/components/prototypes/home/CollectionPrototypeSection.tsx`,
`src/components/prototypes/home/HomePrototype.tsx`,
`src/components/modules/hero/carousel.tsx`, `src/components/modules/hero/Hero.tsx`,
and `package.json`.

Implement the first carousel performance improvement by migrating only the
`/prototype/home` mobile collections deck from custom touch handling to
Embla-powered carousel behavior. Keep it prototype-local, preserve real
collection data and links, preserve the desktop accordion and empty state, add
visible previous/next controls plus dots, keep keyboard left/right and
`aria-live`, and ensure mobile card movement uses stable dimensions with
`transform`/`opacity` animations only. Do not edit live homepage paths, hero
carousel files, dependencies, global CSS, Tailwind config, navigation, shared
trackers, biography, or shop sections. Run the focused prototype page test,
lint, `git diff --check`, and `npm run build` if practical. Do one narrow phone
viewport check if available and record concise observations. Update only this
task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md
```

## Handoff Notes

- Prepared on 2026-05-23 from the T-221 recommendation to prove an Embla-based
  mobile collections carousel in the isolated prototype before any shared
  carousel foundation is promoted.
- Completed on 2026-05-23. The `/prototype/home` mobile collections deck now
  uses prototype-local `embla-carousel-react` wiring with looped mobile
  dragging, selected-slide sync from `select`/`reInit`, visible previous/next
  icon buttons, dot `scrollTo` controls, keyboard left/right support, and the
  existing `aria-live` current-slide announcement.
- The old custom `touchStart`/`touchEnd` swipe state was removed. Mobile cards
  now keep stable slide/card dimensions and restrict card state transitions to
  `opacity` and `transform`, while preserving active-card links,
  side-card peeks, fallback deck copy, the `/collections` CTA, the desktop
  accordion, and the empty state.
- Focused test coverage now mocks the Embla hook for jsdom, verifies mobile
  previous/next/dot/keyboard state changes, preserves collection hrefs, and
  adds source-level guardrails against custom touch handlers and
  layout-affecting mobile card transitions.
- Verification: `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  passed; `npm run lint` passed; `git diff --check` passed; `npm run build`
  passed. Build output reported `/prototype/home` as a static route with
  `11.9 kB` route size and `121 kB` first-load JS.
- Browser phone-viewport interaction QA was not run because this repo does not
  have Playwright or Puppeteer installed (`require.resolve` and `npm ls`
  checks returned unavailable/empty). No browser automation dependencies were
  added.
