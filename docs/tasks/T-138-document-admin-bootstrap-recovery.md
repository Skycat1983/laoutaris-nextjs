# T-138 Document Admin Bootstrap And Recovery

Status: Completed

Workstream:
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md),
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md)

## Goal

Document a repeatable admin bootstrap, promotion, lockout recovery, and
verification workflow so production operators can recover admin access without
unsafe ad hoc database edits.

## Context

- A-004/F-045 found admin bootstrap and recovery are not documented as
  repeatable operations.
- A-011 found admin user deletion can remove the current admin or the last admin
  account, making the missing recovery workflow a production-impacting
  operations gap.
- T-002/T-003/T-026/T-039/T-040/T-043 hardened role/session and protected API
  guard behavior, so the runbook should align with the current NextAuth/JWT and
  MongoDB role model.
- T-025 documents credential smoke handling but intentionally avoids recording
  secrets or smoke credentials in repo docs.

## Scope

In scope:

- Add or update admin bootstrap/recovery guidance in the auth runbook, or create
  a dedicated admin access runbook if clearer.
- Document:
  - how the first production admin is created or promoted;
  - how a current admin role is verified;
  - what evidence is required before changing roles directly in MongoDB;
  - how to recover if all admins are unavailable;
  - how to verify credentials and OAuth sign-in after recovery;
  - how to avoid recording passwords, cookies, CSRF tokens, or OAuth secrets.
- Add an explicit warning that admin user deletion protections are a separate
  runtime task if they are not implemented in this slice.
- Link the runbook from the runbook index and relevant workstreams/risks.

Out of scope:

- Do not implement route-level self-delete or last-admin deletion guards in this
  docs task.
- Do not create admin users, change MongoDB data, rotate credentials, or inspect
  local `.env` values.
- Do not change NextAuth provider configuration or middleware behavior.
- Do not store account names, passwords, tokens, cookies, or private owner
  contact details in docs.

## Concurrency

Can run in parallel with T-135, T-136, or T-137. Coordinate before running in
parallel with T-134 because both touch operational ownership and incident/admin
runbook responsibilities.

Owned files in parallel-safe mode:

- `docs/runbooks/auth.md` or a new dedicated admin access runbook;
- `docs/runbooks/README.md` only if this task creates a new runbook and the
  orchestrator assigns runbook-index ownership;
- `docs/tasks/T-138-document-admin-bootstrap-recovery.md`.

When running in parallel, do not edit shared trackers unless explicitly
assigned: `docs/orchestration/state.md`, `docs/risks/production-readiness.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and index files. Put
candidate tracker updates in this task's handoff notes for orchestrator
reconciliation.

## Likely Files

- `docs/runbooks/auth.md`
- Optional `docs/runbooks/admin-access.md`
- `docs/runbooks/README.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/risks/production-readiness.md`
- `docs/tasks/T-138-document-admin-bootstrap-recovery.md`

## Acceptance Criteria

- A new agent or operator can identify the approved admin bootstrap and recovery
  path without chat history.
- The runbook distinguishes normal admin creation/promotion, emergency recovery,
  verification, rollback, and evidence handling.
- Secret-handling rules are explicit and consistent with T-025.
- The remaining runtime deletion-protection gap is linked as follow-up if not
  solved by this task.
- Related workstream/risk docs point to the runbook.

## Verification

```bash
rg -n "admin|bootstrap|recovery|promot|last admin|delete admin|smoke" docs/runbooks docs/workstreams docs/risks/production-readiness.md
rg -n "password|secret|token|cookie|csrf|mongodb\\+srv" docs/runbooks
git diff --check
```

The second search should not reveal newly committed secrets; generic policy
words are acceptable.

## Handoff Notes

- Completed by extending [auth.md](../runbooks/auth.md) with the admin
  bootstrap, promotion, lockout recovery, rollback, verification, MongoDB
  evidence, and secret-handling workflow.
- Updated the runbook index label, relevant workstream notes, and production
  risk status so operators can find the runbook without chat history.
- No admin users were created, no MongoDB data was changed, no local
  environment values were inspected, and no secrets or account identifiers were
  recorded.
- A later implementation task should add runtime protections against deleting
  the current admin and deleting the last admin.
- Verification run:
  - `rg -n "admin|bootstrap|recovery|promot|last admin|delete admin|smoke" docs/runbooks docs/workstreams docs/risks/production-readiness.md`
  - `rg -n "password|secret|token|cookie|csrf|mongodb\\+srv" docs/runbooks`
  - `git diff --check`
