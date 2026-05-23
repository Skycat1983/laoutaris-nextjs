# T-225 Recreate Original Mobile Collections Deck With Controls

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Restore the original `mobile_designs/collections.png` mobile collections
composition as closely as possible, while keeping the newer discoverable
carousel controls from the Embla work.

The current T-224 version is not the desired direction. It should not be
polished further. Recreate the original centered featured card with side cards
behind/peeking around it.

## Context

- T-220 first implemented a mobile staged deck that visually matched
  `mobile_designs/collections.png` more closely:
  - large centered active card
  - adjacent side cards visibly behind/peeking
  - vertical inactive collection titles
  - dots below the card
  - bottom `Explore the collections` CTA
- T-222 added Embla-powered controls and improved the interaction foundation.
- T-224 attempted to restore the staged aesthetic inside the Embla rail, but
  owner review found it looked worse.
- The owner now wants the original image recreated again, with the newer
  carousel controls retained.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/prototypes/carousel-performance-assessment.md`
5. `docs/prototypes/mobile-collections-embla-qa.md`
6. `docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`
7. `docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md`
8. `docs/tasks/T-224-restore-mobile-collections-staged-embla-aesthetic.md`
9. `src/components/prototypes/home/CollectionPrototypeSection.tsx`
10. `__tests__/unit/pages/PrototypeHomePage.test.tsx`
11. `mobile_designs/collections.png`

## Scope

In scope:

- Adjust only the `/prototype/home` mobile collections carousel visual
  implementation.
- Recreate the original mockup geometry and T-220 visual direction:
  - active card centered, tallest, widest, and visually forward
  - previous/next cards tucked behind active card with clear side peeks
  - farther cards may peek at the edges when enough collections exist
  - inactive card titles remain vertical where practical
  - active card keeps white index, `View` link, title, and short deck copy
  - dots stay below the deck
  - bottom `/collections` CTA remains below the dots
- Retain the newer controls:
  - visible previous button
  - visible next button
  - dot buttons
  - keyboard left/right
  - `aria-live` current-slide announcement
- Keep `embla-carousel-react` available as the carousel state/gesture engine
  where useful, but do not force the visible layout to look like a flat Embla
  rail.
- If preserving exact staged geometry means the visible deck is state-driven
  from Embla-selected index rather than a conventional rail, that is acceptable.
- Keep collection cards backed by `CollectionFrontend[]` and preserve
  `getCollectionHref()` links.
- Preserve desktop/tablet accordion behavior at `lg` and wider.
- Preserve empty state and intro copy.
- Keep performance guardrails:
  - stable card dimensions by state
  - no animated `width`, `height`, `top`, `left`, margin, flex, or other
    layout-affecting properties
  - animated state changes use `transform` and `opacity`
  - avoid large animated shadow changes during movement
- Update focused tests/source guardrails to reflect the restored original deck
  geometry and retained controls.

Out of scope:

- Do not keep iterating on the T-224 rail-like overlap if it conflicts with the
  original mockup.
- Do not change live homepage paths, live collection pages, collection loaders,
  collection services, global CSS, Tailwind config, root layout, header,
  footer, or public navigation.
- Do not edit `src/components/modules/hero/carousel.tsx` or
  `src/components/modules/hero/Hero.tsx`.
- Do not add, remove, or upgrade dependencies.
- Do not create a shared carousel primitive.
- Do not implement biography or shop carousel behavior.
- Do not edit shared trackers while other agents may be working.

## Implementation Guidance

Use `mobile_designs/collections.png` as the visual source of truth.

The earlier T-220 geometry is a useful reference:

- mobile deck area around `h-[470px]`
- active card around `h-[430px]` and `w-[min(74vw,330px)]`
- active card centered with high z-index
- left/right peeking cards narrower and shorter
- vertical inactive titles
- dots centered under the deck

Do not reproduce the old performance issue. The old custom deck animated
dimension classes and relied on basic touch-start/touch-end handling. This task
should keep the visual geometry but avoid layout-animation jank.

Preferred strategy:

- Render a staged visual deck positioned relative to the active index.
- Use absolute positioned cards within a fixed-height mobile deck area, similar
  to the original mockup.
- Keep each card's dimensions stable for its role. If active/side/far cards
  have different dimensions, they should switch roles on selection, but do not
  include `width` or `height` in transition lists.
- Use transform/opacity transitions for role changes.
- Keep previous/next buttons near or below the deck so they do not obscure the
  active card copy. They may sit beside the dots if that best preserves the
  mockup.
- Keep Embla-selected index in sync with controls if Embla remains mounted.
  Avoid visible double-step from optimistic state plus Embla `select` events.
  Prefer one selected-index source of truth where practical.
- If swipe/drag cannot be made to feel good with the exact staged visual deck,
  keep swipe as a secondary enhancement and make previous/next/dots the primary
  owner-review controls. Do not reintroduce custom touch handlers without
  explaining why in the handoff.

## Acceptance Criteria

- Mobile collections section visually resembles `mobile_designs/collections.png`
  again: large centered featured card, side cards behind/peeking, dots, and
  bottom CTA.
- The newer previous/next controls remain visible, accessible, and synced with
  the active card and dots.
- Collection links and real collection data remain intact.
- Desktop and wider tablet accordion behavior remains unchanged.
- Empty state remains intact.
- No page-level horizontal overflow is introduced.
- Mobile card transitions do not include layout-affecting properties.
- Custom touch handlers do not return unless explicitly justified in the
  handoff.

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

If browser or device inspection is available, check only `/prototype/home` at a
phone viewport such as `390x844` and record concise observations:

- original mockup-like staged deck is restored
- controls advance and reverse the active card
- dots stay synced
- swipe/drag, if available, does not feel worse than the T-222 Embla version
- no page-level horizontal overflow
- controls do not obscure active card text or bottom CTA

Do not collect traces, videos, full DOM dumps, broad console logs, or large
screenshot sets unless the orchestrator explicitly asks.

## Agent Prompt

You are working on T-225. Read `AGENTS.md`, `docs/README.md`, this task brief,
`docs/prototypes/carousel-performance-assessment.md`,
`docs/prototypes/mobile-collections-embla-qa.md`,
`docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`,
`docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md`,
`docs/tasks/T-224-restore-mobile-collections-staged-embla-aesthetic.md`,
`src/components/prototypes/home/CollectionPrototypeSection.tsx`,
`__tests__/unit/pages/PrototypeHomePage.test.tsx`, and
`mobile_designs/collections.png`.

The current T-224 mobile collections carousel looks worse than the original.
Do not polish that direction. Recreate the original
`mobile_designs/collections.png` composition as closely as possible: a large
centered active card, side cards tucked behind/peeking around it, vertical
inactive titles, dots, and the bottom `Explore the collections` CTA. Keep the
newer previous/next controls, dot controls, keyboard support, `aria-live`, real
collection data, collection links, desktop accordion, and empty state. Keep
Embla available for selected-index/control sync where useful, but do not force
the visible deck to read as a flat rail. Use stable card role dimensions and
transform/opacity-only animated state changes; do not animate width, height,
top, left, margin, flex, or other layout-affecting values. Do not touch live
homepage paths, hero carousel files, dependencies, global CSS, Tailwind config,
navigation, shared trackers, biography, or shop sections. Run the focused
prototype page test, lint, `git diff --check`, and `npm run build` if
practical. Do one narrow phone viewport check if available and record concise
observations. Update only this task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-225-recreate-original-mobile-collections-deck-with-controls.md
```

## Handoff Notes

- Prepared on 2026-05-23 after owner review found T-224 worse visually and
  requested the original `mobile_designs/collections.png` style again, with the
  newer carousel controls retained.
- Completed on 2026-05-23. The `/prototype/home` mobile collections carousel
  visible layout is back to a state-driven absolute staged deck: a centered
  `h-[430px]` active card, previous/next cards tucked behind it, farther edge
  peeks when enough collections exist, vertical inactive titles, dots, and the
  bottom `/collections` CTA.
- The newer controls remain: visible previous/next buttons, dot buttons,
  keyboard left/right handling, `aria-live`, real collection data, and
  collection links. `embla-carousel-react` remains mounted for selected-index
  sync/control compatibility, but the visible deck no longer reads as a flat
  Embla rail.
- Mobile card role changes keep fixed role dimensions and transition only
  `opacity`/`transform`; custom touch handlers were not reintroduced.
- Focused tests now assert the restored original-style staged geometry and keep
  the source guardrail against layout-affecting transition lists and old rail
  classes.
- Verification: `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  passed, 1 suite / 21 tests; `npm run lint` passed; `git diff --check`
  passed.
- `npm run build` was attempted twice. The first run compiled and type-checked,
  then failed during page-data collection with Next `PageNotFoundError` for
  `/account/watchlist` and `/_not-found`. After removing the generated `.next`
  cache and retrying, the clean build again compiled and type-checked, then
  failed during page-data collection with `PageNotFoundError` for `/_document`.
  No scoped collections component error was reported.
- Browser phone-viewport inspection was not available in this workspace:
  `playwright`, `@playwright/test`, and `puppeteer` are not installed. No
  browser automation dependencies were added.
