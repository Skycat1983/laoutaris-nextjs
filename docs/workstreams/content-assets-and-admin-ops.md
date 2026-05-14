# Content, Assets, And Admin Operations Workstream

Status: Planned

Goal: make artwork, collection, biography, blog, article, Cloudinary, and admin
content operations repeatable and safe.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Database runbook](../runbooks/database.md)
- [Cloudinary runbook](../runbooks/cloudinary.md)
- [Auth runbook](../runbooks/auth.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-018 Translations, copy, and content taxonomy](../audits/goals.md#a-018-translations-copy-and-content-taxonomy)
- [A-011 Admin content operations](../audits/goals.md#a-011-admin-content-operations)

## Blocks

- Reliable archive maintenance.
- Admin handoff to non-developer operators.
- Content migration and backup planning.

## Related Code Areas

- `src/app/admin/`
- `src/components/features/adminDashboard/`
- `src/app/api/v2/admin/`
- `src/lib/data/models/`
- `src/lib/data/schemas/cloudinarySchema.ts`
- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`

## Current Facts

- Admin dashboard supports CRUD operations for artwork, articles, collections,
  comments, blogs, and users.
- Cloudinary is used for image upload and delivery.
- MongoDB stores primary archive and content data.
- User-generated content includes comments, favourites, and watchlist records.
- A-001 found no operator-safe admin workflow for creating, validating, and
  removing Shopify product links on artwork records.
- A-013 found admin entity operations are repeated across operation tabs, read
  lists, feeds, and API clients.
- A-014 found the i18n translation pipeline is mostly unused and root Shopify
  historical notes still need consolidation before deletion.
- A-003 found public artwork image transforms bypass Cloudinary image
  sanitization and route-specific image fields are not typed.
- A-004 and A-007 found the Cloudinary signing route lacks a route-local admin
  guard, request validation, complete environment documentation, and clear upload
  preset ownership.
- T-005 hardened the Cloudinary signing route guard and request validation while
  preserving the `next-cloudinary` top-level `signature` response contract.

## Backlog

- Document admin content workflows for each content type.
- Document and implement the admin workflow for linking original, print, and
  book Shopify products to artwork records.
- Add validation and duplicate-prevention expectations for Shopify product link
  operations.
- Define backup and restore expectations for MongoDB and Cloudinary assets.
- Audit Cloudinary upload signing and allowed upload parameters.
- Define allowed Cloudinary signing params, folder rules, upload preset
  ownership, and asset lifecycle expectations for `sign-cloudinary-params`.
- Document Cloudinary variables, upload preset ownership, rotation owner, and
  allowed upload policy in the Cloudinary/environment runbooks.
- Decide whether public artwork responses should expose Cloudinary `public_id`;
  if not, wire image sanitization into artwork transforms and tests.
- Confirm delete behavior for content with related records.
- Consolidate repeated admin entity operation patterns into typed descriptors
  where it reduces duplicated feed/read/update/delete behavior.
- Audit translations, labels, content taxonomy, and public/admin copy
  consistency.
- Decide whether the mostly unused translation pipeline is in launch scope; if
  not, route it to a pruning task.
- Add operator runbooks for adding artworks and linking Shopify products.
- Consolidate useful root Shopify historical notes before deleting or archiving
  the root files.

## Acceptance Criteria

- Admin operators can add and update core archive content from documented steps.
- Destructive admin actions have clear expected behavior.
- Cloudinary upload and MongoDB backup processes are documented.
- Content workflows note Shopify dependencies where relevant.

## Verification

```bash
npm test
npm run build
```

Use manual admin checks when changing dashboard behavior.

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-001, A-013, and A-014 content/admin findings into
  `docs/audits/findings-register.md`, production risks, and this backlog.
- 2026-05-14: Reconciled A-003, A-004, and A-007 Cloudinary/image findings into
  F-041, F-044, production risks, and this backlog.
- 2026-05-14: Prepared T-005 to secure the Cloudinary signing endpoint before
  broader upload policy and image transform work.
- 2026-05-14: Completed T-005 route guard and request validation for the
  Cloudinary signing endpoint; allowed signing params, folder/preset ownership,
  and asset lifecycle policy remain open.

## Next Agent Action

Define the remaining Cloudinary upload policy before changing public image
payloads.
