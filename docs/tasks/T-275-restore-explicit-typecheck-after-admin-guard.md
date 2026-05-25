# T-275 Restore Explicit Typecheck After Admin Guard

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Restore the explicit TypeScript `noEmit` check after the T-273 admin frontend
guard test introduced a mock-cast diagnostic.

## Context

- T-268 made `npx tsc --noEmit --pretty false --skipLibCheck` pass.
- T-273 added persisted-role admin frontend guard coverage.
- A fresh run of `npm exec tsc -- --noEmit --pretty false --skipLibCheck`
  now fails only at
  `__tests__/unit/auth/adminFrontendGuard.test.tsx(51,22)` with `TS2352`
  because the `redirect` mock is cast directly to a Jest mock type.

## Scope

In scope:

- Fix the test typing in `adminFrontendGuard.test.tsx` without weakening the
  admin frontend guard behavior.
- Keep the persisted-role redirect assertions intact.
- Run the focused auth test and the explicit `noEmit` command.

Out of scope:

- Adding a CI typecheck gate.
- Changing production auth behavior unless the test exposes a real defect.
- Broader Jest repair work from A-034.

## Concurrency

Can run in parallel with docs-only tasks and unrelated frontend/build tasks.
This task owns `__tests__/unit/auth/adminFrontendGuard.test.tsx`; coordinate
with any agent editing the same test file.

## Files Likely Touched

- `__tests__/unit/auth/adminFrontendGuard.test.tsx`
- `docs/tasks/T-275-restore-explicit-typecheck-after-admin-guard.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after the focused test and explicit
  `noEmit` command pass.
- Add dated handoff notes with exact verification output.
- Update `docs/tasks/README.md`.
- Leave shared findings, risks, workstreams, and orchestration state for the
  orchestrator unless a real production auth behavior change is required.

## Acceptance Criteria

- `npm exec tsc -- --noEmit --pretty false --skipLibCheck` passes.
- `__tests__/unit/auth/adminFrontendGuard.test.tsx` still proves unauthenticated,
  non-admin, stale-token, and DB-failure frontend admin access behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/auth/adminFrontendGuard.test.tsx
npm exec tsc -- --noEmit --pretty false --skipLibCheck
git diff --check
```

## Handoff Notes

- Planned after returned T-273/T-271 handoffs and a fresh local `noEmit` check.
- 2026-05-25: Completed by replacing the direct `redirect as jest.Mock` cast in
  `__tests__/unit/auth/adminFrontendGuard.test.tsx` with `jest.mocked(redirect)`.
  This keeps the persisted-role redirect assertions intact while satisfying the
  explicit TypeScript check.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/auth/adminFrontendGuard.test.tsx
```

Passed: 1 suite, 5 tests. Jest emitted the existing Node `punycode`
deprecation warning.

```text
PASS __tests__/unit/auth/adminFrontendGuard.test.tsx
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
```

```bash
npm exec tsc -- --noEmit --pretty false --skipLibCheck
```

Passed with no stdout/stderr diagnostics.

```bash
git diff --check
```

Passed with no whitespace-error output.
