# T-074 Migrate Article Detail Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `ArticleLoader`'s article detail data fetch off same-app HTTP by sharing a
server-only populated article detail service with the public article detail API
route.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-072 moved `ArticleLoader` previous/next navigation to
  `getArticleNavigationList(section)` but intentionally left
  `serverApi.public.article.singlePopulated(slug)` for article detail data as a
  separate follow-up.
- `src/components/loaders/viewLoaders/ArticleLoader.tsx` still calls
  `serverApi.public.article.singlePopulated(slug)` to get the article detail
  payload before rendering `ArticleView`.
- `src/app/api/v2/public/article/[slug]/route.ts` already owns the populated
  article query, transform, success envelope, `404`, and public-safe `500`
  behavior.
- The public article detail route currently calls `getUserIdFromSession()`
  before `dbConnect()`. Preserve the route's current observable behavior even
  though the transformed article detail payload does not currently use the
  returned user id.

## Scope

In scope:

- Add a server-only data service for populated article detail, for example
  `src/lib/data/services/getArticleBySlugPopulated.ts`.
- Move the existing article detail query/transform behavior into the shared
  service: connect to MongoDB, find one article by `slug`, populate `author
  artwork`, lean to the populated article type, transform through
  `transformArticlePopulated`, and return `null` for not found.
- Refactor `GET /api/v2/public/article/[slug]` to call the shared service while
  preserving its existing optional session lookup, success envelope, `404`, and
  public-safe `500` behavior.
- Refactor `ArticleLoader` to call the shared service directly for article
  detail data while continuing to use `getArticleNavigationList(section)` for
  previous/next navigation.
- Preserve `ArticleView` props, previous/next link calculation, optional `form`
  behavior, article detail not-found/error behavior, and current route response
  contracts.
- Add or update focused tests for the service, API route, and `ArticleLoader`
  no-self-fetch behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate blog loaders, blog detail routes, article list routes,
  collection detail/artwork pages, collection artworks navigation,
  account/user loaders, shop loaders, or root layout data access.
- Do not change `ArticleView`, public article detail route paths, article
  navigation behavior, route URL/base URL policy, cache policy, root layout
  DB/session ownership, or global logging/redaction policy.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getArticleBySlugPopulated.ts`
- `src/app/api/v2/public/article/[slug]/route.ts`
- `src/components/loaders/viewLoaders/ArticleLoader.tsx`
- `__tests__/unit/data/getArticleBySlugPopulated.test.ts` or equivalent
- `__tests__/unit/api/publicContentDetailRoutes.test.ts`
- `__tests__/unit/loaders/ArticleLoader.test.tsx`
- `docs/tasks/T-074-migrate-article-detail-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `ArticleLoader` no longer imports `serverApi` or calls
  `serverApi.public.article.singlePopulated(slug)`.
- `ArticleLoader` uses the shared article detail service for article data and
  keeps using `getArticleNavigationList(section)` for previous/next links.
- The public article detail API route and `ArticleLoader` use the shared
  service for populated article detail data.
- The public article detail API route preserves its current optional session
  lookup, success envelope, `404` not-found response, and public-safe `500`
  response.
- The shared service owns `dbConnect()`, the article lookup, `author artwork`
  population, lean result typing, and `transformArticlePopulated`.
- `ArticleLoader` still passes the same `article`, `navigation`, and optional
  `form` props to `ArticleView`.
- Focused tests cover service success/not-found/failure behavior, route envelope
  preservation, loader no-self-fetch behavior, and preserved previous/next
  navigation behavior.

## Verification

Run:

```bash
rg -n "serverApi|serverPublicApi|singlePopulated|fetch\\(" src/components/loaders/viewLoaders/ArticleLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicContentDetailRoutes.test.ts __tests__/unit/data/getArticleBySlugPopulated.test.ts __tests__/unit/loaders/ArticleLoader.test.tsx
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
- Added `getArticleBySlugPopulated` as the shared server-only populated article
  detail service for MongoDB connection ownership, `slug` lookup, `author
  artwork` population, lean typing, and `transformArticlePopulated`.
- Refactored `GET /api/v2/public/article/[slug]` to preserve the optional
  session lookup before service work while keeping the success envelope,
  `404`, and public-safe `500` contracts.
- Refactored `ArticleLoader` to use the shared detail service directly while
  keeping `getArticleNavigationList(section)` for previous/next links and
  preserving optional `form` rendering.
- Keep blog loaders and blog detail service extraction separate.
- Keep article list routes, collection detail/artwork pages, collection artworks
  navigation, route URL/base URL policy, global logging/redaction policy, root
  layout DB/session ownership, and cache policy separate.
- Verification passed:
  `rg -n "serverApi|serverPublicApi|singlePopulated|fetch\\(" src/components/loaders/viewLoaders/ArticleLoader.tsx`
  returned no matches;
  `npm test -- --runTestsByPath __tests__/unit/api/publicContentDetailRoutes.test.ts __tests__/unit/data/getArticleBySlugPopulated.test.ts __tests__/unit/loaders/ArticleLoader.test.tsx`;
  `npm test`; `npm run lint`; `npm run build`; `git diff --check`.
  Full Jest retained existing expected `dateUtils` invalid-date console error
  output, and build retained existing MongoDB/static-generation,
  branch-verification, navigation link, and `ArticleView` debug noise.

## Escalate

Escalate to the orchestrator if:

- Preserving the public article detail route's current optional session lookup
  conflicts with sharing the detail service safely.
- `ArticleLoader` cannot be changed without altering `ArticleView` behavior or
  article navigation behavior.
- The fix requires touching unrelated loaders, route pages, or global
  server API/fetcher architecture.
