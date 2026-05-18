# T-123 Define Monitoring Provider Plan

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Create a decision-ready monitoring and error-reporting plan for the Next.js 14
Vercel app so owner/platform approval can choose a provider, required
environment variables, instrumentation surfaces, and alert ownership before any
SDK is installed.

## Context

- A-021/F-080 found no monitoring or error-reporting dependency, no
  `instrumentation.ts`, no monitoring environment contract, and no production
  alerting setup.
- T-099 through T-122 created and guarded the provider-neutral API route
  request ID and structured logging foundation.
- T-116 created the incident-response runbook, but owner/escalation
  placeholders and alert automation remain open.
- Choosing Sentry, Axiom, Datadog, New Relic, Vercel-native observability, or
  an explicit no-provider interim policy is an owner/platform decision. This
  task should prepare that decision without committing a provider.

## Scope

In scope:

- Reconfirm current monitoring evidence from package, source, config, and env
  docs without reading secret values.
- Add a durable monitoring/error-reporting architecture doc covering:
  - current no-provider state;
  - required capture surfaces for server route handlers, App Router server
    errors, client boundaries, unhandled client promise failures, Shopify/Mongo/
    Cloudinary failures, build/deploy smoke evidence, and incident triage;
  - how T-099 request IDs and structured logs should connect to the future
    provider;
  - provider selection criteria and owner questions;
  - expected environment variable classification rules once a provider is
    chosen.
- Link the new doc from the architecture index and update related
  workstream/risk/finding/orchestration docs.
- Keep the output decision-ready: clearly state what an implementation task can
  install/configure after owner approval.

Out of scope:

- Do not install a monitoring SDK or add provider-specific runtime code.
- Do not create `instrumentation.ts` until the provider and env contract are
  approved.
- Do not add alert automation, CI scheduling, or Vercel project configuration.
- Do not fill incident-response owner matrix placeholders without owner input.
- Do not change user-facing error UI or lower-level service/client logging
  behavior in this task.

## Likely Files

- `docs/architecture/monitoring-and-error-reporting.md`
- `docs/architecture/README.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`
- `docs/tasks/T-123-define-monitoring-provider-plan.md`

## Acceptance Criteria

- The new architecture doc gives a clear owner decision checklist and
  implementation contract for monitoring/error reporting without choosing a
  provider by accident.
- The doc maps current request ID/structured logging behavior to future
  provider integration points.
- Environment-variable guidance is classified without recording secret values.
- F-080/R-019 and the deployment/testing workstreams record that a monitoring
  decision plan exists while provider install, instrumentation, alerts, and
  owner matrix completion remain open.

## Verification

```bash
rg -n "@sentry|sentry|datadog|newrelic|opentelemetry|otel|axiom|posthog|monitor|alert|instrumentation" package.json package-lock.json src next.config.mjs docs/runbooks/environment.md
git diff --check
```

## Handoff Notes

- Planned on 2026-05-18 after T-122 locked the completed API route logging
  source-hygiene invariant.
- Keep this task docs-only and decision-ready; runtime monitoring integration
  should be a later task after owner/platform approval.
- Completed on 2026-05-18 with
  [Monitoring And Error Reporting](../architecture/monitoring-and-error-reporting.md).
  The plan records the current no-provider state, required server, client, and
  provider failure capture surfaces, the T-099 request ID and structured-log
  integration contract, provider owner questions, environment-variable
  classification rules, and the post-approval implementation contract.
- Remaining work: owner/platform provider decision or explicit no-provider
  interim policy, SDK installation, `instrumentation.ts` if required by the
  chosen provider, alert automation, CI/scheduled smoke ownership, incident
  owner matrix completion, and lower-level service/client logging policy.
