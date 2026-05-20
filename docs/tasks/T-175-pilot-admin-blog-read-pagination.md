# T-175 Pilot Admin Blog Read Pagination

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make the main admin blog read tab consume route pagination metadata and render
page controls while preserving the existing Update, Delete, and Copy handoff.

## Context

- Depends on [T-174](T-174-harden-admin-read-list-query-bounds.md).
- T-173 found that the main blog read tab fetches only page 1 with `limit: 10`.
- The existing blog read route already returns metadata, and feed tabs already
  demonstrate simple previous/next paging.
- A blog pilot is lower risk than artwork because the cards are simple and the
  current tab already has T-152 Update/Delete/Copy actions.

## Scope

In scope:

- Update `ReadBlogList` to track current page and consume `response.metadata`.
- Render simple previous/next pagination using an existing pagination component
  if it fits, or a small local admin-specific control if that is safer.
- Preserve the existing card layout, image handling, copy ID action, and
  `selectEntryForOperation()` update/delete handoff.
- Keep current blog filter behavior only as far as it remains honest for the
  visible page; do not claim full-dataset filtering until T-176.
- Add focused component coverage for page navigation and retained
  Update/Delete/Copy behavior.

Out of scope:

- Do not add search.
- Do not move blog filters to route-backed query params.
- Do not change article, artwork, collection, comment, or user read tabs.
- Do not extract a shared read-list shell yet.
- Do not edit shared trackers while running in parallel.

## Concurrency

Do not run this task until T-174 is complete and reconciled. After T-174, this
task should run alone against the main blog read tab because later filter/search
work depends on the exact state model it introduces.

Owned files:

- `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx`
- focused blog/admin archive read-list component tests, likely extending
  `__tests__/unit/adminArchiveEntryPoints.test.tsx` or adding a nearby focused
  test
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The main admin blog read tab can move between pages using route metadata.
- Loading, empty, and error states remain operator-visible.
- Update/Delete/Copy actions still work from paginated blog cards.
- No search or route-backed filter behavior is introduced.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/adminArchiveEntryPoints.test.tsx
npm run lint
git diff --check
```

Adjust the focused test path if the implementation adds a narrower blog
read-list test file.

## Agent Prompt

You are working on T-175. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, T-174's handoff, and the frontend/content/testing
workstreams. Implement metadata-driven pagination in the main admin blog read
tab only. Preserve existing card visuals, copy ID, and T-152 Update/Delete
handoff. Do not add search, route-backed filters, shared read-list extraction,
other resource changes, or shared tracker edits. Run the focused component test,
lint, and `git diff --check`, then update only this task handoff.

## Handoff Notes

- Planned after T-173.
- Completed on 2026-05-20.
- Updated `ReadBlogList` to fetch the requested admin blog read page with
  `limit: 10`, consume route `metadata`, and render local previous/next page
  controls from `page` and `totalPages`.
- Preserved the existing blog card layout, Cloudinary `adminPreview` image
  handling, Copy ID action, and `selectEntryForOperation()` Update/Delete
  handoff.
- Kept current blog filters page-local only: year options are derived from the
  returned page and active filters are applied only to the visible page data.
  No search, route-backed filters, shared read-list shell, or other resource
  read-list changes were added.
- Added operator-visible empty and error states for the blog read tab,
  including a filter-specific empty message for the current page and an alert
  for fetch errors.
- Added focused coverage in
  `__tests__/unit/adminBlogReadPagination.test.tsx` for metadata-driven
  previous/next navigation, retained Copy/Update/Delete behavior on paginated
  cards, and empty/error states.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/adminBlogReadPagination.test.tsx`;
  `npm run lint`; `git diff --check`.
- Candidate shared-tracker update: mark T-175 complete and run T-176 next for
  route-backed admin read filters; F-095 remains partially mitigated until
  route-backed filters/search and broader read-list pagination land.
