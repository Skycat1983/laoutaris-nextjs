# T-315 Scope Account Admin Route Builder Ownership

Status: Planned

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope the next account/admin route-builder slice before changing UI navigation,
dashboard segment links, saved-item revalidation paths, smoke/sitemap fixtures,
or auth callback redirects.

## Context

T-308 intentionally deferred account/mobile navigation links, provider callback
defaults, admin sidebar/dashboard segment links, saved-item revalidation paths,
smoke/sitemap private-prefix fixtures, and auth callback paths. T-311 completed
only the stable auth/protected route boundary constants. This task should
decide which of those deferred areas can move next without changing auth,
admin, cache, or release behavior.

## Scope

In scope:

- Read [T-308 auth protected route constants scope](../audits/results/T-308-auth-protected-route-constants-scope.md),
  [T-311](T-311-centralize-auth-protected-route-constants.md), and current
  account/admin navigation and saved-item revalidation tests.
- Inventory current route literals for account entry pages, account dropdown,
  mobile drawer, provider sign-in defaults, admin dashboard entry redirects,
  admin sidebar/dashboard segment links, saved-item revalidation paths,
  smoke/sitemap private-prefix fixtures, and `authCallbacks.ts`.
- Recommend one small implementation slice that can be completed by one agent.
- Define owned files, acceptance criteria, risk boundaries, and verification.
- Write the result to
  `docs/audits/results/T-315-account-admin-route-builder-ownership-scope.md`.

Out of scope:

- Do not edit runtime source, tests, route constants, middleware, NextAuth
  callbacks, account/admin UI, saved-item actions, smoke scripts, sitemap,
  robots, shared trackers, or commerce behavior.
- Do not change session handling, OAuth behavior, admin role checks, redirect
  destinations, cache revalidation, smoke coverage, sitemap/robots output, or
  Shopify dashboard data.

## Concurrency

Can run in parallel with T-314 because this task writes only its task brief and
result file. Do not edit shared trackers while running; list candidate updates
in the handoff for the orchestrator.

## Files Likely Touched

- `docs/audits/results/T-315-account-admin-route-builder-ownership-scope.md`
- `docs/tasks/T-315-scope-account-admin-route-builder-ownership.md`

## Acceptance Criteria

- Result file distinguishes account routes, admin dashboard UI routes,
  protected/auth boundary routes, smoke/sitemap public-contract fixtures,
  cache revalidation paths, and NextAuth callback paths.
- Future implementation slice is narrow enough for one agent.
- Runtime source remains unchanged.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-313 restored the broad
  verification gate.
- This is docs-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
