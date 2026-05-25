# T-268 Fix Explicit Typecheck Test Errors

Status: Completed

Workstream: [Testing and quality](../workstreams/testing-and-quality.md).

## Goal

Fix the four test-file TypeScript errors reported by A-027 so
`npx tsc --noEmit --pretty false --skipLibCheck` can pass again before any
decision to add a formal `typecheck` gate.

## Context

A-027 found explicit TypeScript checking fails in:

- `__tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
- `__tests__/unit/loaders/ArtworkListLoader.test.tsx`
- `__tests__/unit/modalProviderLazyHost.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`

## Scope

In scope:

- Fix test type errors only.
- Preserve existing test intent.
- Update focused tests only where types now require current props/contracts.

Out of scope:

- Adding a package script or CI gate for typecheck.
- Broad test refactors.
- Runtime behavior changes unless a type error exposes a real broken contract,
  in which case stop and document the blocker.

## Concurrency

Do not run this task in parallel with another task editing the four listed test
files. It can run in parallel with public/admin/auth implementation tasks that
do not touch those files.

## Files Likely Touched

- `__tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
- `__tests__/unit/loaders/ArtworkListLoader.test.tsx`
- `__tests__/unit/modalProviderLazyHost.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `docs/tasks/T-268-fix-explicit-typecheck-test-errors.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`

## Completion Contract

- Mark completed only when explicit TypeScript passes or an environment/blocker
  is recorded.
- Update this task and the task index.

## Acceptance Criteria

- `npx tsc --noEmit --pretty false --skipLibCheck` passes under Node `22.14.0`,
  or any remaining failure is outside the four scoped files and documented.
- Existing test behavior remains intact.

## Verification

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0
npx tsc --noEmit --pretty false --skipLibCheck
npm test -- --runTestsByPath __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx __tests__/unit/loaders/ArtworkListLoader.test.tsx __tests__/unit/modalProviderLazyHost.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts
git diff --check
```

## Handoff Notes

- Completed 2026-05-25. Cleared the four A-027 test-file diagnostics by typing
  the Shopify product fixture as `SimpleProduct`, narrowing optional artwork
  sort color access in loader table tests, making the modal context
  introspection cast explicit, and replacing Set spread with `Array.from()` in
  the route cache policy test.
- The first verification run after the test fixes exposed one additional
  non-test diagnostic in `getPublicSearchResults.ts`; fixed it as a type-only
  default-search narrowing cleanup so the assigned explicit TypeScript command
  passes.
- Verification passed under Node `22.14.0`: `npx tsc --noEmit --pretty false
  --skipLibCheck`; `npm test -- --runTestsByPath
  __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
  __tests__/unit/loaders/ArtworkListLoader.test.tsx
  __tests__/unit/modalProviderLazyHost.test.tsx
  __tests__/unit/publicRouteCachePolicy.test.ts` with 4 suites and 36 tests;
  `npm test -- --runTestsByPath
  __tests__/unit/data/getPublicSearchResults.test.ts` with 1 suite and 7 tests;
  `git diff --check`.
