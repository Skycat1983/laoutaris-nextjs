# T-116 Create Incident Response Runbook

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Create a durable incident-response runbook that defines severity levels,
triage, escalation, rollback authority, evidence handling, owner matrix, and
post-incident follow-up for production failures.

## Context

- A-021 found deployment smoke and rollback checks are useful, but there is no
  incident-response runbook outside task-specific incident notes.
- T-025 already documents deployment smoke evidence, targeted Vercel log
  checks, and rollback triggers.
- T-099 added request IDs and structured redacted logging for a representative
  API route slice, but monitoring provider selection and broad route migration
  remain separate.
- F-082/R-019 were open because active incident ownership, severity, triage,
  escalation, communication, evidence retention, and postmortem process were
  not defined.

## Scope

- In scope:
  - Add `docs/runbooks/incident-response.md`.
  - Define practical severity levels for production incidents, including
    public site outage, admin/auth regression, commerce/enquiry disruption,
    data-loss risk, privacy/security concern, and third-party dependency outage.
  - Define intake and triage steps from smoke failures, owner reports, Vercel
    logs, API request IDs, Shopify/MongoDB/Cloudinary/Auth symptoms, and
    browser/client errors.
  - Add an owner/escalation matrix with explicit placeholders for Vercel,
    MongoDB, Shopify, Cloudinary, auth/OAuth, DNS/domain, and repository
    release authority.
  - Define rollback/defer/mitigate decision rules that link back to the
    deployment runbook.
  - Define evidence retention and redaction rules for logs, request IDs,
    screenshots, credentials, cookies, customer data, and owner-provided
    excerpts.
  - Add a short post-incident review template and follow-up task creation rules.
  - Update runbook index, deployment workstream, testing workstream, risk
    tracker, findings register, task index, and this task brief after
    completion.
- Out of scope:
  - Do not choose or implement a monitoring/error-reporting provider.
  - Do not add `instrumentation.ts`, SDKs, alert rules, CI/scheduled smoke, or
    runtime logging changes.
  - Do not require production credentials, Vercel tokens, provider dashboard
    access, or secret values in docs.
  - Do not resolve owner/legal policy pages, checkout/cart, strict CSP, HSTS,
    Cloudinary cleanup, or broad route-level logging migration.

## Files Likely Touched

- `docs/runbooks/incident-response.md`
- `docs/runbooks/README.md`
- `docs/runbooks/deployment.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/tasks/README.md`
- `docs/tasks/T-116-create-incident-response-runbook.md`

## Acceptance Criteria

- A new operator can classify an incident severity and know the first triage
  steps without chat history.
- The runbook names the evidence to collect while explicitly excluding secrets,
  cookies, credentials, customer personal data dumps, and unredacted provider
  logs.
- Rollback/defer/mitigate decisions point back to the deployment runbook and
  identify who must approve each path, using placeholders where owner approval
  is still needed.
- The owner matrix records unresolved owner decisions as explicit `TBD` items
  rather than hiding them in prose.
- Post-incident review creates durable follow-up tasks and updates risks,
  runbooks, or workstreams as needed.

## Verification

```bash
git diff --check
```

If the task adds any docs link checks or scripts, run those too.

## Handoff Notes

- Prepared after T-115 completed Shopify fetch cache-policy cleanup.
- F-082 is now resolved by this task. R-019 remains partially mitigated because
  monitoring provider selection, alert automation, broad route logging
  migration, continuous smoke, and owner-approved assignment of the runbook's
  `TBD` matrix entries remain separate.
- Completed on 2026-05-18 by adding
  [incident-response.md](../runbooks/incident-response.md), linking it from the
  runbook index and deployment runbook, and updating the T-116 task/workstream,
  risk, and findings trackers.
- The runbook now defines SEV-1 through SEV-4 classification, first-15-minute
  triage, intake sources, service-specific checks, rollback/defer/mitigate
  rules linked to the deployment runbook, evidence redaction/retention rules,
  explicit `TBD` owner placeholders, communication notes, post-incident review
  template, follow-up task rules, and closure criteria.
- Verification passed: `git diff --check`.
- Keep monitoring provider selection, SDK instrumentation, alerting,
  CI/scheduled smoke, and broad route-level logging migration separate.
