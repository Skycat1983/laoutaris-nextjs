# A-009 Cloudinary And Asset Operations Result

Status: Completed

Audit goal: [A-009 Cloudinary and asset operations](../goals.md#a-009-cloudinary-and-asset-operations)

Workstream: [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md)

## Summary

Cloudinary signing is materially safer than earlier audit notes: the admin
signing route now uses `requireApiAdmin()`, validates JSON request shape, signs
only the current widget params, preserves `next-cloudinary`'s top-level
`signature` contract, and has focused tests. Public artwork image transforms
also now sanitize `image.public_id` from public DTOs and validate persisted
color metadata.

The remaining production gaps are operational rather than basic route auth:
there is no documented or implemented asset lifecycle for deleting, backing up,
restoring, or recovering Cloudinary assets; the upload preset, Cloudinary
account, folder, and delivery-transformation policy are not yet owned end to
end; artwork upload metadata handling depends on a brittle client-side cast; and
non-artwork content images are stored as generic URLs without Cloudinary
metadata or allowed-host ownership.

## Scope Inspected

- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/runbooks/cloudinary.md`
- `docs/runbooks/database.md`
- `docs/runbooks/auth.md`
- `docs/runbooks/environment.md`
- `docs/risks/production-readiness.md`
- `docs/audits/findings-register.md`
- `docs/tasks/T-052-sanitize-public-artwork-image-contracts.md`
- `docs/tasks/T-065-update-environment-inventory.md`
- `docs/tasks/T-066-harden-cloudinary-signing-params.md`
- `docs/tasks/T-067-remove-cloudinary-upload-debug-logs.md`
- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- `src/components/elements/buttons/UploadButton.tsx`
- `src/components/features/adminDashboard/operationTabs/ArtworkOperations.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkWithUpload.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
- Admin delete routes for artwork, article, blog, and collection.
- `src/lib/data/schemas/cloudinarySchema.ts`
- `src/lib/data/schemas/artworkSchema.ts`
- `src/lib/data/schemas/articleSchema.ts`
- `src/lib/data/schemas/blogSchema.ts`
- `src/lib/data/schemas/collectionSchema.ts`
- `src/lib/data/types/cloudinaryTypes.ts`
- `src/lib/data/models/artworkModel.ts`
- `src/lib/transforms/artwork/transformCloudinary.ts`
- `src/lib/transforms/artwork/transformImage.ts`
- `src/lib/transforms/artwork/transformArtwork.ts`
- `src/lib/data/services/getArtworkList.ts`
- `src/components/views/ArtworkView.tsx`
- `src/components/layouts/public/MasonryLayout.tsx`
- `next.config.mjs`
- `__tests__/unit/api/cloudinarySigningRoute.test.ts`
- `__tests__/unit/uploadButton.test.tsx`
- `__tests__/unit/transforms/publicArtworkImageContracts.test.ts`
- `__tests__/unit/api/adminArtworkRoute.test.ts`

## Commands Run

- `rg -n "Cloudinary|cloudinary|Cld|asset|image|upload|delete|public_id|publicId|signature|signed|backup|metadata|secure_url|CloudinaryImage|next/image" -S --glob '!node_modules/**' --glob '!\\.next/**' .`: inspected Cloudinary, image, upload, delete, backup, and delivery references.
- `rg -n "destroy|delete_resources|deleteResource|uploader|public_id|delete.*cloudinary|cloudinary\\.uploader|invalidate|backup|restore|orphan|rollback" src docs __tests__ -S`: found no implemented Cloudinary asset deletion or cleanup path in `src`; existing docs leave lifecycle/backup/rollback as open work.
- `rg -n "replace\\(\\s*[\\\"']/upload/|res\\.cloudinary\\.com|secure_url|imageUrl" src/app src/components src/lib -S --glob '*.ts' --glob '*.tsx'`: inspected Cloudinary URL storage and delivery-transformation usage.
- `rg -n "sign-cloudinary|cloudinary signing|CLOUDINARY_API_SECRET|upload_preset|laoutaris_art|Unsupported Cloudinary" __tests__ src -S`: checked signing route and tests.
- `find src/app/api/v2/admin -path '*delete*route.ts' -print`: listed admin delete route surface.
- `npm test -- --runTestsByPath __tests__/unit/api/cloudinarySigningRoute.test.ts __tests__/unit/uploadButton.test.tsx __tests__/unit/transforms/publicArtworkImageContracts.test.ts __tests__/unit/api/adminArtworkRoute.test.ts`: passed, 4 suites / 62 tests. The run emitted Node's existing `[DEP0040] punycode` deprecation warning.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Cloudinary asset deletion, orphan cleanup, backup, restore, and rollback are not defined or implemented. MongoDB deletes remove content records and relationships but leave Cloudinary assets untouched, while non-artwork content records do not retain `public_id` at all. | `src/app/api/v2/admin/artwork/delete/[id]/route.ts:47-69` deletes the artwork and removes collection references only. `src/app/api/v2/admin/blog/delete/[id]/route.ts:36-78`, `src/app/api/v2/admin/article/delete/[id]/route.ts:31-42`, and `src/app/api/v2/admin/collection/delete/[id]/route.ts:31-42` delete MongoDB records and related MongoDB data only. Source search found no `cloudinary.uploader.destroy`, `delete_resources`, or equivalent cleanup implementation under `src`. `docs/runbooks/cloudinary.md:54-61` explicitly leaves deletion, backup, orphaned assets, and rollback expectations open. | Define the asset lifecycle policy before wiring destructive behavior: decide whether content deletion should preserve assets, soft-delete references, queue manual cleanup, or call Cloudinary deletion. Document backup/export and restore steps in the Cloudinary runbook, then add tests around deletion/cascade behavior if source changes. |
| Medium | Upload preset, folder, account, and delivery ownership are still split across hard-coded source, env docs, and open policy notes. | `src/components/elements/buttons/UploadButton.tsx:19-27` hard-codes `uploadPreset="laoutaris_art"` and no folder/tags/context options. `src/app/api/v2/admin/sign-cloudinary-params/route.ts:30-35` mirrors that preset and only allows `timestamp`, `upload_preset`, and `source`; `__tests__/unit/api/cloudinarySigningRoute.test.ts:171-192` confirms `folder` is rejected. `docs/runbooks/environment.md:57` says `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is unused and needs an owner decision. `next.config.mjs:51-58` only allows `res.cloudinary.com/dzncmfirr/**`, while the signer uses `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` at `src/app/api/v2/admin/sign-cloudinary-params/route.ts:11-14`. | Choose one source of truth for the preset and Cloudinary cloud, document the production account/preset owner, and define exact folder/tag/context rules before signing additional params. Align `next.config.mjs` image delivery policy with that decision so preview or production Cloudinary account changes do not make uploads render-invalid. |
| Medium | Artwork upload metadata processing is brittle and mostly client-side. A successful Cloudinary upload can still fail later without operator recovery or automatic orphan cleanup. | `src/components/features/adminDashboard/crudForms/create/CreateArtworkWithUpload.tsx:16-32` and `src/components/features/adminDashboard/operationTabs/ArtworkOperations.tsx:50-69` only check that `result.info.colors` exists before casting to `CloudinaryUploadInfo`. `src/lib/transforms/artwork/transformCloudinary.ts:10-38` then assumes `colors`, `predominant.cloudinary`, and `predominant.google` are tuple arrays. `CreateArtworkForm` posts the transformed image after upload but only logs API failure at `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx:59-80`; uploaded assets are not marked pending, retried, or cleaned up if the MongoDB create fails. The server does strictly validate persisted image shape through `src/lib/data/schemas/artworkSchema.ts:116-122` and `src/lib/data/schemas/cloudinarySchema.ts:10-22`, so invalid metadata is rejected, but only after the asset may already exist in Cloudinary. | Parse `result.info` with a shared schema before enabling the artwork form, show actionable upload-metadata errors, and document which Cloudinary preset settings guarantee color metadata. If failed form submission should not leave orphan uploads, add an explicit pending-upload cleanup or operator cleanup workflow. |
| Medium | Blog and collection images are treated as arbitrary URLs, so asset operations are not consistently Cloudinary-owned and invalid delivery hosts can be persisted. | Blog create/update forms expose free-text `imageUrl` fields at `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx:139-160` and `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx:143-164`. Collection create/update forms do the same at `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx:84-106` and `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx:162-181`. The schemas only require a syntactically valid URL and length in `src/lib/data/schemas/blogSchema.ts:77-87` and `src/lib/data/schemas/collectionSchema.ts:54-64`. `next.config.mjs:51-70` allows optimized images only from the configured Cloudinary cloud, Flaticon, and Shopify CDN, so other accepted URLs can fail at render time. | Decide whether content images must use Cloudinary. If yes, reuse the admin upload flow or validate allowed Cloudinary hosts and store enough metadata for deletion/backup. If external URLs remain allowed, add an explicit allowed-host policy and documented operator checks. |
| Low | Cloudinary delivery transformations are hand-built with string replacement in multiple components instead of a shared delivery helper or documented transformation policy. | Source search found repeated `.replace("/upload/", "/upload/...")` delivery transforms in cards, section components, admin read lists, and `src/components/layouts/public/MasonryLayout.tsx:42-52`. Detail rendering uses the original `secure_url` in `src/components/views/ArtworkView.tsx:36-44`. `docs/runbooks/cloudinary.md:52` still lists upload preset, folder, and transformation conventions as open work. | Add a small Cloudinary delivery helper or documented convention for common thumbnail, card, detail, and admin preview sizes. Keep A-010 responsible for broader performance/accessibility review, but centralize asset URL construction here so delivery behavior is auditable. |

## Findings Register Updates

- Not updated directly because this audit is in concurrent discovery mode.
  Candidate rows for reconciliation:
  - `A-009` / High / Cloudinary asset deletion, orphan cleanup, backup, restore,
    and rollback are not defined or implemented.
  - `A-009` / Medium / Cloudinary upload preset, folder, account, and delivery
    ownership remain split between hard-coded source, env docs, and open policy
    notes.
  - `A-009` / Medium / Artwork upload metadata processing is brittle and can
    leave orphaned Cloudinary assets after failed MongoDB persistence.
  - `A-009` / Medium / Blog and collection image URLs are generic URL fields
    rather than Cloudinary-owned asset references.
  - `A-009` / Low / Cloudinary delivery transformations are duplicated string
    replacements rather than a shared, documented delivery policy.

## Risks Updated

- Not updated directly. Candidate risk changes:
  - Update `R-008` to include the A-009 evidence for unresolved upload
    preset/folder/account policy, asset deletion, backup/restore, orphan
    cleanup, and Cloudinary delivery ownership.
  - Consider whether generic content image URLs belong under `R-008` or a new
    content-operations risk if the owner wants external image URLs to remain in
    scope.

## Workstream Updates

- Not updated directly. Candidate backlog additions for
  `docs/workstreams/content-assets-and-admin-ops.md`:
  - Define Cloudinary asset lifecycle behavior for artwork, article, blog, and
    collection deletion.
  - Document Cloudinary backup, restore, orphan cleanup, and rollback steps.
  - Choose the canonical upload preset/cloud/folder policy and align
    `UploadButton`, `sign-cloudinary-params`, environment docs, and
    `next.config.mjs`.
  - Harden artwork upload-result parsing and failed-create recovery.
  - Decide whether blog and collection image fields must be Cloudinary-managed
    assets or allowed external URLs.
  - Centralize Cloudinary delivery transformations for cards, lists, detail
    views, and admin previews.

## Next Action

Reconcile these candidate findings into the findings register, `R-008`, the
Cloudinary runbook, and the content/assets workstream backlog, then choose the
first implementation slice: either document lifecycle/backup policy or align
the upload preset/folder/account source of truth.
