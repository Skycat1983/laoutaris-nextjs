# T-190 Add Frame Preview Prototype Route

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Add the isolated noindex `/prototype/frame` route so the framed print preview
concept can be inspected before any live product-page wiring.

## Context

- T-187 added frame/mat profile catalogs and pure geometry.
- T-188 added the standalone framed artwork preview component.
- T-189 added the controlled modal shell and material controls.
- The owner asked for a freely inspectable prototype route, separate from the
  existing `/prototype/home` route.

## Scope

In scope:

- Add `/prototype/frame` as a noindex App Router page.
- Add a prototype component under `src/components/prototypes/frame/`.
- Use local fixture artwork metrics for portrait, landscape, square, and
  unusual aspect-ratio examples.
- Render the standalone framed preview and modal controls from the existing
  framed-preview components.
- Keep the route out of public navigation.
- Add focused tests for noindex metadata, route content, fixture examples, and
  source isolation.

Out of scope:

- Do not touch live shop product pages.
- Do not add product eligibility, Shopify option mapping, checkout, cart,
  enquiry integration, MongoDB schema changes, admin forms, or physical
  dimension persistence.
- Do not alter the existing `/prototype/home` route or its current dirty
  working-tree changes.

## Files Likely Touched

- `src/app/prototype/frame/page.tsx`
- `src/components/prototypes/frame/FramePreviewPrototype.tsx`
- `__tests__/unit/pages/PrototypeFramePage.test.tsx`
- this task brief
- framed print preview planning/workstream docs after completion

## Acceptance Criteria

- `/prototype/frame` renders a visible frame-preview workshop.
- The route exports noindex metadata.
- The route demonstrates portrait, landscape, square, and unusual aspect-ratio
  examples.
- The route uses existing frame preview components rather than duplicating
  geometry or modal logic.
- The live `/prototype/home`, `/shop`, and product detail routes are unchanged
  by this task.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
git diff --check
```

Run the local dev server after implementation so the owner can inspect
`/prototype/frame`.

## Handoff Notes

- Started 2026-05-21.
- Completed 2026-05-21.
- Added the noindex `/prototype/frame` route at
  `src/app/prototype/frame/page.tsx`.
- Added `FramePreviewPrototype` under
  `src/components/prototypes/frame/FramePreviewPrototype.tsx`. It uses fixture
  artwork metrics for portrait, landscape, square, and wide examples, renders
  the T-188 standalone preview, and opens the T-189 modal shell.
- Added `__tests__/unit/pages/PrototypeFramePage.test.tsx` covering noindex
  metadata, the isolated route shell, fixture controls, frame material controls,
  modal open/close behavior, and source isolation from live routes/data
  services.
- No live shop product page, `/prototype/home`, Shopify, checkout, cart,
  enquiry, MongoDB, admin, or physical-dimension behavior was changed.
- Verification passed:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
git diff --check
```

- Next framed-preview step: owner/developer review of `/prototype/frame` in a
  browser. If the visual direction is acceptable, prepare T-191 to wire a
  preview launcher into eligible print product pages only.
