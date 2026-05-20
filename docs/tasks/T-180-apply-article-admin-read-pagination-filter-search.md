# T-180 Apply Article Admin Read Pagination Filter Search

Status: Planned

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Apply the proven admin read-list pagination/search pattern to the main article
read tab, and move its existing article filters to the route.

## Context

- T-174 added shared admin read-list pagination query bounds.
- T-175 through T-177 proved the main blog read-tab sequence: metadata-driven
  pagination, route-backed filters, and bounded route-backed search.
- T-179 applied the pagination/search pattern to the main collection read tab.
- The main article read tab still fetches only page 1, then filters that one
  page in the browser by `section` or `overlayColour`. This can hide matching
  articles that exist on later pages.
- Article cards already have T-152 Update/Delete/Copy handoff and Cloudinary
  `adminPreview` image handling that must be preserved.

## Scope

In scope:

- Update the admin article read-list route to accept bounded `search` using the
  existing shared admin read query parser.
- Search only safe public-ish article fields, expected `title` and `slug`.
- Move the existing visible article filters, `section` and `overlayColour`, to
  route-backed `filterKey`/`filterValue` query params.
- Apply filter and search predicates before both `countDocuments()` and
  paginated `find()` calls, so metadata describes the visible result set.
- Update the admin read fetcher so article list reads can send trimmed `search`
  and the active article filter.
- Update `ReadArticleList` to track current page, consume route metadata,
  render previous/next controls, send bounded search, and reset to page 1 when
  search or filters change.
- Preserve the article card layout, image transform, section/overlay display,
  Copy ID action, and T-152 Update/Delete handoff.
- Add focused route, fetcher, and component coverage for article pagination,
  filters, search, no-results/error states, and retained card actions.

Out of scope:

- Do not change artwork, blog, collection, comment, or user read tabs.
- Do not add new article filter concepts.
- Do not extract a shared admin read-list shell yet.
- Do not change public article routes, public `/search`, or article taxonomy
  decisions.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone against article read-list surfaces. Do not run in parallel
with tasks touching the article read route, admin read fetcher,
`ReadArticleList`, `ArticleFilterDropdowns`, or admin archive entry-point
tests.

Owned files:

- `src/app/api/v2/admin/article/read/route.ts`
- `src/lib/api/admin/read/fetchers.ts`
- `src/lib/data/types/articleTypes.ts` if the article filter type needs to
  include `overlayColour`
- `src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx`
- focused route/fetcher/component tests, likely
  `__tests__/unit/api/adminReadRouteGuard.test.ts`,
  `__tests__/unit/api/adminReadFetchers.test.ts`, and a focused article
  read-list component test
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The main admin article read tab can move between pages using route metadata.
- Existing article filters are route-backed and no longer filter only the
  current browser page.
- Article search is bounded, trimmed, route-backed, and limited to safe fields.
- Search, filters, and pagination metadata describe the same dataset.
- Existing article image cards and Update/Delete/Copy handoff still work.
- No shared shell extraction or other resource rollout is introduced.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminReadFetchers.test.ts
npm run lint
git diff --check
```

Add the focused article read-list component test path to the test command if
the task creates one.

## Agent Prompt

You are working on T-180. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, and the T-175 through T-179 handoffs. Apply the
proven admin blog/collection read-list pagination/search pattern to the main
article read tab only, and move the existing article `section` and
`overlayColour` filters from first-page client filtering to route-backed query
params. Search only safe article fields such as title and slug, escape regex
input, preserve route metadata, preserve article images and Update/Delete/Copy
handoff, and do not extract a shared shell or touch other resources. Do not
edit shared trackers. Run focused route/fetcher/component tests, lint, and
`git diff --check`, then update only this task handoff.

## Handoff Notes

- Planned after T-179 completed the collection read-list pagination/search
  rollout.
