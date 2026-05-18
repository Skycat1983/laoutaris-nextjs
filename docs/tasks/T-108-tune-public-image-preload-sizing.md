# T-108 Tune Public Image Preload And Sizing

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Content Assets And Admin Ops](../workstreams/content-assets-and-admin-ops.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Tune public image priority, sizing, and magnifier loading behavior for the home
hero, shop pages, and artwork detail view without changing visual layout,
Cloudinary ownership policy, product data, or commerce behavior.

## Context

- F-086 found the home hero carousel preloads multiple large images at
  `quality={100}`.
- F-087 found product/shop `fill` images without explicit `sizes`, a priority
  shop banner without `sizes`, and `MagnifierImage` preloading a second
  high-resolution image on mount before pointer/focus intent.
- T-101 documented the conservative Cloudinary delivery policy; this task
  should tune current Next image usage without introducing destructive
  Cloudinary behavior or a broad delivery-transform abstraction.
- T-107 completed the current metadata slice. Image performance is the next
  owner-independent A-010 follow-up.

## Scope

- In scope:
  - Limit the active home hero carousel slides so only the initially visible
    hero image is high-priority, and remove unnecessary `quality={100}` usage
    from non-critical hero images.
  - Add explicit responsive `sizes` to active public hero `fill` images touched
    by the home hero path.
  - Add explicit responsive `sizes` to shop listing banner/product detail
    `fill` images and product-detail featured artwork thumbnails where they are
    touched by this slice.
  - Change `MagnifierImage` so the zoom image is loaded only after user intent
    such as pointer/focus entry, rather than on mount.
  - Preserve existing visible layout, alt text, product enquiry behavior,
    artwork saved-item behavior, and image sources.
  - Add focused tests or source invariants for priority/quality/sizes and
    magnifier intent-loading behavior.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Cloudinary transformation centralization, delivery URL rewriting, upload
    ownership, or cleanup policy changes.
  - Visual redesign of home hero, product pages, or artwork detail pages.
  - Metadata/JSON-LD work completed by T-103, T-106, and T-107.
  - Route cache/ISR policy, landmark/heading cleanup, and artwork-to-shop SSR
    discovery.
  - Browser automation unless a layout-sensitive issue cannot be proven with
    focused tests or source checks.

## Files Likely Touched

- `src/components/modules/hero/Hero.tsx`
- `src/components/modules/hero/slides/FilterableArtworks.tsx`
- `src/components/modules/hero/slides/ComingSoon.tsx`
- `src/components/modules/hero/slides/LargeScaleWorks.tsx`
- `src/components/modules/hero/slides/FamilyFavourites.tsx`
- `src/app/shop/products/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- `src/components/modules/MagnifierImage.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-108-tune-public-image-preload-sizing.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- The active home hero path no longer marks every carousel slide image as
  priority or quality 100.
- Touched `fill` images have explicit `sizes` that match their responsive
  layout.
- Shop banner/detail and touched product artwork thumbnail images have explicit
  responsive `sizes`.
- `MagnifierImage` does not instantiate/preload the zoom image on mount; it
  waits for pointer/focus intent and preserves existing zoom behavior.
- Focused tests or source invariants cover the changed image behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicImagePreloadSizing.test.tsx
npm run lint
npm run build
git diff --check
```

Result: passed on 2026-05-18.

## Handoff Notes

- Prepared after T-107 completed artwork/product detail metadata.
- Completed on 2026-05-18 by keeping only the initially visible active home hero
  image prioritized, removing `quality={100}` from active hero slide images,
  adding explicit `sizes` to touched home hero and shop/product `fill` images,
  and making `MagnifierImage` instantiate its high-resolution zoom image only
  after hover/focus intent.
- Added `__tests__/unit/publicImagePreloadSizing.test.tsx` for source
  invariants covering priority/quality/sizes plus component coverage proving the
  magnifier zoom image is not loaded on mount.
- Keep Cloudinary delivery-transform centralization, route cache policy,
  landmark cleanup, and artwork-to-shop SSR discovery separate.
