# Agent Operating Guide

This file is the first document every agent should read before changing this
repo. It defines the documentation workflow for the production-readiness
refactor of the Laoutaris Art Gallery app.

## Read Order

1. Read this file.
2. Read [docs/README.md](docs/README.md).
3. If the task is an audit, reconciliation, or orchestration task, read the
   relevant goal, result, or process doc in [docs/audits](docs/audits/README.md).
4. Read the relevant workstream brief in [docs/workstreams](docs/workstreams/README.md).
5. If acting as orchestrator, read
   [docs/orchestration/orchestrator-guide.md](docs/orchestration/orchestrator-guide.md).
6. Read only the architecture, runbook, decision, audit, orchestration, and risk docs linked by that
   workstream.

## Project Direction

This is a Next.js 14 App Router application for the Joseph Laoutaris art
archive. The project is being refactored toward production readiness and future
Shopify-backed artwork sales.

Current priorities:

- Preserve the public archive and artwork browsing experience.
- Harden data, auth, admin, API, and deployment boundaries.
- Make Shopify commerce integration durable and easy to operate.
- Keep project knowledge in versioned Markdown so agents can join safely.

## Token And Browser Automation Discipline

Any Playwright, browser automation, screenshot, trace, DOM dump, console log, or
similar high-volume tool use must be tightly controlled. Capture and ingest only
the data needed for the assigned goal.

Defaults:

- Prefer targeted selectors, specific routes, short console excerpts, and small
  screenshots over full-page dumps.
- Do not collect traces, videos, full DOM snapshots, full browser logs, or large
  screenshot sets unless the assignment explicitly requires them.
- Summarize observed behavior in the assigned result file instead of pasting raw
  tool output.
- If a browser check would produce large output, narrow the question first or
  ask the orchestrator to approve the broader capture.

## Documentation Rules

- Treat [docs/README.md](docs/README.md) as the canonical documentation index.
- Track active work in workstream briefs, not in chat history.
- Track audit assignments in [docs/audits/goals.md](docs/audits/goals.md).
- Track audit findings in `docs/audits/results/`.
- Reconcile actionable audit findings through
  [docs/audits/reconciliation.md](docs/audits/reconciliation.md) and
  [docs/audits/findings-register.md](docs/audits/findings-register.md).
- Track orchestration state in [docs/orchestration/state.md](docs/orchestration/state.md).
- Add durable architecture facts under `docs/architecture/`.
- Add repeatable operating steps under `docs/runbooks/`.
- Add decisions that should not be re-litigated under `docs/decisions/`.
- Add production risks and mitigations under `docs/risks/`.
- Move historical notes into `docs/archive/` only after their useful facts have
  been consolidated into durable docs.
- When a task changes behavior, update the relevant workstream brief before
  handing off.
- When an audit assignment explicitly scopes edits to the result file, list
  candidate findings, risks, and workstream updates there; the orchestrator or
  assigned reconciliation agent owns shared-file updates.
- Agents should assume they are not alone in the repo. Other agents may be
  auditing or editing separate docs at the same time.

## Workstream Brief Contract

Every active workstream brief should keep these fields current:

- Status
- Goal
- Depends on
- Blocks
- Related code areas
- Current facts
- Backlog
- Acceptance criteria
- Verification
- Next agent action

Use [docs/templates/workstream-brief.md](docs/templates/workstream-brief.md) for
new workstreams and [docs/templates/task-brief.md](docs/templates/task-brief.md)
for focused tasks inside a workstream.

## Engineering Defaults

- Prefer existing patterns over new abstractions.
- Keep changes scoped to the active workstream.
- Avoid touching unrelated dirty files.
- Do not overwrite, revert, or reorganize work from other agents unless the user
  or orchestrator explicitly assigns that reconciliation task.
- Do not remove historical docs until their useful information is represented in
  the canonical docs.
- For client components in Next.js, prefer direct imports over broad barrel
  imports when server-only dependencies could be pulled into the client bundle.
- For Shopify product links, follow the canonical approach in
  [docs/architecture/shopify-commerce.md](docs/architecture/shopify-commerce.md).

## Verification Defaults

Use the narrowest verification that proves the change, then broaden when shared
behavior is touched.

Common commands:

```bash
npm test
npm run build
npm run lint
```

If a command is unavailable or fails for environment reasons, record that in the
workstream brief and final handoff.

## Handoff Requirements

Before ending a substantial task:

- Update the workstream brief status, completed work, remaining work, and next
  agent action unless the assignment explicitly limits edits to an audit result
  file.
- If the task was an audit, update the matching result file in
  `docs/audits/results/`.
- If the task produced audit findings and the assignment permits shared-file
  edits, add actionable items to `docs/audits/findings-register.md` for review.
- If acting as orchestrator, update `docs/orchestration/state.md` when priority,
  active work, blockers, or next action changes.
- Add or update ADRs for meaningful irreversible decisions.
- Add risks for unresolved production issues unless the assignment scopes those
  updates to candidate notes in an audit result file.
- Note verification commands run and any failures.
- Keep final summaries short and point to the changed docs.
