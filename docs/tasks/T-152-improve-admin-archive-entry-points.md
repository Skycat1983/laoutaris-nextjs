# T-152 Improve Admin Archive Entry Points

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reduce manual ObjectId copy/paste in admin archive maintenance by adding a
direct handoff from read-list items into existing update/delete workflows.

## Context

- A-011/F-095 found archive maintenance starts from shallow read lists and then
  requires manual ObjectId copy/paste into `DocumentReader` before update or
  delete operations.
- T-149 documents manual ObjectId lookup as an escape hatch, not the preferred
  operator workflow.
- Existing update/delete operations already fetch the selected document through
  `DocumentReader`; this task should improve entry points without changing
  route contracts or destructive-delete policy.

## Scope

In scope:

- Add a direct read-list action or URL/query handoff for supported resources so
  operators can select an item for update/delete without manually copying the
  ObjectId.
- Keep manual ObjectId entry available as an escape hatch.
- Cover the first practical archive set: articles, artwork, blogs, and
  collections. Include users/comments only if the same small abstraction covers
  delete-only workflows without broad redesign.
- Preserve existing read-list filtering, loading, copy-ID behavior, and
  update/delete form behavior.
- Add focused tests for selecting a read-list item and landing in the expected
  update/delete lookup or loaded-document state.

Out of scope:

- Do not implement destructive cascade previews, backup gates, or audit events.
- Do not change admin delete route semantics.
- Do not add broad server-side pagination/search tables in this first slice.
- Do not edit artwork create/update form internals owned by T-150.
- Do not edit public search files owned by T-151.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-150 and T-151 if it avoids artwork form internals and
public search files. This task owns admin read-list, tab, and operation handoff
surfaces only.

Owned files:

- `src/components/features/adminDashboard/crudForms/read/*`
- `src/components/features/adminDashboard/operationTabs/*`
- `src/components/features/adminDashboard/DocumentReader.tsx`
- `src/components/features/adminDashboard/adminSegmentConfig.tsx`
- `src/components/modules/tabs/AdminCrudTabs.tsx`
- focused admin dashboard entry-point tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/features/adminDashboard/DocumentReader.tsx`
- `src/components/features/adminDashboard/adminSegmentConfig.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx`
- `src/components/features/adminDashboard/operationTabs/ArticleOperations.tsx`
- `src/components/features/adminDashboard/operationTabs/ArtworkOperations.tsx`
- `src/components/features/adminDashboard/operationTabs/BlogOperations.tsx`
- `src/components/features/adminDashboard/operationTabs/CollectionOperations.tsx`
- `src/components/modules/tabs/AdminCrudTabs.tsx`
- `docs/tasks/T-152-improve-admin-archive-entry-points.md`

## Acceptance Criteria

- An operator can choose an article, artwork, blog, or collection from the read
  list and continue to update/delete without manually copying its ObjectId.
- Manual ObjectId lookup remains available and still shows lookup failures.
- Existing read-list copy buttons, filters, and loading/error states are not
  regressed.
- Focused tests cover at least one content type end-to-end plus any shared
  handoff helper.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx
git diff --check
```

Add or substitute a focused admin dashboard entry-point test file if this task
creates one. Run `npm run lint` if shared tab or operation components change.

## Handoff Notes

- Prepared after T-147 through T-149 reconciliation.
- Completed on 2026-05-19.
- Added read-list Update/Delete icon actions for articles, artwork, blogs, and
  collections. The actions switch the existing admin CRUD tabs to the requested
  operation and pass the selected ObjectId into the existing `DocumentReader`
  lookup path.
- Kept the manual ObjectId form as an escape hatch; lookup failures still
  surface through the `DocumentReader` field error.
- Added `__tests__/unit/adminArchiveEntryPoints.test.tsx` for the article
  read-list-to-update handoff and manual lookup failure/success behavior.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/adminArchiveEntryPoints.test.tsx __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Candidate shared-tracker update: mark F-095 partially mitigated for direct
  update/delete entry points, while keeping paginated/searchable archive tables
  and destructive cascade previews as separate follow-ups.
