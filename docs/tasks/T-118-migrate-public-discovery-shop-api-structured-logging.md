# T-118 Migrate Public Discovery And Shop API Structured Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Migrate the remaining public search, navigation, and shop API internal-failure
paths that still use direct route-level `console.error()` to the T-099
request-context and structured redacted logger pattern.

## Context

- T-099 introduced provider-neutral request IDs, request-context creation,
  structured redacted API logging, and optional public `requestId` plus
  `X-Request-Id` response helper support.
- T-117 migrated the public content article, blog, artwork, and collection
  route directories.
- A scoped source search still shows direct route-level `console.error()` in
  public search, navigation, and shop product routes.

## Scope

In scope:

- Migrate these public route files:
  - `src/app/api/v2/public/search/route.ts`
  - `src/app/api/v2/public/navigation/articles/[section]/route.ts`
  - `src/app/api/v2/public/navigation/collections/[slug]/route.ts`
  - `src/app/api/v2/public/navigation/collections/[slug]/artworks/route.ts`
  - `src/app/api/v2/public/shop/products/route.ts`
  - `src/app/api/v2/public/shop/products/[productId]/route.ts`
- For internal/upstream failures, create request context from the incoming
  request, log through the structured logger with safe route, method, and error
  context, and return public `requestId` plus `X-Request-Id` where the route
  returns `500` or upstream failure responses that already use public-safe
  errors.
- Preserve existing success contracts, validation `400`s, missing-resource
  behavior, unsupported-method behavior, and Shopify upstream status semantics.
- Preserve query parsing, Shopify ID normalization, Shopify fetch behavior,
  service calls, route cache policy, metadata, and client fetcher contracts.
- Add or extend focused tests for representative search, navigation, shop list,
  and shop detail internal/upstream failure paths, including propagated and
  generated request IDs.
- Add source hygiene assertions that the migrated public search/navigation/shop
  route files no longer use direct route-level `console.error()`.
- Update this task brief and the related workstream docs after completion.

Out of scope:

- Do not choose or integrate a monitoring/error-reporting provider.
- Do not add alert automation, CI smoke, or scheduled smoke.
- Do not migrate protected user or admin routes.
- Do not implement checkout/cart, variant selection, server-side shop
  pagination, or new Shopify product-link validation behavior.
- Do not remove lower-level service/client `console.error()` calls outside the
  scoped route files.

## Likely Files

- `src/app/api/v2/public/search/route.ts`
- `src/app/api/v2/public/navigation/articles/[section]/route.ts`
- `src/app/api/v2/public/navigation/collections/[slug]/route.ts`
- `src/app/api/v2/public/navigation/collections/[slug]/artworks/route.ts`
- `src/app/api/v2/public/shop/products/route.ts`
- `src/app/api/v2/public/shop/products/[productId]/route.ts`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `__tests__/unit/api/publicSearchRoute.test.ts`
- `__tests__/unit/api/publicNavigationRoutes.test.ts`
- `__tests__/unit/api/shopProductsRoute.test.ts`
- `__tests__/unit/api/shopSingleProductRoute.test.ts`
- `__tests__/unit/api/publicShopFetchers.test.ts`

## Acceptance Criteria

- Scoped public search, navigation, and shop route internal/upstream failures
  use the T-099 request-context and structured logger pattern instead of direct
  route-level `console.error()`.
- Public failure responses that currently represent server/upstream failures
  include safe request IDs and `X-Request-Id` without changing existing status
  semantics.
- Existing success, validation, not-found, unsupported-method, and Shopify
  upstream behavior is preserved.
- Focused tests cover representative failure paths, propagated/generated request
  IDs, `X-Request-Id`, private-message redaction where applicable, and source
  hygiene.
- Workstream/task documentation records completion, verification, and remaining
  observability follow-ups.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/publicSearchRoute.test.ts __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/api/shopProductsRoute.test.ts __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/publicShopFetchers.test.ts
npm run lint
npm run build
rg -n "console\\.error\\(" src/app/api/v2/public/search src/app/api/v2/public/navigation src/app/api/v2/public/shop/products
git diff --check
```

## Completion Notes

- Completed on 2026-05-18 by migrating the scoped public search, navigation,
  and shop product API route failure paths from direct route-level
  `console.error()` calls to T-099 request context plus structured redacted API
  logging.
- Real `500` responses and the existing Shopify upstream `502` failure response
  now include public `requestId` bodies and `X-Request-Id` headers while
  preserving success, validation `400`, missing-resource `404`, and Shopify ID
  normalization behavior.
- Focused tests now cover representative search, navigation, shop list, and
  shop detail failure paths, propagated and generated request IDs,
  `X-Request-Id`, structured log context, private-message redaction from
  public bodies, and source hygiene for the migrated route files.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/publicSearchRoute.test.ts __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/api/shopProductsRoute.test.ts __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/publicShopFetchers.test.ts`,
  `npm run lint`, `npm run build`,
  `rg -n "console\\.error\\(" src/app/api/v2/public/search src/app/api/v2/public/navigation src/app/api/v2/public/shop/products`,
  and `git diff --check`.
- Remaining observability follow-ups stay separate: monitoring/error-reporting
  provider selection, instrumentation, alert automation, scheduled smoke,
  incident-response owner matrix completion, protected/admin route logging
  migration, broader route migration, and lower-level service/client
  `console.error()` policy.
