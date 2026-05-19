# T-150 Surface Admin Artwork Form Errors

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Apply the structured admin API error-display pattern to artwork create/update
forms, including Shopify product-link validation failures.

## Context

- T-144 fixed collection create/update form error display and made
  `createFetcher()` preserve structured `fieldErrors` and `formErrors`.
- T-148 extracted the client-safe `applyApiFormErrors()` helper and applied it
  to article/blog create/update forms.
- F-094 is resolved for collection, article, and blog form slices; artwork and
  product-link form errors remain the next candidate follow-up.
- T-097 and T-098 added the artwork Shopify product-link workflow and advisory
  verification states. This task should preserve those workflows while making
  route-authored save errors visible.

## Scope

In scope:

- Surface structured API `fieldErrors` and `formErrors` in
  `CreateArtworkForm`.
- Surface structured API `fieldErrors` and `formErrors` in
  `UpdateArtworkForm`.
- Show Shopify product-link validation failures near the product-link controls
  when possible, otherwise as a visible form-level error.
- Ensure failed artwork API responses do not call success callbacks.
- Preserve existing Cloudinary upload gating, upload state handoff, successful
  create/update behavior, and product-link verification states.
- Reuse `applyApiFormErrors()` unless a tiny local extension is needed for
  nested artwork/product-link fields.
- Add focused form tests for representative artwork field errors,
  product-link errors, and preserved success behavior.

Out of scope:

- Do not change admin artwork route schemas, persistence contracts, or
  validation messages.
- Do not add persistence-time Shopify API validation or make product-link
  verification save-blocking.
- Do not redesign the upload workflow or product-link controls beyond visible
  error placement.
- Do not change collection, article, or blog forms in this slice unless a
  shared helper typing fix is unavoidable.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-151 and T-152 because it owns artwork form submit
behavior and focused artwork form tests.

Owned files:

- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkWithUpload.tsx`
  only if the submit boundary requires it
- `src/components/features/adminDashboard/inputs/ShopifyProductLinksInput.tsx`
  only for error placement
- focused artwork form tests under `__tests__/unit/forms/`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `src/components/features/adminDashboard/inputs/ShopifyProductLinksInput.tsx`
- `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`
- `docs/tasks/T-150-surface-admin-artwork-form-errors.md`

## Acceptance Criteria

- Artwork create/update route validation failures are visible to the operator.
- Product-link validation failures are visible near the product-link workflow
  when possible.
- Failed artwork create/update responses do not invoke success callbacks.
- Successful artwork create/update behavior, upload handling, and product-link
  verification behavior remain covered.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx
git diff --check
```

Run `npm run lint` if helper typings or shared artwork form components change.

## Handoff Notes

- Prepared after T-147 through T-149 reconciliation.
- Completed by applying `applyApiFormErrors()` to `CreateArtworkForm` and
  `UpdateArtworkForm`, rendering form-level errors, routing
  `shopifyProducts` field errors into the existing product-link control, and
  preserving success callbacks only for successful API responses.
- Added focused coverage in
  `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx` for artwork
  create field errors, create/update product-link errors, update form errors,
  local duplicate validation, advisory Shopify verification, and successful
  create/update behavior.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`,
  `git diff --check`, and `npm run lint`.
- Candidate shared-tracker update: mark the remaining F-094 artwork/product-link
  form-error follow-up complete.
