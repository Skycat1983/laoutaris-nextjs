# T-234 Scope Public Client Provider Islands

Status: Planned

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Measure and scope the first safe client-JavaScript reduction slice for public
routes after the higher-priority A-022 boundary, middleware, and cache work.

## Context

- A-022 found every route is wrapped in `ClientContextBoundary`, which mounts
  `SessionProvider` and `GlobalFeaturesProvider`.
- Public browse routes still have meaningful first-load JavaScript even though
  much of their initial content is server-rendered.
- Provider splitting can easily change modal, auth, saved-item, form, and
  account behavior, so the first step should be a focused scope and proof plan.

## Scope

In scope:

- Inventory public route client providers and heavy client islands using source
  searches and build output.
- Identify one low-risk first runtime slice, such as route-local modal provider
  placement, lazy-loading a drawer/modal, or keeping session-only UI out of a
  public static shell.
- Record required tests and smoke checks for that first slice.
- Update this brief with the recommended next implementation task if the scope
  is clear.

Out of scope:

- Do not change runtime provider placement in this task unless explicitly
  reassigned from planning to implementation.
- Do not change auth/session semantics, modals, saved-item actions, account
  routes, admin dashboard behavior, or cache policy.
- Do not add a new state management library.

## Concurrency

Run after T-230 through T-233 unless the orchestrator explicitly prioritizes
client JS over cache proof work. Do not run in parallel with homepage
production migration or provider/runtime refactors.

Owned files:

- this task brief
- optionally a focused planning note under `docs/architecture/` or
  `docs/audits/results/` if the inventory is too large for the handoff

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- The current provider/client-island cost is described with concrete route and
  source evidence.
- One first implementation slice is scoped with owned files, expected behavior,
  and verification.
- No runtime behavior changes are made unless the task is explicitly expanded.

## Verification

```bash
npm run build
git diff --check
```

Use targeted source searches for `use client`, `ClientContextBoundary`,
`SessionProvider`, `GlobalFeaturesProvider`, `next/dynamic`, and public route
client components.

## Handoff Notes

- Finding: F-115.
- Priority: after T-230 through T-233.
