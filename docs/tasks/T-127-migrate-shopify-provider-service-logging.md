# T-127 Migrate Shopify Provider Service Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Migrate the Shopify provider/data-service `console.error()` slice to the
[logging and redaction policy](../architecture/logging-and-redaction.md) using
the server-only structured logging helper introduced by T-126, without changing
Shopify product contracts or public shop behavior.

## Context

- T-125 defined the non-route logging/redaction policy and recommended
  provider/data services as the next server-side implementation category after
  public loader/page logging.
- T-126 added `createServerLogger()` and migrated the public loader/page slice.
- The remaining provider/data service direct console calls are concentrated in:
  - `src/lib/api/shopify/shopifyClient.ts`
  - `src/lib/data/services/getArtworkShopProducts.ts`
  - `src/lib/data/services/getShopProductList.ts`
- These paths may handle Storefront API errors, malformed Shopify metafields,
  invalid product IDs, unavailable products, and partial product fan-out
  failures. Logs must summarize these failures without dumping raw provider
  payloads, tokens, headers, or customer/user data.

## Scope

In scope:

- Replace direct `console.error()` calls in the scoped Shopify provider/data
  service files with structured redacted server logging.
- Preserve:
  - Storefront fetch cache policy;
  - `SimpleProduct` transformation output;
  - thrown public-safe Shopify errors from `getProducts()`,
    `getProductByHandle()`, and `getProductById()`;
  - null/skip behavior for missing, unavailable, invalid, or failed linked
    products;
  - product-list metadata and filter behavior.
- Log safe event names, operation names, coarse status categories, public
  Shopify handles/IDs where useful, and normalized errors only.
- Avoid logging raw GraphQL error arrays, Storefront tokens, headers, full query
  bodies, raw provider responses, customer data, or MongoDB documents.
- Add focused source-hygiene coverage for the scoped files.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not change public route handlers or API response contracts.
- Do not change Shopify queries, product DTO fields, cache/revalidate policy,
  product sorting, product-link validation, or checkout/cart behavior.
- Do not migrate browser/client Shopify UI logging, admin Shopify UI logging,
  shared fetcher logging, server actions, session helpers, or utility warnings.
- Do not install or configure a monitoring provider.

## Likely Files

- `src/lib/api/shopify/shopifyClient.ts`
- `src/lib/data/services/getArtworkShopProducts.ts`
- `src/lib/data/services/getShopProductList.ts`
- `src/lib/observability/logger.ts`
- `__tests__/unit/observability/`
- `__tests__/unit/shopifyClientTransform.test.ts`
- `__tests__/unit/data/getArtworkShopProducts.test.ts`
- `__tests__/unit/data/getShopProductList.test.ts`
- Related docs under `docs/`

## Acceptance Criteria

- The scoped Shopify provider/data service files contain no direct
  `console.error()` or `console.warn()` calls.
- Any retained logging goes through server-only structured redacted logging and
  avoids raw provider payloads.
- Existing Shopify product transform, product-list, product-detail, and
  linked-artwork shop product behavior is preserved.
- Focused tests or source-hygiene checks cover the touched files.
- Related tracking docs record remaining non-route logging cleanup categories.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/lib/api/shopify/shopifyClient.ts src/lib/data/services/getArtworkShopProducts.ts src/lib/data/services/getShopProductList.ts
npm test -- --runTestsByPath __tests__/unit/observability/logger.test.ts __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/data/getArtworkShopProducts.test.ts __tests__/unit/data/getShopProductList.test.ts
git diff --check
```

Run additional focused route, loader, sitemap, or metadata tests if the
implementation touches shared Shopify behavior beyond logging.

## Handoff Notes

- Planned on 2026-05-18 after T-126 completed the first public loader/page
  logging implementation slice.
- Completed on 2026-05-18. The scoped Shopify provider/data-service files now
  route Storefront HTTP/GraphQL/fetch failures, malformed featured-artwork
  metafields, and linked-product fan-out failures through server-only
  structured logging with safe provider operation names, coarse status
  categories, public handles/IDs, and normalized errors.
- Product DTO transformation, Storefront fetch cache policy, public-safe
  wrapper errors, linked-product skip/null behavior, product-list metadata, and
  filter behavior were preserved.
- Verification passed:
  `rg -n "console\\.(error|warn)\\(" src/lib/api/shopify/shopifyClient.ts src/lib/data/services/getArtworkShopProducts.ts src/lib/data/services/getShopProductList.ts`,
  `npm test -- --runTestsByPath __tests__/unit/observability/logger.test.ts __tests__/unit/observability/shopifyProviderServiceLoggingSourceHygiene.test.ts __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/data/getArtworkShopProducts.test.ts __tests__/unit/data/getShopProductList.test.ts`,
  and `git diff --check`.
