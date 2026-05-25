# T-281 Repair Shop Client Import Boundary

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Shopify commerce](../workstreams/shopify-commerce.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Make the current `clientServerImportBoundary` suite pass by removing the shop
gallery's runtime import from `src/lib/data/types/shopTypes.ts`.

## Context

After T-277 and T-280, targeted reruns show
`__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` and
`__tests__/unit/visibleBreadcrumbs.test.tsx` pass. The current targeted failure
is:

```text
src/lib/data/types/shopTypes.ts
src/components/compositions/ShopProductGallery.tsx -> @/lib/data/types/shopTypes -> src/lib/data/types/shopTypes.ts
```

`ShopProductGallery.tsx` is a client component and imports `SHOP_SORT_OPTIONS`
as a runtime value from the data-types directory. The import-boundary guard
intentionally treats `src/lib/data/types` as unsafe for client runtime imports.

## Scope

In scope:

- Keep `ShopProductGallery` and related shop client components away from runtime
  imports under `src/lib/data/types`.
- Preserve the current `sortBy` URL/API contract from T-269.
- If a runtime sort-option list is needed in client code, move or duplicate it
  in a client-safe location such as `src/lib/data/options/`, or keep it local
  with a focused comment-free implementation.
- Run the import-boundary suite and focused shop listing/gallery tests.

Out of scope:

- Changing shop filter taxonomy or route query parsing.
- Broad client/server boundary rewrites.
- Full Jest stabilization beyond this one failure class.

## Concurrency

Can run in parallel with T-283 and T-284. Coordinate with any agent editing
`ShopProductGallery`, shop filter/result-bar components, or shop sort helpers.
T-282 should wait until this task completes.

## Files Likely Touched

- `src/components/compositions/ShopProductGallery.tsx`
- `src/lib/data/types/shopTypes.ts`
- `src/lib/data/options/`
- `src/lib/data/utils/shopProductSorting.ts`
- `__tests__/unit/security/clientServerImportBoundary.test.ts`
- Existing focused shop listing/gallery tests
- `docs/tasks/T-281-repair-shop-client-import-boundary.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after the import-boundary suite passes.
- Update `docs/tasks/README.md`.
- Record exact verification commands and any remaining full-Jest blockers.
- Leave broad verification rebaselining to T-282.

## Acceptance Criteria

- `ShopProductGallery` has no runtime import path into `src/lib/data/types`.
- The public shop sort/filter UI still accepts and emits the existing `sortBy`
  values.
- `clientServerImportBoundary.test.ts` passes.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/shopUnsupportedControls.test.tsx __tests__/unit/pages/ShopProductsPage.test.tsx
git diff --check
```

## Handoff Notes

- Completed on 2026-05-25 by moving the runtime shop sort option list to
  `src/lib/data/options/shopSortOptions.ts`.
- `ShopProductGallery`, `ShopResultsBar`, shop sorting helpers, and the public
  shop query schema now use the client-safe sort option source. `shopTypes.ts`
  remains shape-only and is imported from client code only with type imports.
- Scoped verification passed:
  `npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/shopUnsupportedControls.test.tsx __tests__/unit/pages/ShopProductsPage.test.tsx`.
- `git diff --check` passed.
- No full-Jest blockers were investigated here; broad verification
  rebaselining remains T-282.
