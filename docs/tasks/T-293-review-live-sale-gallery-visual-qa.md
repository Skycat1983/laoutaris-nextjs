# T-293 Review Live Sale Gallery Visual QA

Status: Planned

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Run a narrow owner-review or visual-QA pass on the live T-261 shop product sale
gallery using one unlinked print product handle, one original artwork product
handle, and one book product handle.

## Context

- T-261 made `/shop/products/[productHandle]` render the sale gallery as the
  common detail layout for prints, originals, books, and generic products.
- The verified unlinked print route from T-261 was
  `/shop/products/joseph-laoutaris-fine-art-print-no-139`; later visual checks
  also used `/shop/products/joseph-laoutaris-fine-art-print-no-034`.
- T-292 fixed the `/prototype/frame` narrow/mobile room and modal crop, but
  product-page rail adoption remains paused. This task reviews the current live
  sale gallery behavior only.
- If original or book handles are not already known, discover them from the
  local `/shop/products` listing, available fixture/source evidence, or the
  current Shopify product data. If a required product kind cannot be found,
  record that as a review blocker instead of broadening the task.

## Scope

In scope:

- Start from the known unlinked print handle, then identify one original artwork
  handle and one book handle for the review.
- Inspect the live sale gallery at targeted desktop and mobile/narrow widths.
- Check layout stability, selected room backgrounds, raw image/gallery
  selection, print-only frame and mat controls, original artwork room previews,
  book image/page gallery behavior, CTA wording, and graceful behavior when
  linked archive data is absent.
- Record concise visual findings, owner-review readiness, product handles used,
  and any follow-up decisions needed.
- Keep browser evidence targeted: selectors, route status, small screenshots or
  bounding-box notes only when they directly prove a visual finding.

Out of scope:

- Do not implement app-owned cart, checkout, checkout line items, Shopify option
  mapping, selected frame/mat persistence, sale-policy copy, enquiry mutation,
  physical dimension migration, product-page rail renderer adoption, real
  texture assets, or room-background selection changes.
- Do not change runtime source unless the orchestrator explicitly converts a
  finding into a separate implementation task.
- Do not perform broad Shopify product migration, product-link cleanup, route
  cache policy work, shop listing redesign, or unrelated visual redesign.

## Concurrency

This is a focused review task and can run in parallel with unrelated backend or
docs work. It should not run in parallel with another task editing
`src/app/shop/products/[productHandle]/page.tsx`,
`src/components/shop/product-detail/*`, or
`src/components/shop/frame-preview/*`.

Owned files:

- this task brief handoff section only
- optional concise assessment note if screenshot references or owner notes need
  a durable location

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `src/app/shop/products/[productHandle]/page.tsx`
- `src/components/shop/product-detail/ShopProductSaleGallery.tsx`
- `src/components/shop/frame-preview/*`
- `src/lib/framePreview/*`
- `__tests__/unit/shopProductDetailPage.test.tsx`
- `docs/tasks/T-261-build-shop-product-sale-gallery-mockup.md`
- `docs/architecture/framed-print-preview.md`

## Completion Contract

- Mark this task `Status: Completed` only after the targeted review is done and
  exact routes, viewport scope, and verification are recorded.
- State whether the live sale gallery is ready for owner review for the scoped
  print/original/book behavior, needs another visual refinement, or is blocked
  by missing product data.
- Add dated completion notes under `Handoff Notes` with product handles used,
  visual findings, intentionally out-of-scope work, and exact verification
  results.
- If shared trackers are not owned by this task, list candidate tracker updates
  for the orchestrator instead of editing them.

## Acceptance Criteria

- The handoff names the reviewed print, original artwork, and book handles, or
  records a concrete blocker for any missing kind.
- The handoff states whether each reviewed route renders the sale gallery and
  whether the desktop and mobile/narrow layout is owner-review-ready.
- Print review confirms raw preview behavior, room preview behavior, frame/mat
  controls, and truthful purchase/enquiry CTA wording.
- Original artwork review confirms the sale shell, generated room previews when
  available, and absence of print-only frame/mat controls.
- Book review confirms ordered product image/page gallery behavior and absence
  of print-only frame/mat controls.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

If browser automation is used, keep it limited to the three named product
routes, targeted selectors, one desktop viewport, and one mobile/narrow
viewport. Do not collect traces, videos, full DOM dumps, full browser logs, or
large screenshot sets.

## Agent Prompt

You are working on T-293. Read `AGENTS.md`, `docs/README.md`,
`docs/tasks/T-261-build-shop-product-sale-gallery-mockup.md`,
`docs/architecture/framed-print-preview.md`, and the Shopify/frontend/testing
workstreams. Run a narrow visual-QA pass on the live
`/shop/products/[productHandle]` sale gallery using one unlinked print handle,
one original artwork handle, and one book handle. Start from the T-261 print
handle evidence, discover the original and book handles from local listing,
fixture/source evidence, or current Shopify data, and record a blocker if a
kind cannot be found. Review only layout, selected room backgrounds, raw image
and gallery selection, print-only frame/mat presentation, book image/page
behavior, CTA wording, and desktop/mobile fit. Do not edit runtime source or
shared trackers. Run `git diff --check`.

## Handoff Notes

- Planned on 2026-05-26 after T-292 made `/prototype/frame`
  owner-review-ready for the scoped frame, room, and modal review. The live
  T-261 sale gallery still needs a narrow owner-review/visual-QA pass with
  named print, original artwork, and book product handles.
