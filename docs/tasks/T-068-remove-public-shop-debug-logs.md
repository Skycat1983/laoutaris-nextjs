# T-068 Remove Public Shop Debug Logs

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove always-on public shop debug logging from the shop products route,
gallery, and loader while preserving current public shop filtering, sorting,
and product response behavior.

## Context

- F-020 still tracks shop and commerce console noise after the middleware and
  Cloudinary upload slices.
- `src/app/api/v2/public/shop/products/route.ts` currently logs the MongoDB
  query, artwork count, product-link count, product-type filters, filtered-link
  count, unique product IDs, and fetched product count on normal requests.
- `src/components/compositions/ShopProductGallery.tsx` currently logs initial
  products/filters, sort changes, filter query params, and received product
  counts during normal client interactions.
- `src/components/loaders/viewLoaders/ShopProductsLoader.tsx` currently logs
  fetch URLs and product counts during server rendering, and its error UI tells
  users to check the console.
- T-060 through T-063 added focused shop route, gallery, and transform coverage
  that should remain useful while this debug-output cleanup happens.

## Scope

In scope:

- Remove direct `console.log` debug output from:
  - `src/app/api/v2/public/shop/products/route.ts`
  - `src/components/compositions/ShopProductGallery.tsx`
  - `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
- Remove or replace the public-facing "Check the console for more details"
  loader text with a neutral user-facing error hint.
- Preserve public shop query validation, MongoDB filter construction, malformed
  Shopify product ID skipping, product ID deduplication, Shopify fetch fan-out,
  response envelope, metadata, gallery filter behavior, sort behavior, loading
  state, and empty-state behavior.
- Add or extend focused source/component/API coverage so direct shop
  `console.log` debug output cannot return to the touched files.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not define or implement the global logging/redaction, monitoring, or
  request-correlation policy.
- Do not migrate `ShopProductsLoader` away from same-app HTTP; that remains a
  separate ADR 0004/F-021 architecture slice.
- Do not change public shop response contracts, server-side sorting,
  pagination, checkout/cart, product-detail UI, variant selection, or admin
  Shopify product-linking.
- Do not run T-059 or infer Shopify data cleanup from the blocked audit.
- Do not remove all `console.error` paths unless a specific touched error path
  is clearly debug-only and covered by existing behavior.

## Files Likely Touched

- `src/app/api/v2/public/shop/products/route.ts`
- `src/components/compositions/ShopProductGallery.tsx`
- `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a new focused
  shop source hygiene test
- `__tests__/unit/api/shopProductsRoute.test.ts`
- `__tests__/unit/shopProductGallerySorting.test.tsx`
- `__tests__/unit/loaders/ShopProductsLoader.test.tsx`
- `docs/tasks/T-068-remove-public-shop-debug-logs.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- The touched shop route, gallery, and loader files contain no direct
  `console.log` calls.
- Normal shop page rendering and filtering no longer emit the removed debug
  messages.
- The shop products API still validates and applies backed filters, skips
  malformed stored product IDs before Shopify calls, deduplicates product IDs,
  and returns the existing success envelope and metadata.
- The gallery still initializes from provided products/filters, updates filters,
  sorts by explicit product metadata, displays loading state, and preserves the
  existing empty-state reset behavior.
- The loader error UI no longer tells public users to check the console.
- Focused source/API/component tests cover the no-debug-log invariant and
  preserved shop behavior.

## Verification

Run:

```bash
rg -n "console\\.log" src/app/api/v2/public/shop/products/route.ts src/components/compositions/ShopProductGallery.tsx src/components/loaders/viewLoaders/ShopProductsLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/shopProductsRoute.test.ts __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/loaders/ShopProductsLoader.test.tsx __tests__/unit/security/credentialSourceHygiene.test.ts
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation adds a
new focused source hygiene or loader test, run that test as part of the focused
verification set.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- Removed direct `console.log` output from the public shop products route,
  `ShopProductGallery`, and `ShopProductsLoader`.
- Replaced the loader's public "Check the console" error hint with a neutral
  retry/contact hint.
- Added focused loader coverage and extended route, gallery, and source hygiene
  coverage so the direct public shop `console.log` output and console-directed
  loader copy cannot return unnoticed.
- Verification passed: `rg -n "console\\.log"` on the three touched shop files
  returned no matches; focused Jest for
  `__tests__/unit/api/shopProductsRoute.test.ts`,
  `__tests__/unit/shopProductGallerySorting.test.tsx`,
  `__tests__/unit/loaders/ShopProductsLoader.test.tsx`, and
  `__tests__/unit/security/credentialSourceHygiene.test.ts`; `npm run lint`;
  and `npm run build`. Build still emitted existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug noise outside this slice.
- Keep broader logging/redaction policy under F-020/F-053/R-019.
- Keep shop pagination, checkout/cart, variant selection, admin product-linking,
  T-059 audit execution, and ADR 0004 shop-loader migration separate.

## Escalate

Escalate to the orchestrator if:

- Removing the debug logs exposes an untested behavior dependency in the shop
  route, gallery, or loader.
- A proper fix requires deciding a global logging framework or redaction policy.
- Preserving shop behavior requires changing response envelopes, pagination,
  checkout/cart, admin linking, or same-app HTTP data access.
