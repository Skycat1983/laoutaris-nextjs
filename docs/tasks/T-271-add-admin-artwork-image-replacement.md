# T-271 Add Admin Artwork Image Replacement

Status: Completed

Workstreams:

- [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md)
- [Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Expose a safe admin workflow for replacing an existing artwork image using the
current signed Cloudinary upload path.

## Context

- A-031 found the artwork update route accepts an optional replacement `image`,
  but `UpdateArtworkForm` does not expose image replacement.
- Cloudinary signing is already admin-guarded and constrained for the current
  upload widget.
- Current asset lifecycle policy preserves old assets; do not delete Cloudinary
  assets in this task.

## Scope

In scope:

- Add a replacement-image upload control to `UpdateArtworkForm`.
- Use the existing signed Cloudinary upload path and upload-result transform.
- Surface upload and processing failures visibly.
- Preserve current metadata and Shopify product-link update behavior.
- Add focused form/route coverage.

Out of scope:

- Cloudinary deletion or orphan cleanup.
- Blog/collection image media picker.
- Generic media library.

## Concurrency

Do not run in parallel with another task editing `UpdateArtworkForm`, artwork
update route image handling, or Cloudinary upload controls.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `src/app/api/v2/admin/artwork/update/[id]/route.ts`
- Cloudinary upload/transform helpers only if needed
- Focused admin artwork form/route tests
- This task and `docs/tasks/README.md`

## Completion Contract

- Update this task and task index.
- Record verification and candidate tracker updates.

## Acceptance Criteria

- Admins can replace an existing artwork image through the update workflow.
- Upload/transform errors are visible and do not submit partial invalid image
  payloads.
- Existing update behavior remains intact.
- No Cloudinary asset deletion occurs.

## Verification

```bash
npm test -- --runTestsByPath <focused admin artwork form tests> <focused artwork update route tests>
git diff --check
```

## Completion Notes

- Added a replacement-image upload control to the admin artwork update form
  using the existing signed Cloudinary upload button and artwork image
  transform.
- Extended the update form schema/fetcher payload type with optional `image`
  support, while stripping unset image values before submit.
- Surface invalid upload-result processing as a visible form alert and clear
  any pending replacement image rather than submitting a partial image payload.
  The transformed image is schema-validated before it is stored in form state.
- Kept Cloudinary asset lifecycle behavior unchanged; old assets are preserved
  and no deletion path was added.
- Added focused update-form coverage for successful transformed image
  replacement and failed upload-result processing. Existing route coverage
  continues to assert valid and invalid replacement-image payload behavior.
- Added focused upload-button coverage proving the shared Cloudinary upload
  button is `type="button"` when embedded inside forms and supports contextual
  labels.

## Verification Results

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/uploadButton.test.tsx
# Passed: 3 suites, 53 tests

git diff --check -- src/lib/data/schemas/artworkSchema.ts src/components/elements/buttons/UploadButton.tsx src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/uploadButton.test.tsx docs/tasks/T-271-add-admin-artwork-image-replacement.md docs/tasks/README.md docs/workstreams/content-assets-and-admin-ops.md docs/workstreams/testing-and-quality.md
# Passed

./node_modules/.bin/tsc --noEmit --pretty false
# Failed on unrelated pre-existing dirty-worktree diagnostic:
# __tests__/unit/auth/adminFrontendGuard.test.tsx(51,22) TS2352 redirect mock cast.
```

## Handoff Notes

- Completed from A-031 F-A031-001. No shared findings-register row existed for
  this candidate, and no production risk update is needed because the task
  preserved the current no-deletion Cloudinary lifecycle policy.
