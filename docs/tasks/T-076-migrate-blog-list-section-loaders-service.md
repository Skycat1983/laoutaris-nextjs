# T-076 Migrate Blog List Section Loaders Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `BlogListLoader` and `BlogSectionLoader` off same-app HTTP by sharing
server-only blog list data access with `GET /api/v2/public/blog`.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-075 moved `BlogDetailLoader` and the public blog detail routes to shared
  server-only services, leaving blog list/section loaders for this task.
- At assignment time, `src/components/loaders/viewLoaders/BlogListLoader.tsx`
  still called `serverApi.public.blog.multiple(...)` for sorted list pages and
  `serverPublicApi.blog.multiple(...)` for its featured/latest/popular landing
  groups.
- At assignment time,
  `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx` still called
  `serverPublicApi.blog.multiple(...)`.
- At assignment time, `src/app/api/v2/public/blog/route.ts` owned the blog list
  query, sorting/filtering, transform, metadata, and response envelope. It also
  emitted direct MongoDB query `console.log` debug output.

## Scope

In scope:

- Add a shared server-only blog list service, for example
  `src/lib/data/services/getBlogList.ts`, or an equivalent strongly typed
  service shape.
- Move the existing public blog list query/transform behavior into the service:
  connect to MongoDB, apply the current `latest`/`oldest`/`popular`/`featured`
  sort behavior, apply the existing featured filter, page/limit with the
  existing defaults, transform with `transformBlog.toFrontend`, and return
  blogs plus pagination metadata.
- Refactor `GET /api/v2/public/blog` to call the shared service while
  preserving the current success envelope, metadata shape, invalid `sortby`
  error body, and public-safe `500` body.
- Refactor `BlogListLoader` to call the shared service directly for both its
  single-sort path and its featured/latest/popular grouped landing path.
- Refactor `BlogSectionLoader` to call the shared service directly for its
  latest four blog cards.
- Remove direct same-app HTTP imports and calls from both loaders.
- Remove touched direct blog list debug `console.log` output without creating a
  global logging/redaction policy.
- Preserve `BlogListView` props, `BlogSection` props, current sort labels,
  page/limit behavior, pagination link construction, route paths, and route
  response contracts.
- Add or update focused tests for the service, API route, `BlogListLoader`, and
  `BlogSectionLoader` no-self-fetch behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate `ArtworkLoader`, `CollectionArtworkLoader`,
  `CollectionSectionLoader`, `BiographySectionLoader`, account/user loaders,
  shop loaders, or root layout data access.
- Do not change blog sorting semantics, blog pagination UX, blog cards, blog
  detail/comment mutation behavior, route URL/base URL policy, cache policy,
  root layout DB/session ownership, or global logging/redaction policy.
- Do not apply broad public list response-helper/status changes unless required
  to preserve the existing route behavior.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getBlogList.ts` or equivalent
- `src/app/api/v2/public/blog/route.ts`
- `src/components/loaders/viewLoaders/BlogListLoader.tsx`
- `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx`
- `__tests__/unit/data/getBlogList.test.ts` or equivalent
- `__tests__/unit/api/publicBlogListRoute.test.ts` or equivalent
- `__tests__/unit/loaders/BlogListLoader.test.tsx` or equivalent
- `__tests__/unit/loaders/BlogSectionLoader.test.tsx` or equivalent
- `docs/tasks/T-076-migrate-blog-list-section-loaders-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `BlogListLoader` no longer imports `serverApi`, `serverPublicApi`, or
  fetcher-backed blog list methods.
- `BlogSectionLoader` no longer imports `serverApi`, `serverPublicApi`, or
  fetcher-backed blog list methods.
- `BlogListLoader` no longer calls `serverApi.public.blog.multiple`,
  `serverPublicApi.blog.multiple`, `fetch`, or another same-app HTTP wrapper.
- `BlogSectionLoader` no longer calls `serverPublicApi.blog.multiple`, `fetch`,
  or another same-app HTTP wrapper.
- `GET /api/v2/public/blog` and both server loaders share the same server-only
  blog list service for MongoDB query, sort/filter, transform, and metadata
  behavior.
- The public blog list API route preserves its success envelope and metadata
  shape for valid list requests.
- The public blog list API route preserves the current invalid `sortby` error
  body and public-safe `500` body.
- `BlogListLoader` still renders `BlogListView` with the same `single`,
  `featured`, `latest`, `popular`, `metadata`, `prev`, and `next` behavior.
- `BlogSectionLoader` still renders `BlogSection` with the latest four blogs and
  still returns `null` for non-Next loading failures.
- The touched blog list route/loader paths no longer contain direct
  `console.log` debug output.
- Focused tests cover service success for each sort mode, metadata behavior,
  route envelope preservation, loader no-self-fetch behavior, grouped blog list
  behavior, and section loader behavior.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|\\.multiple\\(|fetch\\(|console\\.log" src/components/loaders/viewLoaders/BlogListLoader.tsx src/components/loaders/sectionLoaders/BlogSectionLoader.tsx src/app/api/v2/public/blog/route.ts
npm test -- --runTestsByPath __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/data/getBlogList.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/loaders/BlogSectionLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same service, route, and loader behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- Added `src/lib/data/services/getBlogList.ts` as the shared server-only blog
  list service. It owns `dbConnect()`, the current
  `latest`/`oldest`/`popular`/`featured` sort and featured-filter behavior,
  `transformBlog.toFrontend`, and list metadata.
- `GET /api/v2/public/blog` now delegates to `getBlogList` while preserving the
  existing success envelope, invalid `sortby` body, and public-safe `500` body.
- `BlogListLoader` now calls `getBlogList` directly for both single-sort and
  grouped landing paths; `BlogSectionLoader` now calls it directly for the
  latest four cards.
- Removed the touched blog list route's direct MongoDB query `console.log`.
- Keep collection/artwork/article/account/shop loader migrations separate.
- Keep blog detail/comment behavior, pagination redesign, route URL/base URL
  policy, cache policy, root layout DB/session ownership, and global
  logging/redaction policy separate.

## Verification Result

Passed 2026-05-16:

```bash
rg -n "serverPublicApi|serverApi|\\.multiple\\(|fetch\\(|console\\.log" src/components/loaders/viewLoaders/BlogListLoader.tsx src/components/loaders/sectionLoaders/BlogSectionLoader.tsx src/app/api/v2/public/blog/route.ts
npm test -- --runTestsByPath __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/data/getBlogList.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/loaders/BlogSectionLoader.test.tsx
npm run lint
npm run build
git diff --check
```

Notes:

- The `rg` verification returned no matches, as expected.
- Focused Jest passed with 4 suites and 17 tests.
- Build passed; existing build-time MongoDB/static-generation,
  branch-verification, navigation link, and `ArticleView` debug noise remains
  outside this task.

## Escalate

Escalate to the orchestrator if:

- Sharing blog list behavior requires changing the current public route
  response contract or visible blog list/section behavior.
- The route's current query parsing needs broader validation/status cleanup
  beyond preserving its existing `sortby`, page, and limit behavior.
- The fix requires touching unrelated loaders, client blog components, or
  global server API/fetcher architecture.
