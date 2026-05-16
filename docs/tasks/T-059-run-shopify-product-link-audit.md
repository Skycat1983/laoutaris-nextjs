# T-059 Run Shopify Product Link Audit

Status: Blocked

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Run the T-058 read-only Shopify product-link audit against an owner-approved
MongoDB environment, record the findings, and scope the next cleanup or
admin-link validation task from evidence.

## Context

- T-058 added `npm run audit:shopify-products`, but the live audit was not run
  because `MONGO_URI` was not set in that shell.
- F-012 and R-023 remain open for existing-data audit evidence, admin write
  validation, and any actual data migration.
- The audit is read-only: it projects `_id`, `title`, and `shopifyProducts`
  from `artworks`, does not mutate MongoDB, and does not call Shopify APIs.
- Duplicate-only reports are review signals and do not fail the command.
  Invalid product IDs, unknown product types, missing `MONGO_URI`, or runtime
  failures exit non-zero.

## Scope

In scope:

- Confirm the target MongoDB environment with the owner or use an already
  configured owner-approved `MONGO_URI`.
- Run `npm run audit:shopify-products`.
- Treat exit code `1` with printed invalid IDs or unknown product types as
  audit evidence, not as an implementation failure.
- Record a concise follow-up evidence section in
  `docs/audits/results/A-001-shopify-commerce.md` with:
  - target environment label only, never secrets,
  - command run,
  - exit code,
  - total artworks scanned,
  - artworks with Shopify links,
  - total links,
  - invalid IDs,
  - unknown product types,
  - within-artwork duplicates,
  - cross-artwork duplicates,
  - recommended next task.
- Update Shopify/data/testing workstreams, findings, risks, and orchestration
  state based on the report.
- If the audit reports actionable cleanup needs, prepare the next task brief
  but do not perform cleanup in this task.

Out of scope:

- Do not mutate MongoDB data.
- Do not call Shopify APIs to validate product existence or availability.
- Do not add admin product-linking UI or admin product-link persistence.
- Do not decide checkout/cart ownership.
- Do not commit or document connection strings, credentials, or raw secret
  values.
- Do not perform data migration or cleanup.

## Files Likely Touched

- `docs/audits/results/A-001-shopify-commerce.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/orchestration/state.md`
- Optional next task brief if the audit reveals concrete cleanup or admin-write
  validation work

## Acceptance Criteria

- The audit is run against the approved target database, or the task is marked
  blocked with the exact missing owner/environment input.
- Audit output is summarized in durable docs without secrets.
- F-012/R-023 state reflects whether existing-data audit evidence is complete
  and what remains.
- Any non-zero audit exit is classified correctly as data evidence or runtime
  failure.
- No data is mutated and no Shopify API calls are made.
- The next task is concrete: either data cleanup/migration, admin write
  validation, or another owner decision if the report requires one.

## Verification

Run:

```bash
npm run audit:shopify-products
git diff --check
```

If the audit cannot be run because `MONGO_URI` is unavailable, do not invent a
result. Record the blocker in this task, orchestration state, and relevant
workstreams, then leave the next action as obtaining the owner-approved
database target.

## Handoff Notes

- 2026-05-15: Attempted `npm run audit:shopify-products` in the task shell.
  The command exited `1` before connecting to MongoDB because `MONGO_URI` was
  not set. No artwork data was scanned, no Shopify APIs were called, and no
  data was mutated.
- Required unblocker: owner-approved MongoDB target/environment label and
  `MONGO_URI` configured in the execution shell. Do not invent audit counts or
  assign cleanup/migration until the command runs against that target.

## Escalate

Escalate to the orchestrator if:

- No owner-approved MongoDB target is available.
- The audit reports invalid IDs or unknown product types that require a data
  cleanup plan.
- Cross-artwork duplicate product IDs require an owner decision, especially for
  book products that may legitimately appear on multiple artworks.
