# T-156 Add Admin Delete Cascade Preview Contract

Status: Planned

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a read-only admin delete cascade preview contract for current destructive
delete resources before changing delete confirmation UI or production delete
gates.

## Context

- F-092 remains open because admin delete workflows can hard-delete or detach
  related records without showing operators the cascade impact first.
- T-149 documents production deletes as blocked until cascade previews,
  backup/review evidence, and redacted audit evidence exist.
- T-141 already blocks current-admin and last-admin deletion at delete time, so
  the preview contract should reflect those blockers without replacing the
  existing delete-route protections.
- Current delete resources are article, artwork, blog, collection, comment, and
  user.

## Scope

In scope:

- Define a typed, public-safe admin delete preview response shape that can
  represent target identity, blocking conditions, records to delete, records to
  detach/update, records preserved, and required production evidence reminders.
- Add read-only preview behavior for article, artwork, blog, collection,
  comment, and user deletes using the current route-local admin guard and ID
  validation patterns.
- Preview current cascade behavior without mutating MongoDB records.
- Keep Cloudinary assets marked as preserved where current delete behavior
  preserves them.
- Include focused tests for guard short-circuiting, invalid IDs, representative
  cascade counts, blocker reporting, and no mutation on preview.

Out of scope:

- Do not change existing `DELETE` route behavior.
- Do not add visible preview UI in `DeleteConfirmation`; that depends on this
  contract and should be a follow-up task.
- Do not implement backup-note input, owner review capture, or redacted audit
  event persistence yet.
- Do not change Cloudinary lifecycle behavior or delete assets.
- Do not edit shared trackers while running in parallel.

## Concurrency

This is the next runnable destructive-delete slice, but it should not run in
parallel with another task touching admin delete route files, delete fetchers,
delete confirmation UI, or delete-route tests.

Owned files:

- new or existing admin delete preview route/service files under
  `src/app/api/v2/admin/` and `src/lib/api/admin/delete/`
- current admin delete route validation helpers if a shared preview helper is
  needed
- focused admin delete preview tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/api/admin/delete/routeValidation.ts`
- `src/lib/api/admin/delete/fetchers.ts`
- `src/app/api/v2/admin/article/delete/[id]/preview/route.ts`
- `src/app/api/v2/admin/artwork/delete/[id]/preview/route.ts`
- `src/app/api/v2/admin/blog/delete/[id]/preview/route.ts`
- `src/app/api/v2/admin/collection/delete/[id]/preview/route.ts`
- `src/app/api/v2/admin/comment/delete/[id]/preview/route.ts`
- `src/app/api/v2/admin/user/delete/[id]/preview/route.ts`
- focused tests under `__tests__/unit/api/`
- `docs/tasks/T-156-add-admin-delete-cascade-preview-contract.md`

Adjust paths if the implementation chooses a shared preview route or service
module that better fits the existing route structure.

## Acceptance Criteria

- Admin preview requests use the shared admin guard and reject invalid IDs
  before model work.
- Preview responses show the current delete effect for each resource type:
  deleted target records, related comments, user references, blog references,
  collection artwork detachments, artwork delete blockers, current-admin and
  last-admin user delete blockers, and preserved Cloudinary assets where
  applicable.
- Preview requests do not mutate records.
- Existing destructive delete route behavior and tests remain unchanged.
- The response shape is stable enough for a later UI task to render without
  scraping strings.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts
git diff --check
```

Add the new focused preview test path to the Jest command, and run
`npm run lint` because this adds route modules and shared types.

## Handoff Notes

- Prepared after T-153 through T-155 reconciliation.
- Candidate shared-tracker update after completion: F-092/R-007 should move
  from unimplemented cascade preview to partially mitigated, with visible UI,
  backup/review evidence capture, and redacted audit-event implementation still
  separate.
