# T-158 Build Biography Prototype Section

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Build the full-width biography teaser section for the homepage prototype using
`to_prototype/biography.png` as the design guide and real biography article
data.

## Context

- The image is a guide for the homepage biography teaser section, not the
  biography landing page.
- The current live homepage biography section uses `BiographySectionLoader`,
  `getArticleList({ section: "biography" })`, and `BiographySection`.
- T-157 should provide `/prototype/home` and a prototype component folder before
  this task is wired into the route.

## Scope

In scope:

- Build a prototype biography section component under the prototype home folder.
- Use `to_prototype/biography.png` for composition, spacing, hierarchy, and
  card rhythm.
- Consume real biography article data through the existing server-only article
  list service or a prototype loader that delegates to it.
- Link the section CTA to `/biography` and cards to their biography article
  routes where data provides slugs.
- Keep the section full-width and independent of `ContentLayout`.
- Add focused coverage if meaningful behavior or data mapping is introduced.

Out of scope:

- Do not change the live `BiographySection`, `BiographySectionLoader`, or
  `/biography` page.
- Do not redesign the global hero, blog section, shop section, or navbar.
- Do not edit global CSS or create central style tokens in this task.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-159 and T-160 after T-157 creates the prototype
route/folder. Avoid touching blog/shop prototype files.

Can run in parallel with T-161 because T-161 is read-only.

Owned files:

- biography prototype section files under `src/components/prototypes/home/`
- prototype home route wiring only for the biography slot if T-157 is complete
- focused biography prototype tests if added
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/prototypes/home/BiographyPrototypeSection.tsx`
- `src/components/prototypes/home/HomePrototype.tsx`
- optional `src/components/prototypes/home/BiographyPrototypeLoader.tsx`
- focused tests under `__tests__/unit/` if added
- `docs/tasks/T-158-build-biography-prototype-section.md`

## Acceptance Criteria

- `/prototype/home` shows a full-width biography teaser inspired by
  `to_prototype/biography.png`.
- The section uses real biography article data, not hard-coded mock article
  cards.
- The section degrades cleanly if biography data is missing.
- The live homepage and live biography page are unchanged.
- The section is responsive enough to inspect on desktop and mobile without
  obvious text overlap.

## Verification

```bash
npm run lint
git diff --check
```

Add focused tests if data mapping, fallback behavior, or route rendering is
covered.

## Agent Prompt

You are working on T-158. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the linked workstreams. Use `to_prototype/biography.png` as the visual guide
for a full-width homepage biography teaser section on `/prototype/home`. Use
real biography article data via existing server-only services; do not hard-code
the cards except for safe fallback copy. Do not change the live homepage,
`BiographySection`, `/biography`, `ContentLayout`, global CSS, or shared
trackers. Keep your writes inside the prototype biography files and route wiring
needed to display that section. Run the listed verification and update only this
task brief handoff.

## Handoff Notes

- Prepared after T-157 was proposed. If T-157 is not complete, create the
  section component only and list the route wiring as the next action.
- Completed 2026-05-20 by adding
  `src/components/prototypes/home/BiographyPrototypeSection.tsx` and
  `src/components/prototypes/home/BiographyPrototypeLoader.tsx`.
- The prototype biography loader delegates to `getArticleList` with
  `section: "biography"` and a five-card field-limited fetch. It returns an
  empty list for missing data or non-Next loader failures so the section can
  render its safe fallback state.
- Wired `/prototype/home` through `HomePrototype` so the biography slot renders
  the image-guided full-width teaser while preserving the concurrent blog
  prototype data path. The live homepage, live `BiographySection`,
  `/biography`, `ContentLayout`, global CSS, and shared trackers were not
  changed.
- Added focused coverage in
  `__tests__/unit/pages/PrototypeHomePage.test.tsx` for biography section
  links/fallback behavior and route data-loader wiring, plus
  `__tests__/unit/prototypes/BiographyPrototypeLoader.test.tsx` for the
  server-only article service delegation and failure handling.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx __tests__/unit/prototypes/BiographyPrototypeLoader.test.tsx`
  (with the existing Node `punycode` deprecation warning), `npm run lint`, and
  `git diff --check`.
- Local route smoke passed: started `npm run dev` and
  `curl -I http://localhost:3000/prototype/home` returned `HTTP/1.1 200 OK`.
- Candidate tracker updates for the orchestrator: mark T-158 complete in the
  frontend/testing workstreams and note that `/prototype/home` now has the
  biography teaser wired to real biography article data.
