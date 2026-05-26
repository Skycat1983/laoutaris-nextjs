# T-293 Review Live Sale Gallery Visual QA

Status: Completed

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
- Completed on 2026-05-26 with a scoped live sale-gallery visual QA pass at
  desktop `1440x1000` and narrow/mobile `390x844` viewports. Reviewed routes:
  `/shop/products/joseph-laoutaris-fine-art-print-no-034`,
  `/shop/products/joseph-laoutaris-original-artwork-no-043`, and book-candidate
  `/shop/products/the-complete-artwork-of-joseph-laoutaris`.
- Current Shopify Storefront product data was queried to discover handles. The
  reviewed print and original products have empty `productType`, mostly empty
  `tags`, no `mongodbArtworkId`, no hosted `onlineStoreUrl`, and one Shopify
  product image each. The book-candidate product
  `the-complete-artwork-of-joseph-laoutaris` has five Shopify images, but also
  has empty `productType`, empty `tags`, no `featuredArtworkIds`, and no
  explicit book/catalog/publication marker in Storefront data.
- Print route result: owner-review-ready for the scoped unlinked-print
  behavior. The route returned `200`, rendered `shop-product-sale-gallery`,
  used the raw Shopify product image as the first gallery item, exposed five
  gallery buttons (`raw artwork` plus four room previews), showed print-only
  frame and mat selects, switched to the Modern Gallery room preview in the
  browser click check, hid archive-record linking because linked archive data
  was absent, and used truthful enquiry fallback copy: `Enquire About This
  Product` plus `Contact the archive team to confirm availability and purchase
  details.` No horizontal document overflow was detected at either viewport.
- Original route result: needs visual refinement or a second owner-review pass
  before sign-off. The route returned `200`, rendered the sale shell, showed
  `Original Artwork`/`Original artwork`, omitted print-only frame and mat
  controls, showed five gallery buttons for raw plus generated room previews,
  hid archive-record linking because linked archive data was absent, and used
  the truthful enquiry fallback. However, the desktop screenshot showed the raw
  original preview/first thumbnail reading as a mostly blank white area even
  though the resolved image URL was a Shopify product image, and a follow-up
  room-selection click check was not repeatable after intermittent Shopify
  fetch failures in the local dev server. Treat the original route as not yet
  owner-review-ready until the raw image visibility and room-selection behavior
  are rechecked with stable product fetches.
- Book route result: blocked by missing/misleading product-kind metadata, not
  owner-review-ready for book behavior. The best current book candidate,
  `/shop/products/the-complete-artwork-of-joseph-laoutaris`, returned `200` and
  rendered the sale gallery, but the live route classified it as `Original
  Artwork`/`Original artwork` because Storefront metadata lacks book markers
  and the title/handle contain `artwork`. As a result, the route rendered
  generated room-preview gallery labels instead of the expected ordered
  Shopify book image/page gallery behavior. The candidate still omitted
  print-only frame and mat controls and used the truthful enquiry fallback.
- Targeted browser evidence was intentionally limited to selector facts,
  bounding boxes, route statuses, and six viewport screenshots saved in
  `/private/tmp`: `t293-print-desktop.png`, `t293-print-mobile.png`,
  `t293-original-desktop.png`, `t293-original-mobile.png`,
  `t293-book-desktop.png`, and `t293-book-mobile.png`. No traces, videos, full
  DOM dumps, full browser logs, or broad screenshot sets were collected.
- Candidate tracker updates for the orchestrator: add a commerce/data cleanup
  task to mark book products with durable Shopify metadata such as
  `productType`, tags, or featured artwork IDs before relying on product-detail
  book behavior; add a focused frontend follow-up to recheck original artwork
  raw image visibility and room-gallery selection with stable Shopify fetches;
  consider recording that current Storefront test products lack
  `onlineStoreUrl`, so scoped live product CTAs currently exercise enquiry
  fallback rather than hosted Shopify purchase.
- Intentionally out of scope and not changed: runtime source, app-owned cart or
  checkout, checkout line items, Shopify option mapping, frame/mat persistence,
  sale-policy copy, enquiry mutation, physical dimension migration, rail
  renderer adoption, product data migration, route cache policy, shop listing
  redesign, shared trackers, and workstream briefs.
- Verification:
  - Storefront product-discovery query via local `.env` completed and printed
    only product IDs, handles, titles, taxonomy fields, image counts, image
    dimensions, and relevant metafield presence.
  - Scoped Chrome DevTools Protocol visual pass completed against
    `http://localhost:3003` for the three named product routes at `1440x1000`
    and `390x844`.
  - Local dev-server checks required escalated network permission and still
    logged intermittent `getProductByHandle` Shopify `fetch failed` errors
    during some repeated navigations; the completed selector/screenshot pass
    above used successful `200` route responses, but the original-room
    follow-up was not stable enough for sign-off.
  - `git diff --check` passed.
