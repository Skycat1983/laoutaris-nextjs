# T-179 Apply Collection Admin Read Pagination Search

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Apply the proven admin read-list pagination/search pattern to the main
collection read tab.

## Context

- T-174 added shared admin read-list pagination query bounds.
- T-175 through T-177 proved the main blog read-tab sequence: metadata-driven
  pagination, route-backed filters, and bounded route-backed search.
- Collections are the next low-risk rollout target because the main collection
  read tab already has T-152 Update/Delete/Copy handoff and no visible filters.
- Broader shared read-list shell extraction should wait until at least two
  resources have proven the same states.

## Scope

In scope:

- Update the admin collection read-list route to accept bounded `search` using
  the existing shared admin read query parser.
- Search only safe public-ish collection fields, expected `title` and `slug`.
- Escape regex metacharacters and apply the search predicate before both
  `countDocuments()` and paginated `find()` calls.
- Update the admin read fetcher so collection list reads can send trimmed
  `search`.
- Update `ReadCollectionList` to track current page, consume route metadata,
  render previous/next controls, and send a bounded search query that resets to
  page 1.
- Preserve existing collection card layout, artwork count/summary display,
  Copy ID action, and T-152 Update/Delete handoff.
- Add focused route, fetcher, and component coverage for collection search,
  pagination metadata, no-results/error states, and retained card actions.

Out of scope:

- Do not add collection filters.
- Do not change article, artwork, blog, comment, or user read tabs.
- Do not extract a shared admin read-list shell yet.
- Do not change public collection search, public `/search`, or collection
  section launch policy.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone against collection read-list surfaces. Do not run in
parallel with tasks touching the collection read route, admin read fetcher,
`ReadCollectionList`, or admin archive entry-point tests.

Owned files:

- `src/app/api/v2/admin/collection/read/route.ts`
- `src/lib/api/admin/read/fetchers.ts`
- `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx`
- focused route/fetcher/component tests, likely
  `__tests__/unit/api/adminReadRouteGuard.test.ts`,
  `__tests__/unit/api/adminReadFetchers.test.ts`, and a collection read-list
  component test
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The main admin collection read tab can move between pages using route
  metadata.
- Collection search is bounded, trimmed, route-backed, and limited to safe
  fields.
- Search and pagination metadata describe the same filtered dataset.
- Existing Update/Delete/Copy handoff still works.
- No shared shell extraction or other resource rollout is introduced.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminReadFetchers.test.ts
npm run lint
git diff --check
```

Add the focused collection read-list component test path to the test command if
the task creates one.

## Agent Prompt

You are working on T-179. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, and the T-175 through T-177 handoffs. Apply the
proven admin blog read-list pagination/search pattern to the main collection
read tab only. Search only safe collection fields such as title and slug,
escape regex input, preserve route metadata, preserve Update/Delete/Copy
handoff, and do not extract a shared shell or touch other resources. Do not
edit shared trackers. Run focused route/fetcher/component tests, lint, and
`git diff --check`, then update only this task handoff.

## Handoff Notes

- Planned after T-177 completed the blog read-list search pilot.
- Completed on 2026-05-20.
- Added bounded route-backed collection search through the existing shared
  admin read-list query parser. The route trims `search`, rejects values over
  80 characters with structured `400` field errors, escapes regex
  metacharacters, and searches only collection `title` and `slug`.
- Updated the collection read route so the search predicate is applied before
  both `countDocuments()` and paginated `find()` calls, keeping pagination
  metadata aligned with the visible filtered dataset.
- Updated the admin read fetcher so collection list reads send trimmed
  `search` without changing other resource filters.
- Updated `ReadCollectionList` to fetch the requested page, consume route
  metadata, render previous/next controls, and send a bounded search query that
  resets to page 1.
- Preserved the existing collection card layout, artwork count, summary, Copy
  ID action, and Update/Delete handoff.
- Added focused coverage:
  `__tests__/unit/api/adminReadRouteGuard.test.ts` covers overlong collection
  search rejection and escaped title/slug search metadata;
  `__tests__/unit/api/adminReadFetchers.test.ts` covers trimmed collection
  search params; `__tests__/unit/adminCollectionReadPagination.test.tsx` covers
  pagination, search reset, no-results/error states, artwork count display, and
  retained Copy/Update/Delete actions.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminReadFetchers.test.ts __tests__/unit/adminCollectionReadPagination.test.tsx`;
  `npm run lint`; `git diff --check`.
- Candidate shared-tracker update: F-095 remains partially mitigated; the
  collection read tab now has route-backed pagination and search, while article
  and artwork read-tab pagination/search and any shared read-list shell should
  remain separate follow-up work.
