# Framed Print Preview Owner Review Plan

Status: Planned

This document defines how to review the framed print preview experiment as it is
built. It is intentionally focused on product and visual approval, not code
implementation details.

## Review Surface

The first experimental review surface should be:

```text
/prototype/frame
```

Use it to review frame geometry, materials, mat behavior, modal controls, and
mobile fit before touching live shop product routes.

The first commerce-context review surface should be a print product detail page:

```text
/shop/products/[productHandle]
```

The page should show a `Preview Frame Options` button only when the product has
a linked archive artwork and qualifies as a print.

`/prototype/frame` must be noindex, isolated from public navigation, and safe to
change freely while the visual direction is unsettled.

## Review Gates

Review can happen in stages:

- After the standalone preview component exists, review basic frame thickness
  and material direction with fixture artwork metrics.
- After `/prototype/frame` exists, review controls, copy, keyboard behavior,
  aspect-ratio examples, and mobile fit without depending on Shopify product
  eligibility.
- After product-page wiring exists, review real eligible and ineligible product
  routes.
- Before Shopify option mapping begins, decide whether the preview may remain
  informational or must wait for real purchasable frame options.

## MVP Review Questions

- Is a modal the right place for the preview, or should the preview be visible
  directly on the product page later?
- Are the first frame materials useful enough for print buyers?
- Does the frame thickness look plausible across portrait, landscape, and
  square artworks?
- Should a mat option be visible in the first release, or should it wait?
- Does the copy clearly communicate preview behavior without implying checkout
  or a selected purchasable option?
- Should framed originals ever use this feature, or should it remain print-only?
- If prints have multiple sizes later, should frame preview follow the selected
  print variant size, a product-level default size, or remain relative until a
  size is chosen?

## Representative Products

Before visual review, choose at least:

- One portrait print with linked artwork.
- One landscape print with linked artwork.
- One square print with linked artwork.
- One unusual aspect-ratio artwork if available.
- One unlinked or non-print product to confirm the button is hidden.
- One book product to confirm the button is hidden.

Record product handles in the implementation task handoff or a future owner
review packet. Do not paste private Shopify data or credentials into docs.

## Visual Checklist

For `/prototype/frame`:

- The route is noindex and not linked from public navigation.
- Portrait, landscape, square, and unusual aspect-ratio examples are visible or
  selectable.
- Frame materials can be compared without Shopify product data.
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
