# Admin Content Operations Runbook

Use this runbook for routine archive maintenance through the admin dashboard.
It covers artwork, articles, blogs, collections, comments, and users.

Related runbooks:

- [Auth and admin access](auth.md) for admin bootstrap, promotion, lockout
  recovery, and credential smoke rules.
- [Database](database.md) for MongoDB backup expectations before production
  data changes.
- [Cloudinary](cloudinary.md) for upload signing, image URL policy, asset
  lifecycle, orphan review, and rollback expectations.
- [Shopify operations](shopify-operations.md) for artwork product-link shape,
  Shopify product setup, and link verification.
- [Deployment](deployment.md) for production smoke evidence and credential
  handling.
- [Testing](testing.md) for local verification commands and browser automation
  discipline.

## Operator Boundaries

- Use only owner-approved admin accounts. Do not record account identifiers,
  passwords, cookies, tokens, OAuth values, session payloads, or private contact
  details in repo docs, screenshots, logs, task notes, or chat.
- Do not read or paste `.env` values. Variable ownership is documented in
  [environment.md](environment.md).
- Keep evidence sanitized. Record the route, resource type, result, UTC time,
  request ID if present, and where private evidence is stored outside the repo.
- Treat manual MongoDB edits as an escape hatch, not the normal content
  workflow. Prefer the admin dashboard for create and update operations when it
  can express the intended change.

## Production Delete Block

Production destructive deletes are blocked until all of these exist for the
resource being deleted:

- An operator-visible cascade preview that shows related records that will be
  deleted, detached, preserved, or block the delete.
- Backup or export evidence for affected MongoDB collections, following the
  [database runbook](database.md).
- Review evidence from the owner or explicitly delegated operator.
- Redacted audit evidence containing actor class, resource type, resource ID,
  cascade summary, request ID when present, and timestamp.

Until those controls exist, do not use production admin delete buttons for
artwork, articles, blogs, collections, comments, or users except under an
owner-approved incident procedure. Current route-level safeguards do not replace
the missing cascade preview and audit trail.

## Before A Content Change

1. Confirm the target environment and admin account are approved.
2. Confirm the change request identifies the resource type, expected public
   route, and desired outcome.
3. For production changes, confirm backup/export coverage for affected records
   before editing, using [database.md](database.md).
4. For image changes, confirm the image URL or upload path follows the policy in
   [cloudinary.md](cloudinary.md#delivery-allowlist-and-image-urls).
5. For artwork sale links, confirm the Shopify product exists and the intended
   product type matches [shopify-operations.md](shopify-operations.md).
6. Decide the smoke route before submitting the change. Use stable public
   archive routes and avoid recording private identifiers unless the ID is
   already public in the route.

## Dashboard Entry Points

Admin dashboard sections are available under `/admin/dashboard/<section>`:

| Section | Routine operations |
| --- | --- |
| `artwork` | Create, read, update, delete blocked in production. |
| `articles` | Create, read, update, delete blocked in production. |
| `blogs` | Create, read, update, delete blocked in production. |
| `collections` | Create, read, update, delete blocked in production. |
| `comments` | Read, delete blocked in production. |
| `users` | Read, delete blocked in production. Create and update are not dashboard workflows. |

The dashboard still relies on manual ObjectId lookup for update and delete
flows. Use read lists or approved private records to obtain IDs. If the normal
dashboard path cannot identify a record safely, use MongoDB lookup as an
escape hatch and record only sanitized evidence.

## Create And Update Workflow

1. Open the relevant admin section.
2. Use the create tab for new artwork, articles, blogs, or collections. Use the
   update tab only after confirming the target ObjectId.
3. Fill only the fields required by the change request. Do not use broad
   copy/paste from untrusted documents without reviewing formatting and links.
4. Submit the form once.
5. If the form reports validation errors, fix the named fields and resubmit.
   If the form returns an unhandled failure or no visible error, stop and use
   the failure recovery section before retrying.
6. Run the post-change smoke checks for the resource type.

### Artwork

- Use the dashboard upload widget for artwork image uploads. The signing route
  is admin-only and currently allows only the widget parameters documented in
  [cloudinary.md](cloudinary.md#signing-parameter-allowlist).
- If upload succeeds but artwork persistence fails, preserve the uploaded
  Cloudinary asset. Follow the manual orphan review process before considering
  deletion.
- Manage `shopifyProducts` only through numeric Shopify product IDs and
  `original`, `print`, or `book` types.
- Use the row verify action to confirm a Shopify product currently exists.
  Verification warnings do not block save, so review them before submitting.
- Post-change smoke: artwork detail route, artwork list or collection card
  where the artwork appears, and product/shop affordances when Shopify links
  changed.

### Articles

- Link the article to the intended artwork only after confirming the artwork ID.
- Article images must use the approved content image URL policy.
- Post-change smoke: article or biography detail route when available, any
  public section that lists the article, and the linked artwork detail route.

### Blogs

- Blog `imageUrl` must use the approved content image URL policy.
- The server supports `pinned` and `tags`, but the current dashboard forms do
  not expose those as routine operator controls. Do not attempt to manage them
  through ad hoc payloads.
- Post-change smoke: `/blog`, the blog detail route, and comment rendering if
  the blog has comments.

### Collections

- Collection `imageUrl` must use the approved content image URL policy.
- Confirm every artwork added to or removed from a collection by ObjectId.
- Post-change smoke: `/collections`, the affected collection route, and at
  least one artwork card/detail path in the collection.

### Comments

- Comment creation and update are not admin dashboard workflows.
- For moderation needs, prefer a future approved moderation workflow. Production
  comment deletion remains blocked until cascade preview, backup evidence, and
  redacted audit evidence exist.
- Post-change smoke after an approved incident delete: affected blog detail,
  affected user account data if checked through an approved private path, and
  public comment count or absence.

### Users

- User creation and update are not admin dashboard workflows. Admin role changes
  use [auth.md](auth.md#admin-bootstrap-and-recovery), not the content
  dashboard.
- Current delete routes block deleting the signed-in admin and the last
  remaining admin, but production user deletion is still blocked by the
  missing cascade preview and audit evidence requirements.
- Post-change smoke after an approved incident delete: admin access with an
  approved admin account, non-admin denial, and affected public comment or
  saved-artwork behavior when relevant.

## Current Delete Effects

Use this table only to understand current behavior. It is not approval to delete
production records.

| Resource | Current route behavior |
| --- | --- |
| Artwork | Blocks deletion when an article references the artwork. Otherwise deletes the artwork and removes it from collection `artworks` arrays. Cloudinary assets are preserved. |
| Article | Deletes the article record. Linked artwork is preserved. |
| Blog | Deletes the blog and deletes associated comments, then removes those comment IDs from users. Cloudinary assets are preserved. |
| Collection | Deletes the collection record. Artwork records are preserved. |
| Comment | Deletes the comment and removes its ID from the related user and blog. |
| User | Blocks current-admin and last-admin deletion. Otherwise deletes the user, deletes the user's comments, removes comment IDs from blogs, and removes the user from artwork favourites and watchlists. |

## Validation Error Handling

- Treat `400` validation responses as operator-correctable input errors.
  Correct only the named fields and keep the original change request in scope.
- Treat `401` or `403` as auth/admin access failures. Re-authenticate, then use
  [auth.md](auth.md) if the expected role still cannot access the dashboard.
- Treat `404` as a stale or incorrect ObjectId until the record is verified
  through a read list or approved MongoDB lookup.
- Treat `409` as a conflict that needs review. Examples include blocked artwork
  deletion because an article still references it, or blocked last-admin user
  deletion.
- Treat `500` or an unhandled dashboard failure as an incident candidate when
  it occurs in production. Capture sanitized route/status/request ID evidence
  and use [incident-response.md](incident-response.md) if user impact or data
  loss risk exists.

## Manual ObjectId Lookup Escape Hatch

Use manual lookup only when the dashboard read lists cannot identify the target
record safely.

1. Confirm owner or orchestrator approval for the environment and collection.
2. Use the managed MongoDB console or an approved shell with private
   `MONGO_URI` configuration. Do not paste connection strings into docs.
3. Search by stable public fields such as title, slug, handle, or public route
   context.
4. Confirm the record type and expected public route before copying the
   ObjectId into the dashboard.
5. Record sanitized evidence: collection name, lookup reason, match count, and
   whether the intended record was identified. Do not record private account
   fields or raw documents.

## Post-Change Smoke Checks

For every successful create or update:

- Reload the admin read list for the section and confirm the changed record is
  visible or intentionally absent.
- Visit the affected public route and confirm status and visible content.
- Check one adjacent route that renders the record in a card, list, navigation,
  collection, or shop context.
- For image changes, confirm the image renders through the allowed host and no
  unexpected broken-image state appears.
- For Shopify link changes, check artwork detail sale affordances and the
  relevant product route or shop listing.
- For auth-sensitive changes, use the credential handling rules in
  [deployment.md](deployment.md#credentials-smoke-handling).

Record only concise evidence. Do not capture full DOM dumps, traces, videos,
large screenshot sets, or raw browser logs unless an assigned incident or audit
requires them.

## Failure Recovery

- If a create or update partially fails, do not retry blindly. Identify whether
  MongoDB persistence, Cloudinary upload, Shopify verification, auth, or network
  access failed.
- If MongoDB changed incorrectly, restore or correct the affected records using
  the backup/export plan from [database.md](database.md).
- If Cloudinary upload succeeded but MongoDB persistence failed, preserve the
  asset and follow [manual orphan review](cloudinary.md#manual-orphan-review)
  before any cleanup.
- If Shopify verification fails, leave existing product links unchanged unless
  the owner confirms the product is intentionally missing or unavailable.
- If admin access fails after a role or account change, use
  [auth.md](auth.md#all-admin-lockout-recovery).
- If production users are affected, data loss is possible, or a rollback may be
  needed, follow [incident-response.md](incident-response.md).

## Handoff Evidence Template

Use this template in task notes, incident notes, or workstream handoff files:

```md
## Admin Content Operation Evidence

- Checked at, UTC:
- Environment:
- Admin account source, no identifiers:
- Resource type:
- Operation: create | update | approved incident delete | lookup only
- Resource route or public identifier:
- Private evidence location, if any:
- Backup/export evidence:
- Cloudinary evidence, if image changed:
- Shopify verification evidence, if product links changed:
- Dashboard result:
- Public smoke routes:
- Request ID or deployment log reference, if present:
- Follow-up needed:
```
