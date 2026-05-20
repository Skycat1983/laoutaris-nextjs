# T-186 Fix Never-Typed Test Fixtures

Status: Completed

Workstream:
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining over-narrow `never` fixture TypeScript errors from focused
loader and form tests without changing runtime behavior.

## Context

- T-184 found the strict TypeScript `noEmit` failure set was test-only.
- T-185 removed the stale public navigation DTO fixture group.
- After T-185, `npx tsc --noEmit --pretty false --skipLibCheck` still reports
  26 unrelated test diagnostics. The largest remaining coherent group is the
  fixture group where objects are cast to `never` and later spread or accessed.

Current representative diagnostics for this group:

- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- `__tests__/unit/loaders/ArtworkLoader.test.tsx`
- `__tests__/unit/loaders/CollectionArtworkLoader.test.tsx`
- `__tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx`
- `__tests__/unit/loaders/SavedArtworkLoaders.test.tsx`

## Scope

In scope:

- Replace over-narrow `as never` fixture typing with small local typed fixture
  builders or safer explicit test types.
- Preserve the current assertions, mocked service behavior, rendered component
  expectations, and no-same-app-fetch checks.
- Keep the change limited to test files that currently produce `TS2698` spread
  errors or `TS2339` `shopifyProducts` access errors from `never` fixtures.
- Run the focused tests for the touched files and rerun strict TypeScript to
  confirm this fixture group is gone.

Out of scope:

- Do not change runtime source, loader behavior, services, transforms, UI
  components, or production types.
- Do not fix the remaining admin read-route handler casts, readonly
  `NODE_ENV`, `dbConnect` mock return typing, Cloudinary widget mock typing, or
  `Set` iteration diagnostic.
- Do not change TypeScript/Jest/Next/package configuration or CI gates.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone among TypeScript `noEmit` cleanup tasks because later
cleanup tasks depend on the remaining compiler-error shape. It can run in
parallel with owner-review or design-decision work that does not touch these
test files.

Owned files:

- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- `__tests__/unit/loaders/ArtworkLoader.test.tsx`
- `__tests__/unit/loaders/CollectionArtworkLoader.test.tsx`
- `__tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx`
- `__tests__/unit/loaders/SavedArtworkLoaders.test.tsx`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Focused tests for the touched loader/form files still pass.
- The strict TypeScript command still may fail because other T-184 groups remain,
  but it no longer reports `TS2698` or `TS2339` diagnostics caused by
  `never`-typed fixtures in the touched files.
- Runtime code and behavior are unchanged.
- The next remaining `noEmit` cleanup group can be assigned from the updated
  compiler output.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx __tests__/unit/loaders/SavedArtworkLoaders.test.tsx
npx tsc --noEmit --pretty false --skipLibCheck
git diff --check
```

## Agent Prompt

You are working on T-186. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-184, and the T-185 handoff. Fix only the over-narrow `never` fixture group in
the listed loader/form tests by introducing local typed fixture builders or
safer explicit test types. Preserve current assertions and mocked behavior. Do
not change runtime source, loader/service/component behavior, TypeScript/Jest/
Next/package configuration, CI gates, or the unrelated remaining `noEmit`
groups. Run the focused tests, run `npx tsc --noEmit --pretty false
--skipLibCheck` and record which diagnostics remain, then run
`git diff --check`. Update only this task handoff with candidate tracker
updates.

## Handoff Notes

- Planned after T-185 removed the stale navigation DTO fixture group and left
  26 unrelated strict TypeScript diagnostics.
- Completed on 2026-05-20. Replaced the scoped loader/form `as never` fixtures
  with local typed fixture aliases based on the current component/service
  contracts, and updated the blog form fixture metadata to the current frontend
  shape without changing runtime source.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx __tests__/unit/loaders/SavedArtworkLoaders.test.tsx`
    passed with 5 suites and 36 tests.
  - `npx tsc --noEmit --pretty false --skipLibCheck` still fails with 13
    unrelated test diagnostics: admin read-route handler casts, readonly
    `NODE_ENV` assignments, `dbConnect` mock return typing, `Set` iteration
    under the current target, and Cloudinary widget mock typing. No diagnostics
    remain in the five T-186 files.
  - `git diff --check` passed.
- Candidate tracker updates: the next `noEmit` cleanup task can target either
  the admin read-route `Handler` casts or the smaller isolated helper typing
  group (`NODE_ENV`, `dbConnect`, import-boundary `Set`, Cloudinary widget);
  the over-narrow `never` fixture group is absent from the strict compiler
  output.
