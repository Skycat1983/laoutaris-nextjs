# T-264 Clean Up Admin Reciprocal Delete References

Status: Completed

Workstreams:

- [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md)
- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)
- [Data models and API](../workstreams/data-models-and-api.md)

## Goal

Fix the reciprocal-reference integrity gaps found by A-030 for artwork and
collection admin deletion.

## Context

- A-030 confirmed artwork admin deletion deletes the artwork and pulls it from
  collections, but leaves stale deleted-artwork IDs in user `favourites` and
  `watchlist` arrays.
- A-030 also found collection admin deletion deletes the collection but leaves
  stale deleted-collection IDs in artwork `collections` arrays.
- User delete already cleans reciprocal saved-artwork references, so the coherent
  default is cleanup, not preserved-history tombstones.

## Scope

In scope:

- Update artwork delete preview to report affected user `favourites`/`watchlist`
  cleanup as an update instead of preserved user records.
- Update artwork destructive delete to pull the deleted artwork ID from all user
  `favourites` and `watchlist` arrays in the same guarded/audited transaction.
- Update collection delete preview to report affected artwork `collections`
  cleanup as an update instead of preserved stale references.
- Update collection destructive delete to pull the deleted collection ID from
  affected artwork `collections` arrays.
- Update focused delete preview/route/audit summary tests and the admin content
  operations runbook current-effects table.

Out of scope:

- Cloudinary asset deletion.
- Changing delete evidence/audit-event requirements.
- Adding tombstone UI or preserved-history behavior unless the owner explicitly
  rejects reciprocal cleanup.
- Broad admin dashboard redesign.

## Concurrency

This task can run in parallel with T-263, T-265, and T-266. Do not run it in
parallel with another task editing admin delete preview/destructive routes,
delete route tests, or the admin content operations runbook delete-effect table.

## Files Likely Touched

- `src/lib/api/admin/delete/preview.ts`
- `src/app/api/v2/admin/artwork/delete/[id]/route.ts`
- `src/app/api/v2/admin/collection/delete/[id]/route.ts`
- Admin delete tests under `__tests__/unit/api/`
- `docs/runbooks/admin-content-operations.md`
- `docs/tasks/T-264-clean-up-admin-reciprocal-delete-references.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation, docs, and
  focused tests are complete.
- Update this task brief and `docs/tasks/README.md`.
- List candidate findings/risk/workstream updates in handoff notes unless
  explicitly assigned to reconcile shared trackers.

## Acceptance Criteria

- Deleting artwork removes that artwork ID from user `favourites` and
  `watchlist` arrays.
- Deleting a collection removes that collection ID from artwork `collections`
  arrays.
- Preview contracts accurately describe the destructive effects.
- Existing guards, evidence validation, audit-event creation, article blockers,
  and transaction semantics remain intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeletePreviewRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts --runInBand
git diff --check
```

## Handoff Notes

- Completed 2026-05-25.
- Artwork delete preview now reports affected users as `update` impacts, and
  destructive artwork deletion pulls the deleted artwork ID from user
  `favourites` and `watchlist` arrays in the existing transaction.
- Collection delete preview now queries artwork with the deleted collection ID
  in `collections` and reports those records as `update` impacts. Destructive
  collection deletion now wraps the collection delete and artwork cleanup in a
  transaction.
- The admin content operations runbook current-effects table reflects the new
  reciprocal cleanup behavior. Cloudinary asset preservation, evidence
  validation, audit-event creation, and artwork article blockers remain
  unchanged.
- Candidate shared tracker update: content/admin, auth/admin, and data/API
  workstreams can record T-264 as the A-030 reciprocal delete integrity cleanup.
  R-002, R-006, and R-007 can note that the A-030 artwork/user and
  collection/artwork reciprocal-reference gaps are mitigated by T-264.
- Verification: `npm test -- --runTestsByPath __tests__/unit/api/adminDeletePreviewRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts --runInBand`
  passed: 2 suites, 64 tests. Node emitted the existing `punycode`
  deprecation warning. `git diff --check` passed.
