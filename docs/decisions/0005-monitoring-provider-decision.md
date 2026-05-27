# 0005 - Monitoring Provider Decision

Status: Accepted

Date: 2026-05-23

Updated: 2026-05-27

## Context

[T-123](../tasks/T-123-define-monitoring-provider-plan.md) created the
provider-neutral monitoring and error-reporting architecture plan.
[T-124](../tasks/T-124-add-public-smoke-github-actions-workflow.md) made the
existing unauthenticated public smoke script CI-accessible, but it did not add
provider alerting, browser reporting, dashboard ownership, or release/source-map
tracking.

The app still has no monitoring SDK, no `instrumentation.ts`, no provider
environment contract, no alert automation, and no owner-approved monitoring
operator. The [monitoring architecture](../architecture/monitoring-and-error-reporting.md)
identifies the required decision points: provider choice, launch-blocking scope,
capture surfaces, data boundary, source-map/release policy, environment
classification, alert ownership, smoke coverage, cost, retention, and access.

No owner/platform approval was available for T-139, so this ADR originally
recorded a blocked provider decision. On 2026-05-27 the owner approved Sentry
as the monitoring provider.

## Decision

Sentry is approved as the production monitoring and error-reporting provider.

Initial implementation scope:

- Error reporting for App Router server/runtime errors and browser/client
  errors.
- Preserve the existing request ID and structured redacted logging contract.
- Attach safe request IDs, route names, deployment/release metadata, and status
  categories where available.
- Keep `sendDefaultPii` disabled unless a later owner/legal decision approves a
  narrower data policy.
- Do not enable session replay, profiling, broad tracing, uptime checks, alert
  webhooks, or source-map upload in the first runtime task unless that task
  explicitly scopes and verifies the extra behavior.
- Do not put Sentry secrets or auth tokens in source, docs, `next.config.mjs`
  `env`, or browser bundles.

The implementation task must verify the current official Sentry Next.js setup
before editing source because SDK file names, `instrumentation.ts` behavior,
source-map upload options, and recommended config can change.

Environment variables must be classified in
[the environment runbook](../runbooks/environment.md) before or with code
changes. At minimum, the implementation task must distinguish:

- public/browser-safe Sentry DSN or equivalent ingest identifier, if used;
- server/runtime DSN or equivalent ingest identifier, if separate;
- Sentry release/environment metadata;
- source-map upload token, organization, and project values if source maps are
  later approved;
- sampling or enable flags;
- alert webhook or integration secrets if alert automation is later approved.

Secret values must never be committed.

## Consequences

- Provider choice is unblocked.
- R-019/F-080/F-143 remain open until Sentry is actually implemented and
  verified.
- Alert destinations, incident owner matrix, Vercel log/rollback access,
  credentialed smoke accounts, public-smoke repository variables, source-map
  upload, session replay, profiling, tracing, and uptime checks remain separate
  decisions or tasks.
- Future implementation work can proceed through a scoped Sentry setup task
  without requiring Shopify dashboard access.
