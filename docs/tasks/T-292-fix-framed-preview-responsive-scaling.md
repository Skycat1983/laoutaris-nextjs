# T-292 Fix Framed Preview Responsive Scaling

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Fix the narrow/mobile `/prototype/frame` room and modal preview cropping found by
T-194 so the framed print preview can return to owner review without applying the
rail renderer to live product pages.

## Context

T-194 completed targeted visual QA and found the desktop room, close-up material,
mat spacing, rail panel, room switching, modal, and default shadow behavior usable
for internal review. It also found two blocking narrow-width issues at `390x844`:

- The room-scale framed object starts above the room scene crop.
- The mobile modal frame is wider than the dialog and crops horizontally.

This follow-up should address those responsive fit issues only.

## Scope

In scope:

- Adjust `/prototype/frame` room-scene scaling or container constraints so the
  framed object stays inside the visible room scene at narrow/mobile widths.
- Adjust modal preview sizing so the rail-rendered framed preview fits within a
  narrow dialog without horizontal cropping.
- Preserve desktop room positioning, centered hanging behavior, buffered room
  switching, fixed-print mat behavior, even mat spacing, material panel fills,
  mitred rails, bevels, corner shadows, and Escape-close modal behavior.
- Add or update focused tests/source checks for the responsive constraints where
  practical.
- Update this task, task index, and relevant workstream notes after completion.

Out of scope:

- Do not apply the rail renderer to product pages.
- Do not change live shop sale-gallery behavior.
- Do not generate or add real texture image assets.
- Do not start Shopify option mapping, checkout/cart work, enquiry mutation,
  frame selection persistence, sale-policy copy, or physical-dimension
  migration.
- Do not retune room background selection or final wall shadow values beyond
  what is necessary to preserve the existing default.

## Concurrency

Do not run in parallel with another task editing `/prototype/frame`,
`src/components/prototypes/frame/*`,
`src/components/shop/frame-preview/*`, or `src/lib/framePreview/*`.

This task owns the implementation files it changes plus this task brief,
`docs/tasks/README.md`, and relevant Shopify/frontend/testing workstream notes.
Leave unrelated dirty files alone.

## Files Likely Touched

- `src/components/prototypes/frame/FramePreviewPrototype.tsx`
- `src/components/shop/frame-preview/FramedArtworkPreview.tsx`
- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx`
- `src/components/shop/frame-preview/RoomFramedArtworkPreview.tsx`
- `src/lib/framePreview/roomScenes.ts`
- `__tests__/unit/components/FramedArtworkPreview.test.tsx`
- `__tests__/unit/pages/PrototypeFramePage.test.tsx`
- `docs/tasks/T-292-fix-framed-preview-responsive-scaling.md`
- `docs/tasks/README.md`
- Relevant workstream notes

## Completion Contract

- Mark this task `Status: Completed` only after the narrow/mobile cropping
  issues are fixed and focused verification is recorded.
- Record exact source/test/browser checks in `Handoff Notes`.
- State whether `/prototype/frame` is owner-review-ready after the fix or
  whether another targeted visual refinement remains.
- Keep product-page rail adoption, real texture assets, Shopify option mapping,
  checkout/cart, enquiry mutation, and physical-dimension work paused unless a
  later task explicitly scopes them.

## Acceptance Criteria

- At a narrow/mobile viewport, the room-scene framed object stays inside the
  visible room scene instead of starting above the scene crop.
- At a narrow/mobile viewport, the modal framed preview fits inside the dialog
  without horizontal cropping.
- Desktop room and modal behavior remain visually equivalent to the T-194
  accepted baseline.
- Material rail panel fills still use non-repeating backgrounds.
- Mat spacing remains balanced after the responsive fit changes.
- Buffered room switching still keeps the previous room visible until the
  requested room has loaded.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx
npm run lint
npm run build
git diff --check
```

Run a targeted local browser check for `/prototype/frame` at one desktop width
and one narrow/mobile width. Keep screenshots/DOM evidence small and summarize
only the fit measurements needed to prove the crop is fixed.

## Handoff Notes

- Planned on 2026-05-26 from T-194 visual QA. T-194 found `/prototype/frame`
  should pause before owner review until narrow/mobile room and modal cropping
  are fixed.
- Completed on 2026-05-26. `FramedArtworkPreview` now keeps the calculated
  geometry as its max size while rendering the outer frame, rail content, mat,
  and image as fluid percentage-based layers, so constrained containers shrink
  the whole framed object instead of clipping fixed-pixel children. The
  prototype and shared room-preview shadow wrappers now cap their contents to
  the hanging-zone width, which fixes the narrow room crop without moving the
  desktop hanging anchor.
- `/prototype/frame` is owner-review-ready for the T-194/T-292 scoped frame,
  room, and modal review. Product-page rail adoption, real texture assets,
  Shopify option mapping, checkout/cart, enquiry mutation, and physical
  dimension migration remain paused and out of scope.
- Focused browser fit check was run against local `http://localhost:3002` with
  headless Chrome/CDP and bounding-box measurements only. At `1280x900`, the
  room frame was contained in the room (`169.3x220.3` frame inside
  `778x486.6` room) and the modal frame was horizontally contained (`430x560`
  frame inside `1024px` dialog). At `390x844`, the room frame was contained
  (`136x177.1` frame inside `358x223.9` room) and the modal frame was
  horizontally contained (`318px` wide frame inside `358px` dialog).
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`.
