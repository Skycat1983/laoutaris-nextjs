# T-181 Apply Artwork Admin Read Pagination Search

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Apply the proven admin read-list pagination/search pattern to the main artwork
read tab while preserving its existing artwork filters.

## Context

- T-174 added shared admin read-list pagination query bounds.
- T-175 through T-177 proved the main blog read-tab sequence: metadata-driven
  pagination, route-backed filters, and bounded route-backed search.
- T-179 applied pagination/search to collections.
- T-180 applied pagination, route-backed filters, and search to articles.
- The main artwork read tab already sends one route-backed exact filter for
  `decade`, `artstyle`, `medium`, or `surface`, but it still fetches a single
  page, exposes no search, and has no explicit filter reset.
- The artwork read route currently builds the filter query from query params;
  this task should keep that behavior constrained to the visible filter fields.

## Scope

In scope:

- Update the admin artwork read-list route to accept bounded `search` using the
  existing shared admin read query parser.
- Search only safe public-ish artwork fields, expected `title`.
- Keep existing route-backed artwork filters for `decade`, `artstyle`,
  `medium`, and `surface`, but ensure the route ignores unsupported filter keys
  and values rather than constructing arbitrary query fields.
- Apply filter and search predicates before both `countDocuments()` and
  paginated `find()` calls, so metadata describes the visible result set.
- Update the admin read fetcher so artwork list reads can send trimmed
  `search` while preserving filter params.
- Update `ReadArtworkList` to track current page, consume route metadata,
  render previous/next controls, send bounded search, and reset to page 1 when
  search or filters change.
- Add an explicit no-filter/reset path to the artwork filter control if needed
  to support normal paginated operation.
- Preserve the artwork card layout, Cloudinary `adminPreview` image handling,
  medium/surface display, Copy ID action, and T-152 Update/Delete handoff.
- Add focused route, fetcher, and component coverage for artwork pagination,
  filters, search, no-results/error states, filter reset if added, and retained
  card actions.

Out of scope:

- Do not change article, blog, collection, comment, or user read tabs.
- Do not add new artwork filter concepts or public artwork browse behavior.
- Do not change public `/artwork`, public `/search`, or Shopify product-link
  behavior.
- Do not extract a shared admin read-list shell yet.
- Do not edit shared trackers while running in parallel.

## Concurrency

Run this task alone against artwork read-list surfaces. Do not run in parallel
with tasks touching the artwork read route, admin read fetcher,
`ReadArtworkList`, `ArtworkFilterDropdowns`, or admin archive entry-point
tests.

Owned files:

- `src/app/api/v2/admin/artwork/read/route.ts`
- `src/lib/api/admin/read/fetchers.ts`
- `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx`
- `src/components/features/adminDashboard/inputs/ArtworkFilterDropdowns.tsx`
  if a reset option is needed
- focused route/fetcher/component tests, likely
  `__tests__/unit/api/adminReadRouteGuard.test.ts`,
  `__tests__/unit/api/adminReadFetchers.test.ts`, and a focused artwork
  read-list component test
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The main admin artwork read tab can move between pages using route metadata.
- Existing artwork filters remain route-backed and are constrained to supported
  fields/values.
- Artwork search is bounded, trimmed, route-backed, and limited to safe fields.
- Search, filters, and pagination metadata describe the same dataset.
- Existing artwork image cards and Update/Delete/Copy handoff still work.
- No shared shell extraction or other resource rollout is introduced.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminReadFetchers.test.ts
npm run lint
git diff --check
```

Add the focused artwork read-list component test path to the test command if
the task creates one.

## Agent Prompt

You are working on T-181. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, and the T-175 through T-180 handoffs. Apply the
proven admin read-list pagination/search pattern to the main artwork read tab
only. Keep existing artwork filters route-backed, constrain them to supported
keys/values, add bounded title search, preserve route metadata, preserve artwork
images and Update/Delete/Copy handoff, and do not extract a shared shell or
touch other resources. Add a no-filter/reset path only if needed for the
existing artwork filter control. Do not edit shared trackers. Run focused
route/fetcher/component tests, lint, and `git diff --check`, then update only
this task handoff.

## Handoff Notes

- Planned after T-180 completed the article read-list pagination/filter/search
  rollout.
- Completed on 2026-05-20.
- Added bounded route-backed artwork title search through the shared admin
  read-list query parser. Search values are trimmed, rejected over 80
  characters with structured `400` field errors, regex-escaped, and scoped to
  `title`.
- Constrained existing artwork route-backed filters to the visible
  `decade`, `artstyle`, `medium`, and `surface` keys and their existing
  allowed values. Unsupported keys or values are ignored instead of becoming
  arbitrary MongoDB query fields.
- Applied valid artwork filter/search predicates before both
  `countDocuments()` and paginated `find()` calls so metadata describes the
  visible result set.
- Updated the admin read fetcher so artwork list reads send trimmed `search`
  while preserving existing `filterKey`/`filterValue` params.
- Updated `ReadArtworkList` to fetch the requested page with `limit: 50`,
  consume route metadata, render previous/next controls, send bounded search,
  reset to page 1 on search/filter changes, and keep no-results/error states
  operator-visible.
- Added an explicit `No Filter` option to `ArtworkFilterDropdowns`.
- Preserved the artwork image cards, Cloudinary `adminPreview` handling,
  medium/surface display, Copy ID action, and Update/Delete handoff.
- Added focused coverage:
  `__tests__/unit/api/adminReadRouteGuard.test.ts` covers overlong artwork
  search rejection, supported and unsupported artwork filters, escaped title
  search, and search combined with filters before counts and paginated reads;
  `__tests__/unit/api/adminReadFetchers.test.ts` covers trimmed artwork search
  with preserved filter params; `__tests__/unit/adminArtworkReadPagination.test.tsx`
  covers pagination, filter reset, search-with-filter reset, no-results/error
  states, card display, and retained Copy/Update/Delete actions.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminReadFetchers.test.ts __tests__/unit/adminArtworkReadPagination.test.tsx`;
  `npm run lint`; `git diff --check`.
- Candidate shared-tracker update: F-095 can be marked further mitigated for
  artwork now that article, artwork, blog, and collection main read tabs have
  paginated/searchable route-backed entry points; any shared read-list shell
  should remain a separate follow-up.
