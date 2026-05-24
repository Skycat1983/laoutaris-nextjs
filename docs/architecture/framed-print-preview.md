# Framed Print Preview Architecture

Status: Partially implemented

This document defines the planned architecture for framed print previews on
Shopify-backed product detail pages.

Implemented foundation:

- `src/lib/framePreview/types.ts` defines frame profile, mat profile, artwork
  display metrics, preview bounds, and geometry result contracts.
- `src/lib/framePreview/frameProfiles.ts` defines the first source-controlled
  frame profile catalog and stable default frame profile ID.
- `src/lib/framePreview/matProfiles.ts` defines the first source-controlled mat
  profile catalog and stable default no-mat profile ID.
- `src/lib/framePreview/geometry.ts` calculates relative pixel-based preview
  geometry and switches to physical print scaling only when complete print
  dimensions and profile widths are available.
- `src/lib/framePreview/roomScenes.ts` defines the shared generated room-scene
  catalog, shop product room subset, centered hanging zone, room profile
  scaling helpers, and deterministic room shadow styles used by the prototype
  route and live print product pages.
- `src/components/shop/frame-preview/FramedArtworkPreview.tsx` renders a
  standalone framed artwork preview from the geometry helper without owning
  modal state, carousel controls, product eligibility, checkout, or enquiry
  behavior. It now supports the original `simple` renderer and a prototype
  `rails` renderer with four frame rails, bevel styling, procedural material
  panel backgrounds, mitred seam overlays, inner bevel, and subtle glass sheen.
  The default sizing mode fits the full framed object within bounds; the
  prototype wall scene can opt into fixed-artwork sizing so mat margin grows the
  frame around a constant-size print.
- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx` wraps the
  standalone preview in a controlled modal shell with close, Escape, backdrop,
  previous/next, direct frame-material swatch selection, and optional renderer
  mode pass-through.
- `src/components/shop/frame-preview/FrameMaterialControls.tsx` renders the
  modal's frame-material controls without product, Shopify, checkout, or
  enquiry behavior.
- `src/components/shop/frame-preview/RoomFramedArtworkPreview.tsx` composites a
  framed preview into one shared room scene using the extracted room helpers and
  the rail renderer, without owning product state, checkout, or enquiry
  behavior.
- `src/app/prototype/frame/page.tsx` exposes the first noindex visual review
  route for the feature.
- `src/components/prototypes/frame/FramePreviewPrototype.tsx` uses fixture
  artwork metrics to exercise the standalone preview and modal shell without
  touching live shop routes. The visible controls use neutral sample labels,
  derive orientation from pixel dimensions, expose mat margin presets, and
  composite the selected preview onto generated room-wall backgrounds. Room
  switches keep the current composition visible until the requested background
  has loaded, use a shared centered hanging anchor for every background, and use
  fixed-artwork sizing for the wall composite so changing mat margin increases
  the framed object size rather than shrinking the visible print. The wall
  composite also exposes prototype-only right/down shadow controls for offset,
  edge blur, diffusion, spread, and darkness so generated room lighting can be
  tuned without changing product-page previews. It also renders short diagonal
  south-east corner shadows from the bottom-left and top-right frame points to
  better match
  top-left room lighting. Fixture metrics are measured from the source images
  so the artwork box matches the visible image ratio. The prototype now imports
  shared room-scene constants and room style helpers from
  `src/lib/framePreview/roomScenes.ts` rather than owning those production-safe
  pieces locally.
- `public/prototypes/frame-backgrounds/` stores the current generated
  blank-wall room scenes for `/prototype/frame` review, including regenerated
  Scandinavian white-wall and white plaster hallway scenes plus additional
  bright white-wall candidates for owner comparison. The first four shared
  scenes are also used by print product detail sale galleries as preview-only
  room contexts when a usable preview image is available.
- `src/lib/framePreview/productEligibility.ts` centralizes product metadata
  eligibility and linked-artwork preview payload normalization for product
  detail pages.
- `src/components/shop/frame-preview/FramedPrintPreviewLauncher.tsx` provides
  the older product-page client island for the `Preview Frame Options` button
  and modal open state. It remains available for focused modal coverage.
- `src/components/shop/product-detail/ShopProductSaleGallery.tsx` renders the
  current product detail sale presentation for shop products: a shop-specific
  sale panel, raw image preview, optional frame and mat dropdowns for available
  prints, and optional room-context gallery items.
- `src/app/shop/products/[productHandle]/page.tsx` renders the sale gallery as
  the default product detail layout. It prefers linked archive artwork imagery
  when available and falls back to Shopify product imagery with positive image
  dimensions. Books and originals use the same sale shell without print-only
  frame and room controls.

Not yet implemented: Shopify option mapping, physical dimension persistence, or
checkout/enquiry integration.

## Purpose

The feature lets a visitor preview a print with different frame materials before
enquiring about or purchasing the product. The first implementation should use
the linked archive artwork image and its stored pixel dimensions. Physical
artwork or print dimensions are not currently available, but the architecture
must leave room to use them later without rewriting the UI.

## Product Boundary

The first supported surface is:

```text
/shop/products/[productHandle]
```

The sale layout is the default product detail shell for Shopify products. Print
room previews are available when the product can provide a usable linked
archive artwork image or Shopify product image with positive dimensions.

Initial behavior is informational. It must not imply cart, checkout, payment,
shipping, refund, guarantee, or selected-variant behavior until Shopify variant
or line-item ownership is explicitly implemented.

Use the isolated noindex prototype route for visual experimentation before
rolling prototype-only visual changes into live product pages:

```text
/prototype/frame
```

That route can render fixture artwork metrics, selected real artwork examples
where safe, and frame/material controls without touching checkout/enquiry
behavior or public navigation.

## Print Size Boundary

The preview is for a print product, not necessarily the original artwork's real
physical size. Until Shopify variants or product metafields expose print sizes,
the MVP can only preserve image aspect ratio and relative frame proportions.

Future physical scaling should prefer print dimensions where the customer is
buying a print. Original artwork dimensions may still be useful archive data,
but they are not automatically the correct dimensions for a print product.
If a product offers multiple print sizes, size should eventually be owned by the
selected Shopify variant or a variant-specific metafield before frame
thickness, mat width, price, and availability are treated as purchasable facts.

## Source Image

Use the linked MongoDB artwork image as the canonical source for compositing:

- `artwork.image.secure_url`
- `artwork.image.pixelWidth`
- `artwork.image.pixelHeight`
- `artwork.title` for alt text context

Do not use the Shopify product image for the first compositor unless the product
later has owner-approved frame-specific product imagery. Shopify images may be
mockups, crops, or product photos; the linked artwork image is the cleaner input
for deterministic frame geometry.

## Eligibility Rules

Show the preview entry point only when all initial conditions are true:

- The Shopify product is a print, identified through one approved eligibility
  helper that reads product metadata such as product type, tag, or a future
  explicit metafield.
- The product is available for sale in Shopify.
- The product has a valid `mongodbArtworkId`.
- The linked artwork loads successfully.
- The linked artwork has an image URL plus positive pixel width and height.

Avoid scattering product-type string checks across components. Keep eligibility
in a small helper so Shopify taxonomy changes can be handled in one place.

Books and unlinked products should not show the framed preview button in the
first implementation. Originals can be considered later as a separate owner
decision because original framing has different physical and conservation
expectations.

If eligibility is uncertain, hide the entry point instead of showing a broken or
empty modal. The product page should continue to render normally.

## Dimension Strategy

The renderer should consume normalized display metrics instead of reading raw
artwork records directly. This keeps the current pixel-only implementation
adaptable when physical dimensions arrive.

Planned shape:

```ts
type ArtworkDisplayMetrics = {
  pixelWidth: number;
  pixelHeight: number;
  physicalArtworkWidthCm?: number;
  physicalArtworkHeightCm?: number;
  physicalPrintWidthCm?: number;
  physicalPrintHeightCm?: number;
};
```

If source data arrives in inches or another unit, normalize it to centimeters
before it reaches the renderer. The preview geometry should not mix units.

The geometry layer should expose a mode:

```ts
type FrameScaleMode = "relativePreview" | "physicalScalePreview";
```

`relativePreview` is the first implementation. It derives frame and mat
thickness from the rendered artwork size:

```text
shortSidePx = min(renderedArtworkWidthPx, renderedArtworkHeightPx)
frameWidthPx = clamp(shortSidePx * fallbackFrameRatio, minFramePx, maxFramePx)
matWidthPx = clamp(shortSidePx * fallbackMatRatio, minMatPx, maxMatPx)
```

`physicalScalePreview` becomes available later when physical artwork or print
dimensions exist:

```text
pixelsPerCm = renderedArtworkWidthPx / physicalPrintWidthCm
frameWidthPx = widthCm * pixelsPerCm
matWidthPx = matWidthCm * pixelsPerCm
```

For print products, use print dimensions before original artwork dimensions
when both exist. Preserve `relativePreview` whenever dimensions are incomplete,
invalid, or not tied to the selected purchasable print size.

The UI should not need a redesign when physical dimensions are added; only the
metrics resolver and geometry calculation should change.

## Frame Profiles

Frame options should be data-driven. The first catalog can live in source
configuration; later it can be backed by Shopify metafields or CMS/admin data.

Planned shape:

```ts
type FrameProfile = {
  id: string;
  label: string;
  material: "black-wood" | "white-wood" | "oak" | "walnut" | "metal";
  previewStyle: {
    outerColor: string;
    innerColor?: string;
    grainColor?: string;
    highlightColor?: string;
    shadowColor?: string;
    seamColor?: string;
    textureKind?: "wood-grain" | "painted-grain" | "brushed-metal";
  };
  fallbackFrameRatio: number;
  minFramePx: number;
  maxFramePx: number;
  widthCm?: number;
  textureAsset?: string;
  shopifyVariantId?: string;
};
```

The initial catalog includes a small set of visually distinct options: black
wood, white wood, oak, walnut, and brushed metal. T-192 added procedural texture
intent fields and rail/bevel rendering, and T-193 replaced the visible repeated
stripe pattern with non-repeating full-rail material panel backgrounds. No
texture image assets are committed yet. Reusable texture assets can be added
after visual review without changing geometry.

Frame profile IDs should be stable. Visible labels and styling can change after
owner review, but IDs should not be renamed casually once tests, product
metafields, analytics, or Shopify mappings depend on them.

## Mat Profiles

Some framed previews need a margin between the artwork and the frame. Treat this
as a mat or spacer profile, not as a special frame case.

Planned shape:

```ts
type MatProfile = {
  id: string;
  label: string;
  color: string;
  fallbackMatRatio: number;
  minMatPx: number;
  maxMatPx: number;
  matWidthCm?: number;
};
```

The first implementation can default to no mat or one neutral mat option. If mat
selection is exposed, it must be visually separate from frame material selection
and remain informational until mapped to real Shopify purchasable options.

## Rendering Approach

The preferred first implementation is a client-side deterministic compositor,
not generated finished frame images.

Use a layered component model:

```text
modal
  preview viewport
    computed frame box
      frame layer
      optional mat layer
      artwork image
  frame navigation controls
```

Rendering tiers:

1. Flat or lightly gradient CSS frame surfaces with calculated thickness.
2. A `/prototype/frame` route for isolated visual review using fixture or
   owner-approved sample artwork data.
3. Modal controls and carousel state around the stable preview component.
4. Product-detail launcher wiring after the isolated preview is acceptable.
5. Rail-based CSS rendering with bevels, non-repeating procedural material
   panels, and mitred joins.
6. Optional reusable texture assets or nine-slice frame assets after owner
   review confirms the feature is worth visual refinement.

Avoid AI-generating a complete frame per artwork. AI-generated or designed
assets can be useful for material textures, but frame geometry and sizing should
remain deterministic.

For the current prototype rail renderer, material backgrounds should fill each
rail as a single panel. Do not use repeating stripe gradients for the frame
surface; they create an obvious tiled pattern when clipped into long rails.
Until real texture assets exist, use non-repeating `backgroundImage` layers with
`backgroundRepeat: "no-repeat"` and `backgroundSize: "100% 100%"` so the panel
fills the trapezoid shape.

## Corner Treatment

The frame can show mitred joins through the T-192 `rails` renderer. The current
prototype uses four absolutely positioned rails with CSS `clip-path` ends and
seam overlays. Expected long-term options remain:

- CSS/SVG polygons for four frame sides, producing diagonal inner corner joins.
- Nine-slice assets with separate corners and repeatable side textures.
- Canvas compositing if exportable previews become a requirement.

Do not block commerce mapping on photorealistic corners. Confirm sizing, modal
behavior, material direction, and commerce positioning first.

## Product Detail UX

Current product detail UI:

- A shop-specific sale panel on `/shop/products/[productHandle]` for print,
  original artwork, book, and generic Shopify products.
- Product heading, vendor, Shopify price, product type or linked-artwork
  medium, and the existing purchase/enquiry CTA boundary. Visible print and
  original artwork headings trim comma suffixes such as
  `No.026, Limited Edition Print` to `No.026`; product metadata, structured
  data, and breadcrumbs use the same cropped display title.
- A raw gallery item first when preview imagery exists. It renders only the
  source image and does not include frame, mat, room background, or shadow.
- Available print products with preview imagery show frame and mat dropdowns
  plus four room-context gallery items using the shared room-scene subset.
  Originals can show the same generated room-context gallery with default
  presentation but no print-only frame/mat controls.
- Books use ordered Shopify product images in the gallery slots instead of
  generated wall backgrounds, so book cover/page images can be selected into the
  main viewport.
- Selecting a lower gallery item slides the current preview out to the right
  and the next preview in from the left. Selecting an item above the current one
  reverses that direction. The main viewport keeps a fixed height so different
  image dimensions do not resize the page layout.
- Physical dimensions are shown only if normalized physical dimensions become
  available. Pixel dimensions are not presented as customer-facing centimeter
  dimensions.

The controls are preview-only until Shopify variant selection is implemented.
Do not label them as purchasable options, and do not use app-owned cart
language.

Do not store frame selection in the URL, persist it to the database, or pass it
to the enquiry flow in the MVP. Those behaviors become valid only when the
selection maps to a real Shopify option or an owner-approved enquiry field.

## Commerce Integration Path

Initial release:

- Frame profiles are local preview options.
- Mat profiles are local preview options.
- Selection does not mutate product state, persist to a database, map to
  Shopify variants, or change the enquiry payload.
- The product detail CTA still renders `Purchase on Shopify` when Shopify
  exposes a valid hosted URL and `Enquire About This Product` as the fallback.

Later Shopify-backed release:

- Each purchasable frame option maps to a Shopify variant, selling plan, or
  owner-approved line-item model.
- Variant availability, price, and selected option labels come from Shopify.
- The modal can become a selection surface only after the product detail page
  owns real variant selection and checkout/enquiry handoff semantics.

The current app uses Shopify-hosted product URLs when available and an enquiry
fallback when a hosted URL is missing. Do not introduce app-owned cart or
checkout behavior as part of the preview MVP.

If the owner wants the enquiry form to mention a frame before Shopify-backed
variants exist, that should be a separate copy/data decision. It should not be
added silently by the preview modal task.

## Failure And Fallback Behavior

The product detail page should remain resilient:

- If linked artwork cannot be loaded, fall back to Shopify product imagery when
  it has usable dimensions.
- If no usable preview image exists, keep the sale panel and render a neutral
  no-image preview state.
- If one frame profile is malformed, fail tests before release rather than
  failing at runtime.
- If a room background image fails to load in the browser, keep the raw artwork
  item and product purchase/enquiry boundary usable.
- If no eligible frame profiles exist, do not render broken frame controls.

## Accessibility

The current product detail implementation should include:

- Native labelled frame and mat dropdown controls.
- Gallery items implemented as buttons with clear accessible labels and selected
  state.
- Raw artwork and room preview images with meaningful alt text in the selected
  main preview.
- No hover-only functionality.
- Text and controls that fit mobile widths without overlap.

## Performance

The MVP should not generate server-side images. Use the existing artwork image
URL and browser-side layout. Keep texture assets small and defer them until the
modal opens if possible.

Do not collect heavy Playwright traces, videos, full DOM dumps, or large
screenshot sets for routine verification. Use targeted screenshots only when
visual QA requires them.

## Verification Strategy

Geometry-level tests should cover:

- Portrait, landscape, square, and extreme aspect ratios.
- Ratio-based frame thickness clamps.
- Optional mat thickness.
- Future physical dimensions choosing `physicalScalePreview` when complete
  data exists.

Component/page tests should cover:

- Prototype route noindex metadata, fixture controls, source isolation, and
  modal launch behavior.
- Product eligibility helper behavior for print, book, original, and unknown
  product metadata.
- Print, original artwork, book, and generic products render the sale gallery.
- Unlinked print products can render print controls from Shopify product imagery
  when image dimensions are available.
- The raw artwork gallery item remains unframed.
- Room thumbnail selection updates the main preview.
- Frame and mat dropdown changes update room thumbnails and the selected room
  preview without altering the raw artwork item.
- Books, originals, unavailable products, and invalid image-metric cases do not
  render print-only frame or room controls.
- Hosted Shopify purchase and enquiry fallback CTAs remain unchanged.

Manual or browser checks should cover:

- One portrait print.
- One landscape print.
- One square print.
- Mobile viewport sale gallery fit.
- No misleading checkout, payment, shipping, refund, or guarantee copy.

## Open Decisions

- Exact product metadata that marks a Shopify product as frame-preview eligible.
- First frame profile catalog and labels.
- Whether mat selection appears in the MVP or waits until a second slice.
- Whether framed print options are Shopify variants, separate products, or a
  future custom line-item model.
- Where physical artwork or print dimensions will live once available, and how
  source units will be normalized.
- Whether previews should eventually support export or sharing.
