# T-266 Bound Public Search Shopify Product Search

Status: Completed

Workstreams:

- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)
- [Shopify commerce](../workstreams/shopify-commerce.md)
- [Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the unbounded Shopify product-list fan-out from untyped public search
while preserving an explicit, truthful product-search experience.

## Context

- A-028 found all-type `/search` calls `getShopProductList()` for every query,
  which reads all linked artwork product IDs and fans out through Shopify product
  reads before filtering products in memory.
- T-210/T-211 widened public search to include artwork and Shopify products, so
  do not remove product discovery casually.
- The safer direction is to make product search bounded/query-aware and
  graceful when Shopify is slow or unavailable, or to keep products behind an
  explicit `type=shop-products` decision with UI copy.

## Scope

In scope:

- Inspect current public search service/API/page behavior and product-list data
  service.
- Implement a bounded/query-aware product search path or explicitly scope
  product results to `type=shop-products` with clear UI behavior.
- Ensure Shopify product read failures degrade without hiding MongoDB-backed
  article/blog/artwork/collection results.
- Add focused service/API/page tests for all-type search, product-type search,
  and Shopify failure/degradation behavior.

Out of scope:

- App-owned checkout/cart behavior.
- Shop listing filter/sort fixes.
- Broad search UI redesign beyond copy needed to make product scope truthful.
- Playwright/browser automation.

## Concurrency

This task can run in parallel with T-263, T-264, and T-265. Do not run it in
parallel with another task editing `getPublicSearchResults`, shop product-list
services, public search route/page tests, or search result rendering.

## Files Likely Touched

- `src/lib/data/services/getPublicSearchResults.ts`
- `src/lib/data/services/getShopProductList.ts` or a new focused product-search
  service
- `src/app/api/v2/public/search/route.ts`
- `src/app/search/page.tsx`
- `src/components/modules/search/SearchResultsSection.tsx`
- `__tests__/unit/data/getPublicSearchResults.test.ts`
- Focused search API/page tests if present
- `docs/tasks/T-266-bound-public-search-shopify-product-search.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation and focused
  tests are complete.
- Update this task brief and `docs/tasks/README.md`.
- List candidate findings/risk/workstream updates in handoff notes unless
  explicitly assigned to reconcile shared trackers.

## Acceptance Criteria

- Untyped public search no longer performs a full Shopify product-list fan-out
  for every query.
- Product search remains available through the chosen explicit or bounded path.
- MongoDB-backed search results still render when Shopify product lookup fails.
- Tests cover the selected product inclusion policy and degradation behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts <focused public search route/page tests>
git diff --check
```

If focused route/page tests do not exist, add or identify the focused test file
and record the exact command used.

Completed verification:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/api/publicSearchRoute.test.ts __tests__/unit/searchPage.test.tsx
git diff --check
```

Result: passed on 2026-05-25 with 3 suites and 27 tests; `git diff --check`
also passed.

## Handoff Notes

- Completed from A-028 high-priority public search/Shopify fan-out finding.
- Chosen policy: untyped `/search` now searches MongoDB-backed archive content
  only: articles, blogs, collections, and artworks. It does not call
  `getShopProductList()`, does not include shop-product metadata, and the page
  links users to explicit `type=shop-products` product search instead.
- Explicit `type=shop-products` search remains available through the existing
  public shop product-list data path. If that product lookup throws, the public
  search service logs a structured unavailable event and returns an empty
  product result with `metadata.unavailableTypes: ["shop-products"]` so the page
  can show unavailable copy instead of a public-safe 500.
- Focused service, API, and page tests now cover the selected explicit product
  policy, product-type search, and product-lookup degradation behavior.
- Candidate shared-tracker updates for the orchestrator: record in the frontend,
  Shopify commerce, and testing workstreams that T-266 completed the A-028
  public-search fan-out mitigation by making shop-product search explicit-only.
