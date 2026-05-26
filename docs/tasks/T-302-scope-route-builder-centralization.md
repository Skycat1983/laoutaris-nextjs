# T-302 Scope Route Builder Centralization

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Inventory app route, API route, and auth path construction so a future task can
centralize route builders without broad behavior churn.

## What This Does

This task searches current source for hard-coded route strings, same-app URL
construction, API path constants, auth/protected path constants, and existing
route helpers. It should produce a staged centralization plan that identifies
safe first slices and risky areas to defer.

## Why This Exists

The architecture backlog still calls out centralizing app route builders, API
route builders, and auth path constants. Earlier tasks removed hard-coded
localhost/same-app origins and repaired route-critical loaders, but route path
ownership is still spread across constants, links, fetchers, tests, and docs.
A source-backed inventory is needed before implementation to avoid changing
navigation, auth, API, or smoke contracts accidentally.

## Parallel Assignment Rules

This task is safe to run in parallel with T-301 and T-303 because it should not
edit runtime code or shared trackers. During the parallel run, update only this
task file and the new result artifact. List candidate shared tracker updates in
the handoff notes for orchestrator reconciliation.

## Scope

In scope:

- Search `src`, `__tests__`, scripts, and docs for route/path construction
  patterns, including:
  - app-page paths such as `/artwork`, `/collections`, `/shop`, `/account`,
    `/admin`, `/privacy`, and `/terms`;
  - API paths under `/api/v2`;
  - auth/protected route constants and middleware matchers;
  - public smoke route lists;
  - same-app origin or URL-construction helpers;
  - existing route constants/builders.
- Create `docs/audits/results/T-302-route-builder-centralization-scope.md`
  with:
  - current source map;
  - duplicate or drift-prone path groups;
  - recommended first implementation slice;
  - areas that should remain deferred;
  - verification needed for each slice.

Out of scope:

- Do not edit route constants, links, fetchers, middleware, tests, scripts,
  runtime source, or docs outside the task/result artifact.
- Do not change route behavior, API paths, auth boundaries, smoke route lists,
  cache policy, or redirects.
- Do not combine this with taxonomy/filter option consolidation or Next major
  migration work.

## Concurrency

This task owns only:

- `docs/tasks/T-302-scope-route-builder-centralization.md`
- `docs/audits/results/T-302-route-builder-centralization-scope.md`

Do not edit shared trackers or indexes during the parallel run.

## Completion Contract

- Mark this task `Status: Completed` only after the route-builder scope artifact
  is written and verification passes.
- Record commands used for source discovery.
- Include candidate follow-up tasks and tracker updates in handoff notes.

## Acceptance Criteria

- The result distinguishes app routes, API routes, auth/protected paths, smoke
  routes, and existing helpers.
- It proposes a narrow first implementation slice with low blast radius.
- It explicitly defers risky route behavior changes.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 as one of three parallel-safe scoping tasks after
  T-300 completed the A-014 source-pruning sequence.
- Completed on 2026-05-26 with
  [T-302 route-builder centralization scope](../audits/results/T-302-route-builder-centralization-scope.md).
  Candidate shared tracker updates are listed in the result artifact for
  orchestrator reconciliation. No runtime source was changed.
