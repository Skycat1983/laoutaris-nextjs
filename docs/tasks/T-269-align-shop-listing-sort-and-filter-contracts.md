# T-269 Align Shop Listing Sort And Filter Contracts

Status: Completed

Workstreams:

- [Shopify commerce](../workstreams/shopify-commerce.md)
- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)

## Goal

Align public shop listing sort and taxonomy filter behavior with the route/API
contracts users can deep-link to.

## Context

- A-028 found `sortBy` is accepted by the shop query schema but is not wired
  through the page, service, or URL updates; sorting is client-only local state.
- A-028 also found public shop filter controls omit canonical accepted values
  such as `2020s`, `paint`, and `pastel`.

## Scope

In scope:

- Either implement coherent route-query-backed shop sorting or remove
  unsupported `sortBy` query vocabulary. Prefer implementation if it can follow
  current local sort semantics without changing commerce boundaries.
- Derive public shop filter options from canonical constants or a shared labeled
  option module.
- Add focused service/component/page tests for the chosen sort/filter contract.

Out of scope:

- Checkout/cart behavior.
- Public search behavior already handled by T-266.
- Shopify variant/option mapping.
- Broad shop visual redesign.

## Concurrency

Can run in parallel with admin/auth/testing tasks. Do not run in parallel with
another task editing shop listing services, shop filters, or shop product
gallery sorting tests.

## Files Likely Touched

- `src/app/shop/products/page.tsx`
- `src/components/compositions/ShopProductGallery.tsx`
- `src/components/modules/filters/ShopFilters.tsx`
- `src/lib/data/schemas/shopProductListQuerySchema.ts`
- `src/lib/data/services/getShopProductList.ts`
- Focused shop listing tests
- This task and `docs/tasks/README.md`

## Completion Contract

- Update this task and task index with exact behavior chosen and verification.
- List candidate workstream/risk updates in handoff notes.

## Acceptance Criteria

- Shop sort behavior is either honestly route-backed or no longer advertised as
  a route/API contract.
- Public shop taxonomy filter controls include canonical accepted values or are
  generated from the canonical source.
- Tests cover the contract.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/shopProductGallerySorting.test.tsx <focused shop listing tests>
git diff --check
```

## Handoff Notes

- Completed 2026-05-25.
- Chosen behavior: keep `sortBy` as a route/API contract. `/shop/products`
  passes deep-linked `sortBy` into `ShopProductsLoader`, the shared
  `getShopProductList` service applies the same type/price/title sorting used
  by the gallery, and client sort/filter changes update the browser URL.
- Public shop taxonomy filter options now render from
  `src/lib/data/options/shopFilterOptions.ts`, which derives values from the
  canonical artwork constants and includes `2020s`, `paint`, and `pastel`.
- Focused tests added/updated for service sorting, loader propagation, page
  query handoff, gallery URL/API behavior, and canonical filter option parity.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/shopUnsupportedControls.test.tsx __tests__/unit/loaders/ShopProductsLoader.test.tsx __tests__/unit/api/shopProductsRoute.test.ts __tests__/unit/data/getShopProductList.test.ts __tests__/unit/pages/ShopProductsPage.test.tsx`.
- Candidate risk/workstream updates: no new production risk identified.
  Public shop pagination remains separate; checkout/cart, search, Shopify
  variant mapping, and visual redesign remain out of scope.
