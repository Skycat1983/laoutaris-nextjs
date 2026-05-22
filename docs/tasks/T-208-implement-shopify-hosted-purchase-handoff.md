# T-208 Implement Shopify-Hosted Purchase Handoff

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace the enquiry-only product detail purchase path with a real
Shopify-hosted purchase handoff when Shopify exposes a public product URL,
while preserving the enquiry path as the fallback.

## Context

- F-009/R-001 remain meaningful production risks: the app no longer renders a
  fake `Add to Cart`, but product detail pages still stop at an enquiry link.
- T-008 made the first-release CTA safe by linking available products to
  `/project/contact?product=[handle]`.
- T-062 preserved variant metadata in `SimpleProduct`, but checkout/cart
  ownership, variant selection, line-item construction, payment, shipping, and
  refund behavior remain intentionally undecided.
- `src/app/shop/products/[productHandle]/page.tsx` currently renders
  `Enquire About This Product` for available products and no purchase action
  for unavailable products.
- The lower-surface-area next step is a Shopify-hosted product/purchase link
  sourced from Shopify, not an app-owned cart or checkout session.

## Scope

In scope:

- Query Shopify's hosted product URL for product list, handle, and ID reads if
  the current Storefront schema exposes it. Prefer the canonical product field
  `onlineStoreUrl` unless the local Shopify API version requires a different
  documented public URL field.
- Add `onlineStoreUrl?: string | null` or an equivalent optional field to the
  Shopify product DTO and `SimpleProduct`.
- Transform the queried hosted URL without inventing URLs locally. Treat a
  missing, empty, or invalid URL as `null`.
- Update `/shop/products/[productHandle]` so:
  - available products with a hosted URL render a real external purchase CTA,
  - available products without a hosted URL keep the existing enquiry fallback,
  - unavailable products still do not render a purchase/enquiry completion
    claim.
- Keep enquiry as a fallback or secondary contact option, but do not let it be
  the only path when a real Shopify-hosted purchase URL is available.
- Use external-link hardening for Shopify links, including
  `target="_blank"` and `rel="noopener noreferrer"`.
- Keep purchase copy factual. It may say checkout is completed on Shopify; it
  must not claim payment, shipping, refund, buyer-protection, or fulfilment
  guarantees.
- Add focused tests for Shopify transform behavior, product detail CTA behavior,
  and any API/fetcher fixture updates needed by the `SimpleProduct` contract.
- Update this task brief and linked workstreams after completion.

Out of scope:

- Do not implement app-owned cart, `cartCreate`, checkout session ownership,
  line-item construction, shipping, payment, tax, refund, order, or fulfilment
  behavior.
- Do not add visible variant selection, selling-plan controls, quantity
  controls, cart drawers, or cart persistence.
- Do not change Shopify product-link admin workflows, MongoDB product-link data,
  artwork/shop listing source of truth, pagination, sorting, or caching policy.
- Do not add policy-page, payment, shipping, refund, buyer-protection, or
  delivery claims.
- Do not redesign product detail pages beyond the purchase/enquiry handoff
  controls needed for this task.

## Concurrency

Run this task alone with other work touching Shopify DTOs, product transform
queries, product detail CTA behavior, or commerce copy.

Owned files:

- `src/lib/data/types/shopify.ts`
- `src/lib/api/shopify/queries.ts`
- `src/lib/api/shopify/shopifyClient.ts`
- `src/app/shop/products/[productHandle]/page.tsx`
- focused Shopify transform, product detail, API route, and fetcher tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/data/types/shopify.ts`
- `src/lib/api/shopify/queries.ts`
- `src/lib/api/shopify/shopifyClient.ts`
- `src/app/shop/products/[productHandle]/page.tsx`
- `__tests__/unit/shopifyClientTransform.test.ts`
- `__tests__/unit/shopProductDetailPage.test.tsx`
- `__tests__/unit/api/shopSingleProductRoute.test.ts`
- `__tests__/unit/api/publicShopFetchers.test.ts`
- `__tests__/unit/api/shopProductsRoute.test.ts`
- `docs/tasks/T-208-implement-shopify-hosted-purchase-handoff.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `SimpleProduct` safely carries the Shopify-hosted public product URL when it
  is queried and valid.
- Shopify list, handle, and ID product transforms preserve the hosted URL
  without changing existing handle, price, image, variant, availability,
  `productType`, `tags`, metafield, or description behavior.
- An available product with a hosted URL renders a real external Shopify
  purchase CTA on `/shop/products/[productHandle]`.
- An available product without a hosted URL still renders the existing enquiry
  fallback to `/project/contact?product=[handle]`.
- An unavailable product still avoids purchase CTAs and does not imply checkout
  completion, payment support, shipping, refund, or buyer protection.
- The product detail page no longer makes enquiry the only available-product
  path when Shopify provides a real hosted URL.
- Focused tests cover hosted URL transform, invalid or missing hosted URL
  fallback, available-product purchase CTA, available-product enquiry fallback,
  and unavailable-product behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/publicShopFetchers.test.ts __tests__/unit/api/shopProductsRoute.test.ts
npm run lint
npm run build
git diff --check
```

Add any additional focused test paths touched by the implementation before
handoff.

## Agent Prompt

You are working on T-208. Read `AGENTS.md`, `docs/README.md`,
`docs/architecture/shopify-commerce.md`, F-009 in
`docs/audits/findings-register.md`, R-001 in
`docs/risks/production-readiness.md`, and the Shopify/frontend/testing
workstreams. Implement only a Shopify-hosted purchase handoff for product
detail pages. Query and transform Shopify's public hosted product URL if the
current Storefront schema exposes it, render an external purchase CTA for
available products with that URL, and preserve enquiry fallback when the URL is
missing or invalid. Do not build app-owned cart/checkout, variant selection,
line-item construction, shipping/payment/refund behavior, or commerce assurance
claims. Run the verification commands, then update this handoff with what
changed and list any candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-207 was deferred as
  lower-value route-fallback polish.
- This is the recommended next meaningful production slice because it moves the
  commerce flow beyond enquiry-only behavior without prematurely owning checkout
  state inside the app.
- Completed on 2026-05-22. Shopify product list, handle, and ID queries now
  request `onlineStoreUrl`, `SimpleProduct.onlineStoreUrl` carries only valid
  absolute HTTP(S) hosted URLs, and missing, empty, relative, malformed, or
  non-HTTP(S) hosted URL values normalize to `null`.
- `/shop/products/[productHandle]` now renders an external `Purchase on
  Shopify` CTA for available products with a valid hosted URL, including
  `target="_blank"` and `rel="noopener noreferrer"`. Available products without
  a hosted URL keep the existing enquiry fallback, and unavailable products
  still render no purchase or enquiry completion CTA.
- Focused tests were updated for Shopify transform behavior, product-detail CTA
  behavior, unavailable-product behavior, and public shop API/fetcher fixtures.
  Durable docs were updated in
  [shopify-commerce.md](../architecture/shopify-commerce.md),
  [shopify-operations.md](../runbooks/shopify-operations.md), and the linked
  workstream briefs.
- Verification run on 2026-05-22:

  ```bash
  npm test -- --runTestsByPath __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/publicShopFetchers.test.ts __tests__/unit/api/shopProductsRoute.test.ts
  npm run lint
  npm run build
  git diff --check
  ```

  All passed. The focused Jest run emitted the existing Node `punycode`
  deprecation warning, and `npm run build` emitted the existing Browserslist
  `caniuse-lite` stale-data warning.
- Candidate shared-tracker updates for orchestrator review: F-009 and R-001
  should mention T-208 completed as a hosted product URL handoff mitigation
  while full app-owned cart/checkout ownership, variant selection, line-item
  construction, payment, shipping, refund, and fulfilment behavior remain open
  or out of scope. `docs/orchestration/state.md` should no longer name T-208 as
  the next active Shopify slice.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark T-208
  complete, record F-009/R-001 as mitigated by the hosted Shopify URL handoff,
  and prepare T-209 for the next commerce/compliance copy slice.
