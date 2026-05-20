# T-182 Add Comment User Admin Read Pagination

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make the main admin comment and user read tabs consume existing route metadata
for pagination while preserving the T-178 delete handoff.

## Context

- T-174 added bounded admin read-list `page`/`limit` query parsing across all
  six admin read-list routes.
- T-178 added comment and user read-list delete handoff into the existing
  guarded delete workflow.
- T-175 through T-181 applied route-backed pagination/search/filter patterns to
  the article, artwork, blog, and collection main read tabs.
- Comment and user read routes already return pagination metadata, but
  `ReadCommentList` and `ReadUserList` still fetch only `page: 1, limit: 10`.
  This means older comments/users can still require manual ObjectId lookup.

## Scope

In scope:

- Update `ReadCommentList` to track current page, consume route metadata, and
  render previous/next controls.
- Update `ReadUserList` to track current page, consume route metadata, and
  render previous/next controls.
- Preserve existing comment/user card layout, Copy ID actions, and T-178
  Delete handoff into the guarded delete workflow.
- Preserve manual ObjectId lookup as an escape hatch.
- Preserve route contracts; comment/user routes and fetchers already accept
  `page`/`limit` and return metadata.
- Add focused component coverage for comment/user pagination, empty/error
  states, and retained Copy/Delete actions.

Out of scope:

- Do not add comment or user search.
- Do not add filters.
- Do not change comment/user delete routes, preview routes, evidence gates, or
  audit-event behavior.
- Do not change article, artwork, blog, or collection read tabs.
- Do not extract a shared admin read-list shell yet.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone against comment/user read-list UI. Do not run in parallel
with tasks touching `ReadCommentList`, `ReadUserList`,
`CommentOperations`, `UserOperations`, or admin archive entry-point tests.

Owned files:

- `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx`
- focused component tests, likely a new comment/user read pagination test or
  additions to `__tests__/unit/adminArchiveEntryPoints.test.tsx`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The main admin comment read tab can move between pages using route metadata.
- The main admin user read tab can move between pages using route metadata.
- Existing Copy ID and Delete handoff actions still work on paginated cards.
- Empty, loading, and error states remain operator-visible.
- No comment/user search, filters, delete-route changes, or shared shell
  extraction are introduced.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/adminArchiveEntryPoints.test.tsx
npm run lint
git diff --check
```

Adjust the focused test path if a narrower comment/user read pagination test is
added.

## Agent Prompt

You are working on T-182. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, T-178, and the T-175 through T-181 handoffs.
Make only the main admin comment and user read tabs consume existing route
metadata for previous/next pagination. Preserve Copy ID and the T-178
Delete handoff into guarded delete workflows. Do not add comment/user search,
filters, delete-route changes, shared shell extraction, or shared tracker
edits. Run focused component coverage, lint, and `git diff --check`, then
update only this task handoff.

## Handoff Notes

- Planned after T-181 completed the artwork read-list pagination/search rollout.
- Completed on 2026-05-20.
- Updated `ReadCommentList` to fetch the requested admin comment read page with
  `limit: 10`, consume route pagination metadata, render previous/next page
  controls, and keep no-results/error states operator-visible.
- Updated `ReadUserList` to fetch the requested admin user read page with
  `limit: 10`, consume route pagination metadata, render previous/next page
  controls, and keep no-results/error states operator-visible.
- Preserved the existing comment/user card layouts, Copy ID actions, and the
  T-178 Delete handoff into the existing guarded delete workflow. Manual
  ObjectId lookup remains available through the operation tabs.
- No comment/user search, filters, route contract changes, delete-route
  changes, shared shell extraction, or shared tracker edits were introduced.
- Added focused coverage in
  `__tests__/unit/adminCommentUserReadPagination.test.tsx` for comment and user
  pagination, empty/error states, and retained Copy/Delete actions on paginated
  cards.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/adminCommentUserReadPagination.test.tsx __tests__/unit/adminArchiveEntryPoints.test.tsx`;
  `npm run lint`; `git diff --check`.
- Additional probe: `npx tsc --noEmit --pretty false --skipLibCheck` was run
  outside the task baseline and failed on existing unrelated test type errors in
  admin read route, navigation loader/page, auth, DB helper, form, upload, and
  import-boundary tests.
- Candidate shared-tracker update: F-095 can be marked further mitigated for
  comment/user main read tabs now that article, artwork, blog, collection,
  comment, and user main read tabs have paginated route-backed entry points;
  comment/user search remains out of scope until privacy/product policy exists.
