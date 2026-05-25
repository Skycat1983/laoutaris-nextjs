# T-261 Build Shop Product Sale Gallery Mockup

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Build the new shop product detail sale presentation from the owner mockup as
the common product-detail layout: a shop-specific sale information panel, a
main product/artwork preview, and print-specific room previews whose frame and
mat selections update together.

## Context

- The owner mockup is represented by the newly added local reference image
  `to_prototype/shop_card.png` and the chat handoff image. It shows a sale
  panel on the left, a large selected image in the center, and a vertical
  gallery on the right.
- The existing archive card at
  `src/components/modules/cards/ArtworkArchiveInfoCard.tsx` includes colour
  palette and favourites/watchlist controls. Do not change that card for this
  task. Create a shop-specific variant or new component instead.
- The current product detail route is
  `src/app/shop/products/[productHandle]/page.tsx`. It fetches the Shopify
  product, optional linked artwork, optional book artworks, and builds
  `framePreviewArtwork` through `buildFramedPrintPreviewArtwork()`.
- The frame/mat foundation already exists in `src/lib/framePreview/*` and
  `src/components/shop/frame-preview/FramedArtworkPreview.tsx`.
- The `/prototype/frame` route currently owns useful room-preview code in
  `src/components/prototypes/frame/FramePreviewPrototype.tsx`, including
  `ROOM_SCENES`, the shared hanging zone, scaled frame/mat profiles, and room
  shadow styling. Reuse or extract the production-safe pieces rather than
  importing the prototype component into the live shop route.
- Commerce architecture still forbids app-owned cart/checkout controls. Product
  detail pages must preserve the current Shopify-hosted purchase URL or enquiry
  fallback from
  [Shopify commerce architecture](../architecture/shopify-commerce.md). Do not
  add live cart mutation, checkout creation, line items, variant selection, or
  unsupported sale-policy claims.

## Scope

In scope:

- Create a new shop-specific sale detail presentation for product detail pages.
  Keep prints, originals, books, unlinked products, unavailable products, and
  invalid image-metric cases graceful.
- Add a sale information panel based on the mockup:
  - Limited-edition/product heading using real product and linked-artwork data.
  - Edition or print-run row such as `27 / 100` only when trustworthy source
    data exists. Do not hard-code the mockup value in production behavior.
  - Medium and dimensions rows from real product or linked-artwork fields. Do
    not present pixel dimensions as customer-facing centimeters unless the data
    source actually provides physical print dimensions.
  - Frame and mat dropdowns sourced from `FRAME_PROFILES` and `MAT_PROFILES`.
  - Price sourced from Shopify product data.
  - A primary purchase/enquiry CTA that preserves the existing hosted Shopify
    purchase or enquiry behavior. If the visual label is changed toward
    "Add to cart", it must be non-mutating and documented as presentation-only,
    or the label should remain truthful to the current purchase handoff.
- Add a vertical gallery:
  - The first item is the raw linked artwork image only. It must not include a
    frame, mat, room background, or shadow.
  - Include four room-context thumbnails after the raw artwork item, using four
    existing `/prototype/frame` background assets.
  - Clicking a gallery item updates the large selected preview.
  - Selecting a frame or mat updates all room-context thumbnails and the large
    room preview when a room item is selected.
  - The raw artwork item remains raw and unaffected by frame/mat selections.
  - Gallery items must be accessible buttons with clear selected state.
- Use the same sale layout for prints, original artworks, books, and generic
  products. Print products can show frame/mat and room controls when usable
  preview imagery exists. Original artworks can show generated room-background
  slots without print-only frame controls. Books should use ordered Shopify
  product images in the gallery slots instead of generated wall scenes.
- Prefer extracting reusable room-scene constants/helpers into a production
  frame-preview module so `/prototype/frame` and the new shop product detail
  presentation share the same source where practical.
- Keep the existing frame preview prototype route working after extraction.
- Update relevant docs when behavior changes, especially the Shopify commerce
  workstream and framed-print-preview architecture if room previews become part
  of live product pages.

Out of scope:

- Changing `ArtworkArchiveInfoCard.tsx` or `ArtworkInfoCard.tsx`.
- Implementing an app-owned cart, Shopify checkout creation, checkout line
  items, variant selection, selected frame/mat persistence, or mutation of
  enquiries/admin data.
- Mapping frame/mat choices to Shopify variants or prices.
- Migrating or inventing physical print dimensions.
- Changing shop listing, search, sitemap, route cache policy, account
  navigation, or A-024 loading-state work.
- Broad visual redesign of unrelated artwork/detail pages.

## Concurrency

This task should not run in parallel with other agents editing
`src/app/shop/products/[productHandle]/page.tsx`,
`src/components/shop/frame-preview/*`, `src/lib/framePreview/*`, or shared shop
product-detail tests.

This task owns implementation docs it directly changes, including this task
brief and relevant Shopify/frame-preview docs. Leave unrelated dirty files and
unrelated shared trackers alone. If another agent has active edits in the same
product-detail or frame-preview files, stop and record the conflict in the
handoff notes instead of overwriting.

## Files Likely Touched

- `src/app/shop/products/[productHandle]/page.tsx`
- `src/components/shop/frame-preview/FramedArtworkPreview.tsx`
- `src/components/shop/frame-preview/*`
- `src/lib/framePreview/*`
- `src/components/prototypes/frame/FramePreviewPrototype.tsx`
- `docs/architecture/framed-print-preview.md`
- `docs/workstreams/shopify-commerce.md`
- Focused tests under `__tests__/unit/`

## Completion Contract

- Mark this task `Status: Completed` only after implementation, docs, and
  verification are done.
- Add dated completion notes under `Handoff Notes` with what changed, what
  remained intentionally out of scope, and exact verification results.
- Update `docs/tasks/README.md` if task status, purpose, or follow-up task
  links changed.
- Update the Shopify commerce workstream `Progress` and `Next Agent Action`
  sections for the behavior landed by this task.
- Update architecture docs if live product pages now reuse extracted room
  previews or if purchase CTA wording changes.
- Leave unrelated dirty files alone and mention any pre-existing dirty or
  untracked files that affected the task.

## Acceptance Criteria

- Print, original artwork, book, and generic product detail pages render the new
  mockup-style sale presentation with a distinct shop-specific info panel, not
  the existing archive info card.
- Colour palette, favourites, and watchlist controls are absent from the sale
  panel, while the original archive card remains unchanged elsewhere.
- Frame and mat controls are dropdowns backed by existing profile catalogs and
  are shown only for available print products with usable preview imagery.
- Price and current purchase/enquiry CTA behavior still come from Shopify
  product data and the existing hosted purchase/enquiry boundary.
- The artwork/print gallery's first item shows only the raw artwork image.
- Room gallery items for prints and originals use existing prototype room
  backgrounds and render the selected artwork with the selected frame and mat
  where controls are available.
- Book gallery items use Shopify product images for cover/page previews.
- Clicking gallery items updates the main preview with directional slide
  animation and without resizing the page layout.
- Changing frame or mat updates room thumbnails and the selected room preview
  without altering the raw artwork image.
- Products without usable preview imagery keep the sale shell with a neutral
  no-image state and do not render broken controls.
- Tests cover the raw-artwork gallery item, room selection, frame/mat updates,
  purchase/enquiry boundary, and graceful fallback product states.

## Verification

Use the narrowest focused commands after discovering the relevant test files,
then broaden if shared behavior moved:

```bash
npm test -- --runTestsByPath <focused shop product detail and frame-preview tests>
npm run lint
npm run build
git diff --check
```

If any command is unavailable or fails for environment reasons, record the exact
failure and why it is not a product behavior failure.

## Handoff Notes

- Planned from the owner mockup request on 2026-05-24.
- Completed on 2026-05-24. Implemented
  `src/components/shop/product-detail/ShopProductSaleGallery.tsx` initially for
  eligible linked print product detail pages, with a shop-specific sale panel,
  raw artwork preview, four room-context gallery buttons, frame and mat
  dropdowns backed by the local catalogs, Shopify price display, and the
  existing hosted Shopify purchase or enquiry fallback. The sale panel does not
  render archive colour palette, favourites, or watchlist controls.
- Extracted shared room-preview data and helpers into
  `src/lib/framePreview/roomScenes.ts` and added
  `src/components/shop/frame-preview/RoomFramedArtworkPreview.tsx`; the
  `/prototype/frame` route now imports the shared room scene constants and
  helper math instead of owning those pieces locally.
- Initially wired `/shop/products/[productHandle]` to render the sale gallery
  only when `buildFramedPrintPreviewArtwork()` returned valid linked print
  artwork data, with other product states using the fallback product detail
  layout.
- Follow-up on 2026-05-24 after owner clarification: expanded
  `/shop/products/[productHandle]` so the sale gallery is the default layout for
  prints, original artwork, books, and generic products. Print products now use
  linked archive artwork imagery when available and otherwise fall back to
  Shopify product imagery with positive width/height for the frame/room
  controls. Books and originals keep the sale shell without print-only
  frame/room controls.
- Follow-up on 2026-05-24 after carousel/title clarification: visible print
  and original artwork headings now trim comma suffixes such as
  `No.026, Limited Edition Print` to `No.026`; the side gallery reserves a
  fixed main viewport and animates directional slide transitions based on the
  clicked item's position; originals and prints use generated wall-background
  slots; books use ordered Shopify product images for cover/page slots.
  `SimpleProduct.images` now carries Shopify product image URL, alt text, width,
  and height for that book gallery behavior.
- Product detail metadata, product JSON-LD, and product breadcrumbs now use the
  same cropped display title for print and original products.
- External Shopify/Cloudinary product imagery in the sale gallery now renders
  unoptimized so the local page does not depend on Next's image optimizer
  refetching remote assets during development checks.
- Follow-up on 2026-05-24 after local visual QA: fixed the sale gallery's
  desktop grid so the main preview column uses a real minimum width instead of
  collapsing into a narrow strip, and switched the main raw image to
  `fill`/`object-contain` within the fixed viewport.
- Follow-up on 2026-05-24 after thumbnail proportion review: room thumbnails in
  the vertical stack now fill their square thumbnail viewport with the same
  cropped-wall behavior as the focused room preview so the framed artwork reads
  at matching wall proportions.
- Follow-up on 2026-05-24 after slide loading review: room previews now gate
  the framed artwork overlay until the room background image has loaded, and
  room backgrounds use the same unoptimized asset path as thumbnails so cached
  background assets can be reused between stack and focused preview states.
- The live local route
  `/shop/products/joseph-laoutaris-fine-art-print-no-139` was verified to
  return `200` and render `shop-product-sale-gallery` using the Shopify product
  image. The Shopify product data still has no `mongodbArtworkId`, empty
  `productType`, empty `tags`, and a handle/title mismatch: the handle says
  `no-139`, while the title and image identify `No.034`.
- Intentionally left out app-owned cart/checkout, checkout creation, line
  items, Shopify variant mapping, frame/mat persistence, enquiry mutation,
  physical-dimension migration, product listing/search/cache changes, and
  unsupported sale-policy copy.
- Physical dimensions remain hidden because the current source data does not
  provide trustworthy physical print dimensions. Pixel dimensions are still
  used only for deterministic preview geometry.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx`
    passed with 16 tests.
  - `npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/components/FramedPrintPreviewLauncher.test.tsx __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/framePreview/geometry.test.ts __tests__/unit/framePreview/productEligibility.test.ts`
    passed with 46 tests after removing a React type import from the new pure
    room helper module.
  - `npm run lint` passed with no warnings or errors.
  - `npm run build` passed. It emitted the existing non-failing Browserslist
    `caniuse-lite is outdated` notice.
  - `git diff --check` passed.
- Follow-up verification:
  - `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/shopifyClientTransform.test.ts`
    passed with 39 tests.
  - Local HTTP check against the restarted dev server returned `200` for
    `http://localhost:3000/shop/products/joseph-laoutaris-fine-art-print-no-139`
    and included `shop-product-sale-gallery`, `Limited Edition Print`, and
    `Fine art print` in the rendered HTML. An older local Node process on port
    `3000` was returning `500`; it was stopped and replaced with a fresh dev
    server.
  - `npm run lint` passed with no warnings or errors.
  - `npm run build` passed after stopping the temporary dev server. An initial
    build attempt while the dev server was running failed during page-data
    collection for `/account/comments`, a route that exists in source; the clean
    rerun passed.
  - `git diff --check` passed.
  - `npx tsc --noEmit --pretty false` was attempted as an extra check and
    failed on pre-existing test type issues in
    `__tests__/unit/loaders/ArtworkListLoader.test.tsx`,
    `__tests__/unit/modalProviderLazyHost.test.tsx`, and
    `__tests__/unit/publicRouteCachePolicy.test.ts`; none were introduced by
    this task.
- Latest follow-up verification:
  - `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
    passed with 52 tests.
  - `npm run lint` passed with no warnings or errors.
  - `npm run build` passed.
  - Local HTTP check against `http://localhost:3000/shop/products/joseph-laoutaris-fine-art-print-no-139`
    confirmed the sale gallery renders and the visible heading contains
    `No.034`; metadata now uses the same cropped product display title.
  - `git diff --check` passed.
- Main-preview collapse fix verification:
  - `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx`
    passed with 15 tests.
  - Headless Chrome screenshot of
    `http://localhost:3002/shop/products/joseph-laoutaris-fine-art-print-no-034`
    confirmed the main artwork image renders in the center viewport.
  - `npm run lint` passed with no warnings or errors.
  - `npm run build` passed. It emitted the existing non-failing Browserslist
    `caniuse-lite is outdated` notice.
- Thumbnail proportion follow-up verification:
  - `npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx`
    passed with 15 tests.
  - `npm run lint` passed with no warnings or errors.
  - `npm run build` passed after stopping stale dev server processes and
    clearing `.next`. It emitted existing non-failing Google Fonts retry,
    `punycode`, and Browserslist notices.
- Background-first loading follow-up verification:
  - `npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/shopProductDetailPage.test.tsx`
    passed with 22 tests.
  - `npm run lint` passed with no warnings or errors.
  - `npm run build` passed. It emitted the existing non-failing Browserslist
    notice.
- Pre-existing dirty/untracked files at start of task included
  `docs/audits/results/A-024-loading-state-ux.md`,
  `docs/orchestration/state.md`, `docs/tasks/README.md`,
  `docs/tasks/T-260-align-account-menu-internal-navigation.md`,
  `docs/workstreams/frontend-routes-and-components.md`,
  `docs/workstreams/shopify-commerce.md`,
  `docs/workstreams/testing-and-quality.md`, this T-261 task brief, and
  `to_prototype/shop_card.png`. Only the T-261-owned docs and implementation
  areas were edited for this task.
