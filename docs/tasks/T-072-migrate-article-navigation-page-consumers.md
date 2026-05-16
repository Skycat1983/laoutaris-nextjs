# T-072 Migrate Article Navigation Page Consumers

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Finish the current article-navigation ADR 0004/F-021 cleanup by moving the
remaining article navigation page consumers off same-app HTTP and onto the
server-only `getArticleNavigationList` service created in T-071.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-071 added `src/lib/data/services/getArticleNavigationList.ts` and reused it
  from the public article navigation API route, `BiographySubnavLoader`, and
  `MainNavLoader`.
- `src/app/biography/page.tsx` still calls
  `serverApi.public.navigation.fetchArticleNavigationList("biography")` only to
  redirect to the first biography article.
- `src/components/loaders/viewLoaders/ArticleLoader.tsx` still calls
  `serverApi.public.navigation.fetchArticleNavigationList(section)` to build
  previous/next links.
- `ArticleLoader` also calls `serverApi.public.article.singlePopulated(slug)`
  for article detail data. That article-detail self-fetch is a separate future
  migration and should not be changed in this task.

## Scope

In scope:

- Refactor `src/app/biography/page.tsx` to call
  `getArticleNavigationList("biography")` directly for its default redirect.
- Refactor `src/components/loaders/viewLoaders/ArticleLoader.tsx` to call
  `getArticleNavigationList(section)` directly for previous/next article
  navigation.
- Preserve existing redirect behavior, error behavior, previous/next link
  calculation, article ordering, link path formats, and `ArticleView` props.
- Add or update focused tests for the biography default redirect and
  `ArticleLoader` navigation behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate `serverApi.public.article.singlePopulated(slug)` in
  `ArticleLoader`; article detail service extraction is separate.
- Do not migrate blog loaders, collection redirect pages, collection detail
  pages, account/user loaders, shop loaders, or root layout data access.
- Do not change `ArticleView`, article detail route behavior, route URL/base URL
  policy, cache policy, root layout DB/session ownership, or global
  logging/redaction policy.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/app/biography/page.tsx`
- `src/components/loaders/viewLoaders/ArticleLoader.tsx`
- `__tests__/unit/pages/BiographyPage.test.tsx` or equivalent
- `__tests__/unit/loaders/ArticleLoader.test.tsx` or equivalent
- `docs/tasks/T-072-migrate-article-navigation-page-consumers.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `src/app/biography/page.tsx` no longer imports `serverApi` or calls the
  article navigation HTTP fetcher.
- `ArticleLoader` no longer calls
  `serverApi.public.navigation.fetchArticleNavigationList(section)`.
- `ArticleLoader` may still use `serverApi.public.article.singlePopulated(slug)`
  for article detail data; that is explicitly out of scope.
- Both consumers use `getArticleNavigationList` for article navigation data.
- The biography default page still redirects to the first biography article
  using `buildUrl(["biography", firstSlug])`.
- `ArticleLoader` still computes previous and next links from the ordered
  navigation list and passes the same `article`, `navigation`, and optional
  `form` props to `ArticleView`.
- Focused tests cover success and no-results/error behavior for the redirect
  page and previous/next link behavior for `ArticleLoader`.

## Verification

Run:

```bash
rg -n "fetchArticleNavigationList|serverApi\\.public\\.navigation|serverPublicApi|fetch\\(" src/app/biography/page.tsx src/components/loaders/viewLoaders/ArticleLoader.tsx
npm test -- --runTestsByPath __tests__/unit/pages/BiographyPage.test.tsx __tests__/unit/loaders/ArticleLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same redirect and loader behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- `src/app/biography/page.tsx` now calls
  `getArticleNavigationList("biography")` directly and keeps the default
  redirect path as `buildUrl(["biography", firstSlug])`.
- `ArticleLoader` now calls `getArticleNavigationList(section)` for
  previous/next navigation while intentionally keeping
  `serverApi.public.article.singlePopulated(slug)` for article detail data.
- Added focused coverage in
  `__tests__/unit/pages/BiographyPage.test.tsx` and
  `__tests__/unit/loaders/ArticleLoader.test.tsx`.
- Verification passed:
  `rg -n "fetchArticleNavigationList|serverApi\\.public\\.navigation|serverPublicApi|fetch\\(" src/app/biography/page.tsx src/components/loaders/viewLoaders/ArticleLoader.tsx`
  returned no matches; `npm test -- --runTestsByPath
  __tests__/unit/pages/BiographyPage.test.tsx
  __tests__/unit/loaders/ArticleLoader.test.tsx`; `npm run lint`;
  `npm run build`; `git diff --check`.
- Build passed with existing MongoDB/static-generation, branch-verification, and
  navigation link debug output still present.
- Keep article detail service extraction separate.
- Keep collection redirect pages, blog loaders, route URL/base URL policy,
  global logging/redaction policy, root layout DB/session ownership, and cache
  policy separate.

## Escalate

Escalate to the orchestrator if:

- The existing biography default redirect behavior is ambiguous and needs a
  product decision.
- `ArticleLoader` navigation cannot be changed without altering article detail
  fetching or `ArticleView` behavior.
- The fix requires touching unrelated loaders, route pages, or global
  server API/fetcher architecture.
