# T-198 Clear Remaining Test NoEmit Diagnostics

Status: Completed

Workstream:
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Clear the remaining strict TypeScript `noEmit` diagnostics that are currently
limited to test files, without changing runtime behavior or enabling a new CI
gate.

## Context

- T-184 audited strict TypeScript `noEmit` failures and found the failure set was
  test-only.
- T-185 fixed stale public navigation DTO fixtures.
- T-186 fixed the largest over-narrow `never` fixture group in loader/form tests.
- A fresh `npx tsc --noEmit --pretty false --skipLibCheck` run on 2026-05-22
  still reports 14 test-only diagnostics across six test files:
  - `__tests__/unit/api/adminReadRouteGuard.test.ts`
  - `__tests__/unit/auth/sessionTestHeaders.test.ts`
  - `__tests__/unit/db/dbHelpers.test.ts`
  - `__tests__/unit/security/clientServerImportBoundary.test.ts`
  - `__tests__/unit/shopProductDetailPage.test.tsx`
  - `__tests__/unit/uploadButton.test.tsx`

Current diagnostic groups:

- Admin read-route `Handler` casts for detail routes with required params.
- Readonly `NODE_ENV` assignments in session-header tests.
- `dbConnect` mock return typing in DB helper tests.
- `Set<string>` iteration under the current TypeScript target.
- One shop product detail fixture spread diagnostic.
- Cloudinary upload widget callback mock typing.

## Scope

In scope:

- Fix the listed test-only TypeScript diagnostics with test-local types,
  fixtures, helpers, or safer mocks.
- Preserve existing assertions, route behavior under test, mocked service
  behavior, and public/component expectations.
- Prefer explicit test call signatures or typed helpers over broad casts.
- Run focused tests for every touched test file.
- Rerun strict TypeScript to confirm the current test-only failure set is clear.

Out of scope:

- Do not change runtime source, route handlers, loaders, services, transforms,
  UI components, or production types unless a test import requires a purely
  type-only export and the scope is approved in the handoff.
- Do not change TypeScript, Jest, Next, package, or CI configuration.
- Do not add `noEmit` to the release gate in this task.
- Do not mask diagnostics by adding `skip` blocks, `@ts-ignore`, or blind
  `unknown` casts when a local test type can model the behavior.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone among TypeScript `noEmit` cleanup tasks. It can run in
parallel with owner-review or docs-only work that does not touch the listed test
files or this task brief.

Owned files:

- `__tests__/unit/api/adminReadRouteGuard.test.ts`
- `__tests__/unit/auth/sessionTestHeaders.test.ts`
- `__tests__/unit/db/dbHelpers.test.ts`
- `__tests__/unit/security/clientServerImportBoundary.test.ts`
- `__tests__/unit/shopProductDetailPage.test.tsx`
- `__tests__/unit/uploadButton.test.tsx`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Focused tests for all touched files pass.
- `npx tsc --noEmit --pretty false --skipLibCheck` passes, or any remaining
  diagnostics are clearly unrelated concurrent changes outside the listed files.
- Runtime source and behavior are unchanged.
- The task handoff records whether strict TypeScript can now be considered for a
  later documented quality gate decision.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/auth/sessionTestHeaders.test.ts __tests__/unit/db/dbHelpers.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/uploadButton.test.tsx
npx tsc --noEmit --pretty false --skipLibCheck
git diff --check
```

## Agent Prompt

You are working on T-198. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-184, T-185, and the T-186 handoff. Fix only the remaining test-only strict
TypeScript diagnostics in the listed files. Preserve existing test intent and
runtime behavior. Do not change runtime source, TypeScript/Jest/Next/package
configuration, CI gates, or shared trackers. Run the focused tests, run
`npx tsc --noEmit --pretty false --skipLibCheck`, run `git diff --check`, and
record the outcome plus any candidate tracker updates in this handoff.

## Handoff Notes

- Prepared after T-186 cleared the loader/form `never` fixture group.
- Baseline command on 2026-05-22:
  `npx tsc --noEmit --pretty false --skipLibCheck` failed with 14 test-only
  diagnostics across the six files listed in this task.
- Completed on 2026-05-22. Cleared the remaining test-only strict TypeScript
  diagnostics with test-local route handler adapters, environment mutation
  helpers, safer mock return values, target-compatible `Set` conversion,
  object-shaped product-page artwork fixtures, and a complete Cloudinary upload
  widget callback mock. Runtime source, configuration, packages, and CI gates
  were unchanged.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/auth/sessionTestHeaders.test.ts __tests__/unit/db/dbHelpers.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/uploadButton.test.tsx`
    passed with 6 suites and 90 tests.
  - `npx tsc --noEmit --pretty false --skipLibCheck` passed with no
    diagnostics.
  - `git diff --check` passed.
- Candidate tracker updates: the testing-quality workstream can record that the
  current strict TypeScript `noEmit` test-only backlog is clear. A later
  documented quality-gate decision can consider adding strict `noEmit` to CI or
  release verification; this task intentionally did not add that gate.
