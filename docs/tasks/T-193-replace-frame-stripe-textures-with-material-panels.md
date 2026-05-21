# T-193 Replace Frame Stripe Textures With Material Panels

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Remove the visible regular stripe effect from the rail renderer and replace it
with non-repeating material panel fills that look more consistent behind the
mitred trapezoid rails.

## Context

- T-192 added the prototype `rails` renderer with procedural texture layers.
- Owner review found the repeating stripe texture is visually distracting and
  appears across frame materials.
- The owner approved a non-tileable material panel approach where each rail is
  filled by one larger texture field and clipped into shape.

## Scope

In scope:

- Remove `repeating-linear-gradient` texture layers from the rail renderer.
- Replace them with non-repeating, full-rail material panel gradients.
- Set rail backgrounds to `no-repeat` and `100% 100%` so the panel fills the
  clipped trapezoid shape instead of tiling.
- Keep bevels, mitred seams, and rail geometry from T-192.
- Update tests and docs to capture the non-repeating panel contract.

Out of scope:

- Do not generate or commit AI texture image assets in this slice.
- Do not apply the rail renderer to product pages.
- Do not change checkout, cart, enquiry payloads, Shopify option mapping,
  MongoDB/admin data, or physical-dimension behavior.
- Do not touch `/prototype/home` or unrelated homepage prototype work.

## Acceptance Criteria

- `/prototype/frame` no longer uses the regular stripe texture pattern.
- Rail backgrounds fill the clipped rail shape as a single panel.
- The renderer still supports wood, painted wood, and brushed metal intent.
- Existing frame geometry, mat margin controls, and modal behavior remain
  intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx
npm run lint
npm run build
git diff --check
```

Run the local dev server after implementation so `/prototype/frame` can be
reviewed visually.

## Handoff Notes

- Started 2026-05-21.
- Completed 2026-05-21.
- Replaced the rail renderer's repeated stripe textures with full-rail
  non-repeating material panel backgrounds.
- Rail panels now use `backgroundImage`, `backgroundRepeat: "no-repeat"`, and
  `backgroundSize: "100% 100%"` so the material field fills the clipped
  trapezoid instead of tiling across it.
- Bevel shadows, mitred seams, rail geometry, mat margin controls, and modal
  behavior were preserved.
- Focused tests assert the rail renderer exposes panel mode and no longer emits
  `repeating-linear-gradient` for rail backgrounds.
- Product-page previews still use the simple renderer; `/prototype/frame` is
  the review surface for the rail panel treatment.
- Fresh dev server for review: `http://localhost:3004/prototype/frame`.
- Route check: `curl -I http://localhost:3004/prototype/frame` returned
  `200 OK` after the initial development compile. The older server on port
  `3003` returned `500`, so use port `3004` for this review session.

Verification run:

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx
npm run lint
npm run build
curl -I http://localhost:3004/prototype/frame
git diff --check
```
