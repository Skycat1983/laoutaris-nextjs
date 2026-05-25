# T-221 Assess Carousel Performance Foundation

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Assess why the `/prototype/home` mobile collections carousel interaction feels
janky and recommend the first implementation direction for smooth reusable
carousel behavior across the app.

This is an assessment task. Do not patch runtime carousel behavior in this
task. The output is a report for the orchestrator.

## Context

- T-220 added a mobile-specific collections deck in
  `src/components/prototypes/home/CollectionPrototypeSection.tsx`.
- Owner review found swiping feels extremely janky, close to a very low frame
  rate.
- The app already has `embla-carousel-react` installed and a wrapper at
  `src/components/modules/hero/carousel.tsx`.
- Future homepage/shop/archive surfaces may need carousel-like behavior, so the
  answer should not be a one-off prototype hack.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/workstreams/testing-and-quality.md`
6. `docs/prototypes/homepage-owner-review-packet.md`
7. `docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`
8. `src/components/prototypes/home/CollectionPrototypeSection.tsx`
9. `src/components/prototypes/home/HomePrototype.tsx`
10. `src/components/modules/hero/carousel.tsx`
11. `src/components/modules/hero/Hero.tsx`
12. `src/components/sections/BiographySectionVariations.tsx`
13. `package.json`

## Scope

In scope:

- Inspect the current T-220 mobile collections deck implementation.
- Identify likely performance bottlenecks, including layout-triggering CSS,
  image paint/decode costs, React rerender behavior, gesture handling, and dev
  mode versus production mode differences.
- Inspect current carousel-like app patterns:
  - the Embla wrapper under `src/components/modules/hero/carousel.tsx`
  - the hero carousel usage
  - the native overflow/snap biography variation
- If practical in the local environment, compare the current route in dev mode
  and production mode (`npm run build`, then `npm run start`) using only narrow
  observations or concise browser performance notes.
- Evaluate at least these candidate directions:
  1. optimize the custom mobile deck while keeping its staged-card aesthetic
  2. migrate the mobile collections deck to Embla
  3. use native horizontal scroll snap for mobile rails
  4. use explicit previous/next buttons as primary controls with swipe as
     secondary
- Recommend a next implementation slice, including the code areas it should
  touch and the verification needed.

Out of scope:

- Do not change runtime component behavior.
- Do not add or remove dependencies.
- Do not refactor the existing hero carousel.
- Do not migrate live homepage behavior.
- Do not edit shared trackers or workstream files.
- Do not collect broad traces, videos, full DOM dumps, large screenshot sets, or
  exhaustive browser logs.

## Required Report

Create this report:

```text
docs/prototypes/carousel-performance-assessment.md
```

The report must include:

- Current implementation summary.
- Evidence gathered, with exact commands or browser checks attempted.
- Whether checks were run in dev mode, production mode, or not run, and why.
- Likely bottlenecks ranked from most likely to least likely.
- Comparison of custom transform-only deck, Embla, native scroll snap, and
  button-led controls.
- Recommendation for the next implementation task.
- Specific files the next implementation should edit.
- Specific files it should not edit.
- Verification plan for the next implementation.
- Open questions or owner decisions, if any.

## Code Instructions

Do not write runtime code in this task.

If local measurement absolutely requires a small temporary script, write it
under `/private/tmp`, not in the repo. Record what it did in the report. Remove
or ignore temporary artifacts before handoff.

## Verification

Required:

```bash
git diff --check
```

If running app checks is practical:

```bash
npm run build
npm run start
```

Then inspect only `/prototype/home` at a phone-sized viewport. Keep notes
concise in the report.

If build/start or browser inspection is blocked by environment constraints,
record the exact blocker in the report instead of broadening scope.

## Agent Prompt

You are working on T-221. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`,
`src/components/prototypes/home/CollectionPrototypeSection.tsx`,
`src/components/prototypes/home/HomePrototype.tsx`,
`src/components/modules/hero/carousel.tsx`,
`src/components/modules/hero/Hero.tsx`,
`src/components/sections/BiographySectionVariations.tsx`, and `package.json`.

Assess why the current mobile collections carousel feels janky and recommend a
durable smooth carousel foundation for this app. Do not change runtime code,
dependencies, live homepage behavior, shared trackers, or existing carousel
components. Create `docs/prototypes/carousel-performance-assessment.md` with
your evidence, bottleneck ranking, comparison of custom transform-only deck
versus Embla versus native scroll snap versus button-led controls, and a
recommended next implementation slice with exact files to edit, files to avoid,
and verification steps. Run `git diff --check`; run `npm run build` and a
narrow production-mode `/prototype/home` phone-viewport check only if practical,
and record any blockers.

## One-Line Assignment

```text
/task effort: medium details: docs/tasks/T-221-assess-carousel-performance-foundation.md
```

## Handoff Notes

- Prepared on 2026-05-23 after owner feedback that the T-220 mobile collections
  swipe interaction is too janky for reuse.
- Orchestrator should review
  `docs/prototypes/carousel-performance-assessment.md` before assigning any
  implementation task.
