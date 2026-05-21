# T-191 Wire Framed Preview Launcher To Product Pages

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Expose the framed print preview modal from eligible print product detail pages
without changing checkout, cart, enquiry, Shopify option mapping, or product
data persistence.

## Context

- T-187 added frame/mat profile catalogs and pure geometry.
- T-188 added the standalone framed artwork preview component.
- T-189 added the controlled modal shell and material controls.
- T-190 added the isolated noindex `/prototype/frame` review route.
- Product detail pages already resolve linked MongoDB artwork for non-book
  products through `mongodbArtworkId`.

## Scope

In scope:

- Add a pure product eligibility and preview-artwork normalization helper under
  `src/lib/framePreview/`.
- Add a product-page client launcher island that owns only the preview button
  and modal open state.
- Render `Preview Frame Options` only for available print products with a valid
  linked archive artwork image URL and positive pixel dimensions.
- Keep the existing product image, product details, enquiry CTA, and linked
  artwork handoff unchanged.
- Add focused tests for eligibility, launcher behavior, and product page
  eligible/ineligible rendering.

Out of scope:

- Do not add cart, checkout, direct purchase, Shopify mutations, variant
  selection, line-item state, price changes, or enquiry payload changes.
- Do not add physical dimension persistence or admin forms.
- Do not wire frame selections into Shopify or MongoDB.
- Do not alter `/prototype/frame` or `/prototype/home`.

## Files Likely Touched

- `src/lib/framePreview/productEligibility.ts`
- `src/components/shop/frame-preview/FramedPrintPreviewLauncher.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- focused tests under `__tests__/unit/`
- framed print preview planning/workstream docs after completion

## Acceptance Criteria

- Available print products with linked artwork image metrics render
  `Preview Frame Options`.
- Clicking the button opens the frame preview modal for the linked artwork.
- Books, originals, unavailable products, unlinked products, linked-artwork
  failures, and invalid linked artwork image metrics do not render the preview
  entry point.
- Existing product enquiry behavior remains unchanged.
- Frame selection remains preview-only and is not persisted or submitted.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/framePreview/productEligibility.test.ts __tests__/unit/components/FramedPrintPreviewLauncher.test.tsx __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
npm run build
git diff --check
```

Run a targeted browser check for one eligible print product only if a suitable
local product handle is available without new data setup.

## Handoff Notes

- Started 2026-05-21.
- Completed 2026-05-21.
- Added `src/lib/framePreview/productEligibility.ts` to centralize product
  metadata eligibility and linked-artwork image metric normalization.
- Added `src/components/shop/frame-preview/FramedPrintPreviewLauncher.tsx` as a
  client island for the product-page `Preview Frame Options` button and modal
  open state.
- Updated `src/app/shop/products/[productHandle]/page.tsx` to render the
  launcher only for available print products with a linked artwork image URL and
  positive pixel dimensions.
- Added focused tests for eligibility, launcher modal behavior, and product
  detail eligible/ineligible rendering.
- Fixed a type-only state inference issue in
  `src/components/prototypes/frame/FramePreviewPrototype.tsx` that `npm run
  build` exposed after T-190.
- No checkout, cart, Shopify mutation, variant selection, enquiry payload,
  MongoDB, admin, physical-dimension, `/prototype/home`, or `/prototype/frame`
  behavior changed.
- Verification passed:

```bash
npm test -- --runTestsByPath __tests__/unit/framePreview/productEligibility.test.ts __tests__/unit/components/FramedPrintPreviewLauncher.test.tsx __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
npm run build
git diff --check
```

- Local dev server started with `npm run dev` on `http://localhost:3002`
  because ports 3000 and 3001 were already in use. A targeted
  `curl -I http://localhost:3002/prototype/frame` returned `200 OK` after the
  route compiled.
- Next framed-preview step: M6/T-192 visual QA and owner review on
  `/prototype/frame` plus representative real product handles. Record the chosen
  handles and any visual decisions before Shopify option mapping begins.
