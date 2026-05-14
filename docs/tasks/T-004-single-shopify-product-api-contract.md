# T-004 Standardize Single Shopify Product API Contract

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Shopify commerce](../workstreams/shopify-commerce.md)

## Goal

Make `GET /api/v2/public/shop/products/[productId]` use the shared API response
envelope, validate numeric Shopify product IDs before calling Shopify, and
update the direct artwork-page consumer to read the new contract.

## Why Now

This is the first API contract implementation slice after the high-severity auth
identity fixes. It is narrow enough to test well, but it exercises the response,
validation, Shopify, and frontend-consumer concerns found by the audits.

It addresses:

- [F-012](../audits/findings-register.md): Shopify product ID shape is
  documented as numeric but not validated.
- [F-015](../audits/findings-register.md): API response and transform contracts
  are uneven.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP status codes.
- [R-006](../risks/production-readiness.md): API response envelopes, validation,
  and field contracts remain inconsistent.
- [R-023](../risks/production-readiness.md): Shopify product ID validation and
  normalization remain open.
- [A-002](../audits/results/A-002-api-contracts.md): public shop single-product
  contract evidence.
- [A-003](../audits/results/A-003-data-models-transforms.md): Shopify product
  link validation evidence.

## Read First

- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-003 data models and transforms result](../audits/results/A-003-data-models-transforms.md)
- [API architecture](../architecture/routes-and-api.md)

## Scope

In scope:

- Standardize `GET /api/v2/public/shop/products/[productId]` to return:
  - `{ success: true, data: product }` on success.
  - `{ success: false, error: string }` with real HTTP status codes on failure.
- Validate the decoded `productId` path segment as a numeric Shopify product ID
  before constructing `gid://shopify/Product/...`.
- Return a 400 envelope for missing or invalid product IDs without calling
  Shopify.
- Return a 404 envelope when Shopify returns no product.
- Return an intentional server/upstream error status when the Shopify client
  throws, with a public-safe error message.
- Add or reuse a small route-response helper only if it keeps this slice
  clearer and does not force broad API churn.
- Update `ArtworkShopSection` so it unwraps the single-product envelope and does
  not treat error envelopes as products.
- Remove or gate directly related debug `console.log` output in the route and
  direct consumer. Keep useful error logging concise.
- Add focused tests for the route contract and validation behavior.
- Update this task and affected workstream progress after completion.

Out of scope:

- Do not standardize every public shop route.
- Do not change checkout/cart behavior.
- Do not change product detail linked-artwork fetching.
- Do not add the admin Shopify product-linking workflow.
- Do not migrate existing artwork `shopifyProducts` values.
- Do not change Shopify listing filters, pagination, sorting, variants, product
  type, tags, or description transforms.
- Do not perform broad API response-helper adoption across public, user, and
  admin routes.

## Files Likely Touched

- `src/app/api/v2/public/shop/products/[productId]/route.ts`
- `src/components/modules/cards/ArtworkShopSection.tsx`
- Optional focused helper under `src/lib/api/` if useful
- Focused tests under `__tests__/unit/`
- `docs/tasks/T-004-single-shopify-product-api-contract.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/shopify-commerce.md`

## Concurrency

You are not alone in the repo. Keep edits scoped to this route, its direct
consumer, focused tests, and directly related docs. Do not combine this with
checkout, product-detail artwork fetching, admin linking, or broad API contract
standardization.

## Acceptance Criteria

- The single-product shop route always returns the shared success/error
  envelope.
- Invalid product IDs return HTTP 400 and do not call Shopify.
- Missing Shopify products return HTTP 404.
- Shopify client failures return a non-2xx HTTP status with a public-safe error
  envelope.
- Successful responses pass a numeric Shopify product ID as a Shopify GID to the
  client and return the product under `data`.
- `ArtworkShopSection` reads `result.data` and ignores failed product responses.
- Focused tests cover success, invalid ID, not found, and thrown Shopify client
  cases.

## Verification

Run the narrowest relevant tests first, then the project checks:

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm test
npm run lint
npm run build
```

If `npm run build` surfaces the known live MongoDB or external network coupling,
record the exact output and reference R-024/F-019 instead of expanding this
task.

Completed 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/api/shopSingleProductRoute.test.ts`
  passed.
- `npm test` passed, with existing `dateUtils` invalid-date console errors.
- `npm run lint` passed.
- `npm run build` passed, with existing MongoDB/fetcher/static-generation logs.

## Result

- `GET /api/v2/public/shop/products/[productId]` now returns
  `{ success: true, data: product }` on success and
  `{ success: false, error }` with real HTTP 400, 404, and 502 statuses on
  validation, missing-product, and Shopify upstream failures.
- The route validates the decoded path segment as a numeric Shopify product ID
  before constructing `gid://shopify/Product/...`; invalid IDs do not call
  Shopify.
- `ArtworkShopSection` unwraps the response envelope and ignores failed product
  responses instead of treating error JSON as product data.
- Focused route tests cover success, invalid ID, not found, and thrown Shopify
  client behavior.

## Escalate

Escalate to the orchestrator if:

- Existing data contains non-numeric Shopify product IDs that must keep working
  immediately.
- Another agent is editing the shop product routes, `ArtworkShopSection`, or
  shared API response types.
- The fix requires changing Shopify product transforms beyond the current
  `SimpleProduct` contract.
- Tests require a new route-handler testing pattern that would affect multiple
  API tasks.
