# T-258 Add Admin Main Loading Skeleton

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a route-level loading skeleton for the admin dashboard `@main` parallel
route so segment changes do not leave the main dashboard panel blank while the
feed slot already has its own loading fallback.

## Context

- A-024 found that `src/app/admin/dashboard/@feed/loading.tsx` renders
  `FeedSkeleton`, but `@main` had no matching `loading.tsx`.
- `src/app/admin/dashboard/@main/default.tsx` imported generic loading
  components while returning `null`.
- Public route shells and programmatic-navigation pending feedback are already
  complete; this task addresses F-121 before the targeted route-transition
  verification slice.

## Scope

In scope:

- Add `src/app/admin/dashboard/@main/loading.tsx`.
- Add a main-panel skeleton that preserves the admin segment heading, CRUD tab,
  and operation body geometry.
- Remove stale generic loading imports from `@main/default.tsx`.
- Add focused render/source coverage for the new fallback.
- Update A-024 result/workstream notes for this task.

Out of scope:

- Do not change admin CRUD behavior, admin feed behavior, auth/admin access,
  data fetching, API behavior, route cache policy, public routes, package
  files, Playwright setup, or CI workflows.
- Do not redesign the admin dashboard layout or operation tabs.

## Acceptance Criteria

- `@main/loading.tsx` renders a route-level loading skeleton.
- The fallback exposes an accessible loading status and busy region.
- The fallback preserves the main dashboard panel shape while loading.
- `@main/default.tsx` no longer imports unused generic loading components.
- Focused tests cover the loading route and stale import cleanup.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/adminDashboardMainLoading.test.tsx
npm run lint
git diff --check
```

## Handoff Notes

- Finding: F-121.
- Related findings: F-118, F-120, F-122.
- Depends on: A-024 Phase 3 and T-257.
- 2026-05-24: Completed. Added `@main/loading.tsx`,
  `AdminMainLoadingSkeleton`, and focused test coverage. Removed stale generic
  loading imports from `@main/default.tsx`. Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/adminDashboardMainLoading.test.tsx`,
  `git diff --check`, and `npm run lint`.
