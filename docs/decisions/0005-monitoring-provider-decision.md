# 0005 - Monitoring Provider Decision

Status: Blocked

Date: 2026-05-23

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

No owner/platform approval was available for T-139. A prior reconciliation note
also recorded that T-139 remained blocked on the monitoring provider or
no-provider owner decision. This packet records that blocked state so later
agents do not infer a provider choice or an approved no-provider launch posture.

## Decision

No monitoring provider is approved as of 2026-05-23.

No explicit no-provider interim launch policy is approved as of 2026-05-23.
Manual public smoke checks, request IDs, structured redacted logs, and the
incident-response runbook are the current mitigations, but they are not accepted
as a complete production monitoring substitute.

Until the owner/orchestrator records a replacement decision:

- Do not install Sentry, Axiom, Datadog, New Relic, Vercel-native monitoring, an
  OpenTelemetry exporter, or another monitoring SDK.
- Do not add `instrumentation.ts` or provider-specific client bootstrap code.
- Do not add provider variables to `next.config.mjs` `env`.
- Do not define provider environment variables as required runtime config.
- Do not upload browser source maps or configure release tracking.
- Do not configure provider dashboards, uptime checks, alert webhooks, or alert
  destinations.
- Do not expose a browser DSN, public provider key, dashboard URL, or provider
  project identifier in client bundles.
- Do not treat `npm run smoke:public`, GitHub Actions public smoke, or manual
  Vercel log inspection as approved no-provider monitoring for launch.

The next owner/platform decision must explicitly choose one of these paths:

- An approved provider and launch scope.
- An approved no-provider interim policy with expiry/review date and launch
  acceptance.
- A decision to block launch until provider selection and alert ownership are
  complete.

If a provider is approved later, the implementation task must classify variable
names in [the environment runbook](../runbooks/environment.md) before or with
code changes. At minimum, the variable contract must distinguish server-only
secrets, public browser identifiers such as any documented browser-safe DSN,
release/environment metadata, source-map upload credentials, sampling flags, and
alert webhook secrets. Secret values must never be committed.

The unresolved decision must be reviewed before any monitoring implementation
task, before production launch readiness sign-off, or by 2026-06-06, whichever
comes first.

## Required Future Decision Record

A replacement accepted decision should cover:

- Provider choice or explicit no-provider interim policy.
- Whether monitoring is launch-blocking or post-launch.
- Server route, App Router server, client error boundary, unhandled client
  promise rejection, Shopify, MongoDB, Cloudinary, build/deploy smoke, and
  incident-triage capture surfaces.
- Environment variable names and classifications without values.
- Source-map upload and release tracking policy.
- Alert destinations, incident owner links, dashboard access, and escalation
  authority from the [incident-response runbook](../runbooks/incident-response.md).
- Data retention, region/privacy boundary, cost/sampling expectations, and
  provider access model.
- Expiry/review date if no-provider launch posture is approved.

## Consequences

- Monitoring provider implementation remains blocked, but the blocked state is
  now durable and dated.
- R-019/F-080 remain open for provider selection, alert automation,
  source-map/release tracking, browser reporting, owner-approved alert routing,
  and provider-backed monitoring.
- Provider-specific environment variables remain absent from the environment
  runbook because no provider is approved.
- Future implementation work can proceed only after replacing this blocked
  packet with an accepted provider or no-provider decision.
