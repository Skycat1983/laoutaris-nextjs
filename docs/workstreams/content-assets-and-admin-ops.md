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

## Backlog

- Document admin content workflows for each content type.
- Define backup and restore expectations for MongoDB and Cloudinary assets.
- Audit Cloudinary upload signing and allowed upload parameters.
- Confirm delete behavior for content with related records.
- Audit translations, labels, content taxonomy, and public/admin copy
  consistency.
- Add operator runbooks for adding artworks and linking Shopify products.

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

## Next Agent Action

Inventory admin CRUD forms and routes, then document one complete artwork create
and update workflow.
