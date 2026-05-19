# T-134 Complete Incident Owner Matrix

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace the incident-response runbook's `TBD` owner/escalation placeholders with
owner-approved roles, backups, and authority boundaries, or record an explicit
blocked owner-decision handoff if those names are not yet available.

## Context

- T-116 created the incident-response runbook and intentionally left real owner
  names as `TBD` until the owner/orchestrator approved them.
- A-021/F-080/F-083 and R-019 still leave monitoring, alert ownership,
  credentialed/admin smoke, Vercel log inspection, and owner escalation
  incomplete.
- T-123 defines the monitoring provider decision contract, but provider SDK work
  remains blocked until owner/platform approval.
- This task is operational ownership documentation. It should not install a
  monitoring provider or change runtime behavior.

## Scope

In scope:

- Confirm the required owner rows in the incident-response runbook:
  - incident commander;
  - Vercel deployment and rollback;
  - repository release authority;
  - MongoDB production data;
  - Shopify Storefront/API;
  - Cloudinary media/upload;
  - Auth/NextAuth credentials;
  - OAuth providers;
  - DNS/domain/TLS;
  - privacy/legal communication.
- Replace `TBD` placeholders only with owner-approved role labels, named owners,
  team aliases, or explicitly approved owner process references.
- Record backup owners and escalation channels without adding secrets, personal
  phone numbers, private emails, tokens, dashboard URLs with secret identifiers,
  or credentials.
- Update deployment/testing workstreams, risk R-019/R-028, and orchestration
  state after the matrix is complete or explicitly blocked.

Out of scope:

- Do not install or configure a monitoring provider.
- Do not add `instrumentation.ts`, alert automation, scheduled smoke changes, or
  provider environment variables.
- Do not create smoke accounts or record credentials.
- Do not change rollback scripts, Vercel project settings, or incident runtime
  code.

## Concurrency

Can run in parallel with implementation tasks if assigned in parallel-safe
mode.

Owned files in parallel-safe mode:

- `docs/runbooks/incident-response.md`
- `docs/tasks/T-134-complete-incident-owner-matrix.md`

Do not edit shared trackers during a parallel run unless the orchestrator
explicitly assigns ownership: `docs/orchestration/state.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`,
`docs/audits/findings-register.md`, and index files. Put candidate tracker
updates in this task's handoff notes for later reconciliation.

## Likely Files

- `docs/runbooks/incident-response.md`
- `docs/runbooks/deployment.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`
- `docs/tasks/T-134-complete-incident-owner-matrix.md`

## Acceptance Criteria

- The incident-response owner matrix no longer contains unresolved `TBD`
  placeholders for rows where the owner has supplied approved ownership data.
- Any still-unresolved owner row is explicitly marked blocked with the missing
  decision, escalation path, and next owner action.
- The runbook states who can approve rollback, release changes, provider checks,
  data restore, credential rotation, and privacy/legal communication.
- Related workstream/risk/orchestration docs record whether owner matrix
  completion is done or blocked.
- No secrets, credentials, private contact details, or dashboard-only sensitive
  URLs are committed.

## Verification

```bash
rg -n "TBD" docs/runbooks/incident-response.md
rg -n "password|secret|token|private key|mongodb\\+srv|api[_-]?key" docs/runbooks/incident-response.md
git diff --check
```

If approved owner data is unavailable, the `TBD` search may still return rows,
but each row must have a documented blocker and next owner action.

## Handoff Notes

- Prepared after A-011, A-017, and A-018 completed and after T-123/T-124 left
  provider-specific monitoring and alert ownership blocked on owner/platform
  decisions.
- Keep this task docs-only unless the owner explicitly expands it.
- Completed 2026-05-19 as a blocked owner-decision handoff because no
  owner-approved names, team aliases, or permanent backup roles were available
  in repo documentation. The incident-response runbook no longer leaves raw
  owner placeholders; every required row states the missing decision, interim
  escalation to owner/orchestrator, next owner action, and authority boundary.
- Updated the deployment runbook to keep rollback blocked until the
  owner/orchestrator identifies the Vercel-access operator for the incident.
- Updated deployment/testing workstreams, R-019/R-028, orchestration state, and
  task index to record the docs-only blocked outcome. No runtime behavior,
  monitoring SDK, alert automation, environment variable, account, credential,
  Vercel project, rollback script, or provider setting changed.
- Verification:
  - `rg -n "TBD" docs/runbooks/incident-response.md` returned no matches.
  - `rg -n "password|secret|token|private key|mongodb\\+srv|api[_-]?key" docs/runbooks/incident-response.md`
    returned only generic redaction/credential-handling policy text and no
    secret values, connection strings, private keys, or API keys.
  - `git diff --check` passed.
