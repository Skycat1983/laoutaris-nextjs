# T-306 Add Admin Content Image URL Feedback

Status: Completed

Workstreams:

- [Content Assets And Admin Ops](../workstreams/content-assets-and-admin-ops.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add pre-submit allowed-host feedback and safe preview gating for blog and
collection image URL fields.

## What This Does

This task implements the T-303 recommendation: blog create/update and collection
create/update forms should show immediate image URL policy feedback before
submit and should only render previews for valid allowed-host URLs.

## Why This Exists

T-303 found persistence validation is already protected by shared schemas and
admin route validation, but operators can still paste unsupported or malformed
URLs into raw text fields and see broken previews before submit. This is a
focused operator-feedback gap, not a media-picker or Cloudinary lifecycle task.

## Parallel Assignment Rules

This task can run in parallel with T-304 and T-305. It owns admin content image
form feedback code and focused form tests only. Do not edit shared trackers,
workstreams, task index, or orchestration state while running in parallel; list
candidate shared updates in the handoff.

## Scope

In scope:

- Use
  [T-303 Admin Image Control Feedback](../audits/results/T-303-admin-image-control-feedback.md)
  as the source of truth.
- Add a small shared client-safe helper or component for blog/collection
  content-image URL feedback.
- Reuse `isAllowedContentImageUrl()` and
  `CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR`, or the same schema rules, so client
  feedback stays aligned with route validation.
- Apply the feedback/preview guard to:
  - `CreateBlogForm.tsx`;
  - `UpdateBlogForm.tsx`;
  - `CreateCollectionForm.tsx`;
  - `UpdateCollectionForm.tsx`.
- Only update preview state when the URL is syntactically valid and policy
  allowed. Keep existing placeholder/current preview behavior when the draft URL
  is invalid.
- Add focused tests for malformed values, unsupported hosts, preview
  suppression, visible feedback, and allowed-host preview behavior.

Out of scope:

- Do not edit admin routes, route schemas, persistence contracts, allowed-host
  policy, Cloudinary signing/upload behavior, product data, assets, or image
  migration.
- Do not implement a media picker, generic Cloudinary upload reuse,
  Cloudinary lifecycle deletion, or comment/user search filters.
- Do not change persisted `imageUrl` shape or existing form submit contracts.

## Concurrency

This task owns:

- blog/collection create/update form files listed above;
- any new shared client helper/component for content-image URL feedback;
- focused form/helper tests;
- `docs/tasks/T-306-add-admin-content-image-url-feedback.md`.

Leave unrelated dirty files and shared trackers alone.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
- optional shared helper/component for content-image URL feedback
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- `__tests__/unit/forms/adminCollectionForms.test.tsx`
- optional focused helper/component test
- `docs/tasks/T-306-add-admin-content-image-url-feedback.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation and verification
  are complete.
- Record the helper/component added, form files changed, and preview behavior.
- State that routes, schemas, persistence, Cloudinary upload/lifecycle, and media
  picker work were unchanged.
- List candidate shared tracker updates for orchestrator reconciliation.

## Acceptance Criteria

- All four forms show pre-submit visible feedback for malformed or unsupported
  image URLs.
- Previews render only for valid allowed-host URLs.
- Existing valid Cloudinary, Shopify CDN, and Flaticon URLs still work according
  to the shared policy.
- Admin route validation and persisted data shape are unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx __tests__/unit/utils/contentImageUrlValidation.test.ts
git diff --check
```

If a new helper/component test is added, include it in the focused test command.

## Handoff Notes

- Planned on 2026-05-26 after T-303 completed the admin image-control feedback
  audit.
- Completed on 2026-05-26.
- Added `contentImageUrlFeedback.ts` as the shared client-safe helper for draft
  content image URL classification. It reuses `isAllowedContentImageUrl()` and
  `CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR`, with a separate malformed-URL message
  for syntactically invalid drafts.
- Updated `CreateBlogForm.tsx`, `UpdateBlogForm.tsx`,
  `CreateCollectionForm.tsx`, and `UpdateCollectionForm.tsx` so image URL
  changes show pre-submit field feedback and only advance preview state for
  syntactically valid, allowed-host URLs.
- Invalid drafts leave the existing placeholder or current saved preview in
  place. Valid Cloudinary, Shopify CDN, and Flaticon URLs continue to preview
  according to the shared policy.
- Added focused form coverage in
  `__tests__/unit/forms/adminArticleBlogForms.test.tsx` and
  `__tests__/unit/forms/adminCollectionForms.test.tsx` for malformed values,
  unsupported hosts, preview suppression, visible feedback, and allowed-host
  preview behavior.
- Routes, schemas, persistence contracts, allowed-host policy, Cloudinary
  upload/lifecycle behavior, media picker work, product data, assets, and image
  migration were unchanged.
- Candidate shared tracker updates for orchestrator reconciliation:
  - mark T-306 complete in `docs/tasks/README.md`;
  - add a short T-306 completion progress note to
    `docs/workstreams/content-assets-and-admin-ops.md`;
  - add a short T-306 focused coverage note to
    `docs/workstreams/testing-and-quality.md`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx __tests__/unit/utils/contentImageUrlValidation.test.ts`
  and `git diff --check`.
