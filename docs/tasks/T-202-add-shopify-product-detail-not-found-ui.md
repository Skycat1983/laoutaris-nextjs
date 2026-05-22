# T-202 Add Shopify Product Detail Not-Found UI

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Complete the remaining Shopify product detail slice of the accepted public
detail not-found/error contract by adding route-local not-found presentation and
focused coverage.

## Context

- A-005 found public detail routes lacked consistent route-local not-found UI and
  primary-content failure behavior.
- T-199 recorded the accepted public detail route contract.
- T-200 implemented the artwork and collection-scoped artwork runtime slice.
- T-201 implemented the article/blog runtime slice.
- `/shop/products/[productHandle]` already calls `notFound()` when
  `getProductByHandle()` returns no primary Shopify product.
- The remaining public-detail gap is route-local shared not-found UI and
  focused page coverage for the Shopify product detail route.

## Scope

In scope:

- Add `src/app/shop/products/[productHandle]/not-found.tsx` using the shared
  `PublicDetailNotFound` presentation with product-appropriate title, message,
  return href, and return label.
- Add or update focused product detail tests proving a missing Shopify product
  calls `notFound()`, route-local not-found presentation renders, and same-app
  HTTP stays out of product detail rendering.
- Preserve existing product detail metadata behavior:
  `generateMetadata()` should still return missing-product metadata when
  `getProductByHandle()` returns `null` and unavailable metadata on upstream
  failures.
- Preserve optional related-content degradation for linked archive artwork, book
  artwork cards, framed-preview eligibility data, and JSON-LD boundaries.

Out of scope:

- Do not change checkout/cart behavior, enquiry handoff, variant selection,
  product listing/filtering/sorting, Shopify queries/transforms, sitemap,
  metadata copy, framed-preview behavior, or commerce policy copy.
- Do not change artwork, collection-scoped artwork, article, or blog detail
  routes.
- Do not resolve home section loader fallback states, client follow-up fetch
  states, mixed component barrels, account subnavigation, or route loading-state
  documentation.

## Concurrency

Run this task alone with other runtime work touching
`src/app/shop/products/[productHandle]/page.tsx`, product detail tests, shared
public not-found UI, or Shopify product detail presentation.

Owned files:

- `src/app/shop/products/[productHandle]/not-found.tsx`
- `src/app/shop/products/[productHandle]/page.tsx` only if focused source
  hygiene or testability needs a narrow import/signature adjustment
- focused product detail page/not-found tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Missing primary Shopify product content still calls `notFound()`.
- Route-local not-found UI exists for `/shop/products/[productHandle]` and uses
  shared public presentation.
- Product detail metadata behavior for missing and unavailable products is
  unchanged.
- Optional linked archive artwork, book artwork, framed-preview, and structured
  data failures do not turn a found product route into a 404.
- Focused tests pass and same-app HTTP remains absent from product detail
  rendering.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
git diff --check
```

Add any new focused route/not-found component test paths to the command before
handoff.

## Agent Prompt

You are working on T-202. Read `AGENTS.md`, `docs/README.md`, T-199, T-200,
T-201, the A-005 result, the public detail contract in
`docs/architecture/rendering-and-data-fetching.md`, the frontend workstream,
and the Shopify workstream. Implement only the Shopify product detail
route-local not-found UI and focused coverage for `/shop/products/[productHandle]`.
Reuse `PublicDetailNotFound`, preserve the existing primary-product
`notFound()` behavior, preserve metadata and optional related-content
degradation, and do not touch checkout/cart, enquiry, product listing, Shopify
queries/transforms, framed-preview behavior, or shared trackers. Run the
verification commands plus any new focused tests, then update this handoff with
candidate tracker updates.

## Handoff Notes

- Prepared after T-201 completed the article/blog public detail runtime slice.
- Completed on 2026-05-22.
- Added route-local not-found UI for `/shop/products/[productHandle]` using the
  shared `PublicDetailNotFound` presentation.
- Preserved existing product detail runtime behavior: missing primary Shopify
  products still call `notFound()`, missing/unavailable metadata behavior is
  unchanged, and linked archive artwork, book artwork cards, framed-preview
  eligibility, and structured data remain optional related-content paths.
- Added focused coverage in
  `__tests__/unit/shopProductDetailPage.test.tsx` for missing primary Shopify
  products calling `notFound()` without same-app HTTP, plus the route-local
  not-found presentation.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
  passed.
- Verification: `git diff --check` passed.
- Test runs emitted the existing Node `punycode` deprecation warning.
- Candidate tracker updates for the orchestrator: mark the Shopify product
  detail route-local not-found UI slice complete; F-105 can now be reviewed as
  fully implemented across artwork, collection-scoped artwork, article/blog,
  and Shopify product detail route families; note that shared workstream, risk,
  audit, and orchestration trackers were intentionally not edited by this
  implementation task.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark T-202
  complete, F-105 resolved, and T-203 was created for the next F-106 home
  section fallback-state slice.
