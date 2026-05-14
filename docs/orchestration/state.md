# Current Orchestration State

Last updated: 2026-05-14

## Current Priority

Establish the coordination system for production-readiness work before runtime
refactors begin.

## Active Phase

Documentation and audit planning.

## Current Facts

- `AGENTS.md` is the first-read operating guide for all agents.
- `docs/README.md` is the canonical documentation index.
- Workstream briefs exist for production-readiness implementation areas.
- Audit goals and result files exist for discovery work.
- Architecture refactor, unused-code pruning, SSR/data-fetching, and testing
  reliability are first-class audit and workstream concerns.
- This orchestration guide now defines how a successor agent should take over.
- Audit reconciliation now has a dedicated findings register and review process.
- Orchestrator-assigned goals must start with `/goal` and include `effort:
  high` or `effort: xhigh`.
- Orchestrator assignments must be one-line pointers to canonical docs, not
  large prompt blocks.
- Because assignments are one-line pointers, the linked details doc must be
  complete before commissioning an agent.
- Concurrent audit agents should assume they are not alone in the repo and should
  keep edits scoped to assigned result files unless told otherwise.

## Active Audits

None started yet.

## Recommended Next Audits

1. [A-012 Documentation and handoff quality](../audits/goals.md#a-012-documentation-and-handoff-quality)
2. [A-013 Architecture refactor scope](../audits/goals.md#a-013-architecture-refactor-scope)
3. [A-014 Unused code and dependency pruning](../audits/goals.md#a-014-unused-code-and-dependency-pruning)
4. [A-015 SSR and data-fetching strategy](../audits/goals.md#a-015-ssr-and-data-fetching-strategy)
5. [A-006 Testing and quality baseline](../audits/goals.md#a-006-testing-and-quality-baseline)
6. [A-016 Forms, validation, and user input](../audits/goals.md#a-016-forms-validation-and-user-input)
7. [A-019 Dependencies and supply chain](../audits/goals.md#a-019-dependencies-and-supply-chain)

## Open Coordination Tasks

- Use `/goal effort: high` by default when commissioning audit work; reserve
  `effort: xhigh` for broad, ambiguous, or high-risk cross-cutting audits.
- Update and review the relevant details doc first, then commission agents with a
  one-line `/goal` or `/task` pointer.
- Keep audit result status in sync with `docs/audits/goals.md`.
- Keep [findings-register.md](../audits/findings-register.md) in sync with
  completed audit results.
- Convert completed audit findings into workstream backlog items.
- Add ADRs when architecture or process decisions become settled.
- Keep High severity risks visible and linked to active work.

## Next Orchestrator Action

Run A-012 as a quick self-audit of the documentation system, then start A-013 to
define the architecture refactor scope before assigning implementation work.
