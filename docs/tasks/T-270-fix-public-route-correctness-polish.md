# T-270 Fix Public Route Correctness Polish

Status: Completed

Workstream: [Frontend routes and components](../workstreams/frontend-routes-and-components.md).

## Goal

Resolve two narrow public route correctness issues from A-028: unsafe plain
description HTML injection on product detail and stale collection-slug redirect
error handling.

## Context

- A-028 found `ShopProductSaleGallery` injects plain Shopify
  `product.description` through `dangerouslySetInnerHTML`, while rich HTML
  rendering remains a separate sanitizer/design decision.
- A-028 found missing `/collections/[slug]` redirect targets throw a generic
  route error instead of rendering public not-found behavior.

## Scope

In scope:

- Render plain product descriptions as text, preserving layout.
- Keep sanitized rich Shopify `descriptionHtml` rendering out of scope.
- Use route-local public not-found behavior for missing collection redirect
  targets while preserving true service failures as errors.
- Add focused tests for escaping/plain-text rendering and missing collection
  slug handling.

Out of scope:

- Rich HTML sanitizer implementation.
- Product sale gallery redesign.
- Collection detail/list redesign.

## Concurrency

Can run in parallel with shop listing/admin/auth/testing tasks. Avoid parallel
edits to product detail sale gallery or collection redirect route.

## Files Likely Touched

- `src/components/shop/product-detail/ShopProductSaleGallery.tsx`
- `src/app/collections/[slug]/page.tsx`
- Focused product detail and collection route tests
- This task and `docs/tasks/README.md`

## Completion Contract

- Update this task and task index.
- Record exact verification and any deferred rich-description decision.

## Acceptance Criteria

- Plain product descriptions are not interpreted as HTML.
- Missing collection redirect targets render not-found behavior.
- Existing product/collection behavior remains intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx <focused collection route test>
git diff --check
```

## Handoff Notes

- Completed 2026-05-25.
- `ShopProductSaleGallery` now renders Shopify `product.description` as React
  text, preserving the product-detail sidebar placement and newline handling
  without interpreting plain descriptions as HTML.
- `/collections/[slug]` now calls route-local `notFound()` when the collection
  navigation lookup returns null, while service failures still log structured
  errors and throw to the error boundary.
- Deferred decision: sanitized rich Shopify `descriptionHtml` rendering remains
  out of scope and should be handled in a separate sanitizer/design task.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/pages/CollectionSlugPage.test.tsx`
  (pass);
  `git diff --check` (pass).
