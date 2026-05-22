# T-211 Add Shopify Product Results To Public Search

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Expand public `/search` to include Shopify product results as the second staged
site-wide search slice, after T-210 added MongoDB-backed artwork results.

## Context

- A-017/F-098 found the global public search entry point excluded artworks and
  Shopify products even though both are core discovery surfaces.
- T-210 added MongoDB-backed artwork results and deliberately left Shopify
  product search out of scope.
- Shopify remains the commerce source of truth. Product search must use the
  public Shopify-backed product DTOs already exposed through
  `getShopProductList`, not MongoDB artwork fields as a substitute for product
  title, handle, availability, image, price, or type.
- The current public shop listing path already fetches linked Shopify products
  from artwork `shopifyProducts` references, normalizes numeric IDs, skips
  malformed stored IDs, deduplicates products, and tolerates individual
  Shopify fan-out failures.
- Search result copy must stay discovery-focused. Do not add payment, shipping,
  refund, guarantee, buyer-protection, checkout, cart, or purchase claims.

## Scope

In scope:

- Add a valid Shopify product search type, using `shop-products` as the public
  query value unless implementation evidence shows a safer existing convention.
- Extend public search schema, result types, service metadata, API validation,
  and page type labels for Shopify product results.
- Reuse `getShopProductList()` for product source data rather than adding a new
  Shopify query, search provider, or direct Storefront fan-out path.
- Search returned public product DTOs by conservative public fields such as
  `title`, `handle`, `description`, `productType`, `tags`, and `vendor`.
- Map product results into `SearchResultItem` with:
  - `title`,
  - `linkTo` under `/shop/products/[productHandle]`,
  - `imageUrl` from the public product image URL when present,
  - neutral subtitle/summary text based on public product metadata only.
- Render a Shop Products section and selected-type pagination on `/search`
  using existing `SearchResultsSection` and `SearchPagination` patterns.
- Update all-types empty-state copy and unsupported-type validation copy so the
  supported type set is accurate.
- Add focused service, API, and page/component coverage for all-type product
  results, selected `type=shop-products`, unsupported type validation, and
  no-results states.
- Update this task brief and linked workstreams after completion.

Out of scope:

- Do not add an app-owned cart, checkout, variant selection UI, line-item
  construction, payment, shipping, refund, fulfilment, or purchase policy flow.
- Do not change product detail purchase handoff, enquiry behavior, or hosted
  Shopify purchase links.
- Do not add a new Shopify Storefront query, Shopify Admin API call, external
  search provider, indexing service, autocomplete, or fuzzy ranking.
- Do not change `/shop/products` filters, client-side sorting, pagination, or
  product card layout.
- Do not use `descriptionHtml` in search result rendering.
- Do not include hidden or unsupported commerce claims in search copy.
- Do not change T-210 artwork result behavior except as needed to share the
  widened search type list.

## Concurrency

Run this task alone with other work touching public search schema, search
service, search page rendering, Shopify product list service contracts, or
public search tests.

Owned files:

- `src/lib/data/schemas/searchSchema.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `src/app/api/v2/public/search/route.ts`
- `src/app/search/page.tsx`
- focused public search tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/data/schemas/searchSchema.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `src/app/search/page.tsx`
- `__tests__/unit/data/getPublicSearchResults.test.ts`
- `__tests__/unit/api/publicSearchRoute.test.ts`
- `__tests__/unit/searchPage.test.tsx`
- `docs/tasks/T-211-add-shopify-product-results-to-public-search.md`

## Acceptance Criteria

- `/api/v2/public/search?q=...` searches shop products along with articles,
  blogs, collections, and artworks by default.
- `/api/v2/public/search?q=...&type=shop-products` is valid and returns only
  product results plus product metadata.
- Unsupported search type validation mentions the complete supported type set.
- `/search?q=...` can render a Shop Products section with links to product
  detail pages.
- Selected `type=shop-products` pages render product results, no-results copy,
  and pagination consistently with existing selected-type behavior.
- Product search uses existing public product DTOs and does not call Shopify
  outside the existing public shop product-list service path.
- Existing article, blog, collection, and artwork search behavior remains
  covered.
- Search result copy does not imply checkout/cart ownership, purchase
  completion, payment, shipping, refunds, guarantees, or buyer protection.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/api/publicSearchRoute.test.ts __tests__/unit/searchPage.test.tsx
npm run lint
./node_modules/.bin/tsc --noEmit --pretty false --skipLibCheck
git diff --check
```

Add any focused page/component test paths touched by the implementation before
handoff.

## Agent Prompt

You are working on T-211. Read `AGENTS.md`, `docs/README.md`, F-098 in
`docs/audits/findings-register.md`, R-016 in
`docs/risks/production-readiness.md`, T-143 for staged public-search direction,
T-210 for the completed artwork search slice, and the Shopify/frontend/data/
testing workstreams. Add Shopify product results to public search using the
existing `getShopProductList()` public product data path. Do not add checkout,
cart, variant selection, new Shopify queries, product detail behavior changes,
shop listing filter/sort/pagination changes, external search providers, or
commerce policy claims. Preserve existing article/blog/collection/artwork
search behavior and run the verification commands, then update this handoff
with what changed and list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-210 completed.
- This is the next staged F-098/R-016 search widening slice. It addresses the
  commerce discovery side of site-wide search while keeping checkout/cart and
  legal policy work separate.
- Completed on 2026-05-22. Public search now accepts `type=shop-products`,
  includes Shopify product results in all-type searches, maps product links to
  `/shop/products/[productHandle]`, and renders a Shop Products section on the
  `/search` page.
- `getPublicSearchResults` reuses `getShopProductList()` as the product source
  path, filters returned public product DTOs by `title`, `handle`,
  `description`, `productType`, `tags`, and `vendor`, and paginates the matched
  product set with the existing per-type metadata contract.
- Product result copy stays discovery-focused: title, image, product type,
  vendor, and tags only. Product descriptions are searchable but are not
  rendered as search-result summary copy. No checkout, cart, payment, shipping,
  refund, guarantee, buyer-protection, variant-selection, or purchase
  completion claims were added.
- Focused coverage was added for all-type product service results, selected
  `type=shop-products` service/API/page behavior, unsupported type validation
  copy, all-type Shop Products rendering, and selected product no-results
  states while preserving article, blog, collection, and artwork coverage.
- Verification run before handoff:
  `npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/api/publicSearchRoute.test.ts __tests__/unit/searchPage.test.tsx`
  passed with 3 suites and 24 tests; `npm run lint` passed with no ESLint
  warnings or errors; `./node_modules/.bin/tsc --noEmit --pretty false --skipLibCheck`
  passed; `git diff --check` passed.
- Candidate shared-tracker updates: F-098 can move to resolved for the public
  search scope gap because articles, blogs, collections, artworks, and Shopify
  products are now included; R-016 should record T-211 as completed and remove
  Shopify product search from the remaining discovery gaps while keeping
  unrelated language/i18n launch direction, collection section launch policy,
  and footer/legal cleanup tracked separately.
