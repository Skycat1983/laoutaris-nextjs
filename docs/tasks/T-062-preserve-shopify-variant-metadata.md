# T-062 Preserve Shopify Variant Metadata

Status: Ready

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Continue the F-014 Shopify product transform hardening by carrying queried
Shopify variant metadata through `SimpleProduct` without implementing checkout,
cart, or visible variant-selection UI.

## Context

- F-014 remains partially mitigated after T-061: `productType` and `tags` now
  flow through `SimpleProduct`, but variant IDs/titles/availability are still
  dropped.
- `src/lib/api/shopify/queries.ts` already requests product variants with
  `id`, `title`, `price`, `compareAtPrice`, `availableForSale`, and variant
  images.
- `src/lib/api/shopify/shopifyClient.ts` currently uses only the first variant
  to derive top-level price fields.
- Checkout/cart ownership remains undecided, so this task should only make the
  data contract durable for later checkout work.

## Scope

In scope:

- Add a minimal `SimpleProductVariant` type or equivalent field shape for
  variants exposed through `SimpleProduct`.
- Preserve Shopify variant metadata already queried from Storefront:
  - variant `id`,
  - `title`,
  - `availableForSale`,
  - `price.amount`,
  - `price.currencyCode`,
  - optional `compareAtPrice.amount`,
  - optional variant image URL/alt text if present.
- Keep existing top-level `price`, `currencyCode`, `compareAtPrice`, `image`,
  and `availableForSale` behavior unchanged.
- Ensure products with no variants still transform safely with an empty
  `variants` array and existing top-level price fallback behavior.
- Add focused transform tests for:
  - multiple variants preserved in order,
  - variant compare-at price and image handling,
  - no-variant fallback behavior,
  - existing `productType`/`tags` behavior from T-061 still preserved.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not implement checkout/cart or variant selection UI.
- Do not choose checkout ownership or line-item behavior.
- Do not change product detail CTA behavior.
- Do not expose description HTML or render rich descriptions.
- Do not implement pagination, admin linking, MongoDB data migration, or
  Shopify API validation.
- Do not run the blocked T-059 audit.

## Files Likely Touched

- `src/lib/data/types/shopify.ts`
- `src/lib/api/shopify/shopifyClient.ts`
- Focused Shopify transform tests under `__tests__/unit/`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `SimpleProduct` exposes a stable `variants` array with minimal checkout-ready
  metadata.
- Shopify list, handle, and ID transforms preserve variant metadata from the
  existing GraphQL query.
- Existing top-level product price, compare-at price, image, availability,
  `productType`, and `tags` behavior is preserved.
- Products without variants do not crash and return `variants: []`.
- No checkout/cart, product-detail CTA, pagination, admin-linking, or data
  migration behavior changes.

## Verification

Run:

```bash
npm test -- --runTestsByPath <focused Shopify transform test>
npm run lint
npm run build
```

Record the exact focused test path in the handoff notes.

## Handoff Notes

- Not started.

## Escalate

Escalate to the orchestrator if:

- Variant data needs UI, checkout/cart, or owner decisions to expose safely.
- Shopify variant data shape differs from the current Storefront query in a way
  that requires query or product-detail behavior outside this task.
- Description HTML, selling plans, inventory policy, or line-item construction
  becomes necessary to complete the transform-only slice.
