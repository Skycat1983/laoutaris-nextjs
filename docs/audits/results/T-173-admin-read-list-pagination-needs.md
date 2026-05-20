# T-173 Admin Read-List Pagination Needs

Status: Completed

Task: [T-173 Audit Admin Read-List Pagination Needs](../../tasks/T-173-audit-admin-read-list-pagination-needs.md)

Workstreams:
[Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md),
[Frontend routes and components](../../workstreams/frontend-routes-and-components.md),
[Data models and API](../../workstreams/data-models-and-api.md),
[Testing and quality](../../workstreams/testing-and-quality.md)

## Summary

Admin read routes already return pagination metadata for articles, artwork,
blogs, collections, comments, and users, and the right-side admin feed tabs use
that metadata for simple previous/next paging. The main CRUD read tabs do not
use the metadata: they render a fixed first page of cards, expose no page
controls, and expose no search box. T-152 improved articles, artwork, blogs,
and collections by letting those first-page cards seed update/delete lookups,
but users and comments still require manual ObjectId lookup for delete.

The smallest safe next split is route query validation and metadata contract
cleanup first, then one resource read-tab pilot that consumes route metadata,
then search/filter expansion and shared read-list component extraction.

## Scope Inspected

- Task and docs:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/tasks/T-173-audit-admin-read-list-pagination-needs.md`
  - `docs/tasks/T-152-improve-admin-archive-entry-points.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md`
  - `docs/audits/results/A-011-admin-content-operations.md`
  - `docs/workstreams/content-assets-and-admin-ops.md`
  - `docs/workstreams/frontend-routes-and-components.md`
  - `docs/workstreams/data-models-and-api.md`
  - `docs/workstreams/testing-and-quality.md`
  - `docs/runbooks/admin-content-operations.md`
- Admin read API routes:
  - `src/app/api/v2/admin/article/read/route.ts`
  - `src/app/api/v2/admin/artwork/read/route.ts`
  - `src/app/api/v2/admin/blog/read/route.ts`
  - `src/app/api/v2/admin/collection/read/route.ts`
  - `src/app/api/v2/admin/comment/read/route.ts`
  - `src/app/api/v2/admin/user/read/route.ts`
  - Detail read routes under matching `[id]/route.ts` paths where manual lookup lands.
- Admin fetchers and UI:
  - `src/lib/api/admin/read/fetchers.ts`
  - `src/components/features/adminDashboard/crudForms/read/*`
  - `src/components/features/adminDashboard/operationTabs/*`
  - `src/components/features/adminDashboard/DocumentReader.tsx`
  - `src/components/modules/tabs/AdminCrudTabs.tsx`
  - `src/components/features/adminDashboard/feeds/*`
  - `src/components/modules/cards/*FeedCard.tsx`
  - `src/components/elements/pagination/FeedPagination.tsx`
- Focused tests:
  - `__tests__/unit/api/adminReadRouteGuard.test.ts`
  - `__tests__/unit/adminArchiveEntryPoints.test.tsx`

## Current Route And Fetcher Contract

- All six list routes require `requireApiAdmin()`, call `dbConnect()`, read
  `page` and `limit` from query params, and return `apiListResponse(data,
  { page, limit, total, totalPages })` on success.
- Empty list pages return `404` with `No <resource> found`, matching the current
  tested admin read contract.
- Query parsing uses `parseInt()` directly. There is no shared admin list query
  schema, no lower or upper bounds for `page`/`limit`, and no invalid-number
  `400` behavior.
- `ReadListParams` includes `search?: string`, but no admin read fetcher adds a
  search query param and no admin read route reads one.
- Only the artwork list fetcher sends filter params. It maps one `filterKey` and
  one `filterValue` to the route, and the route applies exact-match MongoDB
  filtering before pagination/counting.
- Article, blog, and collection fetcher filter types exist in TypeScript, but
  their list fetchers ignore `filter` and their routes do not read filter
  params.

## Current Behavior By Resource

| Resource | Route sort and server filters | Main read tab | Feed tab | Manual ObjectId lookup need |
| --- | --- | --- | --- | --- |
| Articles | `createdAt: -1`; no server filter/search; populated `artwork`; `total` counts all articles. | Fetches `page: 1, limit: 10`, then filters that page client-side by `section` or `overlayColour`. Shows Update/Delete/Copy actions from T-152. No pagination or search. | Fetches `limit: 10` with previous/next pagination. Cards only copy ID. No filter/search or update/delete handoff. | Still needed for articles not on the first read-tab page or not reachable through current filters/feed handoff. |
| Artwork | `createdAt: -1`; exact server filter for one of `decade`, `artstyle`, `medium`, or `surface`; `total` counts the filtered query. | Fetches the fetcher default `page: 1, limit: 50` and passes the selected filter to the route. Shows Update/Delete/Copy actions. No pagination or search. The filter dropdown has no explicit `No Filter` reset option. | Fetches `page`, `limit: 10` with pagination but no filters. Cards only copy ID. | Still needed for artwork outside first filtered/unfiltered read-tab page, or when feed pagination finds an item but does not hand it to update/delete. |
| Blogs | `displayDate: -1`; no server filter/search; populated `author comments`; `total` counts all blogs. | Fetches `page: 1, limit: 10`, derives year options only from that first page, then filters that page client-side by `featured` or year. Shows Update/Delete/Copy actions. No pagination or search. | Fetches `limit: 10` with pagination. Cards only copy ID. No filter/search or update/delete handoff. | Still needed for blogs outside the first read-tab page, especially older years that are absent from first-page-derived year options. |
| Collections | `createdAt: -1`; no server filter/search; populated `artworks`; `total` counts all collections. | Fetches `page: 1, limit: 10`. Shows collection title, artwork count, summary, and Update/Delete/Copy actions. No filters, pagination, or search. | Fetches `limit: 10` with pagination. Cards only copy ID. No filter/search or update/delete handoff. | Still needed for collections outside the first read-tab page or only found through feed pagination. |
| Comments | `createdAt: -1`; no server filter/search; populated `author`; `total` counts all comments. | Fetches `page: 1, limit: 10`. Shows author username and truncated text. Copy ID only; no direct delete handoff, filters, pagination, or search. | Fetches `limit: 10` with pagination. Cards copy ID only. | Required for delete workflow, because `CommentOperations` exposes a delete `DocumentReader` but read-list/feed cards cannot seed it. |
| Users | `createdAt: -1`; no server filter/search; `total` counts all users. The route contains a TODO questioning timestamp sorting. | Fetches `page: 1, limit: 10`. Shows username and role. Copy ID only; no direct delete handoff, filters, pagination, or search. | Fetches `limit: 10` with pagination. Current user feed cards do not expose copy/update/delete actions. | Required for delete workflow, because `UserOperations` exposes a delete `DocumentReader` but read-list/feed cards cannot seed it. |

## UI Surface Notes

- `AdminCrudTabs` can pass an `initialDocumentId` only to update/delete
  components when a read-tab card calls `selectEntryForOperation()`. That path
  exists in article, artwork, blog, and collection read tabs.
- `CommentOperations` and `UserOperations` still do not accept
  `initialDocumentId`, and their read-list cards do not call
  `selectEntryForOperation()`.
- `DocumentReader` remains the common escape hatch. It accepts any non-empty
  string at form validation time and relies on the detail route/fetcher to fail
  invalid or missing IDs.
- The side feed tabs and main read tabs duplicate list fetching and card
  rendering concerns but have different capabilities: feeds paginate, read tabs
  seed update/delete for four content resources.
- The route metadata is already available to build richer read tabs without a
  route response-shape change.

## Recommended Implementation Split

1. Harden the shared admin list route query contract.
   - Add a small admin list query parser for `page` and `limit` with explicit
     defaults, min/max bounds, and `400` validation errors for invalid input.
   - Apply it to all six admin read list routes without adding search or UI.
   - Add route tests for invalid pagination and preserved success metadata.

2. Pilot a paginated main read tab on one low-risk resource.
   - Use blogs or collections first: both have simple cards and no relationship
     lookup requirement in the list itself.
   - Keep existing card actions and copy behavior.
   - Consume `response.metadata` in the main read tab and render
     `FeedPagination` or a small admin-specific equivalent.
   - Add focused component coverage for next/previous page fetches and retained
     Update/Delete handoff.

3. Move eligible filters from first-page client filters to route-backed query
   params.
   - Start with blog `featured` and year or article `section`, because the
     current UI already exposes those controls.
   - Keep client-only filtering out of the paginated path, because it hides
     matching records outside the current page.
   - Add route tests for filtered `countDocuments(query)` and page metadata.

4. Add explicit search after pagination and filter contracts are stable.
   - Use resource-specific safe fields: article/blog/collection/artwork title or
     slug where available, comment text and author username where safe, and user
     username/role for users.
   - Do not search or display private account fields unless the admin privacy
     policy explicitly allows it.
   - Add debounced UI search in one pilot tab before broad rollout.

5. Unify the read-tab/feed duplication.
   - Extract a shared admin read-list shell only after the pilot proves the
     metadata, filter, search, loading, empty, error, copy, and handoff states.
   - Decide whether the right-side feed remains a paginated passive overview or
     reuses the same row/card actions as the main read tab.

6. Add direct delete handoff for comments and users only after the delete UX
   policy remains acceptable.
   - The technical shape is small: let read cards call
     `selectEntryForOperation({ documentId, operation: "delete" })`, add
     `initialDocumentId` props to `CommentOperations` and `UserOperations`, and
     pass them into `DocumentReader`.
   - Because these are destructive moderation/account workflows, keep this as a
     separate task from pagination/search.

## Candidate Follow-Up Tasks

- `T-admin-read-route-query-bounds`: Add shared admin read-list pagination
  parsing and invalid-query tests for articles, artwork, blogs, collections,
  comments, and users.
- `T-admin-blog-read-pagination-pilot`: Add metadata-driven pagination to the
  main blog read tab while preserving T-152 update/delete handoff.
- `T-admin-read-filter-contracts`: Move current first-page client filters for
  blog/article read tabs to route-backed query params and metadata-aware
  counts.
- `T-admin-read-search-pilot`: Add a route-backed title/slug search pilot for
  blogs or collections after pagination is stable.
- `T-admin-comment-user-delete-entry-points`: Add read-list-to-delete handoff
  for comments and users as a separate destructive-workflow slice.
- `T-admin-read-list-shell`: Extract shared admin read-list pagination/loading/
  empty/error/card-action patterns after at least one pilot is implemented and
  covered.

## Candidate Tracker Updates

Shared trackers were not edited because T-173 is parallel read-only audit work.
Candidate updates for the orchestrator or reconciliation agent:

- Keep F-095 partially mitigated: T-152 resolved direct update/delete handoff
  for first-page article/artwork/blog/collection cards, but admin read tabs
  still need metadata-driven pagination and search.
- Add a data/API backlog item to define and validate admin read-list
  pagination, filter, and search query contracts.
- Add a content/admin backlog item for paginated/searchable main read tabs,
  preserving ObjectId lookup as an escape hatch.
- Add a testing backlog item for focused admin read-list route query tests and
  component pagination/handoff tests.

## Verification

- `git diff --check`
