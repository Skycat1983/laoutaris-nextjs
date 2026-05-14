# T-001 Remove MONGO_URI From Next Config

Status: Completed

Workstream: [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Remove server-only MongoDB connection string exposure through `next.config.mjs`
and update deployment/environment documentation so `MONGO_URI` is treated as a
server-only secret.

## Why Now

This is the smallest high-severity implementation slice from the reconciled
audit batch. It addresses:

- [F-046](../audits/findings-register.md): `MONGO_URI` is exposed through Next
  config `env`.
- [R-027](../risks/production-readiness.md): server-only secrets can be exposed
  through Next config.
- [A-007](../audits/results/A-007-deployment-environment.md): deployment audit
  confirmed the issue and environment docs gap.

## Read First

- [Deployment workstream](../workstreams/deployment-security-and-observability.md)
- [Environment runbook](../runbooks/environment.md)
- [Deployment runbook](../runbooks/deployment.md)
- [A-007 deployment audit](../audits/results/A-007-deployment-environment.md)

## Scope

In scope:

- Remove the `env: { MONGO_URI: process.env.MONGO_URI }` block from
  `next.config.mjs`.
- Confirm no client-side code depends on `process.env.MONGO_URI`.
- Update [environment.md](../runbooks/environment.md) so `MONGO_URI` is clearly
  server-only and must not be placed in `next.config.mjs`.
- Update deployment docs or workstream progress with the result and verification.
- Update [production-readiness risks](../risks/production-readiness.md) if the
  risk status changes.

Out of scope:

- Do not refactor DB connection architecture.
- Do not change MongoDB helpers.
- Do not solve build-time MongoDB coupling.
- Do not edit `.env` or record secret values.
- Do not address Cloudinary, Shopify, OAuth, or other environment variables in
  this task except by preserving existing docs.

## Files Likely Touched

- `next.config.mjs`
- `docs/runbooks/environment.md`
- `docs/runbooks/deployment.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/risks/production-readiness.md`

## Concurrency

You are not alone in the repo. Keep edits scoped to the files above unless you
discover a directly related reference. Do not reorganize unrelated deployment
docs or broad environment inventory work.

## Acceptance Criteria

- `next.config.mjs` no longer exposes `MONGO_URI` through the Next config `env`
  field.
- `MONGO_URI` remains documented as required for server-side MongoDB access.
- Docs explicitly say server-only secrets must not be exposed through
  `next.config.mjs`.
- Any remaining deployment/build coupling is left as an open risk, not silently
  treated as solved.

## Outcome

Completed on 2026-05-14.

- Removed the `MONGO_URI` export from `next.config.mjs`.
- Confirmed remaining `MONGO_URI` references are in server-side MongoDB helper
  code and documentation.
- Updated the environment and deployment runbooks to state that `MONGO_URI` is a
  server-only secret and must not be exposed through Next config `env` or
  `NEXT_PUBLIC_*` variables.
- Updated the deployment workstream and R-027. R-027 remains partially mitigated
  until a guard prevents future server-only secret exposure through Next config.

## Verification Results

- `rg -n "MONGO_URI|env:" next.config.mjs src docs/runbooks docs/workstreams docs/risks`
  shows no `MONGO_URI` or `env` match in `next.config.mjs`; remaining runtime
  `MONGO_URI` references are DB helper code under `src/lib/db/`.
- `npm run lint`: passed with no ESLint warnings or errors.
- `npm run build`: failed in the default sandbox on Google Fonts DNS
  (`getaddrinfo ENOTFOUND fonts.googleapis.com`), matching the known external
  build dependency. Rerun with approved external access passed. The successful
  build still exercised live MongoDB/build-time data paths, which remains open
  under R-024 and is out of scope for T-001.

## Verification

Run:

```bash
npm run lint
npm run build
```

If `npm run build` fails because external services are unavailable, record the
exact failure and reference existing build-coupling risks instead of broadening
the task.

Also run a targeted search:

```bash
rg -n "MONGO_URI|env:" next.config.mjs src docs/runbooks docs/workstreams docs/risks
```

## Escalate

Escalate to the orchestrator if:

- Any client-side code appears to require `MONGO_URI`.
- Removing the config block changes build behavior in a way unrelated to known
  MongoDB/network coupling.
- Another agent is editing the same deployment or risk docs.
