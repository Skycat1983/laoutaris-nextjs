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
- `src/components/shop/frame-preview/FramedArtworkPreview.tsx` renders a
  standalone framed artwork preview from the geometry helper without owning
  modal state, carousel controls, product eligibility, checkout, or enquiry
  behavior. It now supports the original `simple` renderer and a prototype
  `rails` renderer with four frame rails, bevel styling, procedural material
  panel backgrounds, mitred seam overlays, inner bevel, and subtle glass sheen.
- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx` wraps the
  standalone preview in a controlled modal shell with close, Escape, backdrop,
  previous/next, direct frame-material swatch selection, and optional renderer
  mode pass-through.
- `src/components/shop/frame-preview/FrameMaterialControls.tsx` renders the
  modal's frame-material controls without product, Shopify, checkout, or
  enquiry behavior.
- `src/app/prototype/frame/page.tsx` exposes the first noindex visual review
  route for the feature.
- `src/components/prototypes/frame/FramePreviewPrototype.tsx` uses fixture
  artwork metrics to exercise the standalone preview and modal shell without
  touching live shop routes. The visible controls use neutral sample labels,
  derive orientation from pixel dimensions, expose mat margin presets, and
  composite the selected preview onto generated room-wall backgrounds. Room
  switches keep the current composition visible until the requested background
  has loaded, and fixture metrics are measured from the source images so the
  artwork box matches the visible image ratio.
- `public/prototypes/frame-backgrounds/` stores the current generated
  blank-wall room scenes for `/prototype/frame` review. These are prototype
  assets and are not loaded by product pages.
- `src/lib/framePreview/productEligibility.ts` centralizes product metadata
  eligibility and linked-artwork preview payload normalization for product
  detail pages.
- `src/components/shop/frame-preview/FramedPrintPreviewLauncher.tsx` provides
  the product-page client island for the `Preview Frame Options` button and
  modal open state.
- `src/app/shop/products/[productHandle]/page.tsx` renders the launcher only
  when the linked product is an available print with a valid linked archive
  artwork image URL and positive pixel dimensions.

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

The preview should initially be available only for print products that can be
linked back to one MongoDB artwork through the existing Shopify
`mongodb_artwork_id` metafield path.

Initial behavior is informational. It must not imply cart, checkout, payment,
shipping, refund, guarantee, or selected-variant behavior until Shopify variant
or line-item ownership is explicitly implemented.

Before product-page integration, use an isolated noindex prototype route for
visual experimentation:

```text
/prototype/frame
```

That route can render fixture artwork metrics, selected real artwork examples
where safe, and frame/material controls without touching live shop routes,
checkout/enquiry behavior, or public navigation.

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

Recommended first UI:

- Secondary button near the product image or enquiry panel:
  `Preview Frame Options`.
- Modal dialog with one large framed preview.
- Previous and next arrow buttons to cycle frame materials.
- Optional material swatches or compact labels below the preview.
- Close button and Escape-key support.

The control text should remain preview-oriented until a Shopify variant
selection is implemented. Use "preview" language, not "choose" or "buy with",
for the first implementation.

Do not store frame selection in the URL, persist it to the database, or pass it
to the enquiry flow in the MVP. Those behaviors become valid only when the
selection maps to a real Shopify option or an owner-approved enquiry field.

## Commerce Integration Path

Initial release:

- Frame profiles are local preview options.
- Selection does not mutate product state.
- Enquiry flow remains unchanged.

Later Shopify-backed release:

- Each purchasable frame option maps to a Shopify variant, selling plan, or
  owner-approved line-item model.
- Variant availability, price, and selected option labels come from Shopify.
- The modal can become a selection surface only after the product detail page
  owns real variant selection and checkout/enquiry handoff semantics.

The current app has an enquiry-led purchase handoff. Do not introduce cart or
checkout behavior as part of the preview MVP.

If the owner wants the enquiry form to mention a frame before Shopify-backed
variants exist, that should be a separate copy/data decision. It should not be
added silently by the preview modal task.

## Failure And Fallback Behavior

The product detail page should remain resilient:

- If linked artwork cannot be loaded, hide the preview launcher.
- If artwork image metrics are invalid, hide the preview launcher.
- If one frame profile is malformed, fail tests before release rather than
  failing at runtime.
- If the modal image fails to load in the browser, show the normal image
  fallback state and keep close/navigation controls usable.
- If no eligible frame profiles exist, hide the launcher.

## Accessibility

The modal implementation should include:

- `dialog` semantics through the existing modal/dialog pattern or shadcn
  primitives if already present.
- Focus management when opening and closing.
- Close button with an accessible label.
- Arrow buttons with accessible labels for previous and next frame material.
- Keyboard support for Escape and, if implemented, left/right frame navigation.
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
- Eligible print products render the preview button.
- Unlinked products, books, and non-print products do not render the button.
- Modal open, close, and frame cycling behavior.
- The enquiry CTA remains unchanged.

Manual or browser checks should cover:

- One portrait print.
- One landscape print.
- One square print.
- Mobile viewport modal fit.
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
