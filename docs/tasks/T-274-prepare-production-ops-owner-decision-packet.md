# T-274 Prepare Production Ops Owner Decision Packet

Status: Completed

Workstream: [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md).

## Goal

Prepare a concise owner-decision packet for the A-033 production operations
blockers without implementing monitoring, CI, smoke accounts, or deployment
changes.

## Context

A-033 confirmed these remain blocked on owner/platform input:

- Monitoring provider, no-provider interim policy, or launch-blocking posture.
- Incident owner matrix and backups.
- Vercel deployment/log/rollback operator and backup.
- Non-admin/admin smoke accounts and private secret delivery path.
- Public-smoke repository variables and approved public detail records.

## Scope

In scope:

- Create or update a docs-only owner decision packet that turns the A-033 blocked
  decisions into concrete questions and acceptable answer formats.
- Link back to ADR 0005, incident response, deployment, testing, and public
  smoke docs.
- Do not invent owners, credentials, providers, or legal/policy decisions.

Out of scope:

- Installing monitoring providers.
- Editing CI workflows.
- Creating smoke accounts or handling secrets.
- Running Vercel logs or deployment smoke.

## Concurrency

Can run in parallel with implementation tasks. Avoid parallel edits to the same
owner-decision packet if one already exists.

## Files Likely Touched

- A new or existing doc under `docs/runbooks/`, `docs/risks/`, or
  `docs/orchestration/`
- `docs/tasks/T-274-prepare-production-ops-owner-decision-packet.md`
- `docs/tasks/README.md`

## Completion Contract

- Update this task and task index.
- Record where the owner decision packet lives and what remains blocked.

## Acceptance Criteria

- The owner can answer the production ops blockers without reading all of A-033.
- The packet clearly separates provider/platform decisions from agent-actionable
  implementation work.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned from A-033 blocked decisions.
- Completed on 2026-05-25. Added the
  [Production Ops Owner Decision Packet](../runbooks/production-ops-owner-decision-packet.md)
  as the owner-facing intake sheet for monitoring posture, incident owner
  matrix, Vercel log/rollback authority, credentialed smoke accounts, and
  public-smoke repository variables.
- Updated [Runbooks](../runbooks/README.md), [Tasks](README.md),
  [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
  and [Production-readiness risks](../risks/production-readiness.md) so the
  packet is discoverable and the remaining production-ops blockers point to the
  owner decision path.
- No monitoring provider, CI workflow, Vercel access, smoke account, secret
  handling, deployment, or runtime behavior changes were made.
- Still blocked until owner/orchestrator input exists:
  - monitoring provider, explicit no-provider interim launch policy, or
    launch-blocking posture;
  - incident owners, service operators, backups, access sources, and authority
    boundaries;
  - Vercel deployment/log/rollback operator and backup;
  - owner-approved non-admin/admin smoke accounts and private secret delivery
    path;
  - non-secret `SMOKE_BASE_URL` and optional public detail records for scheduled
    GitHub Actions smoke.
- Verification: `git diff --check` passed.
