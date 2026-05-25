# A-031 Admin Content Controls Snapshot

Status: Completed

Audit goal:
[A-031 Admin content controls snapshot](../goals.md#a-031-admin-content-controls-snapshot).

Workstreams:
[Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md),
[Shopify commerce](../../workstreams/shopify-commerce.md).

## Assignment Summary

Inspect admin dashboard content-operation controls for articles, artwork, blogs,
collections, users, comments, Shopify product links, and Cloudinary uploads to
identify focused operator-facing gaps.

## Summary

The admin dashboard has a materially stronger content-control baseline than the
older runbook context implied: all main dashboard sections are configured,
article/artwork/blog/collection read lists are route-backed with pagination plus
resource-specific search/filter controls, read-list cards can hand off into
update/delete workflows, delete confirmation shows preview/evidence controls,
and Shopify product-link editing has explicit advisory verification.

The remaining operator-facing gaps are concentrated in media and relationship
controls. The dashboard can upload an image for new artwork, but it does not
expose the update-route image replacement capability for existing artwork.
Article and collection relationship edits still depend on manual ObjectId entry,
and collection relationship add failures can be silent. Blog and collection
image fields still rely on raw URL entry instead of an admin media picker or
pre-submit allowlist feedback. User/comment moderation discovery remains
pagination-only.

## Scope Inspected

- Dashboard routing and segment config:
  `src/app/admin/dashboard/@main/[segment]/page.tsx`,
  `src/components/features/adminDashboard/adminSegmentConfig.tsx`, and
  `src/components/modules/tabs/AdminCrudTabs.tsx`.
- Document reader, operation tabs, read-list handoff, pagination, search, and
  filter controls under `src/components/features/adminDashboard/`.
- Create/update/delete form controls for articles, artwork, blogs,
  collections, users, and comments.
- Shopify product-link form controls, schema validation, advisory verification
  fetcher, and the public product-by-ID route.
- Cloudinary artwork upload button, signing route, upload-result transform, and
  Cloudinary image schema.
- Focused unit tests covering admin read-list pagination/handoff, forms,
  Shopify product links, delete confirmation, and Cloudinary signing.
- Required docs: A-031 goal, content/admin and Shopify workstreams, admin
  content operations runbook, Cloudinary runbook, Shopify commerce architecture,
  Shopify operations runbook, and production risks.

## Commands Run

- `git status --short` - confirmed a dirty worktree with unrelated existing
  edits/untracked audit files; this audit touched only this result file.
- `sed -n '650,710p' docs/audits/goals.md` - confirmed A-031 scope,
  result-file-only ownership, and no browser/destructive operations.
- `sed -n '1,260p' docs/workstreams/content-assets-and-admin-ops.md` and
  `sed -n '1,280p' docs/workstreams/shopify-commerce.md` - read workstream
  facts, backlog, and acceptance criteria.
- `sed -n '1,260p' docs/runbooks/admin-content-operations.md`,
  `sed -n '260,620p' docs/runbooks/admin-content-operations.md`,
  `sed -n '1,280p' docs/runbooks/cloudinary.md`, and
  `sed -n '1,260p' docs/runbooks/shopify-operations.md` - read current
  operator policies for content edits, Cloudinary, and Shopify links.
- `sed -n '1,260p' docs/architecture/shopify-commerce.md` and
  `sed -n '1,320p' docs/risks/production-readiness.md` - read commerce
  architecture and active production risks.
- `rg --files src/app/admin src/components/features/adminDashboard src/app/api/v2/admin __tests__ | rg "admin|Admin|dashboard|cloudinary|shopify|delete|create|update|read"`
  - inventoried admin dashboard source and focused tests.
- Targeted `nl -ba ... | sed -n ...` reads over admin segment config, CRUD
  tabs, operation tabs, document reader, read lists, create/update/delete
  forms, form schemas, admin routes, fetchers, `UploadButton`, Cloudinary
  signing, and focused tests.
- `rg -n "TODO|Not Available|Read User Component|Read Comment Component|imagePreview|handleImageUrlBlur|artworkToAdd|Fetch Artwork|Add Artwork|Failed to process upload|Please upload an image to continue" ...`
  - identified remaining operator-control TODOs and weak feedback paths.
- `git diff --no-index --check /dev/null docs/audits/results/A-031-admin-content-controls.md`
  - exited `1` because the file is untracked/new, with no whitespace errors
  reported.
- No browser automation, screenshots, uploads, destructive operations, or
  source tests were run; this was a source/doc audit only.

## Control Surface Matrix

| Surface | Current behavior | Gap or confidence note | Evidence | Recommended follow-up |
| --- | --- | --- | --- | --- |
| Article controls | Articles have create/update/delete routes in the segment config, a read-list with title/slug search, section/overlay filters, update/delete/copy actions, and a create flow gated by an artwork lookup. | Create/update still rely on manual artwork ObjectId entry. Updating the linked artwork silently ignores failed fetches, so the operator gets no visible "not found" state until submit or not at all. | `adminSegmentConfig.tsx:21-31`; `ReadArticleList.tsx:40-167`, `200-249`; `ArticleOperations.tsx:73-130`; `UpdateArticleForm.tsx:83-101`, `146-173`; tests in `adminArticleReadPagination.test.tsx` and `adminArticleBlogForms.test.tsx`. | Add a reusable relationship-picker/lookup control with visible lookup failure and duplicate/unchanged states, keeping ObjectId lookup as an escape hatch. |
| Artwork controls | Artwork has create/read/update/delete tabs. Create requires the Cloudinary upload to complete before form fields/submit are enabled. Read list supports title search, taxonomy filters, pagination, update/delete/copy handoff. Update supports metadata and Shopify links. | Existing artwork image replacement is not exposed in the update UI even though the update route schema accepts an optional replacement `image`. Operators cannot correct or replace an artwork image through the normal dashboard path. | `ArtworkOperations.tsx:98-114`; `CreateArtworkForm.tsx:74-110`, `300-324`; `UpdateArtworkForm.tsx:59-76`, `301-327`; `artworkSchema.ts:128-138`; `artwork/update/[id]/route.ts:117-146`; `adminArtworkReadPagination.test.tsx:229-452`. | First follow-up should add a signed Cloudinary replacement-image control to `UpdateArtworkForm`, with visible upload/process errors and tests. |
| Blog controls | Blog create/update expose display date, image URL, title/subtitle/summary/text, featured, pinned, and canonical tag checkboxes. Read list has pagination, title/slug search, featured/year filters, update/delete/copy actions, and empty/error states. | Image entry is a raw URL field with preview-on-blur; host/policy validation is surfaced only after submit. There is no admin media picker/upload path for blog images. | `CreateBlogForm.tsx:41-71`, `173-195`, `286-366`; `UpdateBlogForm.tsx:32-70`, `173-195`, `286-366`; `blogSchema.ts:78-141`; `ReadBlogList.tsx:49-180`, `214-264`; `adminArticleBlogForms.test.tsx:208-369`; `adminBlogReadPagination.test.tsx`. | Add pre-submit content-image validation or a Cloudinary-backed selector for blog images after the artwork replacement path is handled. |
| Collection controls | Collection create/update/read/delete exist. Read list has title/slug search, pagination, update/delete/copy actions. Update shows associated artwork previews and sends `artworksToAdd`/`artworksToRemove` to a route that validates added artwork IDs exist. | Create cannot attach artworks. Update uses a manual artwork ID field; duplicate adds and failed lookups return silently, a TODO notes missing duplicate feedback, and the "Ready to add" state is never set. Section remains schema/default-driven rather than operator-controlled. | `CreateCollectionForm.tsx:74-151`, `164-257`; `UpdateCollectionForm.tsx:145-179`, `223-259`, `380-408`; `collectionSchema.ts:67-103`; `collection/update/[id]/route.ts:44-55`, `130-150`; `adminCollectionForms.test.tsx:168-230`. | Include collection membership in the relationship-picker follow-up: visible search/lookup errors, duplicate warnings, and tested add/remove state. |
| User/comment controls | User/comment create/update tabs are disabled; read lists are paginated and retain delete/copy handoff into the evidence-gated delete confirmation flow. Detail delete workflows use `DocumentReader` when invoked manually. | Discovery is pagination-only: no search/filter by username, role, comment text, blog, author, or date. This can push routine moderation/user cleanup back to manual ObjectId lookup. | `adminSegmentConfig.tsx:62-83`; `ReadUserList.tsx:22-164`; `ReadCommentList.tsx:23-166`; `UserOperations.tsx:62-90`; `CommentOperations.tsx:65-93`; `adminCommentUserReadPagination.test.tsx:103-315`; `adminArchiveEntryPoints.test.tsx:222-281`. | Add moderation/user discovery filters only after higher-risk media and relationship controls are queued. |
| Shopify product links | Artwork create/update forms expose repeatable `shopifyProducts` rows with numeric ID, canonical type, add/remove, local validation, and explicit advisory verification against the public product-by-ID route. Verification shows title, handle, availability, type, and price; it does not block save. | This area looks aligned with the documented current policy. Remaining choice is policy, not missing UI: verification is advisory and persistence-time Shopify validation remains undecided. | `ShopifyProductLinksInput.tsx:203-297`, `299-497`; `artworkSchema.ts:14-76`, `79-139`; `shop/fetchers.ts:7-15`; `shop/products/[productId]/route.ts:47-83`; `adminArtworkShopifyProductLinks.test.tsx:111-516`; `shopify-commerce.md` admin workflow. | No immediate UI fix. Keep advisory verification and route validation aligned with the Shopify runbook if policy changes. |
| Cloudinary upload/signing | Artwork create uses `UploadButton` with preset `laoutaris_art`, one file, 10 MB max, and the admin signing endpoint. The signing route is admin-guarded, validates `paramsToSign`, accepts only `timestamp`, `upload_preset`, and `source`, and preserves the `signature` response contract. | Signing controls are strong for the current widget. UI gaps remain around upload result processing and where upload controls are exposed: update artwork has no replacement upload path, and blog/collection image workflows do not use the widget. | `UploadButton.tsx:18-49`; `sign-cloudinary-params/route.ts:25-157`; `ArtworkOperations.tsx:52-71`; `transformCloudinary.ts:4-36`; `cloudinarySchema.ts:10-22`; `cloudinarySigningRoute.test.ts:88-344`. | Reuse the existing signed upload path for controlled artwork image replacement before expanding generic content-image uploads. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| Medium | Existing artwork image replacement is not an operator workflow. The update route contract can accept `image`, but the update form only edits metadata and Shopify links while rendering the current image preview. | `artworkSchema.ts:128-138`; `artwork/update/[id]/route.ts:117-146`; `UpdateArtworkForm.tsx:59-76`, `301-327`; `ArtworkOperations.tsx:98-114`. | Add a focused artwork image replacement task using the existing signed upload widget, explicit upload-result processing states, server-side route validation, and form/route tests. |
| Medium | Article and collection relationship controls still depend on manual ObjectId entry with incomplete lookup feedback. Article update silently ignores failed artwork fetches; collection update silently ignores duplicate adds and failed lookups. | `ArticleOperations.tsx:73-100`; `UpdateArticleForm.tsx:83-101`; `UpdateCollectionForm.tsx:145-179`, `223-259`; TODOs at `UpdateCollectionForm.tsx:163`, `230`; `adminCollectionForms.test.tsx:168-199`. | Build a reusable admin relationship lookup/picker for artwork relationships, with visible not-found, duplicate, and unchanged states plus tests. |
| Medium | Blog and collection image controls still require operators to paste raw image URLs. The forms preview HTTP(S) strings before submit, but the approved-host policy is enforced only when the create/update request is submitted. | `CreateBlogForm.tsx:104-108`, `173-195`, `370-381`; `UpdateBlogForm.tsx:73-75`, `173-195`, `371-382`; `CreateCollectionForm.tsx:85-89`, `164-186`, `262-273`; `collectionSchema.ts:55-61`; `blogSchema.ts:78-84`. | Add pre-submit approved-host validation and/or a Cloudinary-backed media selector for content images once the artwork replacement workflow is defined. |
| Low | Comment and user read tabs are pagination-only, so normal moderation and user cleanup may still require manual ObjectId lookup when the target is not on the current pages. | `ReadCommentList.tsx:23-166`; `ReadUserList.tsx:22-164`; `comment/read/route.ts:29-69`; `user/read/route.ts:30-68`; `adminCommentUserReadPagination.test.tsx:103-315`. | Add search/filter controls for moderation/user discovery if operators report routine lookup friction. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| F-A031-001 | Medium | Candidate | Existing artwork image replacement is not available through the admin update workflow despite route support for an optional replacement image. | Content, assets, and admin operations; Cloudinary policy under R-008. |
| F-A031-002 | Medium | Candidate | Article and collection relationship controls rely on manual ObjectIds and have weak or silent lookup/duplicate feedback. | Content, assets, and admin operations; Data/API for reusable lookup contracts if needed. |
| F-A031-003 | Medium | Candidate | Blog and collection image controls rely on raw URL paste with submit-time allowlist validation and no admin media picker. | Content, assets, and admin operations; Cloudinary policy under R-008. |
| F-A031-004 | Low | Candidate | Comment and user read tabs lack search/filter controls for routine moderation or cleanup discovery. | Content, assets, and admin operations; Auth/admin only if user-role discovery scope changes. |

## Risks Updated

- None edited. Candidate updates for orchestrator review:
  - R-008 could mention that Cloudinary signing is hardened but admin media
    controls still lack update-artwork replacement and content-image picker
    workflows.
  - R-007 could mention that relationship/moderation discovery still relies on
    manual ObjectId paths in some admin controls.

## Workstream Updates

- Candidate `content-assets-and-admin-ops.md` backlog additions:
  - Add an admin artwork image replacement workflow using the signed
    Cloudinary upload path, visible upload-result errors, and tests.
  - Replace manual article/collection artwork relationship entry with a shared
    lookup/picker that surfaces not-found, duplicate, and unchanged states.
  - Add pre-submit approved-host feedback or a Cloudinary-backed selector for
    blog and collection image URLs.
  - Consider comment/user search and filters after higher-risk media and
    relationship controls are queued.
- Candidate `shopify-commerce.md` update: none. Product-link controls match the
  current documented advisory-verification policy.

## Next Action

Prepare one focused implementation task for F-A031-001: add artwork image
replacement to the admin update workflow using the existing signed Cloudinary
upload path, preserve the current asset lifecycle policy, surface upload and
processing failures visibly, and add form plus route coverage.
