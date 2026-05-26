# Framed Print Preview Owner Review Plan

Status: Material-rendering review surface available

This document defines how to review the framed print preview experiment as it is
built. It is intentionally focused on product and visual approval, not code
implementation details.

## Review Surface

The first experimental review surface should be:

```text
/prototype/frame
```

Use it to review frame geometry, materials, mat behavior, modal controls, and
mobile fit independently from live shop product data.

The first commerce-context review surface should be a print product detail page:

```text
/shop/products/[productHandle]
```

The page should show a `Preview Frame Options` button only when the product has
a linked archive artwork and qualifies as a print.

`/prototype/frame` must be noindex, isolated from public navigation, and safe to
change freely while the visual direction is unsettled.

Implementation status on 2026-05-21: `/prototype/frame` exists and renders a
fixture-based workshop with neutral sample artwork controls, frame material
controls, mat margin presets, and the modal preview shell. It does not load
live Shopify product data and does not change checkout, cart, enquiry, or
product detail behavior.

Product-page implementation status on 2026-05-21: eligible available print
product pages with valid linked artwork image metrics now render
`Preview Frame Options`. The modal remains preview-only; selected frame
materials are not submitted to enquiries, persisted, or mapped to Shopify
variants.

Material-rendering status on 2026-05-21: `/prototype/frame` uses the new
rail-based renderer with four computed sides, mitred seam overlays, bevel
styling, non-repeating procedural material panel backgrounds, inner bevel/glass
sheen overlays, and independent mat margin selection. The visible repeating
stripe pattern reported during owner review has been removed from the rail
renderer. Product-page previews still use the simple fallback renderer until
the rail treatment is visually approved.

Room-preview status on 2026-05-22: `/prototype/frame` includes generated
blank-wall home backgrounds under `public/prototypes/frame-backgrounds/`,
including regenerated Scandinavian white-wall and white plaster hallway scenes
plus additional bright white-wall candidates for comparison. The route
composites the selected framed artwork into a shared centered hanging zone.
Background switching is buffered so the existing room composition remains
visible until the requested room image has loaded. The fixture artwork metrics
have also been corrected to the measured source image dimensions, and the wall
scene uses fixed-artwork sizing so mat margin grows the framed object around a
constant-size print. The wall scene also includes prototype-only right/down
shadow controls for offset, edge blur, diffusion, spread, and darkness near the
room preview, plus short south-east diagonal corner shadows from the frame.
These generated backgrounds are prototype review assets only.

Responsive review status on 2026-05-26: targeted T-194 QA found the desktop
room/material/modal direction usable for internal review, and T-292 fixed the
narrow/mobile room and modal cropping blockers. `/prototype/frame` is now
owner-review-ready for the scoped frame, room, and modal review. Product-page
rail adoption, real texture assets, Shopify option mapping, checkout/cart,
enquiry mutation, and physical dimension work remain paused until separate
owner decisions or task briefs scope them.

## Review Gates

Review can happen in stages:

- After the standalone preview component exists, review basic frame thickness
  and material direction with fixture artwork metrics.
- After `/prototype/frame` exists, review controls, copy, keyboard behavior,
  varied aspect-ratio examples, and mobile fit without depending on Shopify
  product eligibility.
- After rail rendering exists, review material panel direction, bevel depth,
  diagonal joins, and mat margins before applying the renderer to product pages.
- After room backgrounds exist, review whether wall-scale previews help buyers
  understand size/context, and whether the background set should be curated,
  regenerated, or reduced before any production use.
- After product-page wiring exists, review real eligible and ineligible product
  routes.
- Before Shopify option mapping begins, decide whether the preview may remain
  informational or must wait for real purchasable frame options.

## MVP Review Questions

- Is a modal the right place for the preview, or should the preview be visible
  directly on the product page later?
- Are the first frame materials useful enough for print buyers?
- Does the frame thickness look plausible across tall, wide, square, and
  unusual-ratio artworks?
- Should a mat option be visible in the first release, or should it wait?
- Does the copy clearly communicate preview behavior without implying checkout
  or a selected purchasable option?
- Should framed originals ever use this feature, or should it remain print-only?
- If prints have multiple sizes later, should frame preview follow the selected
  print variant size, a product-level default size, or remain relative until a
  size is chosen?

## Representative Products

Before visual review, choose at least:

- One tall print with linked artwork.
- One wide print with linked artwork.
- One square print with linked artwork.
- One unusual aspect-ratio artwork if available.
- One unlinked or non-print product to confirm the button is hidden.
- One book product to confirm the button is hidden.

Record product handles in the implementation task handoff or a future owner
review packet. Do not paste private Shopify data or credentials into docs.

## Visual Checklist

For `/prototype/frame`:

- The route is noindex and not linked from public navigation.
- Tall, wide, square, and unusual aspect-ratio examples are visible or
  selectable through neutral sample controls.
- Frame materials can be compared without Shopify product data.
- Mat margin presets can be compared independently from frame material.
- Mitred corners and bevel shadows look intentional rather than broken.
- Frame materials do not show a regular stripe or tiled pattern.
- The room-preview backgrounds leave a believable blank wall zone for the
  framed artwork and do not visually compete with the print.
- Switching room backgrounds keeps the framed print centered in a plausible
  hanging position and does not flash a half-loaded background/frame composite.
- On the room wall, changing mat margin grows or shrinks the framed object
  around a fixed-size print rather than shrinking the print inside a fixed
  outer frame.
- Wall shadows cast to the right and bottom of the frame and can be tuned for
  length, edge blur, diffusion, spread, and darkness against the selected room
  backgrounds.
- Short diagonal shadows from the bottom-left and top-right frame points read as
  south-east cast shadows rather than visual artifacts.
- Mat spacing around the artwork remains even when switching between the tall,
  wide, and near-square sample images.
- The preview remains clearly experimental and does not include enquiry,
  checkout, price, shipping, refund, or guarantee copy.
- Mobile layout has no overlapping text, clipped controls, or unusable arrows.

For each eligible product after product-page wiring:

- The product page loads normally.
- The existing product image and enquiry call to action are unchanged.
- `Preview Frame Options` is visible and secondary to the main product action.
- The modal opens without layout jump.
- The framed artwork is centered and fits the viewport.
- The artwork is not cropped by the frame or mat.
- Frame thickness looks plausible for the current pixel-based preview mode.
- Previous and next controls cycle materials predictably.
- Material labels or swatches match the visible frame.
- The modal closes through the close button and Escape key.
- Mobile layout has no overlapping text, clipped controls, or unusable arrows.
- The modal does not pass the selected frame into the enquiry flow unless that
  has been separately approved.

For ineligible products:

- No frame preview button is shown.
- No broken or empty preview surface is rendered.
- The product page still has its normal enquiry or unavailable state.

## Commerce Copy Checklist

Until Shopify-backed frame variants or another approved commerce model exists,
the UI must avoid:

- `Choose frame`
- `Add frame to order`
- `Buy framed`
- `Checkout`
- payment assurance claims
- shipping or refund claims
- buyer-protection or guarantee claims

Prefer preview-only language:

- `Preview Frame Options`
- `Frame preview`
- `Material preview`
- `This preview is illustrative`

The final phrase should be owner-approved before public launch if visible.

## Decision Log To Capture Later

When the first visual review is complete, record:

- Product metadata rule approved for preview eligibility.
- Approved frame material labels.
- Rejected material labels or visual treatments.
- Whether mat selection is in or out for the first release.
- Whether the modal is approved as the first UI.
- Whether the feature can appear publicly before Shopify variant mapping.
- Whether print dimensions should live on Shopify variants, product metafields,
  MongoDB artwork records, or another owner-approved source.
- Required changes before commerce-backed frame selection begins.

## Verification Discipline

Use targeted browser checks. Do not capture full traces, videos, full DOM dumps,
full browser logs, or large screenshot sets unless explicitly requested.

Good evidence:

- One desktop screenshot of the modal for a representative print.
- One mobile screenshot of the same modal if layout approval is needed.
- A short written summary of any visible defect.

Avoid storing broad raw automation output in this doc.
