# T-141 Protect Admin User Deletion

Status: Completed

Workstream:
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md),
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add runtime protections so admin user deletion cannot delete the current admin
account or the last remaining admin account.

## Context

- A-011/F-091 found the admin user delete route is admin-guarded but does not
  block self-delete or last-admin deletion.
- T-138 documents admin bootstrap, promotion, and lockout recovery, but it did
  not change runtime delete behavior.
- R-002 remains open specifically for current-admin and last-admin deletion
  protections.
- T-040 already migrated admin delete routes to `requireApiAdmin()` and added
  destructive ID validation, so this task should keep those guard/order
  invariants intact.

## Scope

In scope:

- Update the admin user delete route to reject deletion when the target user is
  the authenticated admin.
- Reject deletion when the target is the last remaining admin account.
- Return stable JSON error envelopes and appropriate non-2xx statuses without
  exposing sensitive account details.
- Add focused route tests for:
  - unauthenticated and non-admin guard behavior remains unchanged;
  - invalid target ID still short-circuits before DB work;
  - current-admin self-delete is blocked;
  - last-admin deletion is blocked;
  - non-current admin deletion succeeds when another admin remains;
  - non-admin user deletion still preserves existing cascade behavior.

Out of scope:

- Do not change admin bootstrap/recovery docs except for tiny links if needed.
- Do not implement broader delete cascade previews, audit trails, or backup
  gates.
- Do not change account self-service deletion, privacy workflows, or user
  registration/OAuth behavior.
- Do not change other admin delete routes.

## Concurrency

Can run in parallel with T-142 or T-143 because it owns only the admin user
delete route and focused tests.

Owned files:

- `src/app/api/v2/admin/user/delete/[id]/route.ts`
- focused admin user delete route tests, likely under
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/app/api/v2/admin/user/delete/[id]/route.ts`
- `__tests__/unit/api/adminDeleteRouteGuard.test.ts`
- `docs/tasks/T-141-protect-admin-user-deletion.md`

## Acceptance Criteria

- A current admin cannot delete their own user record through the admin user
  delete API.
- The route blocks deletion of the last remaining admin account.
- Existing successful non-critical user deletion behavior and cascade cleanup
  remain covered.
- Focused tests prove guard ordering and failure statuses.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts
git diff --check
```

Run broader `npm test`, `npm run lint`, or `npm run build` only if the route
change touches shared helpers or reveals integration risk.

## Handoff Notes

- Prepared by T-140 after reconciling A-011.
- Keep cascade previews, admin content runbooks, and account privacy workflows
  separate.
- 2026-05-19: Added admin user delete runtime protections: current admin
  self-delete returns `403` before transaction work, and deleting the last
  remaining admin returns `409` after target lookup/admin count verification
  inside the existing transaction path.
- 2026-05-19: Extended
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts` to cover preserved guard
  ordering, invalid-ID short-circuiting, self-delete blocking, last-admin
  blocking, non-current admin deletion when another admin remains, and preserved
  non-admin user cascade cleanup.
- 2026-05-19 verification: `npm test -- --runTestsByPath
  __tests__/unit/api/adminDeleteRouteGuard.test.ts` passed.
- Candidate shared tracker update for the next orchestrator/reconciliation pass:
  mark the admin user deletion runtime-protection backlog item complete in the
  Auth/Admin and Content/Admin workstreams and close the matching R-002
  mitigation note once reviewed.
