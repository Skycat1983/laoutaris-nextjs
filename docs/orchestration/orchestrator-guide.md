# Orchestrator Guide

The orchestrator is responsible for keeping the refactor navigable, sequenced,
and documented. The role is not to personally implement every task; it is to make
sure agents can be assigned focused work with enough context, and that their
results land in the right canonical place.

## First Read Checklist

When taking over orchestration, read in this order:

1. [../../AGENTS.md](../../AGENTS.md)
2. [../README.md](../README.md)
3. [state.md](state.md)
4. [../audits/goals.md](../audits/goals.md)
5. [../workstreams/README.md](../workstreams/README.md)
6. [../risks/production-readiness.md](../risks/production-readiness.md)
7. Any audit result or workstream named as the current priority in
   [state.md](state.md)

## Responsibilities

- Maintain the documentation map and make sure agents can navigate it from
  `AGENTS.md`.
- Keep audit goals linkable, scoped, and paired with result files.
- Prefix delegated goal assignments with `/goal` and include an explicit effort
  level.
- Convert audit findings into workstream backlog items, risks, ADRs, or runbook
  updates.
- Reconcile findings before treating them as implementation work.
- Sequence work so high-risk unknowns are audited before implementation.
- Prefer concurrent assignments when tasks have separate result files, separate
  code areas, or no direct dependency on each other.
- Prevent broad refactors from starting without documented scope, acceptance
  criteria, and verification.
- Keep [state.md](state.md) current enough that another orchestrator can take
  over without chat history.

## Routing Rules

Use these defaults when deciding where work belongs:

| Work type | Start here | Results go here |
| --- | --- | --- |
| Discovery or inspection | `docs/audits/goals.md` | `docs/audits/results/` |
| Finding reconciliation | Audit result | `docs/audits/findings-register.md` |
| Implementation | Relevant workstream brief | Same workstream progress/backlog |
| Production risk | Relevant workstream or audit | `docs/risks/production-readiness.md` |
| Durable architectural fact | Relevant architecture doc | `docs/architecture/` |
| Repeatable operation | Relevant runbook | `docs/runbooks/` |
| Irreversible decision | ADR template | `docs/decisions/` |
| Successor handoff | Orchestrator handoff template | `docs/orchestration/state.md` or linked note |

## Sequencing Defaults

The preferred early sequence is:

1. Audit documentation and handoff quality enough to keep the system usable.
2. Audit architecture refactor scope, unused code, SSR/data fetching, and testing
   baseline before broad code changes.
3. Audit Shopify commerce and deployment/security risks before public commerce
   launch work.
4. Convert each audit into small implementation tasks in the relevant
   workstream.
5. Reconcile findings before implementation begins.
6. Require verification notes before marking work done.

Do not treat this order as absolute. Escalate production blockers or user
priorities by updating [state.md](state.md), the relevant workstream, and the risk
tracker.

## Assignment Pattern

Orchestrator assignments should be one line, not a copied prompt block.
Because the assignment carries only a pointer, the linked details document must
be complete before the agent is commissioned. The orchestrator is responsible for
checking that the target doc contains the context an agent would otherwise have
received in a longer prompt.

Format:

```text
/goal effort: high details: docs/audits/goals.md#a-006-testing-and-quality-baseline
```

Use `/goal` for goal-oriented audit or discovery work. Use `/task` for bounded
implementation or reconciliation work.

Rules:

- `/goal` or `/task` must be the first token.
- Include `effort: high` by default.
- Use `effort: xhigh` for broad architecture, security, compliance,
  SSR/data-fetching, or ambiguous cross-cutting work.
- Include one `details:` path or anchor where the full assignment details live.
- Do not paste long instructions into the assignment. Update the target audit
  goal, result file, task brief, or workstream first, then send the one-line
  pointer.
- The details doc must include scope, read-first dependencies, write location,
  concurrency expectations, verification, escalation criteria, and completion
  expectations.
- For `/task` assignments, the details doc must say whether the assigned agent
  owns shared tracker edits such as `docs/tasks/README.md`, workstream
  `Progress`/`Next Agent Action`, `docs/orchestration/state.md`, the findings
  register, and the risk tracker. If tracker edits are not assigned, require
  candidate tracker updates in the task handoff notes.
- Completion means the task brief is left as a usable project record: status is
  current, handoff notes summarize the landed work, verification commands and
  results are recorded, and follow-up task pointers are added when created.
- If the details doc is incomplete, update it first or do not commission the
  agent yet.

## Concurrency Rules

- Prefer running independent audits concurrently when each agent can write to a
  distinct result file.
- Avoid assigning multiple agents to edit the same doc unless one is clearly the
  owner and the others are read-only.
- For concurrent audits, agents should usually write only their assigned result
  file. The orchestrator or a dedicated review agent should reconcile findings
  into [../audits/findings-register.md](../audits/findings-register.md).
- If an audit must update a shared file directly, the assignment must say so
  explicitly and name the exact section to edit.
- Agents should assume other work may land while they are running. They must not
  revert unrelated changes and should report conflicts back to the orchestrator.

## Takeover Checklist

When becoming orchestrator:

- Confirm the latest user priority.
- Check `git status --short` and avoid overwriting unrelated changes.
- Read [state.md](state.md), especially `Successor Takeover Snapshot`, current
  priority, and open coordination tasks.
- Check audit result files for audits marked `In progress`.
- Check workstream briefs for `Next Agent Action`.
- Check risks for High severity open items.
- If the current task has been commissioned and returned, reconcile its task
  brief, task index, state, relevant workstreams, findings register, and risk
  tracker before preparing the next assignment.
- Update [state.md](state.md) if the priority or next action has changed.

## Handoff Checklist

Before handing off orchestration:

- Update [state.md](state.md).
- Record current priority, active audits, active workstreams, blockers, and next
  recommended action.
- Ensure every in-progress audit has a result file with current status.
- Ensure completed audits have findings reconciled or explicitly marked as
  no-action.
- Ensure every implementation task has a workstream backlog or progress note.
- Ensure new risks are in the risk tracker.
- Add ADRs for decisions the next orchestrator should not re-open casually.

## Anti-Patterns

- Starting large refactors before A-013, A-014, and A-015 have useful findings.
- Leaving audit findings only in chat.
- Treating every audit finding as accepted implementation work without review.
- Creating new task docs when an existing audit result or workstream brief should
  be updated.
- Marking a risk closed without evidence.
- Deleting historical docs before their durable facts are consolidated.
- Assigning implementation work without acceptance criteria and verification.
