# T-308 Scope Auth Protected Route Constants

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope a safe implementation slice for auth and protected route constant
consolidation.

## Context

T-302 found auth/protected route literals split across route constants,
middleware, route utils, NextAuth options/callbacks, admin frontend redirects,
account links, mobile navigation, and tests. That area is higher blast radius
than public UI link cleanup, so this task is docs-only scoping before runtime
changes.

## Scope

In scope:

- Read [T-302 route-builder scope](../audits/results/T-302-route-builder-centralization-scope.md),
  auth/admin workstream notes, middleware tests, and current route constants.
- Inventory current hard-coded auth/protected paths and their behavior:
  `/sign-in`, `/account`, `/admin`, `/api/auth`, `/api/v2/admin`,
  `/api/v2/user`, redirects to `/`, and protected matcher prefixes.
- Propose the smallest implementation slice that can centralize route constants
  without changing auth behavior.
- Define owned files, acceptance criteria, and verification for the future
  runtime task.
- Write the result to
  `docs/audits/results/T-308-auth-protected-route-constants-scope.md`.

Out of scope:

- Do not edit runtime source, tests, middleware, NextAuth config, route
  constants, admin guards, redirects, or shared trackers.
- Do not change protected route behavior, session handling, OAuth behavior,
  role checks, or admin dashboard access.
- Do not touch Shopify dashboard data or commerce behavior.

## Concurrency

Can run in parallel with T-307 and T-309 because it writes only its task brief
and result file. Do not edit shared trackers; list candidate updates in the
handoff.

## Acceptance Criteria

- Result file maps auth/protected route literals, current owners, tests, and
  risk boundaries.
- Future implementation slice is narrow enough for one agent.
- Runtime source remains unchanged.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 to keep progress moving on
  non-Shopify-dashboard architecture work.
- Completed on 2026-05-27 in
  [T-308 auth protected route constants scope](../audits/results/T-308-auth-protected-route-constants-scope.md).
- Recommended implementation follow-up is
  [T-311 Centralize auth protected route constants](T-311-centralize-auth-protected-route-constants.md).
- Runtime source, tests, middleware, NextAuth config, route constants, admin
  guards, redirects, and shared trackers were not changed by the scoping task.
