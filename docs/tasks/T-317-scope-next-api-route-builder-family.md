# T-317 Scope Next API Route Builder Family

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope the next API route-builder family after the completed admin delete/read
path-builder slices.

## Context

T-309 separated external API paths, client fetcher builders, physical route
files, and request-context route IDs. T-312 centralized admin delete client
fetcher paths, and T-314 centralized admin read client fetcher paths. Before
continuing into admin write, public, user, auth, smoke, or route-ID paths, the
next family needs a source-backed scope.

## Scope

In scope:

- Read [T-309 API route builder ownership scope](../audits/results/T-309-api-route-builder-ownership-scope.md),
  [T-312](T-312-add-admin-delete-api-path-builders.md), and
  [T-314](T-314-add-admin-read-api-path-builders.md).
- Inventory candidate next API route-builder families, such as admin create,
  admin update, public navigation/content, protected user, or shared API fetcher
  paths.
- Decide whether the next implementation should centralize client fetcher paths
  only or remain docs-only pending more coverage.
- Define owned files, acceptance criteria, risk boundaries, and verification for
  one future task.
- Write the result to
  `docs/audits/results/T-317-next-api-route-builder-family-scope.md`.

Out of scope:

- Do not edit runtime source, tests, API handlers, fetchers, route logging,
  request-context route IDs, parity fixtures, shared trackers, smoke scripts,
  or Shopify behavior.
- Do not change API response contracts, statuses, validation, auth/admin
  guards, DB ownership, route logging behavior, or UI behavior.

## Concurrency

Can run in parallel with T-316 because this task writes only its task brief and
result file. Do not edit shared trackers while running; list candidate updates
in the handoff.

## Files Likely Touched

- `docs/audits/results/T-317-next-api-route-builder-family-scope.md`
- `docs/tasks/T-317-scope-next-api-route-builder-family.md`

## Acceptance Criteria

- Result file distinguishes candidate API client fetcher paths from physical
  route files and request-context route IDs.
- Future implementation slice is narrow enough for one agent.
- Runtime source remains unchanged.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-314 completed.
- This is docs-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
- Completed on 2026-05-27 by writing
  `docs/audits/results/T-317-next-api-route-builder-family-scope.md`.
- The result selects admin update as the next client fetcher path-builder
  family, keeps runtime source out of scope, and defines the future T-318
  implementation files, acceptance criteria, risk boundaries, and verification.
- Shared tracker updates were not applied because this task can run in parallel
  with T-316 and is scoped to its task brief plus result file.
- Verification passed: `git diff --check`.
