# T-290 Scope Legacy Session Helper Pruning

Status: Completed

Workstreams:

- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Close or route F-142 by inventorying legacy session/admin helper usage and
preparing a safe pruning plan before deleting anything.

## Context

A-032 found stale helper files under `src/lib/session/`, while active protected
API boundaries are guarded by shared API helpers and the admin frontend shell
now uses `requireAdminFrontendAccess()`. The current helper set includes:

- `src/lib/session/createUserFromSession.ts`
- `src/lib/session/getUserFromSession.ts`
- `src/lib/session/getUserIdFromSession.ts`
- `src/lib/session/isAdmin.ts`
- `src/lib/session/requireAdminFrontendAccess.ts`

Some of these are active compatibility paths, while others may be legacy. This
task is an inventory/scoping task so deletion does not accidentally break
account loaders, test-header behavior, or admin/frontend guard behavior.

## Scope

In scope:

- Use `rg` and targeted imports to map every current reference to the session
  helper files.
- Classify each helper as active, legacy-but-kept, or candidate for pruning.
- Prepare one or more follow-up task briefs if deletion is safe.
- Update this task, the task index, and architecture/auth workstream notes.
- Update F-142 if the finding is resolved by inventory or routed to a concrete
  pruning task.

Out of scope:

- Deleting source files.
- Changing auth/session behavior.
- Changing protected API guard contracts, middleware, account navigation, or
  admin dashboard access.

## Concurrency

Docs/source-search only. Can run in parallel with T-289 if it does not edit the
same auth workstream sections. Do not run in parallel with an implementation
task deleting session helpers.

## Files Likely Touched

- `docs/tasks/T-290-scope-legacy-session-helper-pruning.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/audits/findings-register.md`
- Follow-up task brief(s), only if safe pruning candidates are found

## Completion Contract

- Mark this task `Status: Completed` only after every `src/lib/session/*`
  helper is classified.
- Record exact reference-search commands and results in handoff notes.
- Create follow-up implementation tasks only for safe, bounded deletions.
- Do not delete code in this task.

## Inventory Result

| Helper | Classification | Evidence | Follow-up |
| --- | --- | --- | --- |
| `src/lib/session/createUserFromSession.ts` | Candidate for pruning | No active `src` imports. Only `__tests__/unit/auth/credentialsRoleSession.test.ts` imports/mocks it to assert `getUserIdFromSession()` no longer calls it. | Delete with stale test mock cleanup in [T-291](T-291-prune-unused-legacy-session-helpers.md). |
| `src/lib/session/getUserFromSession.ts` | Candidate for pruning | No active `src` imports. Only `__tests__/unit/auth/sessionTestHeaders.test.ts` imports its development test-header helpers and `__tests__/unit/observability/serverActionSessionLoggingSourceHygiene.test.ts` names the file for source hygiene. | Delete with test-header-only test cleanup in [T-291](T-291-prune-unused-legacy-session-helpers.md). |
| `src/lib/session/getUserIdFromSession.ts` | Active | Imported by public artwork/article routes, account loaders, saved-artwork/comment/account loaders, saved-item server actions, and focused tests. | Keep. Future auth/session redesign must be separately scoped. |
| `src/lib/session/isAdmin.ts` | Candidate for pruning | No active `src` or `__tests__` imports; exact search found only the file's own export. Broad `isAdmin` hits are unrelated route utilities or admin-delete evidence helpers. | Delete in [T-291](T-291-prune-unused-legacy-session-helpers.md). |
| `src/lib/session/requireAdminFrontendAccess.ts` | Active | Imported by `src/app/admin/dashboard/layout.tsx` and covered by `__tests__/unit/auth/adminFrontendGuard.test.tsx`. | Keep. Preserve T-273 persisted-role admin shell guard. |

No current helper was classified as `legacy-but-kept`: the inventory found
active helpers that should stay, and unused legacy helpers that can move to a
bounded pruning task.

## Acceptance Criteria

- The orchestrator can see which session helpers are active and which are prune
  candidates.
- F-142 is either resolved as documented/no-action or routed to a concrete
  deletion task.

## Verification

```bash
rg -n "createUserFromSession|getUserFromSession|getUserIdFromSession|isAdmin|requireAdminFrontendAccess" src __tests__
git diff --check
```

## Handoff Notes

- 2026-05-25: Completed inventory without source deletion or behavior changes.
  `getUserIdFromSession.ts` and `requireAdminFrontendAccess.ts` are active and
  should stay. `createUserFromSession.ts`, `getUserFromSession.ts`, and
  `isAdmin.ts` are safe pruning candidates from repo-local reference evidence.
- Created [T-291](T-291-prune-unused-legacy-session-helpers.md) to delete the
  three unused helper files and clean their test-only references.
- Exact reference-search commands and results:
  - `rg -n "createUserFromSession|getUserFromSession|getUserIdFromSession|isAdmin|requireAdminFrontendAccess" src __tests__`: returned active `getUserIdFromSession` route/loader/action imports, active `requireAdminFrontendAccess` admin layout/test imports, exports/test-only references for `getUserFromSession`, a test-only `createUserFromSession` mock, and unrelated broad `isAdminRoute`/admin-delete helper name hits.
  - `rg --files src/lib/session __tests__ | sort`: confirmed the only current `src/lib/session` helper files are the five files classified above.
  - `rg -n "@/lib/session/createUserFromSession|\\.\\./session/createUserFromSession|createUserFromSession" src __tests__`: found only the helper export and stale `credentialsRoleSession` import/mock/assertions.
  - `rg -n "@/lib/session/getUserFromSession|\\.\\./session/getUserFromSession|getUserFromSession|isUserAdmin" src __tests__`: found only the helper file, `sessionTestHeaders` coverage, and the source-hygiene path.
  - `rg -n "@/lib/session/getUserIdFromSession|\\.\\./session/getUserIdFromSession|getUserIdFromSession" src __tests__`: found active public route, account loader, saved-item action, and test references; keep.
  - `rg -n "@/lib/session/isAdmin|\\.\\./session/isAdmin|isAdmin\\(" src __tests__`: found only `src/lib/session/isAdmin.ts`.
  - `rg -n "@/lib/session/requireAdminFrontendAccess|\\.\\./session/requireAdminFrontendAccess|requireAdminFrontendAccess|getAdminFrontendAccess" src __tests__`: found the admin dashboard layout and focused guard tests; keep.
- Verification:
  - `rg -n "createUserFromSession|getUserFromSession|getUserIdFromSession|isAdmin|requireAdminFrontendAccess" src __tests__`: passed and returned the classified references above.
  - `git diff --check`: passed.
