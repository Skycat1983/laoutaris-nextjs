# T-309 Scope API Route Builder Ownership

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope API route builder and route-ID ownership before any runtime API path
centralization.

## Context

T-302 found duplicated API paths across physical `src/app/api/v2` route files,
client fetchers, route logging context strings, preview helpers, route parity
tests, protected API guard tests, and smoke/auth tests. It also warned that
external paths, encoded client fetcher builders, and route logging IDs with
`[param]` placeholders are different concerns.

## Scope

In scope:

- Read [T-302 route-builder scope](../audits/results/T-302-route-builder-centralization-scope.md),
  [routes and API architecture](../architecture/routes-and-api.md), and
  current route/fetcher parity tests.
- Inventory one or two candidate API route families for the first
  centralization slice, preferring areas with existing helper or parity
  coverage.
- Decide whether the first implementation should centralize:
  - client fetcher paths only;
  - route logging IDs only;
  - physical-route parity fixtures only;
  - or a small deliberately separated combination.
- Define future task scope, owned files, acceptance criteria, and verification.
- Write the result to
  `docs/audits/results/T-309-api-route-builder-ownership-scope.md`.

Out of scope:

- Do not edit runtime source, tests, API handlers, fetchers, route logging,
  route parity fixtures, shared trackers, or smoke scripts.
- Do not change API response contracts, statuses, validation, auth/admin
  guards, DB ownership, or logging behavior.
- Do not touch Shopify dashboard data or commerce behavior.

## Concurrency

Can run in parallel with T-307 and T-308 because it writes only its task brief
and result file. Do not edit shared trackers; list candidate updates in the
handoff.

## Acceptance Criteria

- Result file distinguishes external API paths, client fetcher builders,
  physical route files, and request-context route IDs.
- Future implementation slice is small, testable, and does not blur those
  concerns.
- Runtime source remains unchanged.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 to keep source-only API hardening
  moving without Shopify dashboard involvement.
- Completed on 2026-05-27 in
  [T-309 API route builder ownership scope](../audits/results/T-309-api-route-builder-ownership-scope.md).
- Candidate shared tracker updates after completion: add the result link to
  architecture/data-API/testing workstreams and prepare the implementation task
  if the scope is clear.
