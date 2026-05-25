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

## Production Delete Approval

Production destructive deletes are not routine maintenance. Before each
production delete, confirm all of these exist for the resource being deleted:

- An operator-visible cascade preview that shows related records that will be
  deleted, detached, preserved, or block the delete. This is now present in the
  admin delete confirmation UI.
- Backup or export evidence for affected MongoDB collections, following the
  [database runbook](database.md). The admin delete confirmation UI and route
  boundary now require this evidence before destructive execution.
- Review evidence from the owner or explicitly delegated operator. The admin
  delete confirmation UI and route boundary now require this evidence before
  destructive execution.
- Redacted audit evidence containing actor class, resource type, resource ID,
  cascade summary, request ID when present, timestamp, and the final outcome
  where the route reaches one.

The technical controls now exist for the current admin delete resources:
preview, backup/review evidence validation, and redacted audit-event
persistence before mutation. Those controls do not by themselves approve a
delete. Use production admin delete buttons for artwork, articles, blogs,
collections, comments, or users only when the change request follows this
checklist and the owner-approved production policy.

## Admin Delete Audit Receipt Verification

After an approved production delete, verify that a redacted audit receipt exists
in the `admin_delete_audit_events` collection before closing the handoff. Use
the managed MongoDB console or approved shell only through private environment
configuration. Do not paste connection strings, environment values, raw records,
or query output into repo docs.

Check only these receipt fields:

- `eventType` is `admin_destructive_delete`.
- `resource` and `resourceId` match the approved delete request.
- `route`, `method`, `requestId` when present, `occurredAt`, and `completedAt`
  match the operator action and deployment/request evidence.
- `actor.class` is `authenticated_admin` and `actor.role` is `admin`; do not
  look up or record the admin account identity in repo docs.
- `evidence.backupExportReference` and `evidence.ownerReviewReference` point to
  the private evidence locations supplied at confirmation time.
- `previewSummary.targetFound`, `previewSummary.blocked`,
  `previewSummary.blockerCodes`, `previewSummary.totals`, and
  `previewSummary.impacts` contain only resource classes, actions, and counts.
- `outcome.status`, `outcome.responseStatus`, and any short
  `outcome.reason` code match the final route result where the route reached a
  final state.

Do not copy raw preview records, target labels, names, emails, request bodies,
cookies, authorization values, session data, raw caught errors, raw MongoDB
documents, private account data, Cloudinary URLs, or private asset identifiers
into task notes, incident notes, screenshots, or chat.

Use a placeholder-shaped query like this and remove the `requestId` line if no
request ID was captured:

```javascript
db.admin_delete_audit_events.findOne(
  {
    eventType: "admin_destructive_delete",
    resource: "<resource>",
    resourceId: "<resource-id>",
    requestId: "<request-id-if-present>",
  },
  {
    _id: 0,
    eventType: 1,
    route: 1,
    method: 1,
    requestId: 1,
    occurredAt: 1,
    completedAt: 1,
    resource: 1,
    resourceId: 1,
    actor: 1,
    evidence: 1,
    previewSummary: 1,
    outcome: 1,
  }
);
```

If the receipt is missing or still shows `outcome.status: "started"` after the
route returned a final response, do not repeat the delete. Capture only the
sanitized route, resource type, resource ID placeholder, request ID when
present, and private evidence location, then follow
[incident-response.md](incident-response.md).

Sanitized handoff example:

```md
## Admin Content Operation Evidence

- Checked at, UTC: <YYYY-MM-DDTHH:MM:SSZ>
- Environment: production
- Admin account source, no identifiers: owner-approved admin account
- Resource type: artwork
- Operation: approved production delete
- Resource route or public identifier: <public route or approved resource ID>
- Private evidence location, if any: <private evidence system reference>
- Backup/export evidence: reference verified in private evidence location
- Dashboard result: delete returned 200
- Public smoke routes: <route list and status summary>
- Request ID or deployment log reference, if present: <request ID>
- Delete audit receipt: found in `admin_delete_audit_events`
- Audit receipt safe summary: event type `admin_destructive_delete`; resource
  `artwork`; request ID matched; preview totals delete 1, detach/update 2,
  preserve 1; blocker codes none; outcome `succeeded`; response status 200
- Follow-up needed: none
```

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
| `artwork` | Create, read, update, delete only through the production delete approval checklist. |
| `articles` | Create, read, update, delete only through the production delete approval checklist. |
| `blogs` | Create, read, update, delete only through the production delete approval checklist. |
| `collections` | Create, read, update, delete only through the production delete approval checklist. |
| `comments` | Read, delete only through the production delete approval checklist. |
| `users` | Read, delete only through the production delete approval checklist. Create and update are not dashboard workflows. |

For articles, artwork, blogs, and collections, use read-list Update/Delete
actions to seed the existing update/delete workflows when the target record is
visible there. Manual ObjectId lookup remains an escape hatch for records that
cannot be identified safely through the dashboard, and for workflows that do not
yet have a direct read-list handoff. If the normal dashboard path cannot
identify a record safely, use MongoDB lookup only with approval and record
sanitized evidence.

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
- Manage `pinned` with the dashboard checkbox and `tags` through the canonical
  dashboard tag options. Do not invent ad hoc tag values outside the visible
  options.
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
  comment deletion requires the production delete approval checklist.
- Post-change smoke after an approved production delete: affected blog detail,
  affected user account data if checked through an approved private path, and
  public comment count or absence.

### Users

- User creation and update are not admin dashboard workflows. Admin role changes
  use [auth.md](auth.md#admin-bootstrap-and-recovery), not the content
  dashboard.
- Current delete routes block deleting the signed-in admin and the last
  remaining admin, and the dashboard shows the preview impact before
  confirmation. The dashboard and route now require backup/review evidence and
  persist a redacted audit event before destructive execution. Production user
  deletion requires the production delete approval checklist.
- Post-change smoke after an approved production delete: admin access with an
  approved admin account, non-admin denial, and affected public comment or
  saved-artwork behavior when relevant.

## Current Delete Effects

Use this table only to understand current behavior. It is not approval to delete
production records.

| Resource | Current route behavior |
| --- | --- |
| Artwork | Blocks deletion when an article references the artwork. Otherwise deletes the artwork, removes it from collection `artworks` arrays, and removes it from user `favourites` and `watchlist` arrays. Cloudinary assets are preserved. |
| Article | Deletes the article record. Linked artwork is preserved. |
| Blog | Deletes the blog and deletes associated comments, then removes those comment IDs from users. Cloudinary assets are preserved. |
| Collection | Deletes the collection record and removes the collection ID from affected artwork `collections` arrays. Artwork records are preserved. |
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
- Operation: create | update | approved production delete | lookup only
- Resource route or public identifier:
- Private evidence location, if any:
- Backup/export evidence:
- Cloudinary evidence, if image changed:
- Shopify verification evidence, if product links changed:
- Dashboard result:
- Public smoke routes:
- Request ID or deployment log reference, if present:
- Delete audit receipt, if approved production delete:
- Audit receipt safe summary, if approved production delete:
- Follow-up needed:
```
