# T-187 Add Frame Preview Geometry Contracts

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Add the pure frame preview profile and geometry foundation for the framed print
preview feature without changing any runtime product page UI.

## Context

- The framed print preview feature starts with pixel-based relative geometry.
- Physical print dimensions are not currently available, but the contract must
  support them later.
- `/prototype/frame`, modal UI, product-page launcher wiring, Shopify option
  mapping, and physical-dimension persistence are later phases.

## Scope

In scope:

- Add frame profile and mat profile source configuration.
- Add display metric and geometry TypeScript contracts.
- Add a pure geometry helper that fits artwork, mat, and frame inside preview
  bounds.
- Keep `relativePreview` as the default mode.
- Switch to `physicalScalePreview` only when complete print dimensions and
  physical frame/mat widths are available.
- Add focused unit tests for portrait, landscape, square, extreme aspect ratio,
  clamp behavior, mat behavior, physical mode, fallback behavior, validation,
  and source hygiene.

Out of scope:

- Do not add visual components, modal UI, `/prototype/frame`, product-page
  launcher wiring, Shopify contracts, MongoDB schemas, admin forms, checkout,
  or enquiry behavior.

## Files Touched

- `src/lib/framePreview/types.ts`
- `src/lib/framePreview/frameProfiles.ts`
- `src/lib/framePreview/matProfiles.ts`
- `src/lib/framePreview/geometry.ts`
- `__tests__/unit/framePreview/geometry.test.ts`
- framed print preview planning/workstream docs

## Acceptance Criteria

- Geometry remains pure and unit-tested.
- Profile IDs are stable and unique.
- Preview geometry fits portrait, landscape, square, and extreme aspect-ratio
  artwork into requested bounds without distorting the artwork.
- Frame and mat thickness use configured ratio/clamp behavior in relative mode.
- Physical mode requires complete print dimensions and physical profile widths.
- Missing original-only dimensions and mismatched print ratios fall back to
  relative mode.
- The helper does not import React, Next, Shopify clients, Mongoose models,
  MongoDB helpers, app data services, or browser globals.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts
npm run lint
git diff --check
```

## Handoff Notes

- Completed 2026-05-21.
- Added the first source-controlled frame catalog: black wood, white wood,
  natural oak, walnut, and brushed metal.
- Added the first mat catalog: no mat, warm white mat, and wide gallery mat.
- Added `calculateFramePreviewGeometry()` and `getFrameScaleMode()` under
  `src/lib/framePreview/geometry.ts`.
- The geometry helper accepts artwork pixel metrics, optional future print
  dimensions, a frame profile, a mat profile, and preview bounds. It returns
  computed artwork, mat, frame, and outer dimensions plus the active scale mode.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts`
  with 15 tests, `npm run lint`, and `git diff --check`.
- The focused test run emitted the existing Node `punycode` deprecation warning.
- Next task: build the standalone framed artwork preview component from this
  geometry. Do not wire product pages yet.
