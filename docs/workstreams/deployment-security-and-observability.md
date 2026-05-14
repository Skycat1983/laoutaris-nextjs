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

## Backlog

- Inventory required environment variables without recording secret values.
- Tighten CSP and CORS policy where feasible.
- Define production logging policy.
- Confirm build behavior on a clean environment.
- Document deployment, rollback, and smoke-check steps.
- Audit dependency and supply-chain risk.
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

## Next Agent Action

Create an environment variable inventory from config files and route usage, then
update [../runbooks/environment.md](../runbooks/environment.md).
