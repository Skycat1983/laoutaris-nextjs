# T-185 Fix Navigation DTO Test Fixtures

Status: Completed

Workstream:
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the stale navigation DTO fixture errors identified by T-184 without
changing runtime behavior.

## Context

- T-184 found 46 current `npx tsc --noEmit --pretty false --skipLibCheck`
  diagnostics, all under `__tests__/`.
- The largest coherent group is stale public navigation test data:
  - article navigation mocks still include old `linkTo` fields;
  - collection navigation mocks omit current `_id` and `artworks` fields.
- The current public navigation services return typed `ArticleNavDataFrontend`
  and `CollectionNavDataFrontend` objects from
  `getArticleNavigationList()` and `getCollectionNavigationList()`.

## Scope

In scope:

- Update stale article navigation test fixtures so they match the current
  article navigation DTO shape and no longer include `linkTo`.
- Update stale collection navigation test fixtures so they include the current
  required collection navigation DTO fields.
- Prefer small typed fixture builders inside the touched test files where that
  reduces repeated literal drift.
- Preserve all test intent and assertions about route paths, fallback behavior,
  route statuses, logging, and service calls.
- Run the focused navigation test files and the strict TypeScript command to
  confirm this diagnostic group is gone.

Out of scope:

- Do not change runtime source, navigation services, transforms, public route
  behavior, or UI components.
- Do not fix the unrelated `never` fixture, admin route handler, `NODE_ENV`,
  `dbConnect`, Cloudinary widget, or `Set` iteration TypeScript errors.
- Do not change TypeScript/Jest/Next/package configuration or CI gates.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone among TypeScript `noEmit` cleanup tasks because later
cleanup tasks depend on the remaining compiler-error shape. It can run in
parallel with owner-review or design-decision work that does not touch these
test files.

Owned files:

- `__tests__/unit/loaders/ArticleLoader.test.tsx`
- `__tests__/unit/api/publicNavigationRoutes.test.ts`
- `__tests__/unit/loaders/CollectionsSubnavLoader.test.tsx`
- `__tests__/unit/loaders/MainNavLoader.test.tsx`
- `__tests__/unit/pages/CollectionsPage.test.tsx`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The touched navigation tests still pass.
- The strict TypeScript command still may fail because T-184 identified other
  unrelated test-only groups, but it no longer reports stale article `linkTo`
  fixture errors or collection navigation fixture errors for the touched files.
- Runtime code and navigation behavior are unchanged.
- The next remaining `noEmit` cleanup group can be assigned from the updated
  compiler output.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/ArticleLoader.test.tsx __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/loaders/CollectionsSubnavLoader.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx __tests__/unit/pages/CollectionsPage.test.tsx
npx tsc --noEmit --pretty false --skipLibCheck
git diff --check
```

## Agent Prompt

You are working on T-185. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the T-184 audit result at
`docs/audits/results/T-184-typescript-noemit-test-errors.md`. Fix only the stale
navigation DTO test fixtures: remove old article `linkTo` fields, add the
current required collection navigation DTO fields, and use small typed fixture
builders if useful. Do not change runtime source, navigation behavior, config,
packages, CI, or unrelated TypeScript error groups. Run the focused navigation
tests, run `npx tsc --noEmit --pretty false --skipLibCheck` and record which
diagnostics remain, then run `git diff --check`. Update only this task handoff
with candidate tracker updates.

## Handoff Notes

- Planned after T-184 categorized the strict TypeScript failures as test-only
  and recommended fixing stale navigation DTO fixtures first.
- Completed on 2026-05-20. Updated navigation DTO fixtures to typed local
  builders, removed stale article `linkTo` fields, and added required
  collection `_id` and `artworks` fields without changing runtime code.
- The same stale navigation DTO group also appeared in
  `__tests__/unit/loaders/BiographySubnavLoader.test.tsx`,
  `__tests__/unit/pages/BiographyPage.test.tsx`, and
  `__tests__/unit/pages/CollectionSlugPage.test.tsx`; those test-only fixtures
  were updated with the same DTO-shaped builders so the navigation group is
  fully absent from `tsc`.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/loaders/ArticleLoader.test.tsx __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/loaders/CollectionsSubnavLoader.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx __tests__/unit/pages/CollectionsPage.test.tsx __tests__/unit/loaders/BiographySubnavLoader.test.tsx __tests__/unit/pages/BiographyPage.test.tsx __tests__/unit/pages/CollectionSlugPage.test.tsx`
    passed with 8 suites and 40 tests.
  - `npx tsc --noEmit --pretty false --skipLibCheck` still fails with 26
    unrelated test diagnostics: admin read-route handler casts, readonly
    `NODE_ENV` assignments, `dbConnect` mock return typing, over-narrow
    `never` spread/property fixtures, `Set` iteration under the current target,
    and Cloudinary widget mock typing.
  - `git diff --check` passed.
- Candidate tracker updates: next `noEmit` cleanup task can start from the
  remaining `never` fixture group or the admin read-route handler cast group;
  no stale public navigation DTO diagnostics remain in the strict compiler
  output.
