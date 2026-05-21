# T-189 Build Framed Print Preview Modal Shell

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Build a controlled modal shell and frame-material controls around the standalone
framed artwork preview without adding a route, product-page wiring, Shopify
option mapping, checkout, or enquiry behavior.

## Context

- T-187 added pure profile and geometry helpers.
- T-188 added the standalone `FramedArtworkPreview` visual primitive.
- `/prototype/frame` remains the next slice and will be the first browser-visible
  review surface.

## Scope

In scope:

- Add a controlled modal component that receives `isOpen`, `onClose`, artwork
  preview input, frame profiles, optional initial frame profile, mat profile,
  and bounds.
- Add previous/next frame material controls.
- Add direct frame-material swatch controls.
- Support close button, Escape key, and backdrop close behavior.
- Keep copy preview-only.
- Add focused component tests.

Out of scope:

- Do not add `/prototype/frame`, product-page launcher wiring, product
  eligibility, Shopify option mapping, physical dimension persistence, checkout,
  or enquiry integration.

## Files Touched

- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx`
- `src/components/shop/frame-preview/FrameMaterialControls.tsx`
- `__tests__/unit/components/FramedPrintPreviewModal.test.tsx`
- framed print preview planning/workstream docs

## Acceptance Criteria

- Modal renders only when open and frame profiles are available.
- Modal exposes `dialog` semantics and focuses the close button on open.
- Close button, Escape key, and backdrop close call `onClose`.
- Previous and next controls cycle frame profiles with wraparound behavior.
- Swatch controls select specific frame profiles and expose selected state.
- Modal remains isolated from product routes, Shopify clients, checkout, cart,
  and enquiry behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx
npm run lint
git diff --check
```

## Handoff Notes

- Completed 2026-05-21.
- Added `FramedPrintPreviewModal`, a controlled client component that wraps
  `FramedArtworkPreview`.
- Added `FrameMaterialControls` with labelled previous/next buttons and direct
  swatch buttons.
- Added focused modal coverage for open rendering, closed/empty profile
  fallback, close button, Escape key, backdrop close, previous/next cycling,
  direct swatch selection, unknown initial profile fallback, and source
  isolation from product/commerce phases.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx`,
  `npm run lint`, and `git diff --check`.
- The focused test run emitted the existing Node `punycode` deprecation warning.
- No visible route exists yet. Next task: add the noindex `/prototype/frame`
  workshop route so the owner can inspect the concept in a browser.
