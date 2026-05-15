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
- A-008 reconfirmed allowed Cloudinary signing params, public/server variable
  ownership, and asset lifecycle policy remain open after T-005.
- A-016 found admin content create/update routes do not have a consistent
  server-side validation policy and invalid admin input often becomes a 500.
- T-020 completed the first admin collection create/update validation slice
  with strict route schemas, allowlisted parsed persistence, collection/artwork
  ObjectId checks, real validation statuses, and focused route tests.
- T-029 found active admin dashboard detail fetchers for user and comment
  records without matching route files; T-030 backed those read operations with
  admin detail routes.
- T-034 applied the T-020 collection write-validation pattern to article
  create/update routes with strict schemas, allowlisted persistence, ObjectId
  validation, session author ownership, route-local `dbConnect()`, and focused
  route tests.
- T-037 applied the same admin write-validation pattern to artwork
  create/update while leaving Shopify product-link editing separate.
- T-038 applied the same admin write-validation pattern to blog create/update
  while leaving `pinned`/`tags` workflow support separate.
- T-040 migrated admin delete routes to the shared admin guard, added
  destructive ID validation before target/session work, and preserved existing
  artwork/blog/comment/user cascade behavior with focused tests.

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
- Migrate admin content create/update routes toward allowlisted validation
  schemas, ObjectId validation, and structured 400 field-error responses.
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
- 2026-05-14: Reconciled A-008 Cloudinary signing policy follow-up into F-054
  as a duplicate of remaining F-044 policy work.
- 2026-05-14: Reconciled A-016 admin create/update validation findings into
  F-057.
- 2026-05-14: Prepared T-020 to harden admin collection create/update route
  validation before broader admin write-route migration.
- 2026-05-14: Completed T-020 for admin collection create/update route
  validation. Collection writes now reject invalid JSON, invalid fields, invalid
  collection/artwork IDs, and unknown fields before persistence while preserving
  explicit auth and not-found responses.
- 2026-05-14: Prepared T-030 to add missing admin user/comment detail read
  routes for active dashboard operation-tab fetchers, with focused route tests
  and route/fetcher parity allowlist cleanup.
- 2026-05-15: Completed T-030 by adding admin user/comment detail read routes
  for the existing operation-tab fetchers, using the shared admin guard and
  existing DTO transforms without changing operation tab behavior.
- 2026-05-15: Prepared T-034 to harden admin article create/update validation
  as the next F-057 content/admin write slice after collection.
- 2026-05-15: Completed T-034 by hardening admin article create/update
  validation, rejecting unknown fields before persistence, preserving the
  session admin user as create author, and removing the invalid `collections`
  article section option from the admin article forms.
- 2026-05-15: Prepared T-037 and T-038 as the remaining F-057 admin
  write-validation queue. T-037 owns artwork create/update first; T-038 owns
  blog create/update after T-037 is reconciled.
- 2026-05-15: Completed T-037 by hardening admin artwork create/update
  validation with strict route schemas, canonical artwork constants,
  allowlisted parsed persistence, optional replacement-image updates,
  session-owned create author, and focused route tests while keeping Shopify
  product-link editing separate.
- 2026-05-15: Completed T-038 by hardening admin blog create/update validation
  with strict route schemas, trimmed and allowlisted parsed persistence,
  update ID validation before body reads, title-based slug-conflict handling,
  session-owned create author, public-safe failures, and focused route tests.
- 2026-05-15: Prepared T-040 as the queued admin delete route guard and
  destructive ID validation slice after T-039 migrates admin read routes.
- 2026-05-15: Completed T-040 by moving admin delete routes for article,
  artwork, blog, collection, comment, and user to `requireApiAdmin()`, adding
  destructive ID validation before target/session work, and preserving existing
  delete and cascade semantics with focused route tests.
- 2026-05-15: Prepared T-052 for the F-041 public artwork image contract slice.
  It owns public artwork image sanitization, explicit color-proximity metadata
  behavior, and Cloudinary color schema validation while leaving broader
  Cloudinary upload policy and Shopify product-link workflow decisions
  separate.

## Next Agent Action

Assign T-052:
`/task effort: high details: docs/tasks/T-052-sanitize-public-artwork-image-contracts.md`
Keep broader Cloudinary upload policy, Shopify product-link workflow, and admin
content workflow runbooks separate.
