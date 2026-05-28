# T-327 Public/User API Route Builder Scope

Status: Completed
Date: 2026-05-28

Task:
[T-327 scope public and user API route builders](../../tasks/T-327-scope-public-user-api-route-builders.md)

Workstreams:
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
[Data models and API](../../workstreams/data-models-and-api.md),
[Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Inventory hard-coded public and protected user API client fetcher paths, compare
the remaining route-builder families, and recommend one small implementation
slice. Runtime source, tests, route handlers, physical App Router files,
request-context route IDs, release fixtures, auth callbacks, saved-item
revalidation, smoke checks, and Shopify dashboard behavior were not changed.

## Commands Run

- `sed -n` reads for `AGENTS.md`, `docs/README.md`, the T-327 task brief, linked
  workstream briefs, and T-321 result context.
- Targeted reads of `src/lib/api/public/*/fetchers.ts`,
  `src/lib/api/user/*/fetchers.ts`, `src/lib/api/public/clientPublicApi.ts`,
  `src/lib/api/user/clientUserApi.ts`, `src/lib/routes/*`,
  `src/lib/api/admin/*/paths.ts`, and focused route/fetcher tests.
- `rg` searches for current `/api/v2` fetcher calls, route-builder references,
  and existing route-builder/fetcher coverage.
- `git status --short`
- `git diff --check` (passed)

## Current Fetcher URL Ownership

| Family | Current source | Operations | Current path behavior | Existing focused coverage |
| --- | --- | --- | --- | --- |
| Public article content | `src/lib/api/public/article/fetchers.ts` | `single`, `multiple`, `singlePopulated` | Builds `/api/v2/public/article/[slug]` with encoded slugs and `/api/v2/public/article?section&fields&limit&page`. | Route/fetcher parity plus public article route tests. No dedicated article fetcher path-builder test. |
| Public artwork content | `src/lib/api/public/artwork/fetchers.ts` | `single`, `multiple` | Builds `/api/v2/public/artwork/[id]` and `/api/v2/public/artwork?sortBy&sortColor&filterMode&decade&artstyle&medium&surface&limit&page`. Single artwork currently interpolates `id` directly. | `publicArtworkFetchers.test.ts` covers list query construction; route/fetcher parity covers backed paths. |
| Public blog content | `src/lib/api/public/blog/fetchers.ts` | `single`, `multiple`, `singlePopulated` | Builds `/api/v2/public/blog/[slug]/`, `/api/v2/public/blog?sortby&limit&page`, and `/api/v2/public/blog/[slug]/comments`. The single-blog fetcher currently includes a trailing slash. | Route/fetcher parity plus public blog route tests. No dedicated blog fetcher path-builder test. |
| Public collection content | `src/lib/api/public/collection/fetchers.ts` | `single`, `multiple`, `singleCollectionAllArtwork`, `singleCollectionSingleArtwork` | Builds collection detail/list/artwork paths under `/api/v2/public/collection`, with encoded slugs and artwork IDs plus section/limit/page query params. | Route/fetcher parity plus collection route tests. No dedicated collection fetcher path-builder test. |
| Public navigation | `src/lib/api/public/navigation/fetchers.ts` | `fetchArticleNavigationList`, `fetchCollectionNavigationList`, `fetchCollectionNavigationItem`, `fetchCollectionArtworksNavigation` | Builds GET-only paths under `/api/v2/public/navigation/articles/[section]` and `/api/v2/public/navigation/collections...`, with encoded section/slug values and no query string or body. | Route/fetcher parity plus public navigation route tests. No dedicated navigation fetcher path-builder test. |
| Public search | `src/lib/api/public/search/fetchers.ts` | `search` | Builds `/api/v2/public/search?q&type&page&limit` from `SearchParams`, always appending `q`, `page`, and `limit`. | Public search route/page tests and route/fetcher parity. No dedicated search fetcher path-builder test. |
| Public shop product by ID | `src/lib/api/public/shop/fetchers.ts` | `productById` | Trims the product ID, encodes it, and builds `/api/v2/public/shop/products/[productId]`. | `publicShopFetchers.test.ts`, Shopify product route tests, route/fetcher parity. |
| Public enquiry | `src/lib/api/public/enquiry/fetchers.ts` | `create` | Posts JSON to `/api/v2/public/enquiry`. | Public enquiry route tests and route/fetcher parity. No dedicated enquiry fetcher path-builder test. |
| User navigation | `src/lib/api/user/navigation/fetchers.ts` | `fetchUserNavigation` | Builds `/api/v2/user/navigation`. | User saved-route tests cover the route; route/fetcher parity covers the fetcher. |
| User profile | `src/lib/api/user/profile/fetchers.ts` | `get` | Builds `/api/v2/user/profile`. | User profile route tests and route/fetcher parity. |
| User comments | `src/lib/api/user/comments/fetchers.ts` | `getUserComments`, `createComment`, `updateComment`, `deleteComment` | Builds `/api/v2/user/comment` and `/api/v2/user/comment/[commentId]`, with encoded comment IDs and POST/PATCH/DELETE request options. | User comment route tests and route/fetcher parity. No dedicated comment fetcher path-builder test. |
| User favourites | `src/lib/api/user/favorites/fetchers.ts` | `getList`, `getOne` | Builds `/api/v2/user/favourite` and `/api/v2/user/favourite/[artworkId]`, with encoded artwork IDs and explicit GET options. | User saved-route tests and route/fetcher parity. |
| User watchlist | `src/lib/api/user/watchlist/fetchers.ts` | `getList`, `getOne` | Builds `/api/v2/user/watchlist` and `/api/v2/user/watchlist/[artworkId]`, with encoded artwork IDs. | User saved-route tests and route/fetcher parity. |

The client wrappers in `clientPublicApi.ts` and `clientUserApi.ts` only compose
fetcher factories with `createFetcher({ getUrl: (path) => path })`. They should
not own route paths directly.

## Unsafe Surfaces To Keep Explicit

- Keep physical route files under `src/app/api/v2/**/route.ts` unchanged. The
  next slice should only build client fetcher URLs.
- Keep request-context route IDs such as `/api/v2/public/navigation/articles/[section]`
  inside route handlers and tests explicit. They are logging/contract labels,
  not client value builders.
- Keep `routeFetcherParity.test.ts`'s manifest paths explicit so it continues
  to compare fetcher expectations against physical routes instead of mirroring
  helper output.
- Keep public smoke, sitemap, robots, auth callback redirects, saved-item
  revalidation, middleware, session/auth policy, Shopify dashboard data, and
  production smoke values out of this route-builder wave.
- Do not use `publicAppRoutes` or `accountRoutes` for API endpoints. App route
  builders and API route builders are separate ownership layers.
- Do not broaden this into query validation, response-helper standardization,
  DB ownership, route status changes, cache policy, or direct server-data
  service work.

## Candidate Family Comparison

### Public Content Fetchers

Article, artwork, blog, and collection fetchers are route-backed and useful, but
they are too broad for the next safest slice. They mix detail paths, list query
builders, repeated filters, field selections, color sorting, and existing
edge-case behavior such as the blog single trailing slash and artwork single
direct ID interpolation. Centralizing this family is implementation-ready only
after a smaller public API path-builder pattern is established.

### Public Navigation Fetchers

Public navigation is the safest next slice. It is cohesive, GET-only, has four
paths, uses only encoded section/slug segments, has no request body, no mutation,
no auth state, no commerce behavior, and no query-string ordering contract. It
already has route-level coverage and route/fetcher parity; the missing piece is
focused fetcher/path-builder coverage.

### Public Search/Shop/Enquiry Fetchers

This group is not one coherent path family. Search is query-heavy and tied to
query parsing/bounds contracts; shop product lookup includes product-ID
normalization and Shopify availability behavior; enquiry is a POST body flow.
Each can get a later narrow slice, but grouping them would mix unrelated
behavior.

### User Fetchers

Protected user fetchers are route-backed, but the family mixes read-only profile
and navigation calls, saved-artwork reads, and comment create/update/delete
mutations. A future user slice should likely start with read-only saved-artwork
paths or profile/navigation paths. It is less safe than public navigation
because protected API auth behavior and mutation fetcher options sit adjacent in
the same user API surface.

## Recommended Next Implementation Task

Implement a source-only public navigation API path-builder slice:

1. Add `src/lib/api/public/navigation/paths.ts`.
2. Export value-only builders:
   - `publicArticleNavigationPath(section: ArticleSection)`
   - `publicCollectionNavigationListPath()`
   - `publicCollectionNavigationItemPath(slug: string)`
   - `publicCollectionArtworksNavigationPath(slug: string)`
3. Encode dynamic path segments with `encodeURIComponent()` and preserve exact
   current output strings.
4. Update only `src/lib/api/public/navigation/fetchers.ts` to call those
   builders.
5. Add `__tests__/unit/api/publicNavigationFetchers.test.ts` covering every
   builder and fetcher call, including encoded section/slug values.
6. Keep `routeFetcherParity.test.ts` explicit and unchanged unless the fetcher
   call count changes unexpectedly, which it should not.

Focused verification for that implementation task:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicNavigationFetchers.test.ts __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Expected app impact: none. Public navigation fetchers should call the same four
API endpoints with the same encoded values and response handling. The change
only moves client URL construction into a small client-safe helper module.

## Explicitly Deferred

- Public article/artwork/blog/collection content API path builders.
- Public search query path builders.
- Public shop product and enquiry path builders.
- Protected user navigation/profile/comment/favourite/watchlist API path
  builders.
- Admin API route builders already completed or scoped in earlier tasks.
- Route handler IDs, physical App Router files, route/fetcher parity inventory
  semantics, auth callbacks, saved-item revalidation, smoke/sitemap/robots, and
  production checks.

## Candidate Shared Tracker Updates

For orchestrator reconciliation only; this task did not edit shared trackers.

- Architecture workstream: note that T-327 scoped the next public/user API
  route-builder source slice to public navigation client fetcher URLs.
- Data/API workstream: keep broader public content, public search/shop/enquiry,
  and protected user API path builders as future separate route-builder slices.
- Testing workstream: add the future `publicNavigationFetchers.test.ts` focused
  coverage to the route-builder/fetcher verification surface after
  implementation.
