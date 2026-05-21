# T-192 Improve Frame Preview Material Rendering

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Improve the visual realism of the framed print preview by adding prototype-only
support for independent mat margin selection, rail-based frame rendering,
beveling, material texture styling, and mitred corner treatment.

## Context

- T-187 through T-191 established the geometry, preview component, modal shell,
  `/prototype/frame`, and product-page launcher.
- Owner feedback confirmed orientation should be derived from artwork pixel
  dimensions, not selected by users.
- Owner feedback prioritized better material realism, bevel depth, mitred joins,
  and explicit margin controls.

## Scope

In scope:

- Add a renderer mode that keeps the existing simple box renderer as a fallback
  while enabling a rail-based visual renderer for prototype review.
- Add visual profile fields for material texture layers and bevel intent without
  adding Shopify mappings.
- Add prototype controls for mat margin presets.
- Replace visible prototype sample labels with neutral sample labels rather
  than portrait/landscape/square wording.
- Render four frame rails with mitred `clip-path` ends and bevel/texture
  overlays in `/prototype/frame`.
- Add focused tests for renderer mode attributes, mat margin controls, and
  source isolation.

Out of scope:

- Do not generate or commit AI texture assets in this slice.
- Do not map frame choices to Shopify variants, prices, checkout, cart, or
  enquiry payloads.
- Do not add physical dimension persistence, admin controls, or MongoDB schema
  changes.
- Do not change `/prototype/home` or unrelated homepage prototype work.

## Files Likely Touched

- `src/lib/framePreview/types.ts`
- `src/lib/framePreview/frameProfiles.ts`
- `src/components/shop/frame-preview/FramedArtworkPreview.tsx`
- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx`
- `src/components/prototypes/frame/FramePreviewPrototype.tsx`
- focused tests under `__tests__/unit/`
- framed print preview planning/workstream docs after completion

## Acceptance Criteria

- `/prototype/frame` can render the improved rail/bevel/mitred frame treatment.
- Existing simple frame rendering remains available as a fallback/default.
- Prototype sample controls do not ask the user to choose orientation.
- Mat margin can be changed independently from frame material.
- Product-page commerce behavior, enquiry behavior, and Shopify data contracts
  remain unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
npm run build
git diff --check
```

Run the local dev server after implementation so `/prototype/frame` can be
reviewed visually.

## Handoff Notes

- Started 2026-05-21.
- Completed 2026-05-21.
- Added `FrameRenderMode` and `FrameTextureKind` contracts plus profile-level
  highlight, shadow, seam, and texture intent fields.
- Kept the existing `simple` renderer as the default fallback and added a
  `rails` renderer to `FramedArtworkPreview` with four rails, mitred
  `clip-path` ends, seam overlays, bevel shadows, and procedural material
  texture backgrounds.
- Added optional `renderMode` pass-through to `FramedPrintPreviewModal`.
- Updated `/prototype/frame` to use the rail renderer, neutral sample labels,
  and mat margin preset controls. The prototype no longer exposes
  portrait/landscape/square wording as a user choice.
- Product-page launcher behavior remains on the default simple renderer until
  the new visual treatment is reviewed.
- No AI texture assets were generated or committed. The next material-quality
  step can replace or augment the procedural texture backgrounds with
  owner-approved seamless texture assets.
- Verification passed:

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
npm run build
git diff --check
```

- Local dev server started with `npm run dev` on `http://localhost:3003`
  because ports 3000, 3001, and 3002 were already in use. A targeted
  `curl -I http://localhost:3003/prototype/frame` returned `200 OK` after the
  route compiled. The dev server logged transient Google font retry warnings
  while compiling, but the route still served successfully.
- Next framed-preview step: review `/prototype/frame` visually. If the rail
  shape and margin controls are approved, either apply `renderMode="rails"` to
  the product-page launcher or start a dedicated texture-asset slice for
  seamless wood/metal materials before product-page rollout.
