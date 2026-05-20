# T-178 Add Comment User Delete Entry Points

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Let admin comment and user read-list cards seed the existing delete workflows,
matching the safer handoff pattern already available for articles, artwork,
blogs, and collections.

## Context

- T-152 added direct Update/Delete handoffs from article, artwork, blog, and
  collection read-list cards.
- T-173 found comments and users still expose Copy ID only, so delete requires
  manual ObjectId lookup even though their delete workflows already exist.
- This is a destructive workflow surface, so it should stay separate from
  pagination and search.

## Scope

In scope:

- Add delete handoff actions to `ReadCommentList` and `ReadUserList`.
- Add `initialDocumentId` support to `CommentOperations` and `UserOperations`
  and pass it into their delete `DocumentReader` paths.
- Preserve the existing evidence gate and `DeleteConfirmation` behavior.
- Preserve manual ObjectId lookup as an escape hatch.
- Add focused component coverage proving comment/user read cards can seed the
  delete workflow without bypassing confirmation.

Out of scope:

- Do not change delete route behavior, audit event persistence, evidence
  validation, or preview routes.
- Do not add update workflows for comments or users.
- Do not add pagination, filters, or search.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with
[T-174](T-174-harden-admin-read-list-query-bounds.md) because this task owns
comment/user read-list and operation-tab UI handoff, not admin read routes or
route query validation.

Do not run in parallel with another task touching `ReadCommentList`,
`ReadUserList`, `CommentOperations`, `UserOperations`, or
`AdminCrudTabs`.

Owned files:

- `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx`
- `src/components/features/adminDashboard/operationTabs/CommentOperations.tsx`
- `src/components/features/adminDashboard/operationTabs/UserOperations.tsx`
- focused admin archive entry-point tests, likely
  `__tests__/unit/adminArchiveEntryPoints.test.tsx`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Comment read-list cards can open the existing comment delete workflow with
  the selected ID.
- User read-list cards can open the existing user delete workflow with the
  selected ID.
- Delete confirmation, preview, evidence gate, and audit receipt behavior are
  not bypassed.
- Manual ID lookup remains available.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/adminArchiveEntryPoints.test.tsx
npm run lint
git diff --check
```

## Agent Prompt

You are working on T-178. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-152, T-173, and the content/admin, frontend, and testing workstreams. Add
comment and user read-list delete handoff into the existing delete workflows by
passing selected IDs through the same `initialDocumentId`/`DocumentReader`
pattern used by other admin resources. Preserve delete confirmation, preview,
evidence gate, audit receipts, and manual ObjectId lookup. Do not change delete
routes, pagination, filters, search, or shared trackers. Run the focused admin
archive entry-point test, lint, and `git diff --check`, then update only this
task handoff.

## Handoff Notes

- Planned after T-173.
- Completed on 2026-05-20.
- Added comment and user read-list delete icon actions that call the existing
  `AdminCrudTabs` archive entry-point handoff with the selected ObjectId and
  `delete` operation.
- Added `initialDocumentId` support to `CommentOperations` and
  `UserOperations`, passing the selected ID through to their existing
  `DocumentReader` delete lookup paths.
- Preserved manual ObjectId lookup, delete preview loading, evidence gate,
  confirmation, and audit-receipt route behavior; no delete routes,
  pagination, filters, search, or preview routes were changed.
- Extended `__tests__/unit/adminArchiveEntryPoints.test.tsx` to prove comment
  and user read-list cards open the delete confirmation and do not call delete
  without required evidence.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/adminArchiveEntryPoints.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Candidate shared-tracker update: mark the comment/user delete entry-point
  follow-up complete while keeping admin read-list pagination/search as the
  remaining F-095 work.
