# Framed Print Preview Implementation Plan

Status: Partially implemented

Workstreams:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Content, Assets, And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Plan the framed print preview feature from first safe experiment through future
physical-dimension and Shopify-backed frame selection support.

## Current Constraints

- No physical artwork or print dimensions are currently stored.
- The first implementation must use stored artwork image pixel dimensions.
- Physical dimensions should be additive later, not a rewrite.
- Print product dimensions may eventually differ from original artwork
  dimensions, especially when Shopify variants represent different print sizes.
- Product detail pages are currently enquiry-led, not cart or checkout backed.
- Product pages can resolve linked MongoDB artwork data from Shopify
  metafields.
- The first user-facing surface should be a modal on eligible print product
  pages.
- The first experimental surface should be `/prototype/frame`, not a live shop
  product page.

## Non-Goals For The MVP

- Do not add cart, checkout, direct purchase, or Shopify line-item mutation.
- Do not imply selected frame options are purchasable until Shopify variants or
  another owner-approved commerce model is connected.
- Do not generate finished framed artwork images per artwork.
- Do not build an admin frame catalog in the first slice.
- Do not require physical dimensions before the pixel-based prototype is useful.
- Do not pass preview frame selections into enquiries until the owner approves
  that data contract.

## Gap Review

This plan intentionally addresses these implementation risks before runtime
work begins:

- Product eligibility must be centralized so product type, tag, or future
  metafield rules do not become scattered through UI components.
- The MVP uses relative pixel geometry, but the data shapes must distinguish
  future original artwork dimensions from purchasable print dimensions.
- Product-page integration is too large for one pass if it includes geometry,
  visual compositor, modal state, product eligibility, and browser QA together.
- `/prototype/frame` gives the team a safe intermediate review surface before
  wiring the feature into live product pages.
- Frame selection must remain preview-only until Shopify-backed frame options or
  an approved enquiry field exists.

## Milestones

### M0 Planning

Outcome: documents define feature boundaries, data contracts, task slices, and
review criteria before runtime work starts.

Deliverables:

- Architecture plan.
- Implementation plan.
- Owner-review plan.
- Shopify workstream update.

Verification:

```bash
git diff --check
```

### M1 Frame Profile And Geometry Foundation

Outcome: frame preview sizing can be tested without product-page UI.

Scope:

- Add a small frame profile catalog in source configuration.
- Add optional mat profile configuration, with "none" as the default.
- Add a geometry helper that accepts artwork pixel metrics, optional future
  physical metrics, frame profile, mat profile, and rendered preview bounds.
- Implement `relativePreview` first.
- Define the `physicalScalePreview` branch shape, but it can remain inactive
  until real data exists.

Likely files:

- `src/lib/framePreview/frameProfiles.ts`
- `src/lib/framePreview/matProfiles.ts`
- `src/lib/framePreview/geometry.ts`
- focused tests under `__tests__/unit/framePreview/`

Acceptance criteria:

- Portrait, landscape, square, and extreme aspect-ratio inputs produce bounded
  frame and mat measurements.
- The helper does not import React, Next, Shopify clients, Mongoose models, or
  browser-only APIs.
- Tests prove missing physical dimensions keep the result in
  `relativePreview`.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/framePreview/geometry.test.ts
npm run lint
git diff --check
```

### M2 Standalone Preview Component

Outcome: the visual compositor can render a framed artwork independently from
the shop page.

Scope:

- Add a client component that renders one artwork image inside computed frame
  and optional mat layers.
- Keep the component data-driven through profiles and normalized artwork
  display metrics.
- Use simple material styling first.
- Do not add modal state or product-page eligibility in this slice.

Likely files:

- `src/components/shop/frame-preview/FramedArtworkPreview.tsx`
- focused component tests under `__tests__/unit/components/`

Acceptance criteria:

- The component accepts artwork image URL, alt text, pixel metrics, selected
  frame profile, and optional mat profile.
- It renders without depending on product-page data fetching.
- It does not expose checkout, purchase, or variant-selection copy.
- It does not own frame carousel controls, modal state, or product eligibility.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedArtworkPreview.test.tsx
npm run lint
git diff --check
```

### M3 Modal Shell And Controls

Outcome: modal behavior and frame cycling can be tested without product-page
eligibility or Shopify data changes.

Scope:

- Add a client modal shell around the standalone preview component.
- Add previous/next controls and optional swatches for local frame profiles.
- Keep the modal fed by explicit props or a fixture/prototype wrapper, not by
  product-page data fetching.
- Use preview-only copy.
- Confirm the modal can render portrait, landscape, square, and unusual aspect
  ratio inputs in a controlled test surface.

Likely files:

- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx`
- `src/components/shop/frame-preview/FrameMaterialControls.tsx`
- focused tests under `__tests__/unit/components/`

Acceptance criteria:

- Modal opens, closes, and cycles frame materials in component tests.
- Controls have accessible names.
- The modal can be reviewed with fixture artwork metrics before shop integration.
- No product page, Shopify client, MongoDB schema, checkout, or enquiry behavior
  changes are made in this slice.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/components/FramedPrintPreviewModal.test.tsx
npm run lint
git diff --check
```

### M4 Prototype Frame Route

Outcome: `/prototype/frame` provides an isolated visual workshop for frame
materials, proportions, mat behavior, and modal controls.

Scope:

- Add a noindex `/prototype/frame` App Router page.
- Render the standalone preview and/or modal shell with fixture artwork metrics.
- Include at least portrait, landscape, square, and unusual-aspect examples.
- Keep the route out of public navigation.
- Keep all data local fixtures unless the owner explicitly approves loading real
  sample artwork records.
- Use preview-only copy and no checkout/enquiry behavior.

Likely files:

- `src/app/prototype/frame/page.tsx`
- `src/components/prototypes/frame/FramePreviewPrototype.tsx`
- optional prototype fixture data under `src/components/prototypes/frame/`
- focused route/component tests under `__tests__/unit/`

Acceptance criteria:

- `/prototype/frame` renders a noindex frame-preview workshop.
- The route demonstrates multiple artwork aspect ratios.
- It can be used for owner review before touching live shop product pages.
- The live `/prototype/home`, `/shop`, and product detail routes are unchanged.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeFramePage.test.tsx __tests__/unit/components/FramedPrintPreviewModal.test.tsx __tests__/unit/components/FramedArtworkPreview.test.tsx __tests__/unit/framePreview/geometry.test.ts
npm run lint
git diff --check
```

Run a targeted browser check only if visual evidence is needed for review.

### M5 Product Eligibility And Launcher Wiring

Outcome: eligible print product pages expose a safe modal preview.

Scope:

- Add a small eligibility helper for the product metadata rule.
- Add a product-page client island for the preview button and modal.
- Render the button only for eligible print products with linked artwork image
  metrics.
- Feed the modal only the normalized linked artwork image metrics and frame
  catalog data it needs.
- Preserve the existing enquiry CTA and product detail data flow.

Likely files:

- `src/app/shop/products/[productHandle]/page.tsx`
- `src/lib/framePreview/productEligibility.ts`
- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx`
- `src/components/shop/frame-preview/FramedPrintPreviewLauncher.tsx`
- focused page/component tests under `__tests__/unit/`

Acceptance criteria:

- Eligible print products render `Preview Frame Options`.
- Books, originals, unavailable linked artwork, and unlinked products do not
  show the preview entry point unless explicitly approved later.
- The modal opens and closes accessibly.
- Previous/next frame controls update the visible profile.
- Existing product image, product details, and enquiry handoff are unchanged.

Verification:

```bash
npm test -- --runTestsByPath <focused product preview tests>
npm run lint
npm run build
git diff --check
```

Run build in this slice because the product detail App Router page and
client/server boundary are being touched.

### M6 Targeted Visual QA And Owner Review

Outcome: the team can decide whether the visual direction is good enough to
connect to commerce options.

Status: pending after T-192/T-193 material-rendering refinements.

Scope:

- Review `/prototype/frame` first, then pick representative eligible products:
  portrait, landscape, square, and an edge case with unusual aspect ratio.
- Run targeted browser checks only for `/prototype/frame` and, after wiring, the
  product detail route and modal.
- Record owner review outcomes in the prototype review doc.

Acceptance criteria:

- Modal fits desktop and mobile viewports.
- Frame thickness does not look obviously wrong across tested aspect ratios.
- Material cycling is understandable.
- Copy remains preview-only.
- Owner decisions are recorded before commerce mapping begins.

Verification:

```bash
npm run lint
npm run build
```

Use targeted browser screenshots only when visual evidence is needed.

### M7 Shopify-Backed Frame Options

Outcome: preview profiles can map to real purchasable or enquireable frame
options.

Prerequisite owner decisions:

- Framed print options are Shopify variants, separate products, or another
  approved commerce model.
- Product detail pages either keep enquiry handoff or add a real cart/checkout
  flow in a separate commerce task.

Scope:

- Extend `FrameProfile` with Shopify mapping data.
- Read relevant option/variant availability and price from Shopify.
- Make selected frame state meaningful only after the commerce source of truth
  is available.
- Keep unsupported frame options hidden or disabled with honest copy.

Acceptance criteria:

- Preview options correspond to real Shopify-backed choices.
- Availability and price come from Shopify.
- Selection state is preserved into the approved enquiry/cart/checkout handoff.
- No unsupported commerce claims are added.

Verification:

```bash
npm test
npm run lint
npm run build
```

Add commerce-specific route and transform tests once the Shopify contract is
chosen.

### M8 Physical Dimension Migration

Outcome: frame preview scale can become physically meaningful where data exists.

Prerequisite owner/data decisions:

- Physical dimensions for artworks, prints, or both have a canonical data
  owner.
- For print products with multiple sizes, variant-specific print dimensions are
  available or the owner has decided how product-level dimensions should behave.
- Units and validation rules are defined.
- Backfill or admin entry workflow is approved.

Scope:

- Add optional physical dimension fields to the chosen data model.
- Validate admin writes before persistence.
- Transform dimensions into public-safe DTOs where needed.
- Prefer selected print dimensions over original artwork dimensions for print
  product previews.
- Switch the geometry helper to `physicalScalePreview` only when complete,
  valid dimensions are present.
- Preserve `relativePreview` fallback for records without dimensions.

Acceptance criteria:

- Existing products without physical dimensions still preview with relative
  scaling.
- Products with physical dimensions use physical frame and mat widths.
- Tests prove mode selection and fallback behavior.

Verification:

```bash
npm test
npm run lint
npm run build
```

## Suggested Task Split

Use these as future task briefs or one-line assignments after the owner approves
implementation:

1. `T-187 Add frame preview geometry contracts`: implement M1 only.
2. `T-188 Build standalone framed artwork preview`: implement M2 only.
3. `T-189 Build framed print preview modal shell`: implement M3 only.
4. `T-190 Add frame preview prototype route`: implement M4 only.
5. `T-191 Wire framed preview launcher to eligible product pages`: implement
   M5 only.
6. `T-192 Improve frame preview material rendering`: prototype rail rendering,
   bevels, mitred joins, material texture styling, and mat margin controls.
7. `T-193 Replace frame stripe textures with material panels`: replace the
   regular stripe texture layers with non-repeating panel fills in the
   prototype rail renderer.
8. `T-194 Review framed print preview visual QA`: completed M6 and found a
   narrow/mobile responsive fit blocker.
9. `T-292 Fix framed preview responsive scaling`: completed the narrow/mobile
   room and modal crop fix before owner review or product-page rail adoption.
10. `T-195 Connect preview profiles to Shopify options`: implement M7 after
   commerce ownership is decided.
11. `T-196 Add physical dimension fields and scaling`: implement M8 after data
   ownership is decided.

Do not combine modal rendering, product-page wiring, Shopify option mapping,
physical dimension migration, and checkout/cart work. The preview modal can
launch without commerce selection; real purchasable frame options require a
separate Shopify contract.

The most practical first implementation path is three passes:

1. Geometry and profile contracts with unit tests.
2. Standalone visual preview, modal controls, and `/prototype/frame`.
3. Product-page launcher wiring for eligible print products only after the
   prototype direction is acceptable.

Stop after each pass if tests or owner review show the next slice needs
adjustment.

Do not start with the product-page modal as the first task. The page integration
should wait until the geometry helper and standalone preview have focused tests.

## Implementation Guardrails

- Keep geometry pure and unit-tested.
- Keep client components free of server-only imports.
- Keep product-page server data fetching responsible for resolving the linked
  artwork.
- Keep product eligibility in a helper; do not inline product-type string checks
  across components.
- Use `/prototype/frame` for visual experimentation before touching live product
  pages.
- Keep the first modal copy preview-only.
- Prefer direct imports over broad barrels in client components.
- Do not mutate Shopify or MongoDB as part of the preview MVP.
- Hide the preview entry point when eligibility, linked artwork, image metrics,
  or frame catalog data are incomplete.
- Avoid full DOM dumps, traces, videos, or large screenshot sets during visual
  QA.

## Initial Agent Prompt

Use this when assigning the first implementation slice:

```text
You are implementing the first framed print preview slice. Read AGENTS.md,
docs/README.md, docs/architecture/framed-print-preview.md, docs/tasks/framed-print-preview-implementation-plan.md,
and the Shopify/frontend/testing workstreams. Implement only the frame profile
catalog and pure geometry helper for relative pixel-based previews. Do not edit
product pages, modal UI, checkout/cart behavior, Shopify contracts, MongoDB
schemas, or admin forms. Add focused unit tests for portrait, landscape, square,
extreme aspect ratio, clamp behavior, mat behavior, and future physical-mode
fallback. Run the listed verification and update the task handoff.
```

## Handoff Notes

- Created 2026-05-21 as planning material before runtime implementation.
- 2026-05-21 planning review split the original modal/product-page task into
  smaller geometry, preview component, modal shell, product launcher, owner
  review, Shopify mapping, and physical-dimension phases.
- 2026-05-21 owner direction added `/prototype/frame` as the planned isolated
  experiment route before product-page integration.
- 2026-05-21 completed M1/T-187. Added pure frame preview types, frame profile
  catalog, mat profile catalog, relative/physical geometry helper, and focused
  unit coverage. No product pages, modal UI, Shopify contracts, MongoDB
  schemas, admin forms, checkout, or enquiry behavior were changed.
- 2026-05-21 completed M2/T-188. Added the standalone
  `FramedArtworkPreview` component fed by the geometry helper, with focused
  component tests proving default profiles, explicit frame/mat rendering,
  physical mode surfacing, and no modal/product/commerce behavior. No visible
  route exists yet.
- 2026-05-21 completed M3/T-189. Added the controlled
  `FramedPrintPreviewModal` shell and `FrameMaterialControls`, with focused
  tests for open/closed rendering, close button, Escape, backdrop close,
  previous/next wrapping, swatch selection, fallback initial profile, and
  product/commerce source isolation. No visible route exists yet.
- 2026-05-21 completed M4/T-190. Added the noindex `/prototype/frame` route and
  `FramePreviewPrototype`, using local portrait, landscape, square, and wide
  fixture metrics to exercise the standalone preview and modal shell in a
  browser-reviewable workshop. No live shop product pages, Shopify contracts,
  checkout, cart, enquiry, MongoDB, admin, or physical-dimension behavior
  changed.
- 2026-05-21 completed M5/T-191. Added centralized product eligibility and
  linked-artwork preview payload normalization, a product-page client launcher,
  and conditional `Preview Frame Options` rendering for available print products
  with valid linked artwork image metrics. Existing enquiry behavior remained
  unchanged, and frame selection remains preview-only.
- 2026-05-21 completed T-192. Added prototype-only rail rendering with four
  frame sides, mitred seam overlays, bevel/texture style intent, neutral sample
  controls, and mat margin presets. The existing simple renderer remains the
  default for product-page previews until the rail treatment is reviewed.
- 2026-05-21 completed T-193. Replaced the prototype rail renderer's repeated
  stripe texture layers with non-repeating full-rail material panel backgrounds
  while preserving bevels, mitred seams, rail geometry, mat controls, and modal
  behavior.
- 2026-05-26 completed T-194 targeted visual QA. Desktop room/material/modal
  behavior is usable for internal review, but `/prototype/frame` is not
  owner-review-ready because narrow/mobile room and modal previews crop the
  framed object.
- 2026-05-26 completed T-292. The framed preview renderer now scales inside
  constrained room and modal containers without cropping, and `/prototype/frame`
  is owner-review-ready for the scoped frame, room, and modal review.
- Next framed-preview step: owner review for `/prototype/frame`; then decide
  whether to apply the rail renderer to product pages or add real texture assets
  first. Do not begin Shopify option mapping or physical-dimension migration
  before those review decisions are recorded.
