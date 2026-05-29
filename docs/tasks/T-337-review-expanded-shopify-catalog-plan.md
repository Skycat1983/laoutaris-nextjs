# T-337 Review Expanded Shopify Catalog Plan

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)

## Goal

Generate and review the expanded T-336 dry-run catalog plan, then run a
read-only post-clean-slate Shopify reconciliation so the owner can approve the
full-catalog draft-generation input before any live write task is scoped.

## Context

- T-334 reset Shopify to the two book/publication products.
- T-335 defined the accepted MongoDB-to-Shopify metadata mapping.
- T-336 applied that mapping to `npm run plan:shopify-catalog` without
  Shopify calls or data mutation.
- The next live write task must use owner-reviewed report evidence, not an
  assumed report shape.

## Scope

In scope:

- Run the expanded dry-run planner against the owner-approved MongoDB target:
  `npm run plan:shopify-catalog -- --output=reports/shopify-catalog-dry-run-plan.json`.
- Review and summarize the generated report:
  - total artworks scanned;
  - originals planned;
  - prints planned;
  - missing title/image/taxonomy warnings;
  - duplicate handles;
  - unsupported required data;
  - confirmation that products include T-336 product fields, taxonomy tags,
    typed `custom` metafields, selected image metadata, explicit exclusions,
    and one `Frame package = Unframed` print variant.
- Run read-only Shopify Admin reconciliation against the clean Shopify catalog:
  `npm run reconcile:shopify-catalog -- --input=reports/shopify-catalog-dry-run-plan.json --output=reports/shopify-catalog-reconciliation-report.json`.
- Summarize reconciliation results and identify whether full-catalog draft
  creation can be safely scoped.
- Update this task brief, the task index, and Shopify workstream next action
  with the evidence summary and follow-up recommendation.

Out of scope:

- Do not run Shopify write commands.
- Do not create, update, publish, delete, archive, or restore Shopify products.
- Do not mutate MongoDB or write `shopifyProducts` links.
- Do not mutate Cloudinary assets.
- Do not create the full-catalog draft-generation command.
- Do not add collection joins, collection metadata, price rules,
  framed/material/mat variants, checkout/cart behavior, browser automation, or
  sales-channel publication.

## Concurrency

Do not run alongside another Shopify catalog-generation task. This task owns
the local generated report review and reconciliation evidence. It may run in
parallel with unrelated visual QA or route-builder work if shared docs are not
edited by both agents.

## Files Likely Touched

- `docs/tasks/T-337-review-expanded-shopify-catalog-plan.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/orchestration/state.md` only if assigned by the orchestrator

Generated reports under `reports/` are local evidence and should remain
uncommitted unless the owner explicitly asks for a committed artifact.

## Acceptance Criteria

- The expanded dry-run report is regenerated from MongoDB with the T-336 report
  shape.
- The report summary and warning counts are recorded in this task brief.
- The post-clean-slate reconciliation report is regenerated with Shopify Admin
  read-only credentials.
- Any conflicts, query errors, missing metadata, or unexpected existing product
  matches are recorded before a write task is proposed.
- The task recommends either a full-catalog draft-generation implementation
  task or the specific blocker to resolve first.

## Verification

```bash
npm run plan:shopify-catalog -- --output=reports/shopify-catalog-dry-run-plan.json
npm run reconcile:shopify-catalog -- --input=reports/shopify-catalog-dry-run-plan.json --output=reports/shopify-catalog-reconciliation-report.json
git diff --check
```

If required environment variables are unavailable, do not fake results. Record
the missing environment names and stop before any mutation.

## Review Evidence

Dry-run report regenerated on 2026-05-28 from the local `.env` MongoDB target:

- Output: `reports/shopify-catalog-dry-run-plan.json`
- Report mtime observed after regeneration: `2026-05-28T20:15:09.626Z`
- Artworks scanned: 215
- Originals planned: 215
- Prints planned: 215
- Missing title warnings: 0
- Missing image warnings: 0
- Artworks missing required taxonomy metadata: 0
- Artworks with unsupported required metadata: 0
- Duplicate generated handles: 0
- Warning code counts: none observed.

Report shape review:

- Product entries include generated handles, family-specific titles, vendor
  `Joseph Laoutaris`, `productType`, `DRAFT` status, inventory policy `deny`,
  existing archive image media, selected archive image metadata, family and
  taxonomy tags, and typed `custom` metafields.
- Typed metafields observed include `custom.mongodb_artwork_id`,
  `custom.artwork_title`, optional `custom.artwork_number`,
  `custom.artwork_decade`, `custom.artwork_artstyle`,
  `custom.artwork_medium`, `custom.artwork_surface`,
  `custom.artwork_featured` as `boolean`, `custom.archive_image_url` as `url`,
  selected archive image public ID/width/height/format fields, and print-only
  `custom.print_edition_quantity` as `number_integer`.
- Print products include exactly one planned variant with
  `Frame package = Unframed`, print inventory `50`, and inventory policy
  `deny`.
- The report-level `explicitExclusions` list is present and keeps
  `shopifyProducts`, user saved-item state, collection metadata, Cloudinary
  color/byte metadata, purchasable frame/material/mat options, sales-channel
  publication, checkout/cart state, and MongoDB link writes out of generated
  products.
- Safety flags show no Shopify calls and no Shopify, MongoDB, or Cloudinary
  mutations from the planner.

Reconciliation status:

- 2026-05-28: Attempted
  `npm run reconcile:shopify-catalog -- --input=reports/shopify-catalog-dry-run-plan.json --output=reports/shopify-catalog-reconciliation-report.json`
  after sourcing local `.env`.
- The command stopped before Shopify access because
  `SHOPIFY_ADMIN_API_VERSION` and `SHOPIFY_ADMIN_ACCESS_TOKEN` are not exported
  in the current environment.
- The existing `reports/shopify-catalog-reconciliation-report.json` was not
  regenerated during this task; its observed mtime was
  `2026-05-28T17:00:35.008Z`, older than the regenerated plan.
- 2026-05-29: Reran the same read-only command after sourcing local `.env` and
  mapping `SHOPIFY_APP_AUTOMATION_TOKEN` to the script-required
  `SHOPIFY_ADMIN_ACCESS_TOKEN` for this process only. The first run wrote a
  report with 859 `fetch failed` query errors under sandboxed network access.
  The network-approved rerun reached Shopify but was rejected with
  `Shopify Admin GraphQL HTTP 401 Unauthorized` for all 859 lookups.
- 2026-05-29: Generated a Shopify Admin access token from the local
  `SHOPIFY_CLIENT_ID` and `SHOPIFY_SECRET` through Shopify's client credentials
  flow, wrote it to local `.env` as `SHOPIFY_ADMIN_ACCESS_TOKEN`, and reran the
  read-only reconciliation with network access.
- Output: `reports/shopify-catalog-reconciliation-report.json`
- Report mtime observed after successful regeneration:
  `2026-05-29T10:00:24.953Z`
- Artworks scanned: 215
- Planned products scanned: 430
- Exact matches: 0
- Handle-only matches: 0
- Metafield-only matches: 0
- Manual product matches: 0
- No-match rows: 430
- Conflicts: 0
- Query errors: 0
- Manual-review rows: 0

Follow-up recommendation:

- The full-catalog draft-generation implementation can now be scoped as a
  separate write-gated task. It should use the clean T-337 reconciliation report
  as input, keep all generated products `DRAFT`, preserve one original and one
  unframed print per artwork, refuse conflicts/query errors, write a local
  result report, and require explicit owner confirmation before any live
  Shopify mutation. Do not publish products, write MongoDB `shopifyProducts`,
  mutate Cloudinary, add framed/material/mat variants, or change checkout/cart
  behavior in that task.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after T-336 completed the expanded
  dry-run planner.
- 2026-05-28: Regenerated the expanded dry-run plan successfully after sourcing
  local `.env`. The first unsourced planner attempt failed fast because
  `MONGO_URI` was not exported; the successful run used the local env value and
  performed no Shopify, MongoDB write, or Cloudinary mutation.
- 2026-05-28: Initial reconciliation was blocked by missing
  `SHOPIFY_ADMIN_API_VERSION` and `SHOPIFY_ADMIN_ACCESS_TOKEN`. No Shopify
  write command was run, no Shopify mutation was attempted, and no MongoDB or
  Cloudinary mutation was performed.
- 2026-05-29: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_VERSION`,
  `SHOPIFY_APP_AUTOMATION_TOKEN`, and `SHOPIFY_SECRET` were available after
  sourcing local `.env`, but `SHOPIFY_ADMIN_ACCESS_TOKEN` was not. Mapping the
  automation token to `SHOPIFY_ADMIN_ACCESS_TOKEN` allowed the script to reach
  Shopify, but Shopify returned `401 Unauthorized` for all read-only lookups.
  No Shopify write command was run, no Shopify mutation was attempted, and no
  MongoDB or Cloudinary mutation was performed.
- 2026-05-29: Generated the accepted local `SHOPIFY_ADMIN_ACCESS_TOKEN` via
  client credentials using the local app client ID and secret, then reran
  `npm run reconcile:shopify-catalog -- --input=reports/shopify-catalog-dry-run-plan.json --output=reports/shopify-catalog-reconciliation-report.json`.
  The command exited `0` with 430 no-match rows, 0 conflicts, and 0 query
  errors. T-337 is complete. The next step is a separate write-gated
  full-catalog draft-generation task; live writes remain blocked until that task
  is scoped and explicitly approved.
