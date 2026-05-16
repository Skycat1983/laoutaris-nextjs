# T-073 Migrate Collection Redirect Pages Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move the collection redirect pages off same-app HTTP by reusing server-only
collection navigation data services for `/collections` and `/collections/[slug]`.

## Outcome

- Added `src/lib/data/services/getCollectionNavigationItem.ts` as the shared
  server-only collection navigation item service.
- `src/app/collections/page.tsx` now calls `getCollectionNavigationList()`
  directly for its default redirect.
- `src/app/collections/[slug]/page.tsx` now calls
  `getCollectionNavigationItem(params.slug)` directly and no longer emits the
  direct slug debug `console.log`.
- `GET /api/v2/public/navigation/collections/[slug]` now adapts the shared
  item service into the existing success envelope, `404`, and public-safe
  `500` behavior.
- Added focused service, route, and redirect-page tests, plus full Jest
  verification.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-070 added `src/lib/data/services/getCollectionNavigationList.ts` and reused
  it from the collection navigation API route and `CollectionsSubnavLoader`.
- `src/app/collections/page.tsx` still calls
  `serverApi.public.navigation.fetchCollectionNavigationList()` only to redirect
  to the first collection's first artwork.
- `src/app/collections/[slug]/page.tsx` still calls
  `serverApi.public.navigation.fetchCollectionNavigationItem(params.slug)` only
  to redirect to the selected collection's first artwork, and it still contains
  a direct debug `console.log`.
- `src/app/api/v2/public/navigation/collections/[slug]/route.ts` already owns
  the MongoDB query, transform, and response contract for the single collection
  navigation item.

## Scope

In scope:

- Refactor `src/app/collections/page.tsx` to call
  `getCollectionNavigationList()` directly for its default redirect.
- Add a server-only data service for a single collection navigation item, for
  example `src/lib/data/services/getCollectionNavigationItem.ts`.
- Move the existing collection navigation item route query/transform behavior
  into the shared service: connect to MongoDB, find one collection with
  `section: "collections"` and the requested `slug`, select `title slug
  artworks`, transform through `transformCollectionNav.toFrontend`, and
  preserve the not-found semantics required by the current API route.
- Refactor `GET /api/v2/public/navigation/collections/[slug]` to call the
  shared item service while preserving its existing success envelope, `404`,
  and public-safe `500` behavior.
- Refactor `src/app/collections/[slug]/page.tsx` to call the new item service
  directly and remove the direct debug `console.log`.
- Preserve redirect path construction, error behavior, collection ordering,
  selected fields, transform output, and route response contracts.
- Add or update focused tests for the list redirect page, slug redirect page,
  item service, and item route behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate collection detail/artwork pages or
  `fetchCollectionArtworksNavigation`.
- Do not migrate blog loaders, article detail fetching, account/user loaders,
  shop loaders, or root layout data access.
- Do not change collection route paths, redirect target formats, collection
  ordering, `CollectionView`, route URL/base URL policy, cache policy, root
  layout DB/session ownership, or global logging/redaction policy.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getCollectionNavigationItem.ts`
- `src/app/api/v2/public/navigation/collections/[slug]/route.ts`
- `src/app/collections/page.tsx`
- `src/app/collections/[slug]/page.tsx`
- `__tests__/unit/data/getCollectionNavigationItem.test.ts` or equivalent
- `__tests__/unit/api/publicNavigationRoutes.test.ts`
- `__tests__/unit/pages/CollectionsPage.test.tsx` or equivalent
- `__tests__/unit/pages/CollectionSlugPage.test.tsx` or equivalent
- `docs/tasks/T-073-migrate-collection-redirect-pages-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `src/app/collections/page.tsx` no longer imports `serverApi` or calls
  `fetchCollectionNavigationList`.
- `src/app/collections/[slug]/page.tsx` no longer imports `serverApi`, calls
  `fetchCollectionNavigationItem`, or emits direct debug `console.log` output.
- The collection navigation item API route and slug redirect page both use the
  new shared item service.
- The collection index redirect page uses `getCollectionNavigationList()`.
- `/collections` still redirects to
  `buildUrl(["collections", firstCollection.slug, firstCollection.firstArtworkId ?? ""])`.
- `/collections/[slug]` still redirects to
  `buildUrl(["collections", collection.slug, collection.firstArtworkId || ""])`.
- The API route preserves its existing response helper envelope, `404`
  not-found behavior, and public-safe `500` behavior.
- Focused tests cover service success/not-found/failure behavior, route envelope
  preservation, redirect behavior, and no-self-fetch behavior for both pages.

## Verification

Run:

```bash
rg -n "serverApi\\.public\\.navigation|serverPublicApi|fetchCollectionNavigationList|fetchCollectionNavigationItem|fetch\\(|console\\.log" src/app/collections/page.tsx 'src/app/collections/[slug]/page.tsx'
npm test -- --runTestsByPath __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/data/getCollectionNavigationItem.test.ts __tests__/unit/pages/CollectionsPage.test.tsx __tests__/unit/pages/CollectionSlugPage.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same service, route, and redirect-page behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- Verification passed:
  `rg -n "serverApi\\.public\\.navigation|serverPublicApi|fetchCollectionNavigationList|fetchCollectionNavigationItem|fetch\\(|console\\.log" src/app/collections/page.tsx 'src/app/collections/[slug]/page.tsx'`
  returned no matches; focused Jest for public navigation route,
  `getCollectionNavigationItem`, `CollectionsPage`, and `CollectionSlugPage`
  passed; full `npm test` passed with 69 suites and 570 tests; `npm run lint`
  passed; `npm run build` passed; `git diff --check` passed.
- Build retained existing unrelated build-time MongoDB/static-generation,
  branch-verification, and navigation link console noise.
- Keep collection artworks navigation and collection detail/artwork pages
  separate.
- Keep blog loaders, article detail service extraction, route URL/base URL
  policy, global logging/redaction policy, root layout DB/session ownership,
  and cache policy separate.

## Escalate

Escalate to the orchestrator if:

- The existing collection default redirect behavior is ambiguous and needs a
  product decision.
- The slug redirect cannot be changed without altering collection detail or
  collection artwork navigation behavior.
- The fix requires touching unrelated loaders, route pages, or global
  server API/fetcher architecture.
