# T-139 Record Monitoring Provider Decision

Status: Planned

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Record the owner/platform monitoring decision as an ADR or equivalent durable
decision packet so a later implementation task can safely install a provider,
add instrumentation, or explicitly proceed with a no-provider interim policy.

## Context

- T-123 created the provider-neutral monitoring and error-reporting architecture
  plan.
- T-124 made unauthenticated public smoke CI-accessible, but it did not add
  provider alerting.
- R-019/F-080 remain open because the app still has no monitoring SDK,
  `instrumentation.ts`, provider environment contract, alert automation, or
  completed owner routing.
- Provider choice, no-provider launch posture, source-map upload, browser DSN
  exposure, alert destinations, data retention, and cost are owner/platform
  decisions, not implementation guesses.

## Scope

In scope:

- Use `docs/architecture/monitoring-and-error-reporting.md` as the decision
  checklist.
- Record the approved decision in an ADR or task handoff, covering:
  - provider choice or explicit no-provider interim policy;
  - launch-blocking versus post-launch monitoring scope;
  - server, App Router, client, Shopify, MongoDB, Cloudinary, and smoke capture
    surfaces;
  - environment variable classifications;
  - source-map and release tracking position;
  - alert ownership and incident-response runbook links;
  - expiry/review date for a no-provider interim policy.
- Update the environment runbook only with variable names/classifications, not
  secret values, when a provider is approved.
- Prepare the next implementation task boundary without installing anything.

Out of scope:

- Do not install SDK packages.
- Do not add `instrumentation.ts`.
- Do not add provider variables to `next.config.mjs` `env`.
- Do not upload source maps, create provider projects, configure alerts, or add
  dashboards.
- Do not change client/server error UI or existing request ID/logging behavior.

## Concurrency

Can run in parallel with T-135, T-136, or T-137 if the owner/platform decision
is already available. Coordinate before running in parallel with T-134 because
both may affect alert ownership and incident-response routing.

Owned files in parallel-safe mode:

- the new or updated monitoring ADR/decision record;
- environment runbook variable classification entries only if provider
  variables are approved and the orchestrator assigns environment-doc
  ownership;
- `docs/tasks/T-139-record-monitoring-provider-decision.md`.

When running in parallel, do not edit shared trackers unless explicitly
assigned: `docs/orchestration/state.md`, `docs/risks/production-readiness.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and index files. Put
candidate tracker updates in this task's handoff notes for orchestrator
reconciliation.

## Likely Files

- `docs/decisions/`
- `docs/architecture/monitoring-and-error-reporting.md`
- `docs/runbooks/environment.md`
- `docs/runbooks/incident-response.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`
- `docs/tasks/T-139-record-monitoring-provider-decision.md`

## Acceptance Criteria

- The monitoring decision is durable, dated, and linked from relevant docs.
- The decision either names an approved provider and scope or explicitly records
  a no-provider interim policy with an expiry/review date.
- Environment variable names are classified without exposing values.
- The incident-response ownership implications are linked to T-134 or the
  incident-response runbook.
- The next implementation task can be assigned without re-litigating provider
  choice, data boundary, alert ownership, or source-map policy.

## Verification

```bash
rg -n "Sentry|Axiom|Datadog|New Relic|Vercel|monitoring|error reporting|no-provider|source map|DSN|alert" docs/decisions docs/architecture docs/runbooks docs/workstreams docs/risks/production-readiness.md
rg -n "password|secret|token|license|dsn|private key" docs/decisions docs/runbooks/environment.md
git diff --check
```

Generic environment-variable names are acceptable; committed secret values are
not.

## Handoff Notes

- Prepared after T-123 and T-124. Assign only when the owner/platform decision
  is available or when the assignment is explicitly to record a blocked
  no-decision state.
- Provider-specific implementation remains a later task.
