# T-063 Preserve Shopify Description HTML

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Complete the next transform-only F-014 slice by carrying Shopify
`descriptionHtml` through `SimpleProduct` without rendering rich HTML or changing
product-detail UI behavior.

## Context

- F-014 remains partially mitigated after T-061 and T-062:
  `productType`, `tags`, and variant metadata now flow through `SimpleProduct`,
  but `descriptionHtml` is still queried from Shopify and dropped.
- `src/lib/api/shopify/queries.ts` already requests `descriptionHtml` for list,
  handle, and ID product reads.
- The product detail page currently renders plain `description`; changing rich
  description rendering needs separate sanitization/design review.
- Checkout/cart ownership remains undecided and must stay separate.

## Scope

In scope:

- Add `descriptionHtml` to `SimpleProduct`.
- Preserve Shopify `descriptionHtml` in list, handle, and ID transforms.
- Keep existing plain `description` behavior unchanged.
- Preserve T-061 `productType`/`tags` and T-062 `variants` behavior.
- Add focused transform tests proving:
  - `descriptionHtml` is preserved for product list reads,
  - `descriptionHtml` is preserved for product-by-handle reads,
  - `descriptionHtml` is preserved for product-by-ID reads,
  - existing plain `description`, metadata, and variant behavior remains intact.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not render `descriptionHtml`.
- Do not add HTML sanitization or rich-description UI.
- Do not change product detail layout, CTA behavior, checkout/cart, or variant
  selection.
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
- `docs/orchestration/state.md`

## Acceptance Criteria

- `SimpleProduct` exposes `descriptionHtml`.
- Shopify list, handle, and ID transforms preserve `descriptionHtml`.
- Existing plain `description`, product metadata, variant metadata, and public
  API envelopes are preserved.
- No rich HTML is rendered and no UI/checkout/admin/data behavior changes.

## Verification

Run:

```bash
npm test -- --runTestsByPath <focused Shopify transform test>
npm run lint
npm run build
```

Record the exact focused test path in the handoff notes.

## Handoff Notes

- Completed 2026-05-16.
- Added `descriptionHtml` to `SimpleProduct` and preserved Shopify
  `descriptionHtml` in the shared product transform used by list, handle, and
  ID reads.
- Kept existing plain `description`, product metadata, variant metadata, public
  API envelopes, product-detail UI, checkout/cart, and variant-selection
  behavior unchanged.
- Added focused transform coverage in
  `__tests__/unit/shopifyClientTransform.test.ts` for list, handle, and ID
  reads preserving both plain `description` and `descriptionHtml`.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/shopifyClientTransform.test.ts`,
  `npm run lint`, and `npm run build` passed. Build retained existing
  MongoDB/fetcher/static-generation log noise.

## Escalate

Escalate to the orchestrator if:

- Preserving `descriptionHtml` requires deciding how or where to render rich
  HTML.
- Sanitization policy or product-detail layout changes become necessary.
- Checkout, variant-selection UI, or admin-linking behavior becomes coupled to
  this transform-only change.
