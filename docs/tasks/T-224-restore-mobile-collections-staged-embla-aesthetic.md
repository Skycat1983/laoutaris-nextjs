# T-224 Restore Mobile Collections Staged Embla Aesthetic

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Restore more of the original T-220 mobile collections staged-card aesthetic
while keeping the smoother Embla-powered interaction introduced by T-222.

The target is a performant version of the earlier look: the active collection
card should feel centered and forward, with adjacent collection cards visibly
set behind or tucked around it, rather than reading as a flat standard rail.

## Context

- T-220 created a staged mobile deck that looked closer to the supplied mockup,
  with a large active card and side cards tucked behind it.
- That custom deck felt very janky because it used bespoke touch handling and
  layout-affecting transitions.
- T-222 migrated the mobile deck to Embla and improved the interaction
  foundation.
- Owner review now finds the Embla version smoother but too much of the earlier
  staged aesthetic was lost.
- T-223 QA could not directly verify real phone interaction, but code/test
  review found the Embla direction acceptable with a manual phone-check caveat.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/prototypes/carousel-performance-assessment.md`
5. `docs/prototypes/mobile-collections-embla-qa.md`
6. `docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`
7. `docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md`
8. `docs/tasks/T-223-review-mobile-collections-embla-qa.md`
9. `src/components/prototypes/home/CollectionPrototypeSection.tsx`
10. `__tests__/unit/pages/PrototypeHomePage.test.tsx`
11. `mobile_designs/collections.png`

## Scope

In scope:

- Adjust only the `/prototype/home` mobile collections Embla carousel visual
  treatment.
- Restore a stronger staged-card composition:
  - active card visually forward and centered
  - adjacent cards visibly tucked behind or partially overlapped
  - inactive vertical titles still visible where practical
  - dots and previous/next controls remain usable
- Keep Embla as the carousel/gesture engine.
- Keep stable slide/card dimensions.
- Use transform and opacity for animated visual treatment.
- If using staggered animation, stagger only non-layout properties such as
  opacity, transform, overlay text, or control reveal. Do not stagger layout
  properties.
- Prefer CSS class/variable changes over complex JavaScript gesture math.
- Keep collection cards backed by `CollectionFrontend[]` and preserve
  `getCollectionHref()` links.
- Preserve the desktop/tablet accordion behavior at `lg` and wider.
- Preserve the empty state, intro copy, dots, previous/next controls, keyboard
  support, `aria-live`, and bottom `/collections` CTA.
- Add or update focused tests/source guardrails proving that mobile card
  transitions remain transform/opacity-only and custom touch handlers do not
  return.

Out of scope:

- Do not replace Embla with a custom swipe engine.
- Do not add, remove, or upgrade dependencies.
- Do not change `src/components/modules/hero/carousel.tsx` or
  `src/components/modules/hero/Hero.tsx`.
- Do not create a shared carousel primitive in this task.
- Do not change the live homepage, live collection pages, collection loaders,
  collection services, global CSS, Tailwind config, root layout, header,
  footer, or public navigation.
- Do not implement biography or shop carousel behavior.
- Do not edit shared trackers while other agents may be working.

## Implementation Guidance

Keep Embla responsible for dragging and snapping. Restore the staged aesthetic
through compositor-friendly card styling layered on top of Embla.

Preferred approach:

- Keep the Embla track as a normal horizontal track.
- Use narrower slide bases and/or static negative spacing only if needed for
  peeks; do not animate those layout values.
- Apply active/adjacent/offscreen visual classes based on shortest circular
  offset from `activeIndex`.
- Use only transforms such as `translate3d(...)`, `scale(...)`, and opacity to
  make adjacent cards appear tucked behind the active card.
- Use z-index by state, but avoid changing dimensions by state.
- Consider a small delay only for active-card text/CTA opacity after the card
  state changes. Do not delay Embla movement itself.
- Avoid large animated box-shadow changes during drag. If the active card needs
  depth, keep the shadow static or change it only subtly.
- If the current previous/next buttons visually interfere with the staged-card
  look, reposition them subtly, but keep them visible and accessible.

Be careful with active state during loop transitions. The implementation should
not visibly double-step from optimistic state changes plus Embla `select`
events. If needed, choose one source of truth for selected state and document
that choice in handoff.

## Acceptance Criteria

- Mobile collections carousel keeps Embla-powered swipe/drag, previous/next,
  dots, keyboard left/right, and `aria-live`.
- The visual composition is closer to the T-220/mockup staged deck than the
  flat T-222 rail: adjacent cards appear behind or tucked around the active
  card.
- Mobile card dimensions remain stable by state.
- Mobile card transitions do not include `width`, `height`, `top`, `left`,
  margin, flex, or other layout-affecting properties.
- Desktop and wider tablet accordion behavior remains unchanged.
- Existing empty-state behavior remains intact.
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

If browser or device inspection is available, check only `/prototype/home` at a
phone viewport such as `390x844` and record concise observations:

- staged/behind-card aesthetic is visible
- swipe/drag remains smooth enough for owner review
- previous/next and dots remain synced
- controls do not block active-card text
- no page-level horizontal overflow

Do not collect traces, videos, full DOM dumps, broad console logs, or large
screenshot sets unless the orchestrator explicitly requests deeper performance
evidence.

## Agent Prompt

You are working on T-224. Read `AGENTS.md`, `docs/README.md`, this task brief,
`docs/prototypes/carousel-performance-assessment.md`,
`docs/prototypes/mobile-collections-embla-qa.md`,
`docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`,
`docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md`,
`docs/tasks/T-223-review-mobile-collections-embla-qa.md`,
`src/components/prototypes/home/CollectionPrototypeSection.tsx`,
`__tests__/unit/pages/PrototypeHomePage.test.tsx`, and
`mobile_designs/collections.png`.

Restore more of the original mobile collections staged-card aesthetic while
keeping Embla as the gesture engine. Adjust only the prototype mobile
collections carousel so the active card feels forward and centered and adjacent
cards appear tucked behind or partially overlapped. Use stable dimensions and
transform/opacity-only animated visual treatment; do not animate width, height,
top, left, margin, flex, or other layout-affecting values. If you stagger
animation, stagger only transform/opacity/text reveal and keep Embla movement
itself immediate. Preserve real collection data, links, desktop accordion,
empty state, dots, previous/next controls, keyboard support, `aria-live`, and
the bottom `/collections` CTA. Do not touch live homepage paths, hero carousel
files, dependencies, global CSS, Tailwind config, navigation, shared trackers,
biography, or shop sections. Run the focused prototype page test, lint,
`git diff --check`, and `npm run build` if practical. Do one narrow phone
viewport check if available and record concise observations. Update only this
task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-224-restore-mobile-collections-staged-embla-aesthetic.md
```

## Handoff Notes

- Prepared on 2026-05-23 after owner review noted that the T-222 Embla
  carousel improved interaction direction but lost too much of the original
  staged behind-card aesthetic.
- Completed on 2026-05-23. The `/prototype/home` mobile collections carousel
  still uses Embla for swipe/drag, previous/next, dots, keyboard left/right,
  and `aria-live`, but the visual treatment now restores a stronger staged
  deck: the active card is centered and forward, adjacent cards translate
  inward behind it, and the secondary controls sit below the deck instead of
  over the card copy.
- Mobile card dimensions remain stable by state. Card, active-copy, inactive
  vertical-title, and active-link transitions remain scoped to transform and
  opacity; no custom touch handlers were reintroduced.
- Focused test coverage now asserts the stronger staged mobile classes,
  preserves the Embla controls and collection links, and checks source-level
  mobile transition lists for layout-affecting properties.
- Verification: `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  passed; `npm run lint` passed; `git diff --check` passed; `npm run build`
  passed. Build emitted existing public main-nav MongoDB timeout error logs
  during static generation, but completed successfully.
- Browser phone-viewport inspection was not available in this workspace:
  `playwright`, `@playwright/test`, and `puppeteer` are not installed. No
  browser automation dependencies were added.
