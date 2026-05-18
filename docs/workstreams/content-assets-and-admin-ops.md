# Content, Assets, And Admin Operations Workstream

Status: Active

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
- T-066 restricts the Cloudinary signing route to `timestamp`,
  `upload_preset: "laoutaris_art"`, and `source: "uw"` for the current admin
  upload widget while leaving upload preset ownership, folder policy, and asset
  lifecycle policy separate.
- T-067 removed debug output, availability polling, and DOM/iframe inspection
  from the current admin Cloudinary upload button without changing upload preset
  ownership, folder policy, asset lifecycle, or dashboard workflow.
- T-091 removed direct `console.log()` debug output from the scoped admin
  dashboard create/update forms and artwork filter dropdowns without changing
  validation, upload-state handoff, submit/update, success/error, or filter
  callback behavior.
- T-092 removed success-path copy `console.log()` output from scoped admin
  read-list files, `ArtworkFeedCard`, and the shared `copy_id()` helper while
  preserving clipboard writes, failure logging, read-list fetch/filter/loading/
  error states, cards, and skeleton exports.
- T-097 added the visible admin artwork form workflow for managing canonical
  Shopify product links.
- T-098 added explicit Shopify product-existence verification controls for
  those admin product links.
- A-009 completed the Cloudinary/assets audit. It confirmed current signing is
  admin-guarded and param-limited, but asset deletion/orphan cleanup,
  backup/restore/rollback, preset/cloud/folder ownership, upload metadata
  parsing, generic blog/collection image URL policy, and delivery
  transformation conventions remain unresolved.
- T-101 documented the interim Cloudinary policy: preserve assets on MongoDB
  content deletion, keep automatic destructive Cloudinary cleanup disabled
  until backup/restore and owner approval are in place, use manual orphan
  review evidence before deletion, keep `laoutaris_art` as the current hard-
  coded upload preset, reject signed folders until owner policy is approved,
  and prefer Cloudinary-managed blog/collection images or explicitly allowed
  external hosts.
- A-010 found public image performance follow-ups for the asset workstream:
  home hero carousel images are over-prioritized at quality 100, product/shop
  `fill` images lack explicit `sizes`, and artwork magnifier preloads a second
  high-resolution image on mount before user intent.
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
- T-055 aligned the server-side blog `imageUrl`/`pinned`/`tags` contracts while
  keeping visible pinned/tag admin workflow controls out of scope.
- T-040 migrated admin delete routes to the shared admin guard, added
  destructive ID validation before target/session work, and preserved existing
  artwork/blog/comment/user cascade behavior with focused tests.

## Backlog

- Document admin content workflows for each content type.
- Implement owner-approved Cloudinary asset deletion/orphan cleanup only after
  the T-101 backup, restore, rollback, and deletion-evidence policy is
  satisfied.
- Decide whether signed Cloudinary folder parameters are needed, and if so
  define exact folder names or patterns before adding them to
  `sign-cloudinary-params`.
- Align Cloudinary upload preset/cloud/folder source of truth across
  `UploadButton`, `sign-cloudinary-params`, environment docs, and
  `next.config.mjs` if the owner decides to move beyond the T-101 interim
  policy.
- Harden artwork upload-result parsing and decide failed-create cleanup or
  operator recovery for orphaned uploads.
- Decide whether blog and collection image URLs must be Cloudinary-managed
  assets or explicitly allowed external hosts.
- Centralize Cloudinary delivery transformations for cards, lists, detail
  views, and admin previews.
- Tune public image delivery for the home hero, shop banner/detail images, and
  artwork magnifier after the Cloudinary/Next sizing policy is chosen.
- Migrate admin content create/update routes toward allowlisted validation
  schemas, ObjectId validation, and structured 400 field-error responses.
- Keep Cloudinary variables current in the environment runbook. T-065 documents
  current variable ownership/status and confirms upload preset ownership remains
  an open policy decision.
- Implement blog, article, and collection image URL validation from the T-101
  Cloudinary-managed/explicitly-allowed-host decision table.
- Decide whether public artwork responses should expose Cloudinary `public_id`;
  if not, wire image sanitization into artwork transforms and tests.
- Confirm delete behavior for content with related records.
- Consolidate repeated admin entity operation patterns into typed descriptors
  where it reduces duplicated feed/read/update/delete behavior.
- Audit translations, labels, content taxonomy, and public/admin copy
  consistency.
- Decide whether the mostly unused translation pipeline is in launch scope; if
  not, route it to a pruning task.
- Add operator runbooks for non-Shopify artwork and content operations.
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
- 2026-05-15: Completed T-052 for the F-041 public artwork image contract
  slice. Public artwork transforms now sanitize Cloudinary image payloads,
  omit `public_id`, preserve optional public-only `similarityScore`, and reject
  malformed persisted color entries through the Cloudinary image schema.
- 2026-05-15: Prepared T-055 for the blog field-contract slice. It owns
  server-side `imageUrl`, `pinned`, and `tags` model/schema/admin route
  alignment while keeping visible pinned/tag admin workflow controls out of
  scope.
- 2026-05-15: Completed T-055 by making persisted blog `imageUrl` required,
  defaulting `tags` to `[]`, accepting/defaulting route-safe `pinned` and
  `tags`, and adding focused admin blog route coverage. Visible admin blog
  controls for pinned status and tags remain a separate workflow decision.
- 2026-05-16: Prepared T-065 for the environment inventory slice. It should
  document Cloudinary environment variables and upload-preset ownership status
  from source-search evidence while leaving Cloudinary upload policy and
  dashboard behavior unchanged.
- 2026-05-16: Completed T-065 by documenting active Cloudinary environment
  variables and confirming `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is not
  currently read from `process.env`; upload preset, folder, allowed signing
  params, and asset lifecycle policy remain separate.
- 2026-05-16: Prepared T-066 as the next F-044 Cloudinary upload-security
  slice. It restricts `sign-cloudinary-params` to explicit signing params for
  the current admin upload widget while preserving route-local admin auth and
  leaving upload preset ownership, folders, asset lifecycle, and widget
  workflow changes separate.
- 2026-05-16: Completed T-066 by allowing only `timestamp`,
  `upload_preset: "laoutaris_art"`, and `source: "uw"` in Cloudinary signing
  requests, rejecting unknown or malformed params before signing, preserving
  admin auth and top-level signature compatibility, and documenting the
  remaining preset/folder/lifecycle decisions.
- 2026-05-16: Completed T-067 by removing always-on debug logs, Cloudinary
  availability polling, and DOM/iframe inspection from `UploadButton` while
  preserving current upload widget behavior.
- 2026-05-17: Prepared T-091 to remove direct `console.log()` debug output from
  scoped admin dashboard create/update forms and artwork filter dropdowns while
  preserving validation, upload state handoff, submit/update behavior, and
  filter callbacks.
- 2026-05-17: Completed T-091 by removing the scoped admin dashboard
  create/update form and artwork-filter direct `console.log()` calls and adding
  source-hygiene coverage. Admin read-list copy logs and shared helper logging
  were handled by T-092; route-level API logging and global logging/redaction
  policy remain separate.
- 2026-05-17: Prepared T-092 to remove success-path `console.log()` output
  from scoped admin read-list copy flows, `ArtworkFeedCard`, and the shared
  `copy_id()` helper while preserving clipboard, read-list, card, and skeleton
  behavior.
- 2026-05-17: Completed T-092 by removing the scoped admin read-list copy
  success logs, the `ReadArtworkList` render log, the `ArtworkFeedCard` copy
  success log, and the shared `copy_id()` success log without changing
  clipboard failure logging or read-list behavior.
- 2026-05-17: Prepared T-097 to implement the visible admin Shopify
  product-link workflow in artwork create/update forms with shared schema
  wiring, focused tests, and operator docs.
- 2026-05-17: Completed T-097; admin artwork create/update forms now let
  operators add, edit, remove, and clear Shopify product links while preserving
  canonical numeric ID/type validation and duplicate prevention.
- 2026-05-17: Prepared T-098 to extend the admin product-link control with
  explicit Shopify product verification states and focused tests.
- 2026-05-17: Completed T-098; admin artwork product-link rows now expose a
  verify action, show unchecked/checking/verified/invalid/not-found/upstream
  states, display returned Shopify product context on success, and keep save
  behavior advisory rather than persistence-blocking.
- 2026-05-18: Reconciled A-009 into F-067 through F-071 and R-008. The first
  Cloudinary follow-up should be a policy/runbook slice for asset lifecycle and
  upload preset/cloud/folder ownership before any destructive asset cleanup is
  implemented.
- 2026-05-18: Prepared T-101 to document the conservative Cloudinary asset
  lifecycle, backup/restore, orphan cleanup, and upload preset/cloud/folder
  ownership policy before runtime cleanup work.
- 2026-05-18: Completed T-101 by updating the Cloudinary runbook with the
  interim no-destructive-cleanup policy, manual orphan review process, backup/
  restore/rollback expectations, upload preset/cloud/folder ownership, delivery
  allowlist alignment, and blog/collection image URL decision table.
- 2026-05-18: Reconciled A-010 image findings into F-086 and F-087. Public
  image preload/sizing and magnifier behavior should be tuned through the
  Cloudinary/Next delivery policy rather than ad hoc per-component changes.

## Next Agent Action

Choose the next Cloudinary implementation slice from T-101 follow-ups: upload
metadata parsing and failed-persistence recovery, image URL validation for
blog/article/collection records, delivery transformation centralization,
public image preload/sizing tuning, or an owner-approved cleanup workflow after
backup/restore evidence exists.

For Cloudinary, keep runtime deletion, signed folder params, image-field
migrations, delivery-transform helper extraction, and Cloudinary account
changes separate unless explicitly assigned. Keep persistence-time Shopify API
validation, checkout/cart ownership, product-link data migration, route-level
API logging, and global logging policy separate.
