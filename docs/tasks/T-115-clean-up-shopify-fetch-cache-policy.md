# T-115 Clean Up Shopify Fetch Cache Policy

Status: Planned

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the Next.js build warning caused by Shopify Storefront fetches specifying
both `cache` and `next.revalidate`, while preserving the current intended
development freshness and production revalidation behavior.

## Context

- T-113 expanded `/sitemap.xml` with dynamic public detail URLs that may look up
  linked Shopify products.
- T-114 added discovery endpoint smoke assertions and reran build.
- Build passes, but `/sitemap.xml` generation repeatedly warns:
  `fetch for https://laoutaris.myshopify.com/api/2024-10/graphql.json on /sitemap.xml specified "cache: default" and "revalidate: 3600", only one should be specified.`
- The conflict is in `src/lib/api/shopify/shopifyClient.ts`, where
  `shopifyFetch()` currently sends both `cache` and `next.revalidate`.
- F-026 keeps broader cache/revalidation ownership open; this task only cleans
  the Shopify Storefront fetch option conflict.

## Scope

- In scope:
  - Update `shopifyFetch()` so each request supplies a valid Next fetch cache
    policy without specifying mutually exclusive options.
  - Preserve current development behavior as uncached/fresh.
  - Preserve current production intent as revalidated Shopify reads, without
    introducing route-level `revalidate`, ISR, generated params, or broad static
    rendering changes.
  - Add or extend focused tests that inspect Shopify `fetch()` request options
    for development and production modes.
  - Ensure existing Shopify product transform behavior and sitemap generation
    tests continue to pass.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Do not change Shopify GraphQL queries, product transforms, product detail
    UI, checkout/cart, product availability claims, or admin product-linking
    behavior.
  - Do not change `src/app/sitemap.ts`, metadata helpers, public route segment
    config, route rendering policy, or static/ISR decisions unless needed to
    fix a narrow regression from the fetch-option cleanup.
  - Do not add Shopify product caching, persistence, pagination, sorting, or
    retry/error-reporting behavior.
  - Do not resolve broader account/admin cache policy or build-time external
    service coupling.

## Files Likely Touched

- `src/lib/api/shopify/shopifyClient.ts`
- `__tests__/unit/shopifyClientTransform.test.ts` or a new focused Shopify
  fetch-policy test under `__tests__/unit/`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/tasks/T-115-clean-up-shopify-fetch-cache-policy.md`

## Acceptance Criteria

- Production Shopify Storefront fetches no longer specify both `cache` and
  `next.revalidate`.
- Development Shopify Storefront fetches remain uncached/fresh.
- Product list, handle, and ID reads still send the existing GraphQL queries,
  variables, headers, and request body shape.
- `npm run build` passes without the Shopify `cache: default` plus
  `revalidate: 3600` warning on `/sitemap.xml`.
- No public route rendering, metadata, sitemap, checkout/cart, or commerce-claim
  behavior is changed.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/deployment/publicDynamicSitemap.test.ts
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared after T-114 completed deployed discovery endpoint smoke assertions
  and build still reproduced the Shopify fetch cache/revalidate warning.
- Keep Shopify product caching, pagination/sorting, checkout/cart, monitoring,
  and broad route cache/static migration separate.
