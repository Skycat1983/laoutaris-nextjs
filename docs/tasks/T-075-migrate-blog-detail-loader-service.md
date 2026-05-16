# T-075 Migrate Blog Detail Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `BlogDetailLoader` off same-app HTTP by sharing server-only blog detail
data access with the public blog detail API routes.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-074 moved `ArticleLoader` populated article detail data to a shared
  server-only service and left blog detail service extraction separate.
- `src/components/loaders/viewLoaders/BlogDetailLoader.tsx` still calls
  `serverPublicApi.blog.single(slug)` or
  `serverPublicApi.blog.singlePopulated(slug)` depending on `showComments`.
- `BlogDetailLoader` still emits direct `console.log` debug output for the
  fetched result.
- `src/app/api/v2/public/blog/[slug]/route.ts` already owns the blog-with-author
  query, transform, success envelope, `404`, and public-safe `500` behavior.
- `src/app/api/v2/public/blog/[slug]/comments/route.ts` already owns the
  blog-with-comments-and-comment-authors query, transform, success envelope,
  `404`, and public-safe `500` behavior.

## Scope

In scope:

- Add shared server-only blog detail data service(s), for example
  `src/lib/data/services/getBlogBySlugWithAuthor.ts` and
  `src/lib/data/services/getBlogBySlugWithComments.ts`, or an equivalent
  strongly typed service shape.
- Move the existing blog detail route query/transform behavior into the shared
  service path for the non-comments detail: connect to MongoDB, find one blog by
  `slug`, populate `comments` and `author`, lean to the current type, transform
  through `transformBlogWithAuthor`, and return `null` for not found.
- Move the existing populated-comments route query/transform behavior into the
  shared service path for comments detail: connect to MongoDB, find one blog by
  `slug`, populate `comments.author`, lean to the current type, transform
  through `transformBlogPopulatedWithCommentsPopulated`, and return `null` for
  not found.
- Refactor both public blog detail API routes to call the shared service path
  while preserving existing success envelopes, `404`s, and public-safe `500`s.
- Refactor `BlogDetailLoader` to call the shared service path directly,
  preserve `showComments` behavior, and remove direct result debug
  `console.log` output.
- Preserve `BlogDetail` props, route paths, route response contracts, and
  existing error behavior.
- Add or update focused tests for the service(s), API routes, and
  `BlogDetailLoader` no-self-fetch behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate `BlogListLoader`, `BlogSectionLoader`, blog list routes,
  article routes, collection routes, account/user loaders, shop loaders, or root
  layout data access.
- Do not change `BlogDetail`, comment mutation behavior, blog list sorting,
  route URL/base URL policy, cache policy, root layout DB/session ownership, or
  global logging/redaction policy.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getBlogBySlugWithAuthor.ts` or equivalent
- `src/lib/data/services/getBlogBySlugWithComments.ts` or equivalent
- `src/app/api/v2/public/blog/[slug]/route.ts`
- `src/app/api/v2/public/blog/[slug]/comments/route.ts`
- `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
- `__tests__/unit/data/getBlogBySlugWithAuthor.test.ts` or equivalent
- `__tests__/unit/data/getBlogBySlugWithComments.test.ts` or equivalent
- `__tests__/unit/api/publicContentDetailRoutes.test.ts`
- `__tests__/unit/loaders/BlogDetailLoader.test.tsx` or equivalent
- `docs/tasks/T-075-migrate-blog-detail-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `BlogDetailLoader` no longer imports `serverPublicApi`, `serverApi`, or same
  app HTTP fetchers.
- `BlogDetailLoader` no longer calls `serverPublicApi.blog.single`,
  `serverPublicApi.blog.singlePopulated`, or any fetcher-backed blog detail
  method.
- `BlogDetailLoader` no longer emits direct result `console.log` debug output.
- The public blog detail route and the public populated-comments blog route use
  shared server-only service logic for their query/transform work.
- The non-comments public blog detail API route preserves its success envelope,
  `404` not-found response, and public-safe `500` response.
- The populated-comments public blog detail API route preserves its success
  envelope, `404` not-found response, and public-safe `500` response.
- `BlogDetailLoader` still renders `BlogDetail` with the same `blog` and
  `showComments` props for both modes.
- Focused tests cover service success/not-found/failure behavior, route envelope
  preservation, loader no-self-fetch behavior, and both `showComments` modes.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|singlePopulated|\\.single\\(|fetch\\(|console\\.log" src/components/loaders/viewLoaders/BlogDetailLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicContentDetailRoutes.test.ts __tests__/unit/data/getBlogBySlugWithAuthor.test.ts __tests__/unit/data/getBlogBySlugWithComments.test.ts __tests__/unit/loaders/BlogDetailLoader.test.tsx
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
- Added `getBlogBySlugWithAuthor` for non-comments blog detail data and
  `getBlogBySlugWithComments` for populated comments detail data. The services
  own `dbConnect()`, the `slug` lookups, the existing populate chains, lean
  typing, transforms, and `null` not-found results.
- Refactored `GET /api/v2/public/blog/[slug]` and
  `GET /api/v2/public/blog/[slug]/comments` to call the shared services while
  preserving their success envelopes, `404`s, and public-safe `500`s.
- Refactored `BlogDetailLoader` to call the shared services directly, preserve
  both `showComments` modes and `BlogDetail` props, and remove direct result
  `console.log` debug output.
- Keep blog list/section loaders and blog list route service extraction
  separate.
- Keep comment mutation behavior, article routes, collection routes, route
  URL/base URL policy, global logging/redaction policy, root layout DB/session
  ownership, and cache policy separate.
- Verification passed:
  `rg -n "serverPublicApi|serverApi|singlePopulated|\\.single\\(|fetch\\(|console\\.log" src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
  returned no matches;
  `npm test -- --runTestsByPath __tests__/unit/api/publicContentDetailRoutes.test.ts __tests__/unit/data/getBlogBySlugWithAuthor.test.ts __tests__/unit/data/getBlogBySlugWithComments.test.ts __tests__/unit/loaders/BlogDetailLoader.test.tsx`;
  `npm test`; `npm run lint`; `npm run build`; `git diff --check`.
  Full Jest retained existing expected `dateUtils` invalid-date console error
  output, and build retained existing MongoDB/static-generation,
  branch-verification, navigation link, and `ArticleView` debug noise.

## Escalate

Escalate to the orchestrator if:

- Sharing the two blog detail route behaviors requires changing their current
  response contracts or `BlogDetail` props.
- The comments-populated and author-populated query shapes cannot be expressed
  safely without a product or data-contract decision.
- The fix requires touching unrelated loaders, route pages, or global
  server API/fetcher architecture.
