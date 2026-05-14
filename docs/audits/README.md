# Audits

Audits are discovery tasks. They identify the current state, risks, and concrete
follow-up work before implementation begins.

Use this section when an agent is asked to inspect part of the project and report
what needs to change.

## Entry Points

- [Audit goals](goals.md): canonical list of planned audits.
- [Audit results](results/README.md): canonical location for audit reports.
- [Findings register](findings-register.md): cross-audit findings that need
  review, dedupe, and routing.
- [Reconciliation process](reconciliation.md): how findings become risks,
  backlog items, ADRs, or resolved work.

## Workflow

1. Pick an audit goal from [goals.md](goals.md).
2. Read the linked workstream and dependency docs.
3. Inspect the repo and run non-destructive verification commands as needed.
4. Write findings to the matching file in `docs/audits/results/`.
5. For concurrent audits, leave findings register and risk updates as candidates
   inside the result file unless the assignment explicitly says to edit shared
   files.
6. Add actionable findings to [findings-register.md](findings-register.md) only
   when assigned to reconcile or when working alone.
7. Reconcile findings through [reconciliation.md](reconciliation.md).
8. Add or update risks in [../risks/production-readiness.md](../risks/production-readiness.md).
9. Add implementation tasks to the relevant workstream backlog.
10. Update the result status and next action.

## Shared File Ownership

- Audit result authors update their assigned result file by default.
- The orchestrator or assigned reconciliation agent updates shared trackers:
  [goals.md](goals.md), [results/README.md](results/README.md),
  [findings-register.md](findings-register.md),
  [../risks/production-readiness.md](../risks/production-readiness.md), and
  workstream backlogs.
- If an assignment names shared files directly, follow that assignment and keep
  the edits scoped to the named sections.
- `Unassigned` findings and risks belong to the orchestrator until a specific
  reviewer or owner is recorded.

## Audit Rules

- Audit reports should contain evidence, not guesses.
- Findings should point to files, routes, commands, or docs where possible.
- If an audit uncovers implementation work, record it in the relevant workstream.
- If an audit uncovers unresolved production risk, record it in the risk tracker.
- Do not use audit reports as the final home for durable architecture decisions;
  move those to architecture docs or ADRs.
- Do not assign implementation work from an audit finding until it has been
  reconciled or explicitly accepted by the orchestrator.
- Assume other agents may be working concurrently. Keep audit edits scoped to the
  assigned result file unless the assignment names another file.
