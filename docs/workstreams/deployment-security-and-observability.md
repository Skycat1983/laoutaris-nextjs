# Deployment, Security, And Observability Workstream

Status: Planned

Goal: prepare the app for production deployment with safe configuration,
security headers, environment documentation, and actionable operational signals.

## Depends On

- [Deployment runbook](../runbooks/deployment.md)
- [Environment variables runbook](../runbooks/environment.md)
- [System overview](../architecture/system-overview.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-019 Dependencies and supply chain](../audits/goals.md#a-019-dependencies-and-supply-chain)
- [A-020 Privacy, consent, and commerce compliance](../audits/goals.md#a-020-privacy-consent-and-commerce-compliance)
- [A-021 Observability and incident response](../audits/goals.md#a-021-observability-and-incident-response)

## Blocks

- Production launch.
- Secure Shopify and admin release.
- Incident response readiness.

## Related Code Areas

- `next.config.mjs`
- `src/middleware.ts`
- `src/lib/config/`
- `src/lib/db/`
- Vercel project settings
- Environment variables outside the repo

## Current Facts

- Deployment target in the README is Vercel.
- `next.config.mjs` configures remote image patterns and headers.
- CSP currently allows broad `https:` and inline/eval script behavior.
- API CORS headers are broad.
- Shopify, MongoDB, NextAuth, OAuth, and Cloudinary require environment
  variables.
- A-001 found a Shopify credential-like value in source comments that must be
  verified and removed.
- A-006 found build verification depends on Google Fonts network access and live
  MongoDB/environment behavior during static generation.
- Completed audits found debug logging across build, SSR, DB, fetcher, and shop
  paths that needs a production logging policy.
- A-014 found unused direct dependency candidates; A-019 remains the full
  supply-chain audit.
- A-007 completed the deployment/environment audit and found `MONGO_URI` is
  exposed through `next.config.mjs` `env`, the environment runbook misses active
  variables and decisions, build verification depends on live MongoDB and
  external network access, URL construction is hard-coded/inconsistent,
  Cloudinary upload variables are undocumented, smoke checks are manual, and
  runtime/Vercel/rollback settings are not pinned.

## Backlog

- Inventory required environment variables without recording secret values.
- Remove `MONGO_URI` from `next.config.mjs` and add a config guard that rejects
  known server-only secrets in Next `env`.
- Update the environment runbook with `JWT_SECRET`, `AUTH_SECRET` decision
  status, `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, `VERCEL_URL`, Cloudinary
  variables, upload preset ownership, required environments, owners, and
  rotation guidance.
- Remove credential-like values from source comments and decide whether exposed
  values require rotation.
- Tighten CSP and CORS policy where feasible.
- Define production logging policy.
- Gate or remove debug logs that currently pollute tests, builds, SSR, and shop
  flows.
- Confirm build behavior on a clean environment.
- Decide whether CI builds should be isolated from Google Fonts and live MongoDB
  access or document those external dependencies explicitly.
- Centralize or remove same-app base URL construction; until ADR 0004 is applied
  broadly, avoid production localhost fallbacks and hard-coded production
  domains.
- Document deployment, Vercel project settings, Node runtime, rollback, and
  smoke-check steps.
- Convert deployment smoke checks into a scripted suite or an evidence-based
  manual checklist with exact routes, records, roles, expected status/redirects,
  and rollback trigger.
- Audit dependency and supply-chain risk.
- Run a package-focused cleanup for unused direct dependencies only after A-019
  or a targeted dependency task confirms the plan and lockfile verification.
- Audit privacy, consent, and commerce compliance gaps for owner/legal review.
- Define observability, alerting, incident response, and rollback ownership.
- Add monitoring or error reporting decision if needed.

## Acceptance Criteria

- Production environment variables are documented by name, owner, and purpose.
- Build and deployment steps are repeatable.
- Headers are reviewed for production risk.
- Debug logging does not leak sensitive data in production.
- Deployment smoke checks cover public pages, auth, admin access, and shop.

## Verification

```bash
npm run build
npm run lint
```

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-001, A-006, A-014, and A-015 deployment/security
  findings into `docs/audits/findings-register.md`, production risks, and this
  backlog.
- 2026-05-14: Reconciled A-007 into F-046 through F-048 and updated
  F-011/F-019/F-020/F-030/F-044/F-047, production risks, and this backlog.

## Next Agent Action

Remove `MONGO_URI` from `next.config.mjs`, then update
[../runbooks/environment.md](../runbooks/environment.md) and deployment notes
with the A-007 variable inventory, build dependencies, Vercel settings, and
smoke/rollback evidence requirements.
