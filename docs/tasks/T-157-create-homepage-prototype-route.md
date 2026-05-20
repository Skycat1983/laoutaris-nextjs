# T-157 Create Homepage Prototype Route

Status: Planned

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Create a safe full-width homepage prototype route where redesigned landing-page
sections can be built without changing the live `/` homepage.

## Context

- The current homepage renders through `src/app/page.tsx` and wraps teaser
  sections in `ContentLayout`, which intentionally adds empty columns left and
  right.
- The design-guide images in `to_prototype/` are full-width section references
  for the landing page, not replacements for the destination pages.
- The prototype route is a workshop surface. It must not replace or disturb the
  live homepage until the owner explicitly accepts a section migration.

## Scope

In scope:

- Add a prototype route such as `/prototype/home`.
- Add a prototype home shell that does not use `ContentLayout`.
- Add a prototype component folder for later section work, for example
  `src/components/prototypes/home/`.
- Keep the route isolated from normal navigation.
- Add `noindex` metadata for the prototype route.
- Add placeholder/full-width section slots for hero, biography, blog, shop, and
  any not-yet-designed navbar categories.
- Use concise placeholder content only where a later section task will provide
  the real implementation.

Out of scope:

- Do not change `src/app/page.tsx`, the live `Home` component, `ContentLayout`,
  the global header, or the global footer behavior.
- Do not redesign biography, blog, or shop sections in this task.
- Do not introduce a central style system or edit global CSS beyond route-local
  necessities.
- Do not add the prototype route to public navigation.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this before T-158, T-159, and T-160 unless those agents are explicitly told
to create only section components without wiring them into a route.

Can run in parallel with T-161 because T-161 is read-only.

Owned files:

- `src/app/prototype/home/page.tsx`
- optional `src/app/prototype/home/layout.tsx` or route-local metadata file
- `src/components/prototypes/home/*`
- focused route/smoke tests if added
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/app/prototype/home/page.tsx`
- `src/components/prototypes/home/HomePrototype.tsx`
- `src/components/prototypes/home/PrototypeSectionPlaceholder.tsx`
- focused tests under `__tests__/unit/` if route behavior is covered
- `docs/tasks/T-157-create-homepage-prototype-route.md`

## Acceptance Criteria

- `/prototype/home` renders a full-width prototype shell without using the live
  homepage `ContentLayout`.
- The live `/` homepage, navbar, footer, and existing section components are
  unchanged.
- The prototype route is marked `noindex`.
- Later agents can add independent biography, blog, and shop prototype sections
  without touching live homepage files.

## Verification

```bash
npm run lint
git diff --check
```

Add focused tests if route metadata or component behavior is covered.

## Agent Prompt

You are working on T-157. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the frontend/testing workstream docs linked above. Create a safe
`/prototype/home` route for full-width homepage redesign work. Do not change the
live `/` homepage, `ContentLayout`, global header/footer behavior, global CSS,
or public navigation. Add a prototype home component folder and placeholders so
T-158, T-159, and T-160 can add independent sections later. Mark the route
`noindex`. Run the listed verification and update only this task brief handoff;
leave shared tracker updates for the orchestrator.

## Handoff Notes

- Prepared after the owner added `to_prototype/biography.png`,
  `to_prototype/blog.png`, and `to_prototype/shop.png`.
- Completed 2026-05-20 by adding the isolated `/prototype/home` App Router
  page with route-local `noindex` metadata and a route-owned main landmark.
- Added `src/components/prototypes/home/HomePrototype.tsx` and
  `src/components/prototypes/home/PrototypeSectionPlaceholder.tsx` with
  full-width placeholder slots for hero, artwork, collections, biography, blog,
  project, and shop. The live `/` homepage, `ContentLayout`, global
  header/footer behavior, global CSS, and public navigation were not changed.
- Added focused route coverage in
  `__tests__/unit/pages/PrototypeHomePage.test.tsx` for noindex metadata,
  the isolated page shell, placeholder slots, and source guards against the
  live homepage layout path.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  (with the existing Node `punycode` deprecation warning), `npm run lint`, and
  `git diff --check`.
- Candidate tracker updates for the orchestrator: mark T-157 complete in the
  frontend/testing workstreams and unblock T-158, T-159, and T-160 section work
  inside `src/components/prototypes/home/`.
