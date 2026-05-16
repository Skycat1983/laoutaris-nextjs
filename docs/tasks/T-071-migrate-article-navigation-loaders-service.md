# T-071 Migrate Article Navigation Loaders Service

Status: Ready

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Complete the next focused ADR 0004/F-021 slice by moving article navigation
server loaders off same-app HTTP and onto a shared server-only article
navigation data service used by both the loaders and the public article
navigation API route.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-007, T-018, T-021, and T-070 proved the pattern for artwork detail, artwork
  list, public search, and collection navigation reads.
- `src/components/loaders/componentLoaders/BiographySubnavLoader.tsx` currently
  calls `serverApi.public.navigation.fetchArticleNavigationList("biography")`.
- `src/components/loaders/componentLoaders/MainNavLoader.tsx` currently calls
  `serverApi.public.navigation.fetchArticleNavigationList("biography")` and
  `serverApi.public.navigation.fetchCollectionNavigationList()`.
- `src/app/api/v2/public/navigation/articles/[section]/route.ts` already owns
  the MongoDB query, transform, and response contract for article navigation.
- `src/lib/data/services/getCollectionNavigationList.ts` exists from T-070 and
  should be reused for collection navigation in `MainNavLoader` rather than
  reintroducing a collection same-app HTTP call.

## Scope

In scope:

- Add a server-only data service for article navigation lists, for example
  `src/lib/data/services/getArticleNavigationList.ts`.
- Move the existing article navigation route query/transform behavior into the
  shared service: connect to MongoDB, find articles by `section`, select
  `title slug`, sort by `displayDate: -1`, transform through
  `transformBiographyNav.toFrontend`, and preserve no-results semantics
  required by the current API route.
- Refactor `GET /api/v2/public/navigation/articles/[section]` to call the
  shared service while preserving its existing success envelope, metadata,
  `404`, and public-safe `500` behavior.
- Refactor `BiographySubnavLoader` to call the shared service directly and
  build the same `Subnav` links without importing `serverApi` or making a
  same-app HTTP request.
- Refactor `MainNavLoader` to call the new article navigation service and the
  existing `getCollectionNavigationList` service directly, preserving the same
  main navigation link labels and paths.
- Add or update focused tests for the service, route, and loader behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate blog loaders, article detail loaders, collection detail pages,
  collection index pages, account/user loaders, shop loaders, or root layout
  data access.
- Do not change the `Subnav` or `MainNav` UI, link labels, link path formats,
  article ordering, selected fields, transform output, route path, route
  response envelope, or error copy unless required to preserve the existing
  contract.
- Do not change broader base URL policy, server API helper design, global
  logging/redaction policy, root layout DB/session ownership, or cache policy.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getArticleNavigationList.ts`
- `src/app/api/v2/public/navigation/articles/[section]/route.ts`
- `src/components/loaders/componentLoaders/BiographySubnavLoader.tsx`
- `src/components/loaders/componentLoaders/MainNavLoader.tsx`
- `__tests__/unit/data/getArticleNavigationList.test.ts` or equivalent
- `__tests__/unit/api/publicNavigationRoutes.test.ts`
- `__tests__/unit/loaders/BiographySubnavLoader.test.tsx` or equivalent
- `__tests__/unit/loaders/MainNavLoader.test.tsx` or equivalent
- `docs/tasks/T-071-migrate-article-navigation-loaders-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `BiographySubnavLoader` and `MainNavLoader` no longer import `serverApi`,
  `serverPublicApi`, or same-app HTTP fetchers.
- The new shared service owns the article navigation MongoDB query,
  `dbConnect()`, selection, ordering, and transform.
- The public article navigation API route, `BiographySubnavLoader`, and
  `MainNavLoader` use the shared service.
- `MainNavLoader` uses the existing collection navigation service for the
  collection link instead of `serverApi.public.navigation`.
- The API route preserves its existing response helper envelope, metadata,
  `404` no-results behavior, and public-safe `500` behavior.
- The loaders still render the same `Subnav` and `MainNav` link data from the
  first biography article and first collection navigation item.
- Focused tests cover service success/no-results/failure behavior, route
  envelope preservation, and loader no-self-fetch behavior.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|fetch\\(" src/components/loaders/componentLoaders/BiographySubnavLoader.tsx src/components/loaders/componentLoaders/MainNavLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/data/getArticleNavigationList.test.ts __tests__/unit/loaders/BiographySubnavLoader.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same service, route, and loader behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Keep other same-app HTTP migrations separate.
- Keep route URL/base URL policy, global logging/redaction policy, root layout
  DB/session ownership, and cache policy separate.

## Escalate

Escalate to the orchestrator if:

- The current loader behavior depends on API-envelope semantics that do not map
  cleanly to a shared service without changing route or UI contracts.
- The existing route no-results behavior is ambiguous and requires a product
  decision.
- The fix requires touching unrelated loaders, route pages, or global
  server API/fetcher architecture.
