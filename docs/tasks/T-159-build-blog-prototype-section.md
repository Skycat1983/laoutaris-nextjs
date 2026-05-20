# T-159 Build Blog Prototype Section

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Build the full-width blog teaser section for the homepage prototype using
`to_prototype/blog.png` as a layout guide while rendering real blog entries.

## Context

- The `blog.png` guide currently shows biography wording/content. Ignore that
  content.
- This task is for the homepage blog teaser section, not the `/blog` landing
  page.
- The current live homepage blog section uses `BlogSectionLoader`,
  `getBlogList({ sortby: "latest", limit: 4 })`, and `BlogSection`.
- T-157 should provide `/prototype/home` and a prototype component folder before
  this task is wired into the route.

## Scope

In scope:

- Build a prototype blog section component under the prototype home folder.
- Use `to_prototype/blog.png` for composition, large lead story behavior, card
  layout, image balance, and button treatment.
- Consume real blog data through the existing server-only blog list service or
  a prototype loader that delegates to it.
- Use blog titles, subtitles/excerpts where available, image URLs, and slugs.
- Link the section CTA to `/blog` and cards to `/blog/[slug]`.
- Keep the section full-width and independent of `ContentLayout`.
- Add focused coverage if meaningful behavior or data mapping is introduced.

Out of scope:

- Do not use the biography text/content shown in `blog.png`.
- Do not change the live `BlogSection`, `BlogSectionLoader`, or `/blog` page.
- Do not redesign biography, shop, the global hero, or navbar.
- Do not edit global CSS or create central style tokens in this task.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-158 and T-160 after T-157 creates the prototype
route/folder. Avoid touching biography/shop prototype files.

Can run in parallel with T-161 because T-161 is read-only.

Owned files:

- blog prototype section files under `src/components/prototypes/home/`
- prototype home route wiring only for the blog slot if T-157 is complete
- focused blog prototype tests if added
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/prototypes/home/BlogPrototypeSection.tsx`
- `src/components/prototypes/home/HomePrototype.tsx`
- optional `src/components/prototypes/home/BlogPrototypeLoader.tsx`
- focused tests under `__tests__/unit/` if added
- `docs/tasks/T-159-build-blog-prototype-section.md`

## Acceptance Criteria

- `/prototype/home` shows a full-width blog teaser inspired by
  `to_prototype/blog.png`.
- The section renders real blog entries rather than the biography content shown
  in the guide image.
- The section degrades cleanly if blog data is missing.
- The live homepage and live blog page are unchanged.
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

You are working on T-159. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the linked workstreams. Use `to_prototype/blog.png` for layout only. Ignore
the biography wording/content in that image and build a homepage blog teaser
using real blog entries from the existing server-only blog list service. Do not
change the live homepage, `BlogSection`, `/blog`, `ContentLayout`, global CSS,
or shared trackers. Keep your writes inside the prototype blog files and route
wiring needed to display that section. Run the listed verification and update
only this task brief handoff.

## Handoff Notes

- Prepared after T-157 was proposed. If T-157 is not complete, create the
  section component only and list the route wiring as the next action.
- Completed the prototype homepage blog section in
  `src/components/prototypes/home/BlogPrototypeSection.tsx`.
- Added `getBlogPrototypeEntries()` in
  `src/components/prototypes/home/BlogPrototypeLoader.tsx`, delegating to
  `getBlogList({ sortby: "latest", limit: 5 })` for one lead story plus up to
  four teaser cards.
- Wired `/prototype/home` through the prototype blog loader while keeping the
  live homepage, live `BlogSection`, `/blog`, `ContentLayout`, global CSS, and
  shared trackers unchanged.
- Added focused prototype coverage for the async route shell, blog loader
  service delegation, real blog links, guide biography copy exclusion, and
  empty-data fallback behavior.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx __tests__/unit/loaders/BlogPrototypeLoader.test.tsx`,
  `npm run lint`, and `git diff --check`.
