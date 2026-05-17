# T-085 Migrate Shop Products Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Shopify commerce](../workstreams/shopify-commerce.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `ShopProductsLoader` off same-app HTTP by sharing server-only shop product
listing service logic with `GET /api/v2/public/shop/products`.

## Context

- [ADR 0004](../decisions/0004-server-data-access-ownership.md) chooses direct
  server-only data services over server-side same-app HTTP.
- T-081, T-083, and T-084 completed the account read-loader migrations.
- The current source scan shows `ShopProductsLoader` still builds an absolute
  same-app URL from `NEXT_PUBLIC_BASE_URL || "http://localhost:3000"` and calls
  `fetch()` for initial shop product rendering.
- `GET /api/v2/public/shop/products` already owns route query validation,
  MongoDB artwork filtering, malformed stored product ID skipping, product ID
  deduplication, Shopify product fan-out, success metadata, validation `400`s,
  and public-safe `500`s.

## Scope

In scope:

- Add a shared server-only shop product listing service that owns the post-parse
  MongoDB and Shopify read behavior currently inside the public shop products
  route.
- Reuse that service from `GET /api/v2/public/shop/products` after route query
  parsing succeeds.
- Update `ShopProductsLoader` to convert `initialFilters` into the shared
  service input and call the service directly instead of constructing a
  same-app URL and using `fetch()`.
- Preserve valid filter behavior for `artstyle`, `medium`, `surface`,
  `decade`, `showOriginals`, `showPrints`, and `showBooks`.
- Preserve malformed stored product ID skipping, product ID deduplication,
  Shopify fetch failure handling, success `data`, and `metadata.totalArtworks`
  / `metadata.totalProducts` semantics.
- Preserve current `ShopProductGallery` props and the loader's neutral
  load-failure UI.
- Add focused service, route-adapter, and loader tests proving the loader no
  longer depends on `NEXT_PUBLIC_BASE_URL`, `localhost`, or same-app `fetch()`.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not implement real public shop pagination or server-side sorting.
- Do not change checkout/cart, variant selection, product-detail UI, or rich
  description rendering.
- Do not add Shopify API validation beyond the existing product fetch fan-out.
- Do not change admin Shopify product-linking workflow or product-link data.
- Do not change global route URL/base URL policy, `serverApi` helper files,
  hard-coded auth redirect URLs, or `src/app/project/page.tsx`.
- Do not change public filter UI controls beyond what is necessary to preserve
  existing valid loader inputs.

## Files Likely Touched

- `src/lib/data/services/` shop products service file(s)
- `src/app/api/v2/public/shop/products/route.ts`
- `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
- `__tests__/unit/data/` focused shop products service tests
- `__tests__/unit/api/shopProductsRoute.test.ts`
- `__tests__/unit/loaders/ShopProductsLoader.test.tsx`
- `docs/orchestration/state.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- `ShopProductsLoader` no longer reads `NEXT_PUBLIC_BASE_URL`, falls back to
  `http://localhost:3000`, or calls `fetch()` for initial shop products.
- The public shop products route preserves query validation, success envelope,
  metadata, validation `400`s, and public-safe `500`s.
- The shared service preserves MongoDB filter construction, stored product ID
  normalization/skipping, product ID deduplication, product-type filtering, and
  Shopify product fan-out behavior.
- The loader preserves `ShopProductGallery` props and neutral failure UI.
- Focused tests cover service success/filtering/skipping/deduplication/failure,
  route adapter behavior, and loader no-self-fetch behavior.

## Verification

Run focused tests first, then broaden:

```bash
npm test -- --runTestsByPath <focused shop products service/route/loader tests>
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-084 completed.
- Keep this as the public shop initial product-list read migration only. If
  implementation reveals broader URL construction, hard-coded auth redirects,
  pagination, checkout, or Shopify validation issues, report them as follow-up
  task candidates instead of widening this task.
- Completed on 2026-05-17.
- Added `getShopProductList` as the shared server-only service for public shop
  product listing reads. It now owns MongoDB artwork filtering, stored
  `shopifyProducts` extraction, product-type filtering, numeric Shopify product
  ID normalization/skipping, product ID deduplication, Shopify fan-out,
  per-product fetch failure skipping, and success metadata.
- `GET /api/v2/public/shop/products` now parses and validates route query
  params, delegates post-parse work to `getShopProductList`, and preserves the
  existing success envelope, validation `400`s, and public-safe `500` body.
- `ShopProductsLoader` now converts `initialFilters` into the shared query
  schema input and calls `getShopProductList` directly. It no longer reads
  `NEXT_PUBLIC_BASE_URL`, falls back to `http://localhost:3000`, or calls
  same-app `fetch()` for initial shop products.
- Focused coverage was split across
  `__tests__/unit/data/getShopProductList.test.ts`,
  `__tests__/unit/api/shopProductsRoute.test.ts`, and
  `__tests__/unit/loaders/ShopProductsLoader.test.tsx`.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/data/getShopProductList.test.ts __tests__/unit/api/shopProductsRoute.test.ts __tests__/unit/loaders/ShopProductsLoader.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check` passed. Build
  retained existing unrelated static-generation MongoDB, branch-verification,
  navigation-link, and `ArticleView` debug output.
