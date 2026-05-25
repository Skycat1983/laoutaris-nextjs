# T-276 Fix Deterministic Jest Assertion Drift

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)
- [Shopify commerce](../workstreams/shopify-commerce.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Make the two deterministic A-034 source-contract test failures green under the
current intended product image sizing and semantic-style contracts.

## Context

A-034 found that full Jest remains red, but two failures are deterministic and
small:

- `__tests__/unit/publicImagePreloadSizing.test.tsx` still expects the old
  product page image `sizes` string in
  `src/app/shop/products/[productHandle]/page.tsx`, while sale gallery image
  sizing now lives in
  `src/components/shop/product-detail/ShopProductSaleGallery.tsx`.
- `__tests__/unit/styles/semanticStyles.test.ts` requires every semantic style
  value to appear in runtime source, but `displayTitle` currently appears only
  in the semantic style module and test.

## Scope

In scope:

- Decide from existing code/docs whether the current sale gallery `sizes`
  value is intended, then update the test or source accordingly.
- Decide whether the semantic style scaffold may contain future-only values,
  then update the provenance assertion or style usage accordingly.
- Keep runtime visual behavior unchanged unless the current source clearly
  violates the intended contract.

Out of scope:

- Admin/form Jest timeout tuning.
- Public smoke socket handling.
- Broad style-system migration or product gallery redesign.

## Concurrency

Can run in parallel with T-275 and build/deployment tasks. Avoid parallel edits
to `semanticStyles.ts`, the product detail sale gallery, or the two scoped test
files.

## Files Likely Touched

- `__tests__/unit/publicImagePreloadSizing.test.tsx`
- `__tests__/unit/styles/semanticStyles.test.ts`
- `src/components/shop/product-detail/ShopProductSaleGallery.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- `src/lib/styles/semanticStyles.ts`
- `docs/tasks/T-276-fix-deterministic-jest-assertion-drift.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after the deterministic test pair is
  green and the chosen contracts are documented in handoff notes.
- Update `docs/tasks/README.md`.
- If a runtime source contract changes, update the relevant workstream brief.
- Leave A-034 findings/risk reconciliation to T-267 unless explicitly assigned.

## Acceptance Criteria

- The product image sizing test asserts the current intended component boundary
  and expected `sizes` behavior.
- The semantic style provenance test reflects the accepted role of the semantic
  style scaffold.
- No unrelated Jest timeout or socket-permission changes are mixed in.

## Verification

```bash
npm test -- --runInBand --runTestsByPath __tests__/unit/publicImagePreloadSizing.test.tsx __tests__/unit/styles/semanticStyles.test.ts
git diff --check
```

If feasible after the focused tests pass, rerun `npm test` and record the
remaining failures for T-277/T-280.

## Handoff Notes

- Planned from A-034 deterministic failure class.
- 2026-05-25: Updated
  `__tests__/unit/publicImagePreloadSizing.test.tsx` so the product detail
  source contract asserts the current boundary: `/shop/products/[productHandle]`
  composes `ShopProductSaleGallery`, the sale gallery owns the main sale image
  `sizes="(max-width: 1279px) 100vw, 45vw"` and `112px` thumbnail sizing, and
  the product page still owns the featured-book artwork thumbnail sizing.
- 2026-05-25: Updated
  `__tests__/unit/styles/semanticStyles.test.ts` so semantic style values may
  be either copied from current runtime source or explicitly listed as
  scaffold-only leaves. The current scaffold-only leaves are
  `text.displayTitle`, `text.eyebrow`, `action.primary`, `action.textLink`, and
  `layout.sectionBand`; the semantic map remains intentionally unadopted by
  runtime components until a later visual-parity migration task.
- Runtime visual behavior was unchanged; no product gallery, product page, or
  semantic style source module edits were made.
- Verification: `npm test -- --runInBand --runTestsByPath
  __tests__/unit/publicImagePreloadSizing.test.tsx
  __tests__/unit/styles/semanticStyles.test.ts` passed with 2 suites and 8
  tests. The command emitted Node's existing `[DEP0040]` `punycode`
  deprecation warning.
- Full `npm test` was not rerun in this slice; remaining full-suite failure
  classes stay assigned to T-277 and T-280.
