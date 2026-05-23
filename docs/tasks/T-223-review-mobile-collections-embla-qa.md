# T-223 Review Mobile Collections Embla QA

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Run a narrow post-implementation QA pass for the `/prototype/home` mobile
collections Embla carousel and report whether it is smooth enough for owner
review or needs another implementation slice.

This is a QA/report task. Do not change runtime code unless the orchestrator
assigns a follow-up implementation task.

## Context

- T-221 assessed the custom mobile collections deck and recommended Embla.
- T-222 migrated the `/prototype/home` mobile collections deck to
  prototype-local `embla-carousel-react` wiring.
- Automated tests and build passed after T-222, but no phone-viewport browser
  interaction QA was run because browser automation dependencies were not
  installed.
- The owner specifically reported that the previous swipe behavior felt very
  janky, so this task must focus on interaction smoothness and practical mobile
  usability.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/prototypes/homepage-owner-review-packet.md`
5. `docs/prototypes/carousel-performance-assessment.md`
6. `docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`
7. `docs/tasks/T-221-assess-carousel-performance-foundation.md`
8. `docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md`
9. `src/components/prototypes/home/CollectionPrototypeSection.tsx`
10. `src/components/prototypes/home/HomePrototype.tsx`

## Scope

In scope:

- Inspect `/prototype/home` in a production-like local build if practical.
- Test the mobile collections carousel at a phone-sized viewport such as
  `390x844`.
- Check interaction quality for:
  - swipe/drag
  - next button
  - previous button
  - dot selection
  - keyboard left/right if using desktop browser device emulation
- Check visual layout:
  - no page-level horizontal overflow
  - side-card peeks are visible but do not cause page scrolling
  - controls do not overlap text in an unusable way
  - active-card text remains readable
  - bottom `Explore the collections` CTA remains reachable and clear
- Check whether the hidden prototype dock remains absent on mobile.
- Compare perceived smoothness against the pre-Embla custom swipe behavior if
  known from local context.

Out of scope:

- Do not modify runtime code.
- Do not add browser automation dependencies.
- Do not edit `package.json`, lockfiles, global CSS, Tailwind config, live
  homepage paths, hero carousel files, shared trackers, or workstream files.
- Do not collect traces, videos, full DOM dumps, broad console logs, or large
  screenshot sets.

## Required Report

Create this report:

```text
docs/prototypes/mobile-collections-embla-qa.md
```

The report must include:

- Environment used: dev mode, production mode, browser/device or emulator, and
  viewport size.
- Exact commands run.
- Whether each interaction path worked: swipe/drag, next, previous, dots,
  keyboard.
- Smoothness assessment: `pass`, `borderline`, or `fail`, with concise
  observations.
- Layout assessment: overflow, overlap, text readability, CTA reachability, and
  mobile debug dock absence.
- Any regression risks found.
- Recommendation:
  - accept for owner review
  - or prepare another implementation task, with exact proposed changes.

If no browser/device check is possible, explain the blocker and still review the
code for likely remaining interaction/layout risks.

## Verification

Required:

```bash
git diff --check
```

Recommended if practical:

```bash
npm run build
npm run start -- -p 3001
curl -I http://localhost:3001/prototype/home
```

Stop any temporary local server before handoff.

## Agent Prompt

You are working on T-223. Read `AGENTS.md`, `docs/README.md`, this task brief,
`docs/prototypes/homepage-owner-review-packet.md`,
`docs/prototypes/carousel-performance-assessment.md`,
`docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`,
`docs/tasks/T-221-assess-carousel-performance-foundation.md`,
`docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md`,
`src/components/prototypes/home/CollectionPrototypeSection.tsx`, and
`src/components/prototypes/home/HomePrototype.tsx`.

Run a narrow QA pass for the Embla mobile collections carousel on
`/prototype/home`. Do not change runtime code or dependencies. Use a
production-like local build if practical, inspect a phone viewport such as
`390x844`, and report whether swipe/drag, previous/next buttons, dots, and
keyboard left/right work smoothly enough for owner review. Check for page-level
horizontal overflow, text/control overlap, CTA reachability, and mobile debug
dock absence. Create `docs/prototypes/mobile-collections-embla-qa.md` with the
environment, commands, observations, smoothness/layout verdict, risks, and
recommendation. Run `git diff --check`, stop any temporary server, and update
only this task handoff.

## One-Line Assignment

```text
/task effort: medium details: docs/tasks/T-223-review-mobile-collections-embla-qa.md
```

## Handoff Notes

- Prepared on 2026-05-23 after orchestrator verification of T-222 focused
  tests, lint, and `git diff --check`.
- Completed on 2026-05-23. Added
  `docs/prototypes/mobile-collections-embla-qa.md` with the production-mode
  QA report, interaction/layout assessment, smoothness verdict, risks, and
  recommendation.
- Production verification passed: `npm run build`,
  `npm run start -- -p 3001`, `curl -I http://localhost:3001/prototype/home`,
  focused prototype page test, and `git diff --check`.
- Direct phone-viewport browser interaction QA remained blocked because
  Playwright/Puppeteer are unavailable and Safari WebDriver could not be used
  without a local password. The report marks smoothness as `borderline`: the
  Embla implementation is acceptable for owner review with a manual phone-check
  caveat, and no follow-up implementation slice is recommended from code/test
  review alone.
- The temporary production server on port `3001` was stopped before handoff.
