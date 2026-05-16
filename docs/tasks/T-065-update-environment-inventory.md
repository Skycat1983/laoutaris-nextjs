# T-065 Update Environment Inventory

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Resolve the next F-047 environment-readiness slice by updating the environment
runbook from actual `process.env` usage and prior A-007 evidence without
recording secret values.

## Context

- F-047 tracks missing environment inventory and decisions for active, legacy,
  platform-provided, and public configuration variables.
- A-007 found gaps for `JWT_SECRET`, `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`,
  `VERCEL_ENV`, `VERCEL_URL`, Cloudinary variables, and
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- T-001 removed `MONGO_URI` exposure from `next.config.mjs`, and T-006 added
  the env guard.
- T-019 removed the custom legacy session path that previously used
  `JWT_SECRET`.
- T-064 pinned the Node/npm install baseline, but did not change environment
  inventory.

## Scope

In scope:

- Inventory current env references with targeted source/doc searches.
- Update `docs/runbooks/environment.md` with:
  - variable purpose,
  - secret/public/platform-provided classification,
  - required environments,
  - likely owner or owner-decision status,
  - rotation/configuration notes when they are already known.
- Include currently observed variables such as `MONGO_URI`, `NEXTAUTH_SECRET`,
  OAuth variables, Shopify variables, `VERCEL_ENV`, `VERCEL_URL`,
  `NEXT_PUBLIC_BASE_URL`, Cloudinary signing/upload variables, `NODE_ENV`, and
  legacy/deprecated candidates such as `JWT_SECRET`, `AUTH_SECRET`, and
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- Update setup/deployment/cloudinary/auth runbooks only if cross-links or
  ownership notes need to point at the environment runbook.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not record secret values.
- Do not read or copy local `.env` files.
- Do not change runtime config, code behavior, OAuth provider settings,
  Cloudinary upload behavior, or Vercel project settings.
- Do not rotate credentials or decide whether the removed Shopify value was
  real.
- Do not add CI/dependency-update automation.
- Do not resolve the broader URL ownership, Cloudinary upload policy, CSP/CORS,
  or logging/redaction work.

## Files Likely Touched

- `docs/runbooks/environment.md`
- `docs/runbooks/deployment.md`
- `docs/runbooks/cloudinary.md`
- `docs/runbooks/auth.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- Environment runbook lists every active env variable found in current source
  searches and relevant unresolved A-007 candidates.
- Each listed variable has purpose, classification, required environment, and
  owner/status notes.
- Legacy/deprecated candidates are clearly marked as not currently referenced
  or needing owner cleanup, based on source-search evidence.
- No secret values, local `.env` contents, or credential-shaped examples are
  introduced.
- Runtime behavior remains unchanged.

## Verification

Run:

```bash
rg -n "process\\.env|NEXT_PUBLIC_|MONGO_URI|AUTH_SECRET|JWT_SECRET|CLOUDINARY|SHOPIFY|VERCEL_|GOOGLE|GITHUB" src scripts next.config.mjs docs/runbooks docs/workstreams docs/audits/results/A-007-deployment-environment.md
npm run env:guard
git diff --check
```

No full runtime test suite is required for documentation-only updates. If any
runtime code changes unexpectedly become necessary, escalate before continuing.

## Handoff Notes

- Completed 2026-05-16.
- Updated `docs/runbooks/environment.md` as the canonical inventory for active
  runtime variables, smoke-script variables, platform variables, and
  legacy/deprecated candidates. Each entry now includes purpose,
  classification, required environments, owner/status notes, and known
  configuration or rotation guidance without secret values.
- Updated deployment, auth, and Cloudinary runbooks to point at the environment
  inventory and preserve owner-decision boundaries for legacy auth variables,
  public URL configuration, and Cloudinary upload preset policy.
- Updated linked workstreams, F-047, R-003, orchestration state, and the task
  index to mark the inventory slice complete while leaving credential rotation,
  Vercel settings, runtime config, Cloudinary upload policy, and CI/dependency
  automation separate.

## Escalate

Escalate to the orchestrator if:

- The inventory requires deciding whether owner-managed production variables are
  active or deprecated without source evidence.
- A local `.env` file appears necessary to complete the task.
- Runtime configuration, Vercel settings, Cloudinary upload behavior, or
  credential rotation becomes necessary.
