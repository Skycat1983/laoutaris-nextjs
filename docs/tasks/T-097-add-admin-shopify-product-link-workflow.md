# T-097 Add Admin Shopify Product-Link Workflow

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Content, Assets, And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Give admin operators a visible, validated workflow for adding, editing, and
removing canonical Shopify product links on artwork create/update forms.

## Context

- F-010/R-021 remained open after T-082: admin artwork routes validate
  `shopifyProducts`, but the dashboard still does not expose an operator-safe
  way to manage those links.
- The canonical link shape is documented in
  [Shopify commerce architecture](../architecture/shopify-commerce.md):
  `{ productId: string, type: "original" | "print" | "book" }`.
- The Shopify operations runbook already documents numeric product IDs,
  allowed product types, within-artwork duplicate rejection, and allowed
  cross-artwork book duplicates.
- This task is intentionally larger than recent cleanup tasks: own the UI,
  form-schema wiring, tests, and docs for the admin product-link workflow as
  one coherent slice.

## Scope

- In scope:
  - Add a reusable admin form control for Shopify product links, preferably in
    the admin dashboard inputs/forms area.
  - Support adding multiple links, choosing `original`, `print`, or `book`,
    entering the numeric Shopify product ID, and removing existing links.
  - Use icon buttons for add/remove where practical, with accessible names.
  - Wire the control into both `CreateArtworkForm` and `UpdateArtworkForm`.
  - Extend shared artwork form schemas/types so create and update form values
    can carry `shopifyProducts`.
  - Initialize update forms from existing `artworkInfo.shopifyProducts ?? []`.
  - Preserve the ability to submit an empty array from the update form so an
    admin can remove all product links from an artwork.
  - Keep the existing route-level validation from T-082 authoritative; do not
    loosen numeric ID, product type, or duplicate rules.
  - Add focused tests for the form/schema workflow and preserve existing admin
    artwork route tests.
  - Update this task brief, Shopify architecture/runbook notes if needed,
    Shopify/content/testing workstreams, R-021, and F-010 after completion.
- Out of scope:
  - Calling Shopify from the admin form to validate product existence,
    handles, price, availability, variants, or images.
  - Checkout/cart implementation or product-detail CTA changes.
  - Product-link data migration or automatic mutation of existing MongoDB
    links.
  - Public shop pagination, server-side sorting, or richer product-detail UI.
  - Cloudinary upload policy, route-level API logging, or global logging
    policy.

## Files Likely Touched

- `src/lib/data/schemas/artworkSchema.ts`
- `src/lib/data/types/shopifyTypes.ts`
- `src/components/features/adminDashboard/inputs/`
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `__tests__/unit/forms/`
- `__tests__/unit/api/adminArtworkRoute.test.ts`
- `docs/architecture/shopify-commerce.md`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/T-097-add-admin-shopify-product-link-workflow.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- Admin create artwork form can submit zero or more Shopify product links
  alongside the uploaded artwork image.
- Admin update artwork form renders existing Shopify product links and can add,
  edit, remove one, or remove all links.
- Product IDs are trimmed and validated as numeric before submission.
- Product type choices are limited to `original`, `print`, and `book`.
- Duplicate Shopify product IDs within the same artwork are rejected in the
  form/schema workflow before the API request, matching route behavior.
- Existing T-082 route tests still pass, proving the server boundary remains
  authoritative.
- The Shopify runbook or architecture docs explain the visible admin workflow
  well enough for an operator handoff.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
npm run build
rg -n "shopifyProducts" src/components/features/adminDashboard/crudForms src/components/features/adminDashboard/inputs src/lib/data/schemas/artworkSchema.ts
git diff --check
```

## Handoff Notes

- Prepared after T-096 completed baseline security-header/API CORS hardening.
- Added `ShopifyProductLinksInput` for reusable admin add/remove/edit controls.
- Wired the control into artwork create and update forms, including existing
  link initialization and empty-array update submissions for clearing links.
- Extended shared artwork form schema values to carry `shopifyProducts` while
  preserving T-082 route-level validation.
- Updated Shopify architecture/runbook notes, the Shopify/content/testing
  workstreams, F-010, R-021, and the task index.
- Closed the visible admin workflow gap for F-010/R-021. Shopify product
  existence checks, checkout/cart, data migration, pagination/sorting,
  Cloudinary policy, route-level API logging, and global logging policy remain
  separate.

Verification completed 2026-05-17:

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
npm run build
rg -n "shopifyProducts" src/components/features/adminDashboard/crudForms src/components/features/adminDashboard/inputs src/lib/data/schemas/artworkSchema.ts
git diff --check
```

All commands passed. `npm run build` still emitted the existing Browserslist
staleness notice.
