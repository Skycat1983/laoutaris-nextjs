# T-025 Make Vercel Smoke Checks Repeatable

Status: Completed.

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Turn the ad hoc Vercel smoke checks exposed by the bcrypt incident into a
repeatable checklist or lightweight script with exact evidence fields, route
expectations, auth smoke handling, log-access requirements, and rollback
triggers.

## Why Now

T-024 confirmed the production bcrypt crash is resolved, but it also showed the
deployment process still depends on chat context and manual access: there was no
standard place to record deployment ID, commit SHA, route statuses, credentials
smoke outcome, targeted log check, or rollback decision. That gap remains
F-048/R-028 even after the incident stopped crashing.

This task addresses:

- [F-048](../audits/findings-register.md): deployment smoke checks, runtime
  version, Vercel settings, and rollback steps are not repeatable.
- [R-019](../risks/production-readiness.md): monitoring, incident response,
  rollback ownership, and smoke evidence are not defined.
- [R-024](../risks/production-readiness.md): runtime verification depends on
  deployment-specific behavior.
- [R-028](../risks/production-readiness.md): deployment runtime, Vercel project
  settings, smoke checks, and rollback steps are not pinned or repeatable.

## Read First

- [Deployment runbook](../runbooks/deployment.md)
- [Incident 2026-05-14 Vercel bcrypt native trace](incident-2026-05-14-vercel-bcrypt-native-trace.md)
- [T-024 Verify Vercel bcrypt redeploy smoke](T-024-verify-vercel-bcrypt-redeploy-smoke.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)

## Scope

In scope:

- Update the deployment runbook with a smoke evidence template that records:
  deployment URL or ID, commit SHA, timestamp, Vercel environment, runtime if
  available, route/status results, auth smoke outcome, targeted log check, and
  rollback decision.
- Define the minimum route set for production smoke:
  home, artwork list/detail, collection list/detail, blog list/detail, search,
  shop listing, product detail/not-found behavior, sign-in/sign-out, non-admin
  admin denial, and admin dashboard access.
- Document how credentials smoke should be handled without recording secrets:
  the account source, secret-channel handoff, and allowed evidence wording.
- Document targeted Vercel log access requirements or owner-provided log excerpt
  requirements, including what to capture when native-package errors recur.
- Add a concise rollback trigger checklist for failed critical smoke paths.
- If a small script is practical without secrets, add it for public unauthenticated
  route status checks and document its limitations.
- Update deployment/testing workstreams, findings, risks, and orchestration
  state after completion.

Out of scope:

- Do not require or store production credentials in the repo.
- Do not add Vercel tokens, `.vercel` project metadata, or secret values.
- Do not change application behavior unless the smoke checklist exposes a
  narrow, obvious documentation/code mismatch.
- Do not solve Node/package-manager pins, Next/PostCSS migration, monitoring
  tooling, or full CI setup in this task.

## Acceptance Criteria

- A new agent can follow the deployment runbook and know exactly what smoke
  evidence to collect after a Vercel deploy.
- Secret handling for credentials smoke is explicit and does not put secrets in
  docs, logs, commands, or screenshots.
- Targeted Vercel log access requirements are documented.
- Rollback triggers are concrete enough for the owner/orchestrator to act on.
- Any public-route smoke script, if added, has clear usage and limitations.

## Completion Notes

Completed on 2026-05-14.

- [Deployment runbook](../runbooks/deployment.md) now includes a repeatable
  smoke evidence template with deployment URL or ID, commit SHA, timestamp,
  Vercel environment, runtime/build fields, route results, auth outcomes,
  targeted log checks, and rollback decisions.
- The runbook defines the minimum smoke route set for public archive routes,
  shop listing/product detail/not-found behavior, NextAuth shell pages,
  credentialed sign-in/sign-out, non-admin admin denial, and admin dashboard
  access.
- Credentials smoke handling now requires owner-approved accounts delivered
  through a secret channel and defines allowed evidence wording that excludes
  usernames, passwords, cookies, CSRF tokens, and screenshots with secrets.
- Targeted Vercel log requirements now define the required time window, routes,
  owner-provided excerpt fallback, and the fields to capture if native-package
  errors recur.
- Rollback triggers now cover root/serverless crashes, native-package errors,
  public archive/shop `5xx` responses, product not-found regressions,
  credentials/admin role regressions, and wrong commit/environment promotion.
- `scripts/smoke-public-routes.mjs` and `npm run smoke:public` add a
  dependency-free unauthenticated public-route status check. It intentionally
  does not check credentials, admin dashboard access, page content, or Vercel
  logs.

## Verification

Docs-only changes:

```bash
git diff --check
```

If a script is added or package scripts are changed, run the narrow command that
exercises it plus:

```bash
npm run lint
```

Run for this task:

```bash
npm run smoke:public -- --help
npm run lint
git diff --check
```

## Escalate

Escalate to the orchestrator if:

- The smoke route list requires owner approval for specific production records.
- Vercel log access cannot be documented without exposing private project
  details.
- Credentials smoke cannot be made repeatable without a new test/admin account
  decision.
