# T-183 Extract Admin Read Pagination Control

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the duplicated main admin read-tab previous/next pagination control
without changing admin archive behavior.

## Context

- T-175 through T-182 made the main article, artwork, blog, collection,
  comment, and user read tabs consume route pagination metadata.
- Each read tab now carries a local metadata type, normalization helper, and
  nearly identical previous/next pagination component.
- F-095 is resolved for normal archive maintenance, but the duplicated
  pagination UI makes future read-list changes harder to keep consistent.

## Scope

In scope:

- Add a small client-safe shared admin read pagination control and, if useful,
  a shared metadata normalization helper.
- Replace only the duplicated pagination-control code in:
  - `ReadArticleList`
  - `ReadArtworkList`
  - `ReadBlogList`
  - `ReadCollectionList`
  - `ReadCommentList`
  - `ReadUserList`
- Preserve current labels, disabled states, page text, loading behavior, search
  behavior, filters, card layouts, and Copy/Update/Delete handoff actions.
- Keep resource-specific fetch logic inside the existing read-list components.
- Run the focused read-list pagination/component tests that cover the touched
  tabs.

Out of scope:

- Do not extract a full read-list shell.
- Do not change routes, fetchers, query params, card layouts, search behavior,
  filters, or delete/update workflows.
- Do not add comment/user search.
- Do not redesign admin read tabs.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone. It touches all main admin read-list components and their
focused tests, so it should not run in parallel with any admin archive UI task.

Owned files:

- a new shared pagination helper/control near the admin read-list components
- `src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx`
- focused admin read-list pagination tests touched only as needed
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- A shared pagination control renders the same previous/next behavior currently
  used by the six main admin read tabs.
- Existing focused tests for blog, collection, article, artwork, comment/user,
  and archive entry-point behavior still pass.
- No route, fetcher, search, filter, card action, or delete workflow behavior
  changes.
- The resulting abstraction is small and local to admin read-list maintenance.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/adminBlogReadPagination.test.tsx __tests__/unit/adminCollectionReadPagination.test.tsx __tests__/unit/adminArticleReadPagination.test.tsx __tests__/unit/adminArtworkReadPagination.test.tsx __tests__/unit/adminCommentUserReadPagination.test.tsx __tests__/unit/adminArchiveEntryPoints.test.tsx
npm run lint
git diff --check
```

## Agent Prompt

You are working on T-183. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the T-175 through T-182 handoffs. Extract only the duplicated previous/next
pagination control and any tiny shared metadata helper needed by the six main
admin read-list tabs. Preserve all current user-visible behavior, route/fetcher
contracts, search/filter behavior, card layouts, and Copy/Update/Delete
handoff actions. Do not extract a full read-list shell and do not edit shared
trackers. Run the focused admin read-list pagination tests, lint, and
`git diff --check`, then update only this task handoff.

## Handoff Notes

- Planned after T-182 completed comment/user read-tab pagination.
- Completed on 2026-05-20.
- Added `AdminReadPagination` beside the admin read-list components with the
  shared pagination metadata type, default metadata factory, normalization
  helper, and previous/next control.
- Replaced the duplicated local pagination components in `ReadArticleList`,
  `ReadArtworkList`, `ReadBlogList`, `ReadCollectionList`, `ReadCommentList`,
  and `ReadUserList`.
- Preserved the existing resource-specific fetch logic, route/fetcher
  contracts, search and filter state, empty/error/loading states, card layouts,
  accessible button labels, page text, disabled states, and
  Copy/Update/Delete handoff actions.
- No shared read-list shell, route changes, fetcher changes, query-param
  changes, comment/user search, or shared tracker edits were introduced.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/adminBlogReadPagination.test.tsx __tests__/unit/adminCollectionReadPagination.test.tsx __tests__/unit/adminArticleReadPagination.test.tsx __tests__/unit/adminArtworkReadPagination.test.tsx __tests__/unit/adminCommentUserReadPagination.test.tsx __tests__/unit/adminArchiveEntryPoints.test.tsx`;
  `npm run lint`; `git diff --check`.
- Candidate shared-tracker update: mark T-183 complete and keep any broader
  admin read-list shell extraction as a separate future code-health task only
  if additional duplication becomes actionable.
