# T-149 Add Admin Content Operations Runbook

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md)

## Goal

Create a repeatable admin content operations runbook for archive content
maintenance.

## Context

- A-011/F-097 found no runbook for admin-managed artwork, article, blog,
  collection, comment, or user maintenance.
- T-138 covers admin access bootstrap and lockout recovery, but not day-to-day
  content operations.
- Existing runbooks already cover database, Cloudinary, Shopify operations,
  deployment, auth/admin access, and testing; this runbook should link to those
  rather than duplicating them.

## Scope

In scope:

- Add an admin content operations runbook under `docs/runbooks/`.
- Cover create/update preparation, post-change smoke checks, validation-error
  handling, Cloudinary image URL policy, Shopify product-link verification,
  manual ObjectId lookup as an escape hatch, and failure recovery.
- Document destructive delete preconditions as blocked unless cascade preview,
  backup/review evidence, and redacted audit evidence are available.
- Link to the auth, database, Cloudinary, Shopify, deployment, and testing
  runbooks where relevant.
- Update the runbooks index.

Out of scope:

- Do not change runtime admin UI, delete routes, backup scripts, or audit-event
  implementation.
- Do not invent owner names, credentials, secret values, or legal/compliance
  approvals.
- Do not resolve F-092 destructive cascade previews; describe the blocked
  operating requirement and next implementation need.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-147 and T-148 because it owns a docs-only runbook
surface.

Owned files:

- `docs/runbooks/admin-content-operations.md`
- `docs/runbooks/README.md`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `docs/runbooks/admin-content-operations.md`
- `docs/runbooks/README.md`
- `docs/tasks/T-149-add-admin-content-operations-runbook.md`

## Acceptance Criteria

- A new agent can follow the runbook to prepare, perform, verify, and recover
  from routine admin content changes without relying on chat history.
- Destructive delete operations are explicitly blocked from production use
  until cascade previews, backup evidence, and audit evidence exist.
- Related existing runbooks are linked instead of duplicating sensitive or
  environment-specific details.

## Verification

```bash
rg -n "TODO|TBD" docs/runbooks/admin-content-operations.md
rg -n "(password\\s*=|secret\\s*=|token\\s*=|sk_|shpat_)" docs/runbooks/admin-content-operations.md
git diff --check
```

Both searches should return no matches. Owner names or role placeholders should
remain generic unless explicitly approved.

## Handoff Notes

- Prepared after T-144 through T-146 reconciliation from A-011/F-097.
- Keep runtime cascade previews and audit-event implementation separate.
- 2026-05-19: Added
  [admin-content-operations.md](../runbooks/admin-content-operations.md) and
  linked it from the runbooks index. The runbook covers create/update
  preparation, per-resource post-change smoke checks, validation-error handling,
  Cloudinary image URL policy, Shopify product-link verification, manual
  ObjectId lookup as an escape hatch, and failure recovery.
- 2026-05-19: Documented production destructive deletes as blocked unless the
  resource has operator-visible cascade preview, MongoDB backup/export evidence,
  owner/delegated review evidence, and redacted audit evidence. Runtime
  implementation for cascade preview and audit events remains separate.
- Candidate shared-tracker update: mark the content/admin backlog item for an
  admin content operations runbook as complete, while leaving runtime cascade
  preview, backup gate, and audit-event implementation open.
- Candidate shared-tracker update: note that the current user delete route now
  blocks current-admin and last-admin deletion, but production user deletion is
  still operationally blocked until cascade preview and audit evidence exist.
- Verification:
  `rg -n "TODO|TBD" docs/runbooks/admin-content-operations.md` returned no
  matches;
  `rg -n "(password\\s*=|secret\\s*=|token\\s*=|sk_|shpat_)" docs/runbooks/admin-content-operations.md`
  returned no matches; `git diff --check` passed. New-file whitespace checks
  with `git diff --check --no-index /dev/null` for the runbook and task brief
  produced no whitespace-error output.
