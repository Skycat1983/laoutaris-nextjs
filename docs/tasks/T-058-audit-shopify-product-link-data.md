# T-058 Audit Shopify Product Link Data

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Add a repeatable, read-only audit for existing MongoDB artwork
`shopifyProducts` links so invalid product IDs, duplicate links, and migration
needs are visible before any admin-linking or data-migration work is assigned.

## Context

- F-012 remains partially mitigated after T-057: public reads now normalize and
  skip malformed stored product IDs, but existing data has not been audited or
  migrated.
- R-023 still tracks that admin writes and existing-data audit/migration remain
  open.
- `docs/architecture/shopify-commerce.md` and
  `docs/runbooks/shopify-operations.md` define persisted `productId` values as
  numeric Shopify product IDs, not full Shopify GIDs.
- Admin product-linking workflow and automatic data mutation remain owner-level
  decisions and must stay separate from this read-only audit.

## Scope

In scope:

- Add a read-only audit command, preferably `npm run audit:shopify-products`,
  that connects to MongoDB using the existing app environment pattern and reads
  artwork `_id`, `title`, and `shopifyProducts`.
- Classify and report:
  - total artworks scanned,
  - artworks with Shopify links,
  - total links,
  - invalid product IDs such as empty, whitespace-only, non-numeric, or
    GID-style values,
  - duplicate product IDs within one artwork,
  - duplicate product IDs across multiple artworks, grouped by product type
    where useful,
  - unknown product `type` values if persisted data contains them.
- Keep the command read-only: no writes, no automatic cleanup, no Shopify API
  calls.
- Reuse or stay mechanically aligned with the T-057 numeric product ID rule.
  If direct TypeScript helper reuse is impractical from a Node script, isolate
  the script classification helper and cover it with focused tests against the
  same accepted/rejected examples as `productIds.ts`.
- Document how to run and interpret the audit in the Shopify runbook.
- Update this task, linked workstreams, findings, risks, and orchestration state
  after completion.

Out of scope:

- Do not mutate MongoDB data.
- Do not call Shopify APIs to verify product existence or availability.
- Do not add admin product-linking UI or admin product-link persistence.
- Do not decide whether duplicate book links across artworks are valid or
  invalid globally; report them clearly for later owner review.
- Do not implement checkout/cart, product transforms, sorting, pagination, or
  visible shop UI changes.

## Files Likely Touched

- `scripts/audit-shopify-product-links.mjs`
- `package.json`
- Optional focused test file for audit classification helpers
- `docs/runbooks/shopify-operations.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- The audit command is read-only and does not call Shopify.
- The audit reports invalid stored product IDs before any future migration is
  attempted.
- Duplicate product IDs are reported separately for within-artwork and
  cross-artwork cases.
- GID-style persisted values are flagged as invalid under the current numeric
  ID rule.
- The command exits non-zero when invalid IDs or unknown product types are
  found, while still printing the summary needed for remediation.
- The Shopify runbook explains required environment, command usage, exit
  behavior, and that the audit does not mutate data.
- Future admin-linking and data-migration tasks have a concrete audit report to
  reference.

## Verification

Run:

```bash
npm test -- --runTestsByPath <focused audit/helper test if added>
node --check scripts/audit-shopify-product-links.mjs
npm run lint
npm run build
```

If the agent can safely run the audit against an available local database, run:

```bash
npm run audit:shopify-products
```

Record whether the audit was run and summarize any reported invalid or duplicate
links in the handoff notes. Do not require live database access to complete the
code/test portion of this task.

## Handoff Notes

- Completed 2026-05-15.
- Added `npm run audit:shopify-products`, backed by
  `scripts/audit-shopify-product-links.mjs`.
- The command reads MongoDB `artworks` with `_id`, `title`, and
  `shopifyProducts` projection only. It does not write to MongoDB and does not
  call Shopify APIs.
- Added `scripts/audit-shopify-product-link-helpers.cjs` so product ID/type
  classification and duplicate detection are covered by focused Jest tests.
- The audit exits non-zero only for invalid product IDs, unknown product types,
  missing `MONGO_URI`, or runtime failures; duplicate-only reports are printed
  for review without failing the command.
- Live audit was not run in this shell because `MONGO_URI` was not set.

Verification run:

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/auditShopifyProductLinkHelpers.test.js
node --check scripts/audit-shopify-product-links.mjs
node --check scripts/audit-shopify-product-link-helpers.cjs
npm run lint
npm run build
```

All passed. Focused Jest retained the existing `punycode` deprecation warning;
build retained existing Browserslist, MongoDB, branch-verification, link, and
fetcher log noise.

## Escalate

Escalate to the orchestrator if:

- The audit discovers production data requiring immediate owner review before
  the next code task.
- The task appears to require automatic data mutation or Shopify API validation.
- The current numeric-only product ID rule needs to change to accept persisted
  Shopify GIDs.
