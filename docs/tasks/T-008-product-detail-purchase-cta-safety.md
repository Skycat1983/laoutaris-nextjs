# T-008 Make Product Detail Purchase CTA Safe

Status: Completed

Workstream:
[Shopify commerce](../workstreams/shopify-commerce.md)

## Goal

Remove the misleading nonfunctional `Add to Cart` affordance from
`/shop/products/[productHandle]` and replace it with a first-release safe
purchase/contact handoff until Shopify checkout or cart is implemented.

## Why Now

T-007 restored linked artwork context on product detail pages. The next visible
commerce blocker is that product detail still presents a purchase control that
does not create a cart, checkout, or Shopify handoff.

It addresses:

- [F-009](../audits/findings-register.md): checkout/cart handoff is undefined
  while product detail shows an `Add to Cart` affordance.
- [R-001](../risks/production-readiness.md): first-release purchase scope is
  not documented while product detail shows purchase UI.
- [A-001](../audits/results/A-001-shopify-commerce.md): Shopify checkout
  placeholder evidence.
- [Shopify commerce architecture](../architecture/shopify-commerce.md): checkout
  approach remains an open decision.

## Read First

- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Shopify commerce architecture](../architecture/shopify-commerce.md)
- [Shopify operations runbook](../runbooks/shopify-operations.md)
- [A-001 Shopify audit](../audits/results/A-001-shopify-commerce.md)
- [T-007 product detail linked artwork](T-007-shop-product-detail-linked-artwork-fetching.md)

## Scope

In scope:

- Replace the product detail `Add to Cart` button with a safe first-release
  handoff that does not imply cart/checkout functionality exists.
- Prefer a clear contact/enquiry handoff to `/project/contact` for available
  products unless an existing, tested Shopify checkout URL is already present in
  the product contract.
- Preserve the existing unavailable/out-of-stock behavior without suggesting a
  purchase can be completed.
- Keep the change limited to product detail presentation and directly related
  tests/docs.
- Add focused tests or assertions that product detail no longer renders
  `Add to Cart` for available products and does render the safe handoff.
- Document that real checkout/cart remains a separate future task requiring
  variant IDs, line items, and Shopify checkout/cart ownership.
- Update this task and the Shopify workstream after completion. If this task is
  run concurrently with audit goals, avoid shared risk-register edits and leave
  final risk reconciliation to the orchestrator.

Out of scope:

- Do not implement Shopify cart or checkout.
- Do not add variant selection.
- Do not change `SimpleProduct` or Shopify GraphQL queries unless the current
  product contract already exposes a tested direct checkout URL.
- Do not build the admin Shopify product-linking workflow.
- Do not change shop listing cards, filters, pagination, or sorting.
- Do not modify public enquiry API validation; A-016 owns the broader forms and
  validation audit.

## Files Likely Touched

- `src/app/shop/products/[productHandle]/page.tsx`
- Existing product-detail tests under `__tests__/unit/`
- `docs/tasks/T-008-product-detail-purchase-cta-safety.md`
- `docs/workstreams/shopify-commerce.md`
- Optionally `docs/architecture/shopify-commerce.md` or
  `docs/runbooks/shopify-operations.md` for a short first-release checkout note

## Concurrency

You are not alone in the repo. Keep edits scoped to the product detail purchase
CTA, focused tests, and directly related Shopify docs. This task is safe to run
in parallel with A-008, A-016, and A-019 because those audit agents should write
only their assigned result files.

## Acceptance Criteria

- Available product detail pages no longer render a nonfunctional `Add to Cart`
  button.
- Available product detail pages render a clear safe handoff, such as a contact
  link, without claiming checkout is available.
- Unavailable products still communicate that they cannot currently be bought.
- Tests cover the available and unavailable CTA states.
- Docs state that cart/checkout implementation remains a separate task.

## Verification

Run the narrowest relevant tests first, then the standard project checks:

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm test
npm run lint
npm run build
```

If `npm run build` surfaces the known live MongoDB or external network coupling,
record the exact output and reference R-024/F-019 instead of expanding this
task.

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx
npm test
npm run lint
npm run build
```

`npm run build` passed. It still emitted the known noisy static-generation
MongoDB and same-app fetch logs tracked outside this task, but no build failure
occurred.

## Completion Notes

- Replaced the product detail `Add to Cart` placeholder with an
  `Enquire About This Product` link to `/project/contact?product=...` for
  products that Shopify marks available for sale.
- Replaced the unavailable state with non-purchase status copy so unavailable
  products do not suggest cart, checkout, or enquiry completion.
- Added focused page tests covering the available contact handoff, absence of
  `Add to Cart`, unavailable status, and preservation of the existing linked
  artwork data-service behavior.
- Documented the first-release enquiry handoff in the Shopify architecture and
  operations runbook. Real cart/checkout remains future work requiring variant
  IDs, line items, and explicit Shopify checkout/cart ownership.

## Escalate

Escalate to the orchestrator if:

- The owner wants checkout implemented now instead of a safe first-release
  contact handoff.
- A direct Shopify-hosted checkout/product URL exists but is not represented in
  the current product contract.
- The safe handoff requires changing public enquiry API behavior.
- Another agent is editing the product detail page or Shopify workstream docs
  concurrently.
