# T-079 Migrate Biography Section Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `BiographySectionLoader` off same-app HTTP by sharing server-only article
list service logic with `GET /api/v2/public/article`.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-071 moved biography navigation loaders to `getArticleNavigationList`.
- T-072 moved the biography default page and `ArticleLoader` navigation path to
  `getArticleNavigationList`.
- `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx` still
  calls `serverPublicApi.article.multiple({ section: "biography" })`.
- `GET /api/v2/public/article` currently owns the article list query,
  optional `section` filter, optional field selection, pagination, transform,
  metadata, no-results response body, and public-safe `500` body.
- `GET /api/v2/public/article` still emits direct request/DB debug
  `console.log` output and stack logging in the touched path.

## Scope

In scope:

- Add a shared server-only article list service, for example
  `src/lib/data/services/getArticleList.ts`, or an equivalent strongly typed
  service shape.
- Move the existing public article list query/transform behavior into the
  service: connect to MongoDB, apply optional `section`, optional selected
  fields, page/limit defaults, transform with `transformArticle.toFrontend`,
  and return articles plus pagination metadata.
- Refactor `GET /api/v2/public/article` to call the shared service while
  preserving the current success envelope, metadata shape, no-results response
  body, and public-safe `500` body.
- Refactor `BiographySectionLoader` to call the shared service directly for
  biography articles.
- Preserve `BiographySection` props and the loader's current `null` fallback
  for non-Next loading failures.
- Remove direct same-app HTTP imports and calls from `BiographySectionLoader`.
- Remove touched direct article list debug `console.log` output without
  creating a global logging/redaction policy.
- Add or update focused tests for the service, API route, and
  `BiographySectionLoader` no-self-fetch behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate `CollectionSectionLoader`, collection routes, article detail
  routes, article navigation services, account/user loaders, shop loaders,
  route URL/base URL policy, cache policy, root layout DB/session ownership, or
  global logging/redaction policy.
- Do not change article list query validation, empty-list status semantics,
  `BiographySection`, article transforms, or visible biography section layout.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getArticleList.ts` or equivalent
- `src/app/api/v2/public/article/route.ts`
- `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx`
- `__tests__/unit/data/getArticleList.test.ts` or equivalent
- `__tests__/unit/api/publicArticleListRoute.test.ts` or equivalent
- `__tests__/unit/loaders/BiographySectionLoader.test.tsx` or equivalent
- `docs/tasks/T-079-migrate-biography-section-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `BiographySectionLoader` no longer imports `serverPublicApi`, `serverApi`, or
  fetcher-backed article list methods.
- `BiographySectionLoader` no longer calls `serverPublicApi.article.multiple`,
  `fetch`, or another same-app HTTP wrapper.
- `GET /api/v2/public/article` and `BiographySectionLoader` share the same
  server-only article list service for article list reads.
- The public article list API route preserves its success envelope and metadata
  shape for valid list requests.
- The public article list API route preserves its current no-results response
  body and public-safe `500` body.
- `BiographySectionLoader` still renders `BiographySection` with biography
  articles and still returns `null` for non-Next loading failures.
- The touched article list route/loader paths no longer contain direct
  `console.log` debug output.
- Focused tests cover service success/no-results/failure behavior, route
  envelope preservation, loader no-self-fetch behavior, biography section
  filter behavior, and source hygiene for touched debug logs.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|\\.multiple\\(|fetch\\(|console\\.log" src/components/loaders/sectionLoaders/BiographySectionLoader.tsx src/app/api/v2/public/article/route.ts
npm test -- --runTestsByPath __tests__/unit/api/publicArticleListRoute.test.ts __tests__/unit/data/getArticleList.test.ts __tests__/unit/loaders/BiographySectionLoader.test.tsx
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
- Added `getArticleList` as the shared server-only article list service for
  public article list reads.
- `GET /api/v2/public/article` now adapts `getArticleList` into the existing
  success envelope, no-results body, and public-safe `500` body.
- `BiographySectionLoader` now calls `getArticleList({ section: "biography" })`
  directly, no longer imports `serverPublicApi`, and preserves the `null`
  fallback for non-Next failures.
- Added focused service/API/loader tests:
  `__tests__/unit/data/getArticleList.test.ts`,
  `__tests__/unit/api/publicArticleListRoute.test.ts`, and
  `__tests__/unit/loaders/BiographySectionLoader.test.tsx`.
- Verification passed:
  `rg -n "serverPublicApi|serverApi|\\.multiple\\(|fetch\\(|console\\.log" src/components/loaders/sectionLoaders/BiographySectionLoader.tsx src/app/api/v2/public/article/route.ts`
  returned no matches, and
  `npm test -- --runTestsByPath __tests__/unit/api/publicArticleListRoute.test.ts __tests__/unit/data/getArticleList.test.ts __tests__/unit/loaders/BiographySectionLoader.test.tsx`
  passed. `npm run lint`, `npm run build`, and `git diff --check` also passed;
  build retained the existing MongoDB/static-generation, branch-verification,
  navigation link, and `ArticleView` debug noise.
- Keep `CollectionSectionLoader`, article detail routes, article navigation
  services, account/user loaders, shop loaders, route URL/base URL policy, root
  layout ownership, cache policy, and global logging/redaction policy separate.

## Escalate

Escalate to the orchestrator if:

- Sharing article list behavior requires changing current route response
  contracts or visible biography section behavior.
- The route's current query parsing needs broader validation/status cleanup
  beyond preserving existing `section`, `fields`, `page`, and `limit`
  behavior.
- The fix requires touching unrelated article detail/navigation routes,
  collection routes, or global server API/fetcher architecture.
