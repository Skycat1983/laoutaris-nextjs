# T-228 Implement Mobile Project Prototype Aesthetic

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Adapt only the `/prototype/home` project/documentary section for mobile
viewports using `mobile_designs/project.png` as the visual guide, while
preserving the existing wider desktop prototype behavior and existing
documentary video path.

## Context

- `/prototype/home` is an isolated owner-review workshop route, not the live
  homepage.
- The current project slot is rendered from `HomePrototype.tsx` through
  `PrototypeSectionPlaceholder`, with the existing documentary YouTube embed as
  media.
- `mobile_designs/project.png` shows a phone-first documentary feature with a
  warm white card-like section, uppercase `Project` eyebrow, large Cormorant
  `Watch the documentary` heading, short intro copy, full-width video/image
  area with centered play affordance, three metadata rows, and a bottom
  bordered `Watch on film page` CTA.
- Other agents may be working in this repo at the same time. Keep edits tightly
  scoped and do not overwrite unrelated dirty files.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/workstreams/testing-and-quality.md`
6. `docs/prototypes/homepage-owner-review-packet.md`
7. `src/components/prototypes/home/HomePrototype.tsx`
8. `src/components/prototypes/home/PrototypeSectionPlaceholder.tsx`
9. `src/components/prototypes/home/prototypeHomeLayout.ts`
10. `src/components/elements/misc/YoutubeEmbedding.tsx`
11. `__tests__/unit/pages/PrototypeHomePage.test.tsx`
12. `mobile_designs/project.png`

## Scope

In scope:

- Implement a mobile-specific project/documentary layout for the
  `/prototype/home` project section.
- Prefer creating a prototype-local `ProjectPrototypeSection` component under
  `src/components/prototypes/home/` if that keeps `HomePrototype.tsx` readable.
- Match the mobile mockup's important aesthetic beats:
  - warm white/off-white mobile section surface
  - uppercase `Project` eyebrow
  - large Cormorant `Watch the documentary` heading
  - short intro copy
  - full-width documentary media area
  - centered play affordance or existing YouTube player behavior
  - three separated detail rows using existing copy
  - bottom full-width bordered `Watch on film page` CTA with arrow
- Preserve the existing documentary video ID/path currently used by
  `ProjectPrototypeVideo`.
- Preserve the current wider desktop/tablet project placeholder behavior unless
  a small compatible route-local extraction is needed.
- Keep all project changes isolated to `/prototype/home`.
- Add or adjust focused tests only if rendering behavior, links, or semantics
  change.

Out of scope:

- Do not change the live homepage, live project pages, project route content,
  global CSS, Tailwind config, root layout, header, footer, or public
  navigation.
- Do not implement the biography, blog, collections, or shop mobile mockups.
- Do not add a fake hamburger/menu control just because it appears in the
  mockup. If a top-right icon is included, it must have real section-local
  behavior and an accessible label; otherwise omit it.
- Do not replace the existing documentary embed with an unrelated asset.
- Do not add video playback libraries or dependencies.
- Do not edit shared trackers while other agents may be working.

## Concurrency

This task owns:

- `src/components/prototypes/home/HomePrototype.tsx`
- optional `src/components/prototypes/home/ProjectPrototypeSection.tsx`
- focused project prototype tests if needed
- this task brief handoff section

Avoid:

- `src/components/prototypes/home/BlogPrototypeSection.tsx`
- `src/components/prototypes/home/CollectionPrototypeSection.tsx`
- biography and shop prototype section files
- live route/view files
- `docs/orchestration/state.md`, `docs/tasks/README.md`,
  `docs/workstreams/*`, shared trackers, risks, and audit registers

If `__tests__/unit/pages/PrototypeHomePage.test.tsx` already has unrelated
dirty changes, preserve them and add only the minimum project-specific
assertions.

## Acceptance Criteria

- At mobile widths, the project section reads as the supplied mockup:
  editorial intro, documentary media area, separated detail rows, and bottom
  film-page CTA.
- The existing documentary video remains available.
- The mobile layout does not create page-level horizontal scrolling.
- Text remains readable and does not overlap media, controls, row dividers, or
  CTA.
- Media and CTA remain keyboard-accessible with clear focus states.
- Desktop and wider tablet project behavior remains visually and functionally
  equivalent to the pre-task prototype unless the task handoff explicitly notes
  a route-local extraction with no visual change.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
npm run lint
git diff --check
```

If practical, run a narrow phone-viewport check for `/prototype/home` focused
only on the project section. Capture concise observations, not traces, videos,
full DOM dumps, broad logs, or large screenshot sets.

## Agent Prompt

You are working on T-228. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`src/components/prototypes/home/HomePrototype.tsx`,
`src/components/prototypes/home/PrototypeSectionPlaceholder.tsx`,
`src/components/prototypes/home/prototypeHomeLayout.ts`,
`src/components/elements/misc/YoutubeEmbedding.tsx`,
`__tests__/unit/pages/PrototypeHomePage.test.tsx`, and
`mobile_designs/project.png`.

Implement only the mobile project/documentary prototype aesthetic for
`/prototype/home`: a warm editorial mobile section with uppercase eyebrow,
large `Watch the documentary` heading, intro copy, documentary media area,
three separated detail rows, and a bottom `Watch on film page` CTA. Preserve
the existing documentary video ID/path, wider desktop/tablet project behavior,
live homepage behavior, global CSS, navigation, and shared trackers. Prefer a
prototype-local `ProjectPrototypeSection` extraction if needed, but do not
touch live project pages or add video dependencies. Do not add a nonfunctional
hamburger/menu. Other agents may be editing nearby prototype files, so keep
changes scoped and preserve unrelated dirty work. Run the focused prototype page
test, lint, `git diff --check`, and a targeted mobile visual check if
available, then update only this task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-228-implement-mobile-project-prototype-aesthetic.md
```

## Handoff Notes

- Prepared on 2026-05-23 as a one-at-a-time mobile mockup slice for the
  `/prototype/home` project/documentary section using
  `mobile_designs/project.png`.
- Completed on 2026-05-23. Added
  `src/components/prototypes/home/ProjectPrototypeSection.tsx` and routed the
  `/prototype/home` project slot through it. The phone branch now uses a warm
  off-white editorial layout with `Project` eyebrow, large `Watch the
  documentary` heading, intro copy, full-width existing YouTube embed, three
  separated detail rows, and a keyboard-focusable `/project/film` CTA. The
  `md+` branch preserves the prior placeholder-style composition and the
  existing `6ynF2gO-J30` documentary embed.
- Focused project assertions were added to
  `__tests__/unit/pages/PrototypeHomePage.test.tsx`. The full focused page
  suite still fails on pre-existing non-project prototype drift: the wider-frame
  source-count invariant now sees 6 frame usages instead of 5, and the blog
  test finds duplicate `Studio Note` links from concurrent mobile/desktop blog
  markup.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
    failed with the two non-project failures noted above; the project-specific
    test passed.
  - `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx -t "mobile documentary"`
    passed.
  - `npm run lint` passed.
  - `git diff --check` passed.
  - `curl -I --max-time 5 http://localhost:3000/prototype/home` returned
    `200 OK` against an already-running dev server. A Playwright phone
    viewport check was not available because Playwright is not installed in
    this repo.
