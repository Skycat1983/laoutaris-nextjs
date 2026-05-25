# T-279 Document External Build Evidence Policy

Status: Completed

Workstream: [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md).

## Goal

Document the release evidence required for intentional external-build surfaces
until their rendering strategy changes.

## Context

A-035 identified intentional static/ISR build-time data surfaces:

- `/biography` default redirect uses cached biography navigation.
- `/collections` default redirect uses cached collection navigation.
- `/sitemap.xml` uses MongoDB archive records and Shopify-backed product links,
  and can return stable URLs while silently losing dynamic coverage when a data
  source fails.

These should not be mixed with the account/project hard-failure implementation
task.

## Scope

In scope:

- Update deployment/testing runbooks with required external-access build
  evidence for these intentional routes.
- Add specific post-build or deployed smoke evidence expectations for
  `/biography`, `/collections`, and `/sitemap.xml`.
- Clearly state what evidence is needed when dynamic sitemap archive/shop
  entries are expected.

Out of scope:

- Changing route rendering behavior.
- Fixing account/project build hard failures.
- Installing monitoring or editing CI workflows.
- Creating smoke accounts or secrets.

## Concurrency

Docs-only, but do not run in parallel with T-267 or another agent editing the
same deployment/testing runbooks, risks, or orchestration state.

## Files Likely Touched

- `docs/runbooks/deployment.md`
- `docs/runbooks/testing.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/tasks/T-279-document-external-build-evidence-policy.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after the policy is discoverable from
  the deployment/testing docs.
- Update `docs/tasks/README.md`.
- Record any candidate risk/finding updates for the orchestrator instead of
  editing shared trackers unless explicitly needed.

## Acceptance Criteria

- Release handoffs can state whether `npm run build` ran with external access.
- The docs name the expected smoke evidence for `/biography`, `/collections`,
  and `/sitemap.xml`.
- The policy separates intentional external-build evidence from accidental
  build hard failures.

## Verification

```bash
git diff --check
rg -n "external-access build|sitemap|biography|collections" docs/runbooks docs/workstreams/deployment-security-and-observability.md
```

## Handoff Notes

- Planned from A-035 intentional static/ISR external-build findings.
- Completed 2026-05-25.
- `docs/runbooks/deployment.md` now records the external-access build evidence
  policy, smoke evidence template fields, and route expectations for
  `/biography`, `/collections`, and `/sitemap.xml`.
- `docs/runbooks/testing.md` now points release verification at the same
  intentional external-build surface policy and separates it from accidental
  build-isolation regressions.
- `docs/workstreams/deployment-security-and-observability.md` and
  `docs/tasks/README.md` were updated for completion.
- No shared risk or findings-register edits were made. Candidate orchestrator
  follow-up only: keep R-024/build-verification wording aligned with this
  runbook policy if the risk tracker is next reconciled.

## Verification Results

```bash
git diff --check
rg -n "external-access build|sitemap|biography|collections" docs/runbooks docs/workstreams/deployment-security-and-observability.md
```

Both commands passed on 2026-05-25.
