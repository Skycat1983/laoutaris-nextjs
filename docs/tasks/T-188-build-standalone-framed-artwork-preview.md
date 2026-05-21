# T-188 Build Standalone Framed Artwork Preview

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Build the standalone framed artwork preview component on top of the T-187
geometry helper without adding modal, product-page, Shopify, checkout, or
enquiry behavior.

## Context

- T-187 added pure frame/mat profiles and geometry contracts.
- The preview component is the visual primitive that later modal and prototype
  route work will wrap.
- The first browsable route remains a later `/prototype/frame` slice.

## Scope

In scope:

- Add a presentational component that accepts artwork image source, alt text,
  pixel metrics, optional frame profile, optional mat profile, and preview
  bounds.
- Render the artwork inside frame and optional mat layers from computed
  geometry.
- Use stable default frame and mat profiles when none are supplied.
- Expose non-visual data attributes for profile IDs and scale mode so later
  tests and wrappers can inspect behavior.
- Add focused component tests.

Out of scope:

- Do not add modal state, carousel controls, `/prototype/frame`, product-page
  launcher wiring, product eligibility, Shopify option mapping, physical
  dimension persistence, checkout, or enquiry integration.

## Files Touched

- `src/components/shop/frame-preview/FramedArtworkPreview.tsx`
- `__tests__/unit/components/FramedArtworkPreview.test.tsx`
- framed print preview planning/workstream docs

## Acceptance Criteria

- The component renders a framed artwork preview from geometry output.
- The component can use explicit frame/mat profiles or stable defaults.
- The component surfaces `relativePreview` and `physicalScalePreview` through a
  data attribute for later wrappers.
- The component has no modal, carousel, product, checkout, or enquiry behavior.
- The component does not import Shopify clients, data services, models, or DB
  helpers.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts __tests__/unit/components/FramedArtworkPreview.test.tsx
npm run lint
git diff --check
```

## Handoff Notes

- Completed 2026-05-21.
- Added `FramedArtworkPreview`, which renders a `figure` containing the frame
  layer, optional mat layer, and `next/image` artwork image using geometry from
  `calculateFramePreviewGeometry()`.
- Added focused component coverage for explicit profile rendering, default
  profile behavior, physical scale mode surfacing, absence of modal/commerce
  behavior, and source isolation from later phases.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts __tests__/unit/components/FramedArtworkPreview.test.tsx`,
  `npm run lint`, and `git diff --check`.
- The focused test run emitted the existing Node `punycode` deprecation warning.
- No visible route exists yet. Next task: build the modal shell and controls.
  The first user-visible route should be `/prototype/frame` in the following
  prototype route slice.
