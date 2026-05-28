# T-326 Document Alert And Uptime Owner Routing

Status: Completed 2026-05-28

Workstreams:

- [Deployment Security And Observability](../workstreams/deployment-security-and-observability.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Turn the owner-approved production-ops defaults into a precise docs/runbook
contract for alert routing, incident owner routing, and simple public uptime
checks without changing provider dashboards or runtime code.

## Context

The owner accepted conservative launch-safe defaults on 2026-05-28:

- Heron Laoutaris is the initial incident commander.
- Heron Laoutaris / hlaoutaris@gmail.com is the initial Sentry alert
  destination.
- Heron Laoutaris is the rollback approver.
- Source-map upload is later.
- Session replay, profiling, and broad tracing are off.
- Simple public uptime checks are wanted as a separate scoped task.
- Vercel inspection is read-only by default; rollback, aliases/domains, project
  settings, and promotion changes require separate approval.

Some durable docs still carry older blocked-owner wording. This task should
reconcile that documentation and define the narrow next provider-dashboard
setup steps without performing them.

## Scope

In scope:

- Read:
  - [production ops owner decision packet](../runbooks/production-ops-owner-decision-packet.md)
  - [incident response runbook](../runbooks/incident-response.md)
  - [monitoring and error-reporting architecture](../architecture/monitoring-and-error-reporting.md)
  - [deployment/security workstream](../workstreams/deployment-security-and-observability.md)
  - [production risks](../risks/production-readiness.md)
- Update the incident response runbook so the owner matrix reflects the
  accepted initial owner routing instead of stale fully-blocked rows.
- Document a first alert policy recommendation for Sentry errors that keeps
  replay, profiling, broad tracing, and source maps disabled.
- Document a simple public uptime-check policy as a future provider/dashboard
  setup step. Keep it limited to public availability checks; do not add
  credentialed/admin checks.
- Preserve the rule that rollback execution, Vercel project settings,
  aliases/domains, and promotion changes need separate owner approval.
- Update relevant tracker docs only where they directly describe the above
  owner-routing state.

Out of scope:

- Do not create, edit, or verify Sentry dashboard alerts.
- Do not create uptime monitors in any provider.
- Do not add source-map upload, replay, profiling, broad tracing, sampling
  changes, provider webhooks, CI workflow changes, Vercel API calls, rollback
  automation, credentialed smoke, or secret values.
- Do not run browser automation, Playwright, screenshots, traces, videos, full
  DOM dumps, provider log dumps, or production admin checks.

## Concurrency

Can run in parallel with route-builder scoping tasks because this is docs-only
and should not touch source files. Do not run in parallel with another task
editing the same incident-response or monitoring docs.

## Files Likely Touched

- `docs/runbooks/incident-response.md`
- `docs/architecture/monitoring-and-error-reporting.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/risks/production-readiness.md`
- `docs/tasks/T-326-document-alert-uptime-owner-routing.md`

## Acceptance Criteria

- Incident owner routing no longer contradicts the owner-approved defaults.
- Alert routing documents Heron / hlaoutaris@gmail.com as the initial
  destination without recording provider secrets.
- Uptime checks are scoped as simple public-route checks and do not imply
  credentialed/admin monitoring.
- Privileged Vercel and rollback boundaries remain explicit.

## Verification

```bash
git diff --check
```

Use no broader verification unless runtime source changes unexpectedly, which
should be treated as out of scope.

## Tracker Ownership

The assigned agent owns this task brief status, handoff notes, verification
results, and directly relevant docs listed above. If a wider risk/finding
change seems needed, add a candidate note in this task rather than broadening
the edit.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after T-325 verified
  unauthenticated public smoke and the owner confirmed production-ops defaults.
- This task is intentionally controlled: docs-only, no dashboard mutation, no
  production credentials, no provider logs, no browser automation.
- Completed on 2026-05-28 as a docs-only update. Updated
  `docs/runbooks/incident-response.md`,
  `docs/architecture/monitoring-and-error-reporting.md`,
  `docs/workstreams/deployment-security-and-observability.md`,
  `docs/workstreams/testing-and-quality.md`, and
  `docs/risks/production-readiness.md`.
- Incident owner routing now records Heron Laoutaris as initial incident
  commander, release/service owner, rollback approver, and Sentry alert
  destination through `hlaoutaris@gmail.com`; backup operators remain
  unassigned.
- Initial Sentry alert policy is documented as a future provider-dashboard
  setup step that keeps source-map upload, replay, profiling, broad tracing,
  provider webhooks, and sampling changes disabled.
- Simple public uptime checks are documented as future unauthenticated
  public-route checks only. Credentialed/admin, mutation, provider-console,
  private dashboard, rollback, Vercel project-setting, alias/domain, and
  deployment-promotion actions remain outside this scope.
- Verification: `git diff --check` passed.
