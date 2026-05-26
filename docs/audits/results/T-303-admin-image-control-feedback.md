# T-303 Admin Image Control Feedback

Status: Completed

Task: [T-303 Audit admin image control feedback](../../tasks/T-303-audit-admin-image-control-feedback.md)

Workstream: [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md)

## Assignment Summary

Audit the remaining A-031/F-137 blog and collection image-control feedback gap,
including create/update forms, shared validation, preview behavior, route
validation, and Cloudinary/allowed-host policy touchpoints. This was a docs-only
audit; no runtime source, tests, shared trackers, assets, or data were changed.

## Summary

The current gap is narrower than a full media picker. Blog and collection
`imageUrl` writes already use the shared content-image URL policy in both client
form schemas and admin route schemas, so unsupported hosts are rejected before
persistence. Focused route tests cover Cloudinary, Flaticon, and Shopify CDN
acceptance plus arbitrary-host rejection.

The remaining operator issue is immediate feedback and preview safety. Blog
create/update and collection create/update still expose raw URL text inputs, and
their preview state can accept arbitrary HTTP(S), unsupported-host, or partially
typed values before the operator submits the form. That means the operator may
see a broken preview or only learn the allowlist rule at form-submit time.

Recommended next slice: add shared pre-submit content-image URL feedback for
blog and collection create/update forms. Reuse the existing
`isAllowedContentImageUrl()` policy helper or the same schema rules, set visible
field errors/status on blur/change, and only render previews for policy-valid
URLs. Defer a full media picker and generic Cloudinary upload reuse until owner
workflow requirements are clearer.

## Commands Run

- `sed -n '1,240p' docs/README.md`
- `sed -n '1,260p' docs/tasks/T-303-audit-admin-image-control-feedback.md`
- `sed -n '1,260p' docs/workstreams/content-assets-and-admin-ops.md`
- `sed -n '1,260p' docs/audits/goals.md`
- `sed -n '1,260p' docs/audits/results/A-031-admin-content-controls.md`
- `rg -n "F-137|A031|A-031|imageUrl|image URL|media picker|pre-submit|allowed-host|allowed host" docs/audits/findings-register.md docs/tasks docs/workstreams/content-assets-and-admin-ops.md docs/architecture docs/runbooks`
- `rg --files src/components/features/adminDashboard src/app/api/v2/admin src/lib/validation src/lib/data/schemas __tests__ | rg "(Blog|Collection|Artwork|contentImageUrl|sign-cloudinary|cloudinary|admin.*blog|admin.*collection)"`
- `nl -ba` source reads for the files listed below.
- `rg -n "CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR|arbitrary|imageUrl|cloudinary|shopify|flaticon" __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts`
- `rg -n "image preview|Image URL|allowed content image host|CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR|isAllowedContentImageUrl|Upload replacement image|Replacement image ready" __tests__/unit/forms __tests__/unit/uploadButton.test.tsx __tests__/unit/api/cloudinarySigningRoute.test.ts`
- `git status --short`
- `git diff --check`
- `git diff --no-index --check /dev/null docs/audits/results/T-303-admin-image-control-feedback.md`
- `git diff --no-index --check /dev/null docs/tasks/T-303-audit-admin-image-control-feedback.md`

## Files Inspected

- `docs/tasks/T-303-audit-admin-image-control-feedback.md`
- `docs/audits/results/A-031-admin-content-controls.md`
- `docs/audits/findings-register.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/runbooks/cloudinary.md`
- `docs/runbooks/admin-content-operations.md`
- `docs/tasks/T-135-harden-content-image-url-validation.md`
- `docs/tasks/T-171-audit-existing-content-image-urls.md`
- `docs/tasks/T-271-add-admin-artwork-image-replacement.md`
- `docs/tasks/T-272-improve-admin-artwork-relationship-feedback.md`
- `next.config.mjs`
- `src/lib/validation/contentImageUrl.ts`
- `src/lib/data/schemas/blogSchema.ts`
- `src/lib/data/schemas/collectionSchema.ts`
- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `src/components/elements/buttons/UploadButton.tsx`
- `src/app/api/v2/admin/blog/create/route.ts`
- `src/app/api/v2/admin/blog/update/[id]/route.ts`
- `src/app/api/v2/admin/collection/create/route.ts`
- `src/app/api/v2/admin/collection/update/[id]/route.ts`
- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- `__tests__/unit/utils/contentImageUrlValidation.test.ts`
- `__tests__/unit/api/adminBlogRoute.test.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- `__tests__/unit/forms/adminCollectionForms.test.tsx`
- `__tests__/unit/uploadButton.test.tsx`

## Current Behavior

| Area | Current behavior | Evidence |
| --- | --- | --- |
| Blog create | Renders `Image URL` as a raw input, initializes `imagePreview` as `null`, and sets preview on blur only when the value matches `^https?://.+`. It does not run the allowed-host policy before previewing. Submit uses `zodResolver(createBlogFormSchema)` and API errors are mapped onto visible fields. | `CreateBlogForm.tsx:56`, `CreateBlogForm.tsx:59-71`, `CreateBlogForm.tsx:74-108`, `CreateBlogForm.tsx:173-195`, `CreateBlogForm.tsx:370-381`. |
| Blog update | Renders the same raw `Image URL` input, initializes preview from the existing blog image, and sets preview to any blur value without URL or host checks. Submit uses `zodResolver(updateBlogFormSchema)` and API errors are mapped onto visible fields. | `UpdateBlogForm.tsx:51-75`, `UpdateBlogForm.tsx:77-103`, `UpdateBlogForm.tsx:173-195`, `UpdateBlogForm.tsx:370-382`. |
| Collection create | Renders raw `Image URL`, previews HTTP(S) values on blur, and surfaces route/form field errors after submit. It has a custom `applyApiErrors()` mapper rather than the shared blog/article helper. | `CreateCollectionForm.tsx:38-63`, `CreateCollectionForm.tsx:72-89`, `CreateCollectionForm.tsx:91-151`, `CreateCollectionForm.tsx:164-186`, `CreateCollectionForm.tsx:261-273`. |
| Collection update | Renders raw `Image URL`, initializes preview from the saved collection image, and updates preview on every keystroke. It does not require a syntactically valid or allowed URL before rendering the preview. | `UpdateCollectionForm.tsx:80-88`, `UpdateCollectionForm.tsx:97-145`, `UpdateCollectionForm.tsx:244-273`, `UpdateCollectionForm.tsx:335-354`, `UpdateCollectionForm.tsx:426-450`. |
| Shared validation | Blog and collection schemas both use `buildContentImageUrlSchema()`, so client form submit and route submit share the same allowed-source rules. | `blogSchema.ts:78-84`, `blogSchema.ts:91-115`, `blogSchema.ts:119-141`, `collectionSchema.ts:55-61`, `collectionSchema.ts:67-82`, `collectionSchema.ts:88-103`. |
| Route validation | Blog and collection create/update routes parse request bodies before persistence and return structured 400 field errors for invalid image URLs. Update routes validate body image URLs before reading the target document. | `blog/create/route.ts:102-107`, `blog/update/[id]/route.ts:114-119`, `collection/create/route.ts:56-61`, `collection/update/[id]/route.ts:114-119`. |
| Allowed-host policy | The policy accepts only configured Cloudinary delivery URLs, Flaticon, and Shopify CDN, rejecting malformed URLs, unsupported protocols, credentials, non-default ports, arbitrary hosts, and mismatched Cloudinary paths. | `contentImageUrl.ts:3-22`, `contentImageUrl.ts:40-58`, `contentImageUrl.ts:60-91`, `next.config.mjs:51-71`, `cloudinary.md:133-144`. |
| Artwork replacement comparison | T-271 added an upload-first artwork replacement control with visible upload-result processing feedback. That pattern is useful for error/status presentation, but the artwork flow persists a structured Cloudinary image object while blog/collection currently persist simple URL strings. | `UpdateArtworkForm.tsx:87-142`, `UpdateArtworkForm.tsx:378-400`, `UploadButton.tsx:24-57`, `T-271-add-admin-artwork-image-replacement.md`. |

## Operator Failure Modes

| Failure mode | Impact | Evidence |
| --- | --- | --- |
| Unsupported host appears previewable before submit. | Operators can paste `https://example.com/...`, see the preview attempt, and only learn the policy when submitting the form. | Blog/collection preview handlers do not call `isAllowedContentImageUrl()`; server/form schemas reject the same value later. |
| Partially typed collection update URLs can be passed to `next/image`. | Collection update preview changes on every keystroke, which can create broken preview behavior while the operator types. | `UpdateCollectionForm.tsx:345-348`, `UpdateCollectionForm.tsx:436-443`. |
| Blog update accepts any blur value into preview state. | A mistyped or unsupported URL can replace the known-good current preview before validation feedback is shown. | `UpdateBlogForm.tsx:51-75`, `UpdateBlogForm.tsx:370-378`. |
| Allowed-source details are not visible near the field before submit. | The canonical policy exists in docs and validation code, but the form descriptions say only that the URL accompanies the post or collection. | `CreateBlogForm.tsx:189-191`, `UpdateBlogForm.tsx:189-191`, `CreateCollectionForm.tsx:180-182`, `UpdateCollectionForm.tsx:339-351`. |
| Create/update forms duplicate preview logic. | A future fix could drift if each form handles URL feedback separately. | Blog create/update and collection create/update have separate preview state and handlers. |

## Recommendation

Implement one narrow task: add pre-submit allowed-host feedback and preview
guarding for blog and collection `imageUrl` controls.

Suggested scope:

- Add a small shared client-safe helper or component for content-image URL
  inputs, reused by blog create, blog update, collection create, and collection
  update.
- Reuse `isAllowedContentImageUrl()` and
  `CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR`, or reuse the existing Zod schema via
  form validation, so the UI cannot drift from route validation.
- On blur for blog/create collection, and on debounced change or blur for
  collection update, show a visible field message for malformed or unsupported
  URLs before the operator submits.
- Only set `imagePreview` when the URL is valid and allowed. Keep the existing
  placeholder or the current saved image when the draft value is invalid.
- Preserve current submit contracts, route schemas, allowed sources, and
  persisted `imageUrl` shape.
- Add focused form tests for unsupported hosts, malformed values, preview
  suppression, and successful allowed-host preview for all four forms or a
  shared component plus representative integrations.

Do not make a full media picker the next task. A generic media picker needs
asset-library ownership, selection UX, and lifecycle/orphan policy decisions
that are broader than F-137. Do not reuse the Cloudinary upload widget first
unless the owner specifically wants upload-to-URL as the blog/collection
workflow; that would add new orphaned-upload recovery cases for content images
without solving the immediate feedback gap.

## Future Verification Requirements

For the implementation slice, run:

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx __tests__/unit/utils/contentImageUrlValidation.test.ts
git diff --check
```

If the implementation factors a new shared component or helper into a separate
unit test, include that focused test file as well. Browser automation is not
required unless preview rendering behavior changes beyond targeted jsdom tests.

## Candidate Tracker Updates

For orchestrator reconciliation only; this audit did not edit shared trackers.

- `docs/audits/findings-register.md`: keep F-137 `Converted`, but update the
  note to say T-303 scoped the next slice as pre-submit URL feedback and preview
  guarding, not a full media picker.
- `docs/workstreams/content-assets-and-admin-ops.md`: add a backlog item or
  next action for a focused implementation task: "Add pre-submit allowed-host
  feedback and safe preview gating to blog/collection image URL controls."
- `docs/tasks/README.md`: after the orchestrator prepares the next task, add it
  as the implementation follow-up to T-303.
- No production risk update is recommended. The persistence boundary is already
  protected by T-135; this is an operator-feedback improvement.

## Handoff Notes

- This audit kept F-138 comment/user search separate; it remains unrelated to
  image URL feedback.
- This audit kept Cloudinary asset deletion, folder signing, upload-preset
  ownership, and generic media-library work separate.
- The recommended implementation can run without touching admin routes or
  validation policy unless tests expose a client/server drift.
- Verification passed: `git diff --check` produced no whitespace errors, and
  no-index whitespace checks on the two untracked owned T-303 files also
  produced no whitespace errors. The no-index commands exited `1` because the
  checked files differ from `/dev/null`, not because whitespace errors were
  reported.
