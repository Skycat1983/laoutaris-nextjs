# T-291 Prune Unused Legacy Session Helpers

Status: Completed

Workstreams:

- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Delete the repo-local unused legacy session/admin helper files identified by
T-290 while preserving the active session user ID helper and admin frontend
guard.

## Context

T-290 classified every current `src/lib/session/*` helper. The active helpers
are `getUserIdFromSession.ts` and `requireAdminFrontendAccess.ts`. The pruning
candidates are:

- `src/lib/session/createUserFromSession.ts`
- `src/lib/session/getUserFromSession.ts`
- `src/lib/session/isAdmin.ts`

Their remaining references are file-local exports or tests that preserve stale
behavior; no active route imports them.

## Scope

In scope:

- Delete the three unused helper files.
- Remove stale `createUserFromSession` imports/mocks/assertions from
  `credentialsRoleSession`.
- Remove or replace the test-header-only `getUserFromSession` coverage and the
  observability source-hygiene path for the deleted file.
- Keep `getUserIdFromSession.ts` behavior and active callers unchanged.
- Keep `requireAdminFrontendAccess.ts` behavior and admin dashboard protection
  unchanged.
- Update this task, the task index, and relevant workstream/finding notes after
  implementation.

Out of scope:

- Changing NextAuth callbacks, middleware, protected API guard contracts, saved
  item actions, account loaders, public artwork/article route behavior, or
  admin dashboard access behavior.
- Removing development test-header behavior from any active route; T-290 found
  no active route imports for that legacy helper.

## Concurrency

Do not run in parallel with another auth/session source-pruning task. This task
owns the three candidate helper files and their direct test references.

## Files Likely Touched

- `src/lib/session/createUserFromSession.ts`
- `src/lib/session/getUserFromSession.ts`
- `src/lib/session/isAdmin.ts`
- `__tests__/unit/auth/credentialsRoleSession.test.ts`
- `__tests__/unit/auth/sessionTestHeaders.test.ts`
- `__tests__/unit/observability/serverActionSessionLoggingSourceHygiene.test.ts`
- `docs/tasks/T-291-prune-unused-legacy-session-helpers.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/audits/findings-register.md`

## Completion Contract

- Mark this task `Status: Completed` only after the files are deleted, stale
  test references are removed, active-helper references still pass, and focused
  verification is recorded.
- Do not modify `src/lib/session/getUserIdFromSession.ts` or
  `src/lib/session/requireAdminFrontendAccess.ts` unless a verification failure
  proves a required import cleanup.
- Record exact `rg` and test results in handoff notes.

## Acceptance Criteria

- `src/lib/session/createUserFromSession.ts`,
  `src/lib/session/getUserFromSession.ts`, and `src/lib/session/isAdmin.ts` no
  longer exist.
- No `src` or `__tests__` references remain for `createUserFromSession`,
  `getUserFromSession`, `isUserAdmin`, or the deleted `isAdmin` helper.
- Active `getUserIdFromSession` and `requireAdminFrontendAccess` references are
  still present and covered.
- Protected API guard inventory still prevents direct session/admin helper use
  at protected API route boundaries.

## Verification

```bash
rg -n "createUserFromSession|getUserFromSession|isUserAdmin|from [\"']@/lib/session/isAdmin|isAdmin\\(" src __tests__
rg -n "getUserIdFromSession|requireAdminFrontendAccess" src __tests__
npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/auth/adminFrontendGuard.test.tsx __tests__/unit/observability/serverActionSessionLoggingSourceHygiene.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts
npm run lint
git diff --check
```

## Handoff Notes

- Planned by T-290 on 2026-05-25 from F-142 inventory evidence.
- Completed on 2026-05-26 by deleting
  `src/lib/session/createUserFromSession.ts`,
  `src/lib/session/getUserFromSession.ts`, and
  `src/lib/session/isAdmin.ts`.
- Removed the stale `createUserFromSession` mock/assertions from
  `credentialsRoleSession`, deleted the test-header-only
  `sessionTestHeaders` coverage, and removed the deleted session helper from
  the T-128 source-hygiene inventory.
- Verification:
  - `rg -n "createUserFromSession|getUserFromSession|isUserAdmin|from [\"']@/lib/session/isAdmin|isAdmin\\(" src __tests__`:
    no matches.
  - `rg -n "getUserIdFromSession|requireAdminFrontendAccess" src __tests__`:
    confirmed active helper source, active callers, and focused tests remain.
  - `npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/auth/adminFrontendGuard.test.tsx __tests__/unit/observability/serverActionSessionLoggingSourceHygiene.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts`:
    passed, 4 suites and 21 tests.
  - `npm run lint`: passed with no ESLint warnings or errors.
  - `git diff --check`: passed.
