# Audit Findings Reconciliation

Audit findings are not automatically implementation tasks. They must be reviewed,
deduplicated, prioritized, and routed before work begins.

Use this process whenever an audit result contains findings that affect
architecture, production risk, user behavior, security, data, or public launch
readiness.

## Source Documents

- Audit goals: [goals.md](goals.md)
- Audit results: [results/README.md](results/README.md)
- Findings register: [findings-register.md](findings-register.md)
- Production risks: [../risks/production-readiness.md](../risks/production-readiness.md)
- Workstreams: [../workstreams/README.md](../workstreams/README.md)
- ADRs: [../decisions/README.md](../decisions/README.md)

## Finding Statuses

| Status | Meaning |
| --- | --- |
| Proposed | Finding has been reported by an audit but not reviewed. |
| Needs evidence | Finding may be valid, but evidence is incomplete or too vague. |
| Accepted | Finding is valid and should become a risk, task, ADR, or runbook update. |
| Duplicate | Finding is covered by another finding or risk. |
| Deferred | Finding is valid but outside the current production-readiness phase. |
| Rejected | Finding is not valid after review. |
| Converted | Finding has been routed to a workstream, risk, ADR, or runbook. |
| Resolved | The follow-up work is complete and verified. |

## Review Steps

1. Read the audit result and copy each actionable finding into
   [findings-register.md](findings-register.md).
2. Check for duplicates across existing findings, risks, ADRs, and workstream
   backlog items.
3. Require evidence before accepting a finding. Evidence should usually be a
   file path, route, command output summary, failing test, config value, or
   reproducible behavior.
4. Assign severity:
   - Critical: blocks production or risks data/security loss.
   - High: blocks core user, admin, commerce, or deployment readiness.
   - Medium: weakens reliability, maintainability, accessibility, or operations.
   - Low: cleanup, documentation, or future-proofing.
5. Route accepted findings:
   - Production risk: add or update [../risks/production-readiness.md](../risks/production-readiness.md).
   - Implementation task: add to the relevant workstream backlog.
   - Durable decision: create or update an ADR.
   - Repeatable procedure: update a runbook.
   - Architecture fact: update an architecture doc.
6. Mark the finding `Converted` only after the destination link exists.
7. Mark the finding `Resolved` only after implementation and verification are
   recorded.

## Concurrent Audit Handling

When several audits are running at once:

- Audit agents should write findings to their assigned result files.
- The orchestrator should reconcile shared files after audit results land.
- Shared files include [findings-register.md](findings-register.md),
  [../risks/production-readiness.md](../risks/production-readiness.md), ADRs,
  and workstream backlogs.
- If a concurrent audit agent is asked to update a shared file directly, the
  assignment must name the exact file and section.

## Conflict Resolution

When two audits disagree:

- Prefer repo evidence over assumption.
- Prefer current code over historical notes unless the historical note records a
  decision still accepted by an ADR.
- If both findings are plausible, keep both as `Needs evidence` and assign a
  follow-up audit task.
- If the conflict is architectural or strategic, create an ADR rather than
  hiding the decision inside an audit report.

## Review Cadence

The orchestrator should review findings:

- After each completed audit.
- Before assigning implementation work based on audit results.
- Before closing a high-severity production risk.
- Before deleting code or removing historical docs.

## Completion Standard

An audit is not complete until:

- Its result file has findings and evidence.
- Findings have been entered into the register or explicitly marked as no-action.
- Accepted findings have destination links.
- Relevant risks and workstreams have been updated.
- The result file states the next action.
