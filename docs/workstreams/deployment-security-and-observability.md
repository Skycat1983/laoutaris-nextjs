# Deployment, Security, And Observability Workstream

Status: Active

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
- A-019 completed the dependency/supply-chain audit and found active
  production-tree vulnerabilities in `next`, `cloudinary`, `mongoose`,
  `bcrypt`, `next-auth`, `uuid`, and `postcss`, plus missing package-manager,
  Node runtime, CI, and dependency-update controls.
- T-011 patched current-major production dependency advisories with
  `next@14.2.35`, `cloudinary@2.10.0`, `mongoose@8.23.1`,
  `next-auth@4.24.14`, `uuid@11.1.1`, root dev `postcss@8.5.14`, and targeted
  transitive overrides. The production audit now has no critical advisories but
  still reports residual Next/PostCSS advisories requiring the T-015 major
  migration preflight.
- T-014 decided the residual dependency direction: run a Next major migration
  preflight audit first through T-015, and run the focused `bcrypt@6.0.0`
  compatibility/security patch through T-016.
- T-016 upgraded `bcrypt` to `6.0.0` and removed the
  `bcrypt -> @mapbox/node-pre-gyp -> tar` production advisory path. No residual
  production advisory has been accepted for launch.
- T-015 confirmed the residual Next/PostCSS path does not currently have an
  accepted stable fix target: npm recommends stable `next@16.2.6`, but isolated
  metadata/audit checks show that release still bundles vulnerable
  `postcss@8.4.31`; canary `16.3.0-canary.6+` declares `postcss@8.5.10` and
  clears an isolated audit but needs explicit owner acceptance before use.
- A-007 completed the deployment/environment audit and found `MONGO_URI` is
  exposed through `next.config.mjs` `env`, the environment runbook misses active
  variables and decisions, build verification depends on live MongoDB and
  external network access, URL construction is hard-coded/inconsistent,
  Cloudinary upload variables are undocumented, smoke checks are manual, and
  runtime/Vercel/rollback settings are not pinned.
- T-005 added a route-local admin guard, request validation, and missing-secret
  handling to the Cloudinary signing endpoint.
- T-006 added `npm run env:guard`, a build precheck that rejects known
  server-only secrets and secret-like env names in `next.config.mjs` `env`.
- A-008 completed the security headers/CORS/logging audit and confirmed broad
  wildcard API CORS, permissive CSP, missing hardening headers, raw
  credential-bearing registration logs, always-on request/debug logs, and raw
  API exception messages.
- T-009 removed direct registration credential logging and the Shopify
  token-shaped source comment; owner verification/rotation for the removed
  Shopify value remains open.

## Backlog

- Inventory required environment variables without recording secret values.
- Update the environment runbook with `JWT_SECRET`, `AUTH_SECRET` decision
  status, `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, `VERCEL_URL`, Cloudinary
  variables, upload preset ownership, required environments, owners, and
  rotation guidance.
- Verify whether the removed Shopify credential-like source comment represented
  a real value and rotate it if needed.
- Tighten CSP and CORS policy with production allowlists and missing hardening
  headers.
- Define production logging and redaction policy.
- Gate or remove debug logs that currently pollute tests, builds, SSR, and shop
  flows.
- Standardize public-safe API exception responses with internal redacted
  logging and request/correlation context.
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
- Decide whether to defer the Next/PostCSS migration until a stable Next release
  bundles `postcss@8.5.10+`, migrate to stable `next@16.2.6` with explicit
  temporary PostCSS advisory acceptance, or accept canary framework risk.
- Before any future Next package edit, re-run npm metadata/audit checks and use
  T-015's Node/React/lint/proxy/image/App Router verification plan.
- Run a package-focused cleanup for unused direct dependencies only after A-019
  or a targeted dependency task confirms the plan and lockfile verification.
- Add package-manager and Node runtime pins, document `npm ci` as the install
  path, and define dependency audit/update automation or cadence.
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
- 2026-05-14: T-001 removed `MONGO_URI` from `next.config.mjs`, confirmed the
  remaining `MONGO_URI` references are server-side DB helpers, and updated the
  environment/deployment runbooks to keep server-only secrets out of Next
  config `env`.
- 2026-05-14: Prepared T-005 to harden Cloudinary signing before the broader
  Cloudinary/Vercel/auth environment inventory continues.
- 2026-05-14: Completed T-005 missing `CLOUDINARY_API_SECRET` handling with a
  public-safe JSON error; Cloudinary environment inventory and rotation
  ownership remain open.
- 2026-05-14: Prepared T-006 to prevent server-only secrets from being exposed
  through Next config `env` again.
- 2026-05-14: Completed T-006 by adding `scripts/validate-next-config-env.mjs`,
  `npm run env:guard`, build-time guard execution, and focused guard tests.
- 2026-05-14: Completed A-019 dependency/supply-chain audit; result recorded
  production vulnerabilities, unused direct dependency candidates, lockfile
  health, install-script risk, and missing package-manager/update controls.
- 2026-05-14: Reconciled A-008 into F-051 through F-054, updated F-011/F-044,
  production risks, this backlog, and T-009.
- 2026-05-14: Completed T-009 by removing direct registration console logging,
  replacing the Shopify token-shaped source comment with value-free guidance,
  and adding focused source hygiene regression coverage. Owner verification or
  rotation for the removed Shopify value remains open.
- 2026-05-14: Completed T-011 by patching current-major production dependency
  advisories, adding targeted transitive overrides, fixing the
  `userUtils`/Mongoose Jest runtime import, and running production audit,
  focused tests, full Jest, lint, and build verification.
- 2026-05-14: Completed T-014 by confirming the 5 residual production
  advisories, choosing a Next major preflight audit before package edits, and
  creating ready follow-up briefs T-015 and T-016.
- 2026-05-14: Completed T-016 by upgrading `bcrypt`/`@types/bcrypt` to
  `6.0.0`, removing the `@mapbox/node-pre-gyp`/`tar` advisory path from the
  production audit, and running focused auth/bcrypt tests, full Jest, lint, and
  build verification.
- 2026-05-14: Completed T-015 by confirming current `npm audit --omit=dev`
  reports only residual Next/PostCSS advisories, finding that stable
  `next@16.2.6` does not clear the nested PostCSS advisory in an isolated
  audit, and documenting the owner decision path plus future migration
  verification plan.

## Next Agent Action

Escalate the Next/PostCSS choice to the owner/orchestrator: wait for a stable
Next release with bundled `postcss@8.5.10+`, accept a partial stable
`next@16.2.6` migration with residual PostCSS risk, or explicitly accept canary
framework risk.
